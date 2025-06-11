const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

// Import configurations and middleware
const databaseConfig = require('./config/database');
const authMiddleware = require('./middleware/auth');

// Import controllers
const authController = require('./controllers/authController');
const partnerController = require('./controllers/partnerController');

// Import validation rules
const ValidationRules = require('./utils/validation');

class ExchangePlatformServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    setupMiddleware() {
        // Security middleware
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
                    scriptSrc: ["'self'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'"],
                    fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
                },
            },
        }));

        // CORS configuration
        this.app.use(cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:8080',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Rate limiting
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: {
                success: false,
                message: 'تعداد درخواست‌ها بیش از حد مجاز است'
            }
        });
        this.app.use(limiter);

        // Compression
        this.app.use(compression());

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Request logging
        this.app.use((req, res, next) => {
            const timestamp = new Date().toISOString();
            console.log(`${timestamp} - ${req.method} ${req.path} - IP: ${req.ip}`);
            next();
        });
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                success: true,
                message: 'Exchange Platform API is running',
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            });
        });

        // API Info
        this.app.get('/api', (req, res) => {
            res.json({
                success: true,
                message: 'پلتفرم صرافی - API سرویس',
                version: '1.0.0',
                endpoints: {
                    auth: '/api/auth',
                    partners: '/api/partners',
                    transactions: '/api/transactions',
                    rates: '/api/rates'
                }
            });
        });

        // Authentication routes
        this.setupAuthRoutes();
        
        // Partner management routes
        this.setupPartnerRoutes();
        
        // Exchange rates routes
        this.setupRatesRoutes();
        
        // Transaction routes
        this.setupTransactionRoutes();

        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                message: 'API endpoint یافت نشد',
                path: req.originalUrl
            });
        });
    }

    setupAuthRoutes() {
        const authRouter = express.Router();

        // Login
        authRouter.post('/login', 
            ValidationRules.loginValidation(),
            authController.login
        );

        // Logout
        authRouter.post('/logout',
            authMiddleware.authenticate,
            authController.logout
        );

        // Validate token
        authRouter.post('/validate',
            authMiddleware.authenticate,
            authController.validateToken
        );

        // Change password
        authRouter.put('/change-password',
            authMiddleware.authenticate,
            authController.changePassword
        );

        this.app.use('/api/auth', authRouter);
    }

    setupPartnerRoutes() {
        const partnerRouter = express.Router();

        // Apply authentication to all partner routes
        partnerRouter.use(authMiddleware.authenticate);
        partnerRouter.use(authMiddleware.tenantIsolation);

        // Get all partners
        partnerRouter.get('/',
            authMiddleware.authorize(['admin']),
            partnerController.getAllPartners
        );

        // Create new partner
        partnerRouter.post('/',
            authMiddleware.authorize(['admin']),
            ValidationRules.partnerValidation(),
            partnerController.createPartner
        );

        // Get partner by ID
        partnerRouter.get('/:partnerId',
            authMiddleware.authorize(['admin', 'partner']),
            partnerController.getPartnerById
        );

        // Update partner
        partnerRouter.put('/:partnerId',
            authMiddleware.authorize(['admin']),
            partnerController.updatePartner
        );

        // Delete partner
        partnerRouter.delete('/:partnerId',
            authMiddleware.authorize(['admin']),
            partnerController.deletePartner
        );

        // Partner statistics
        partnerRouter.get('/:partnerId/stats',
            authMiddleware.authorize(['admin', 'partner']),
            partnerController.getPartnerStats
        );

        this.app.use('/api/partners', partnerRouter);
    }

    setupRatesRoutes() {
        const ratesRouter = express.Router();
        const exchangeRateService = require('./services/exchangeRateService');

        // Apply authentication
        ratesRouter.use(authMiddleware.authenticate);
        ratesRouter.use(authMiddleware.tenantIsolation);

        // Get current market rates
        ratesRouter.get('/market/:baseCurrency?', async (req, res) => {
            try {
                const baseCurrency = req.params.baseCurrency || 'AED';
                const rates = await exchangeRateService.getRates(baseCurrency);
                
                res.json({
                    success: true,
                    baseCurrency: baseCurrency,
                    rates: rates,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error('Get rates error:', error);
                res.status(500).json({
                    success: false,
                    message: 'خطا در دریافت نرخ‌ها'
                });
            }
        });

        // Get partner rates (with discount)
        ratesRouter.get('/partner/:baseCurrency?', async (req, res) => {
            try {
                const baseCurrency = req.params.baseCurrency || 'AED';
                const discountRate = req.query.discount || 0;
                
                const rates = await exchangeRateService.getPartnerRates(baseCurrency, discountRate);
                
                res.json({
                    success: true,
                    baseCurrency: baseCurrency,
                    rates: rates,
                    discountRate: discountRate,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error('Get partner rates error:', error);
                res.status(500).json({
                    success: false,
                    message: 'خطا در دریافت نرخ‌های همکار'
                });
            }
        });

        this.app.use('/api/rates', ratesRouter);
    }

    setupTransactionRoutes() {
        const transactionRouter = express.Router();

        // Apply authentication
        transactionRouter.use(authMiddleware.authenticate);
        transactionRouter.use(authMiddleware.tenantIsolation);

        // Calculate exchange
        transactionRouter.post('/calculate', async (req, res) => {
            try {
                const { fromCurrency, toCurrency, amount, type } = req.body;
                
                if (!fromCurrency || !toCurrency || !amount) {
                    return res.status(400).json({
                        success: false,
                        message: 'اطلاعات ناقص برای محاسبه'
                    });
                }

                const exchangeRateService = require('./services/exchangeRateService');
                const rates = await exchangeRateService.getRates(fromCurrency);
                
                const rate = rates[toCurrency];
                if (!rate) {
                    return res.status(400).json({
                        success: false,
                        message: 'نرخ تبدیل برای این ارزها موجود نیست'
                    });
                }

                const result = type === 'multiply' ? amount * rate : amount / rate;
                
                res.json({
                    success: true,
                    calculation: {
                        fromCurrency,
                        toCurrency,
                        amount,
                        rate,
                        result,
                        type,
                        timestamp: new Date().toISOString()
                    }
                });

            } catch (error) {
                console.error('Calculate exchange error:', error);
                res.status(500).json({
                    success: false,
                    message: 'خطا در محاسبه تبدیل'
                });
            }
        });

        // Get transaction history
        transactionRouter.get('/history', async (req, res) => {
            try {
                const { page = 1, limit = 10, startDate, endDate } = req.query;
                
                // اینجا باید از دیتابیس تراکنش‌ها بخوانیم
                // فعلاً mock data برمی‌گردانیم
                const mockTransactions = [
                    {
                        id: 'TXN001',
                        type: 'exchange',
                        fromCurrency: 'USD',
                        toCurrency: 'AED',
                        amount: 1000,
                        rate: 3.67,
                        result: 3670,
                        customerName: 'احمد رضایی',
                        timestamp: new Date().toISOString()
                    }
                ];
                
                res.json({
                    success: true,
                    transactions: mockTransactions,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total: mockTransactions.length
                    }
                });

            } catch (error) {
                console.error('Get transaction history error:', error);
                res.status(500).json({
                    success: false,
                    message: 'خطا در دریافت تاریخچه تراکنش‌ها'
                });
            }
        });

        this.app.use('/api/transactions', transactionRouter);
    }

    setupErrorHandling() {
        // Global error handler
        this.app.use((error, req, res, next) => {
            console.error('Global error handler:', error);
            
            // MongoDB duplicate key error
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: 'رکورد تکراری - این اطلاعات قبلاً ثبت شده است'
                });
            }

            // Validation error
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'اطلاعات ورودی نامعتبر',
                    details: error.message
                });
            }

            // JWT error
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'توکن احراز هویت نامعتبر'
                });
            }

            // Default error
            res.status(error.status || 500).json({
                success: false,
                message: error.message || 'خطای داخلی سرور',
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            });
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            console.error('Unhandled Promise Rejection:', err);
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (err) => {
            console.error('Uncaught Exception:', err);
            process.exit(1);
        });
    }

    async start() {
        try {
            // Connect to database
            await databaseConfig.connect();
            
            // Start server
            this.app.listen(this.port, () => {
                console.log(`
╔════════════════════════════════════════╗
║        🏦 پلتفرم صرافی API              ║
║                                        ║
║  🚀 Server running on port ${this.port}        ║
║  🌐 Environment: ${process.env.NODE_ENV || 'development'}           ║
║  📅 Started: ${new Date().toLocaleString('fa-IR')}     ║
║                                        ║
║  API Endpoints:                        ║
║  - Health: /health                     ║
║  - Auth: /api/auth                     ║
║  - Partners: /api/partners             ║
║  - Rates: /api/rates                   ║
║  - Transactions: /api/transactions     ║
╚════════════════════════════════════════╝
                `);
            });

        } catch (error) {
            console.error('❌ Failed to start server:', error);
            process.exit(1);
        }
    }
}

// Start the server
const server = new ExchangePlatformServer();
server.start();

module.exports = server;