// src/pages/CustomerPortal.jsx - پورتال مشتریان
import React, { useState, useEffect } from 'react';

const CustomerPortal = () => {
  const [customerLogin, setCustomerLogin] = useState({
    username: '',
    password: ''
  });
  const [loggedInCustomer, setLoggedInCustomer] = useState(null);
  const [customerData, setCustomerData] = useState({});

  const handleCustomerLogin = () => {
    // Mock customer authentication
    const mockCustomer = {
      id: 'CUST001',
      name: 'احمد محمدی',
      username: customerLogin.username,
      balances: {
        USD: { available: 5000, frozen: 500 },
        AED: { available: 18500, frozen: 0 },
        EUR: { available: 2300, frozen: 0 }
      },
      transactions: [
        {
          id: 'TXN001',
          type: 'deposit',
          amount: 1000,
          currency: 'USD',
          date: '2024-01-15',
          description: 'Cash deposit'
        },
        {
          id: 'TXN002',
          type: 'remittance',
          amount: 500,
          currency: 'USD',
          date: '2024-01-14',
          description: 'Transfer to Iran'
        }
      ]
    };

    setLoggedInCustomer(mockCustomer);
  };

  if (!loggedInCustomer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Customer Portal</h1>
            <p className="text-gray-600">Login to view your account</p>
          </div>

          <div className="space-y-4">
            <input
              placeholder="Username"
              value={customerLogin.username}
              onChange={(e) => setCustomerLogin({...customerLogin, username: e.target.value})}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
            <input
              placeholder="Password"
              type="password"
              value={customerLogin.password}
              onChange={(e) => setCustomerLogin({...customerLogin, password: e.target.value})}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
            <button
              onClick={handleCustomerLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome, {loggedInCustomer.name}</h1>
              <p className="text-gray-600">Account: {loggedInCustomer.id}</p>
            </div>
            <button
              onClick={() => setLoggedInCustomer(null)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Balances */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">💰 Account Balances</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(loggedInCustomer.balances).map(([currency, balance]) => (
              <div key={currency} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">{currency}</h3>
                  <span className="text-2xl font-bold text-blue-600">
                    {balance.available.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Available:</span>
                    <span>{balance.available.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frozen:</span>
                    <span>{balance.frozen.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Recent Transactions</h2>
          <div className="space-y-3">
            {loggedInCustomer.transactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                    transaction.type === 'deposit' ? 'bg-green-500' : 
                    transaction.type === 'withdrawal' ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    {transaction.type === 'deposit' ? '⬇️' : 
                     transaction.type === 'withdrawal' ? '⬆️' : '🔄'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 capitalize">{transaction.type}</p>
                    <p className="text-sm text-gray-600">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}
                    {transaction.amount.toLocaleString()} {transaction.currency}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal;