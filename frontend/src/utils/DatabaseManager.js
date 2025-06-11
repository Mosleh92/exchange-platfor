// src/utils/DatabaseManager.js
class DatabaseManager {
  constructor(tenantId) {
    this.tenantId = tenantId;
    this.dbPrefix = `tenant_${tenantId}_`;
  }

  // هر tenant دیتابیس جداگانه دارد
  getTable(tableName) {
    return `${this.dbPrefix}${tableName}`;
  }

  async createTenantTables() {
    const tables = [
      'users', 'customers', 'transactions', 'currencies',
      'remittances', 'bank_accounts', 'whatsapp_groups',
      'exchange_rates', 'reports', 'settings'
    ];

    for (const table of tables) {
      await this.createTable(this.getTable(table));
    }
  }

  async getCustomers() {
    return JSON.parse(localStorage.getItem(this.getTable('customers')) || '[]');
  }

  async saveCustomer(customer) {
    const customers = await this.getCustomers();
    customers.push({...customer, id: `customer_${Date.now()}`});
    localStorage.setItem(this.getTable('customers'), JSON.stringify(customers));
  }

  async getRemittances() {
    return JSON.parse(localStorage.getItem(this.getTable('remittances')) || '[]');
  }

  // امکان backup جداگانه برای هر tenant
  async backupTenantData() {
    const data = {};
    const tables = ['customers', 'transactions', 'remittances'];
    
    for (const table of tables) {
      data[table] = JSON.parse(localStorage.getItem(this.getTable(table)) || '[]');
    }
    
    return data;
  }
}