const { useState, useEffect, useContext, createContext } = React;

// Global App Context
const AppContext = createContext();

// Main App Provider
function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('fa');

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            // Load user preferences
            loadUserPreferences();
            
            // Check authentication
            if (isAuthenticated()) {
                await validateSession();
            }
        } catch (error) {
            console.error('App initialization failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUserPreferences = () => {
        const preferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
        if (preferences) {
            const parsed = JSON.parse(preferences);
            setTheme(parsed.theme || 'light');
            setLanguage(parsed.language || 'fa');
        }
    };

    const validateSession = async () => {
        try {
            const response = await apiCall('/auth/validate');
            if (response.success) {
                setUser(response.user);
                setTenant(response.tenant);
                initializeSocket();
            } else {
                logout();
            }
        } catch (error) {
            console.error('Session validation failed:', error);
            logout();
        }
    };

    const initializeSocket = () => {
        if (socket) return;

        const newSocket = io(API_CONFIG.SOCKET_URL, {
            auth: {
                token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
                tenantId: localStorage.getItem(STORAGE_KEYS.TENANT_ID)
            }
        });

        newSocket.on('connect', () => {
            console.log('🔌 Socket connected');
        });

        newSocket.on('disconnect', () => {
            console.log('🔌 Socket disconnected');
        });

        newSocket.on('transaction_created', (data) => {
            addNotification({
                type: NOTIFICATION_TYPES.SUCCESS,
                message: `معامله جدید: ${data.customer_name} - ${PersianUtils.formatCurrency(data.amount, data.currency)}`,
                data
            });
        });

        newSocket.on('rate_updated', (data) => {
            addNotification({
                type: NOTIFICATION_TYPES.INFO,
                message: 'نرخ‌های ارز به‌روزرسانی شد'
            });
        });

        newSocket.on('alert_triggered', (data) => {
            addNotification({
                type: NOTIFICATION_TYPES.WARNING,
                message: data.message,
                data
            });
        });

        setSocket(newSocket);
    };

    const handleLogin = async (credentials) => {
        try {
            setLoading(true);
            const response = await login(credentials);
            
            if (response.success) {
                setUser(response.user);
                setTenant(response.tenant);
                initializeSocket();
                
                addNotification({
                    type: NOTIFICATION_TYPES.SUCCESS,
                    message: t('auth.loginSuccess')
                });
                
                return { success: true };
            }
        } catch (error) {
            addNotification({
                type: NOTIFICATION_TYPES.ERROR,
                message: error.message || t('auth.loginError')
            });
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
        setUser(null);
        setTenant(null);
        logout();
    };

    const addNotification = (notification) => {
        const id = Date.now() + Math.random();
        const newNotification = { ...notification, id };
        
        setNotifications(prev => [...prev, newNotification]);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const updateUserPreferences = (newPreferences) => {
        const preferences = {
            theme,
            language,
            ...newPreferences
        };
        
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
        
        if (newPreferences.theme) setTheme(newPreferences.theme);
        if (newPreferences.language) setLanguage(newPreferences.language);
    };

    const contextValue = {
        user,
        tenant,
        loading,
        notifications,
        socket,
        theme,
        language,
        login: handleLogin,
        logout: handleLogout,
        addNotification,
        removeNotification,
        updateUserPreferences,
        apiCall: apiCall,
        apiGet,
        apiPost,
        apiPut,
        apiDelete,
        apiUpload,
        apiDownload
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}

// Custom Hook
const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

// Loading Component
function LoadingSpinner({ message = 'در حال بارگذاری...' }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <div className="loading w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-700">{message}</h3>
            </div>
        </div>
    );
}

// Notifications Component
function NotificationContainer() {
    const { notifications, removeNotification } = useApp();

    return (
        <div className="fixed top-4 left-4 z-50 space-y-2">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`notification notification-${notification.type} max-w-sm pointer-events-auto`}
                >
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium flex-1 ml-3">
                            {notification.message}
                        </p>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Router Component
function AppRouter() {
    const { user, loading } = useApp();
    const [currentRoute, setCurrentRoute] = useState(window.location.pathname);

    useEffect(() => {
        const handlePopState = () => {
            setCurrentRoute(window.location.pathname);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <LoginPage />;
    }

    // Route based on user role and path
    if (currentRoute.startsWith('/super-admin')) {
        return user.role === USER_ROLES.SUPER_ADMIN ? <SuperAdminDashboard /> : <AccessDenied />;
    }

    if (currentRoute.startsWith('/admin')) {
        return [USER_ROLES.TENANT_ADMIN, USER_ROLES.MANAGER].includes(user.role) ? 
            <TenantAdminDashboard /> : <AccessDenied />;
    }

    if (currentRoute.startsWith('/user')) {
        return [USER_ROLES.EMPLOYEE, USER_ROLES.ACCOUNTANT].includes(user.role) ? 
            <UserDashboard /> : <AccessDenied />;
    }

    if (currentRoute.startsWith('/customer')) {
        return user.role === USER_ROLES.CUSTOMER ? <CustomerDashboard /> : <AccessDenied />;
    }

    // Default dashboard based on role
    switch (user.role) {
        case USER_ROLES.SUPER_ADMIN:
            return <SuperAdminDashboard />;
        case USER_ROLES.TENANT_ADMIN:
        case USER_ROLES.MANAGER:
            return <TenantAdminDashboard />;
        case USER_ROLES.EMPLOYEE:
        case USER_ROLES.ACCOUNTANT:
            return <UserDashboard />;
        case USER_ROLES.CUSTOMER:
            return <CustomerDashboard />;
        default:
            return <AccessDenied />;
    }
}

// Access Denied Component
function AccessDenied() {
    const { logout } = useApp();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="text-6xl mb-4">🚫</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">دسترسی غیرمجاز</h1>
                <p className="text-gray-600 mb-6">شما به این بخش دسترسی ندارید</p>
                <button
                    onClick={logout}
                    className="btn-primary"
                >
                    بازگشت به صفحه ورود
                </button>
            </div>
        </div>
    );
}

// Placeholder Components (will be expanded later)
function LoginPage() {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoginForm />
    </div>;
}

function SuperAdminDashboard() {
    return <div>Super Admin Dashboard - Coming Soon</div>;
}

function TenantAdminDashboard() {
    return <div>Tenant Admin Dashboard - Coming Soon</div>;
}

function UserDashboard() {
    return <div>User Dashboard - Coming Soon</div>;
}

function CustomerDashboard() {
    return <div>Customer Dashboard - Coming Soon</div>;
}

// Login Form Component
function LoginForm() {
    const [credentials, setCredentials] = useState({
        tenant_id: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { login } = useApp();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Validation
        const newErrors = {};
        if (!credentials.tenant_id) newErrors.tenant_id = 'شناسه صرافی الزامی است';
        if (!credentials.email) newErrors.email = 'ایمیل الزامی است';
        if (!credentials.password) newErrors.password = 'رمز عبور الزامی است';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        const result = await login(credentials);
        if (!result.success) {
            setErrors({ general: result.error });
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {t('auth.loginTitle')}
                </h1>
                <p className="text-gray-600">سامانه جامع مدیریت صرافی</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.tenantId')}
                    </label>
                    <input
                        type="text"
                        value={credentials.tenant_id}
                        onChange={(e) => setCredentials(prev => ({
                            ...prev,
                            tenant_id: e.target.value
                        }))}
                        className={`form-input ${errors.tenant_id ? 'border-red-500' : ''}`}
                        placeholder="مثال: EXCHANGE_001"
                        disabled={loading}
                    />
                    {errors.tenant_id && (
                        <p className="text-red-500 text-sm mt-1">{errors.tenant_id}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.email')}
                    </label>
                    <input
                        type="email"
                        value={credentials.email}
                        onChange={(e) => setCredentials(prev => ({
                            ...prev,
                            email: e.target.value
                        }))}
                        className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="admin@example.com"
                        disabled={loading}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.password')}
                    </label>
                    <input
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials(prev => ({
                            ...prev,
                            password: e.target.value
                        }))}
                        className={`form-input ${errors.password ? 'border-red-500' : ''}`}
                        disabled={loading}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                {errors.general && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {errors.general}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary disabled:opacity-50"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <div className="loading w-4 h-4 border-2 border-white border-t-transparent rounded-full ml-2"></div>
                            در حال ورود...
                        </span>
                    ) : (
                        t('auth.login')
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
                <p>سامانه صرافی نسخه ۳.۰</p>
                <p className="mt-1">طراحی شده برای مدیریت حرفه‌ای</p>
            </div>
        </div>
    );
}

// Main App Component
function App() {
    return (
        <AppProvider>
            <div className="app">
                <NotificationContainer />
                <AppRouter />
            </div>
        </AppProvider>
    );
}

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));