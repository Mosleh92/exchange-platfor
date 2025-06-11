// API Helper Functions
class APIClient {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
        this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
    }

    // Get stored auth token
    getAuthToken() {
        return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }

    // Get stored tenant ID
    getTenantId() {
        return localStorage.getItem(STORAGE_KEYS.TENANT_ID);
    }

    // Default headers
    getDefaultHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        const token = this.getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const tenantId = this.getTenantId();
        if (tenantId) {
            headers['X-Tenant-ID'] = tenantId;
        }

        return headers;
    }

    // Make API request with retry logic
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: this.getDefaultHeaders(),
            ...options,
            headers: {
                ...this.getDefaultHeaders(),
                ...options.headers
            }
        };

        // Add timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        config.signal = controller.signal;

        let lastError;
        
        for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
            try {
                const response = await fetch(url, config);
                clearTimeout(timeoutId);

                // Handle different response types
                const contentType = response.headers.get('content-type');
                let data;

                if (contentType && contentType.includes('application/json')) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }

                if (!response.ok) {
                    throw new Error(data.error || data.message || `HTTP ${response.status}`);
                }

                return data;

            } catch (error) {
                lastError = error;
                clearTimeout(timeoutId);

                // Don't retry on certain errors
                if (error.name === 'AbortError' || 
                    error.message.includes('401') || 
                    error.message.includes('403')) {
                    break;
                }

                // Wait before retry (exponential backoff)
                if (attempt < this.retryAttempts - 1) {
                    await new Promise(resolve => 
                        setTimeout(resolve, Math.pow(2, attempt) * 1000)
                    );
                }
            }
        }

        throw lastError;
    }

    // GET request
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url);
    }

    // POST request
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    // Upload file
    async upload(endpoint, file, additionalData = {}) {
        const formData = new FormData();
        formData.append('file', file);
        
        Object.keys(additionalData).forEach(key => {
            formData.append(key, additionalData[key]);
        });

        const headers = { ...this.getDefaultHeaders() };
        delete headers['Content-Type']; // Let browser set it for FormData

        return this.request(endpoint, {
            method: 'POST',
            headers,
            body: formData
        });
    }

    // Download file
    async download(endpoint, filename) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: this.getDefaultHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || 'download';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            return true;
        } catch (error) {
            console.error('Download failed:', error);
            throw error;
        }
    }
}

// Create global API instance
const api = new APIClient();

// Convenience functions
window.apiCall = async (endpoint, options = {}) => {
    try {
        return await api.request(endpoint, options);
    } catch (error) {
        console.error('API call failed:', error);
        
        // Handle auth errors
        if (error.message.includes('401') || error.message.includes('403')) {
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.TENANT_ID);
            window.location.href = '/';
            return;
        }
        
        throw error;
    }
};

window.apiGet = (endpoint, params) => api.get(endpoint, params);
window.apiPost = (endpoint, data) => api.post(endpoint, data);
window.apiPut = (endpoint, data) => api.put(endpoint, data);
window.apiDelete = (endpoint) => api.delete(endpoint);
window.apiUpload = (endpoint, file, data) => api.upload(endpoint, file, data);
window.apiDownload = (endpoint, filename) => api.download(endpoint, filename);

// Auth helpers
window.login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        
        if (response.success) {
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
            localStorage.setItem(STORAGE_KEYS.TENANT_ID, response.user.tenant_id);
            localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
            return response;
        }
        
        throw new Error(response.error || 'Login failed');
    } catch (error) {
        throw error;
    }
};

window.logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TENANT_ID);
    localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
    window.location.href = '/';
};

window.isAuthenticated = () => {
    return !!(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) && 
              localStorage.getItem(STORAGE_KEYS.TENANT_ID));
};