// src/pages/RemittanceManager.jsx - Updated version
import React, { useState, useEffect } from 'react';
import MockWhatsAppSender from '../components/MockWhatsAppSender';
import MockSMSSender from '../components/MockSMSSender';

const RemittanceManager = () => {
  const [remittances, setRemittances] = useState([]);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showSMS, setShowSMS] = useState(false);
  const [currentRemittance, setCurrentRemittance] = useState(null);
  const [newRemittance, setNewRemittance] = useState({
    customerName: '',
    customerPhone: '',
    fromCountry: '',
    toCountry: '',
    fromCurrency: '',
    toCurrency: '',
    amount: '',
    exchangeRate: '',
    receiverName: '',
    receiverAccount: '',
    whatsappGroup: 'Tehran Exchange Group',
    status: 'pending',
    description: ''
  });

  const createRemittance = async () => {
    const remittance = {
      id: `REM${Date.now()}`,
      ...newRemittance,
      createdAt: new Date().toISOString(),
      createdBy: 'current_user',
      trackingNumber: `TR${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      totalAmount: (parseFloat(newRemittance.amount) * parseFloat(newRemittance.exchangeRate)).toFixed(2)
    };

    setRemittances([...remittances, remittance]);
    setCurrentRemittance(remittance);
    setShowWhatsApp(true);
    
    // Reset form
    setNewRemittance({
      customerName: '',
      customerPhone: '',
      fromCountry: '',
      toCountry: '',
      fromCurrency: '',
      toCurrency: '',
      amount: '',
      exchangeRate: '',
      receiverName: '',
      receiverAccount: '',
      whatsappGroup: 'Tehran Exchange Group',
      status: 'pending',
      description: ''
    });
  };

  const generateWhatsAppMessage = (remittance) => {
    return `🔄 *حواله جدید / New Remittance*
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 شماره پیگیری: ${remittance.trackingNumber}
👤 فرستنده: ${remittance.customerName}
📞 موبایل: ${remittance.customerPhone}

💰 مبلغ ارسالی: ${remittance.amount} ${remittance.fromCurrency}
💱 نرخ تبدیل: ${remittance.exchangeRate}
💵 مبلغ دریافتی: ${remittance.totalAmount} ${remittance.toCurrency}

📍 مسیر: ${remittance.fromCountry} → ${remittance.toCountry}
👥 گیرنده: ${remittance.receiverName}
🏦 حساب: ${remittance.receiverAccount}

📝 توضیحات: ${remittance.description || 'ندارد'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ زمان: ${new Date().toLocaleString('fa-IR')}
✅ آماده پرداخت`;
  };

  const generateSMSMessage = (remittance) => {
    return `حواله شما با شماره ${remittance.trackingNumber} ثبت شد. مبلغ ${remittance.amount} ${remittance.fromCurrency} به ${remittance.receiverName} ارسال می‌شود. وضعیت: ${remittance.status}`;
  };

  const updateRemittanceStatus = (id, status) => {
    setRemittances(remittances.map(r => 
      r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
    ));
  };

  const countries = [
    { code: 'UAE', name: 'UAE', flag: '🇦🇪', currency: 'AED' },
    { code: 'Iran', name: 'Iran', flag: '🇮🇷', currency: 'IRR' },
    { code: 'Turkey', name: 'Turkey', flag: '🇹🇷', currency: 'TRY' },
    { code: 'China', name: 'China', flag: '🇨🇳', currency: 'CNY' },
    { code: 'Canada', name: 'Canada', flag: '🇨🇦', currency: 'CAD' },
    { code: 'USA', name: 'USA', flag: '🇺🇸', currency: 'USD' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">💸 Remittance Management</h1>
              <p className="text-gray-600">Manage international money transfers and hawala transactions</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Today's Date</p>
              <p className="text-lg font-semibold">{new Date().toLocaleDateString('fa-IR')}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Transfers</p>
                <p className="text-2xl font-bold text-blue-600">{remittances.filter(r => 
                  new Date(r.createdAt).toDateString() === new Date().toDateString()
                ).length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                🔄
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{remittances.filter(r => r.status === 'pending').length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
                ⏳
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-600">{remittances.filter(r => r.status === 'completed').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                ✅
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Volume</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${remittances.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                💰
              </div>
            </div>
          </div>
        </div>

        {/* Create New Remittance */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            ➕ Create New Remittance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                placeholder="احمد محمدی"
                value={newRemittance.customerName}
                onChange={(e) => setNewRemittance({...newRemittance, customerName: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone</label>
              <input
                placeholder="+971501234567"
                value={newRemittance.customerPhone}
                onChange={(e) => setNewRemittance({...newRemittance, customerPhone: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Country</label>
              <select
                value={newRemittance.fromCountry}
                onChange={(e) => {
                  const country = countries.find(c => c.code === e.target.value);
                  setNewRemittance({
                    ...newRemittance, 
                    fromCountry: e.target.value,
                    fromCurrency: country?.currency || ''
                  });
                }}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Country</label>
              <select
                value={newRemittance.toCountry}
                onChange={(e) => {
                  const country = countries.find(c => c.code === e.target.value);
                  setNewRemittance({
                    ...newRemittance, 
                    toCountry: e.target.value,
                    toCurrency: country?.currency || ''
                  });
                }}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <div className="relative">
                <input
                  placeholder="10000"
                  type="number"
                  value={newRemittance.amount}
                  onChange={(e) => setNewRemittance({...newRemittance, amount: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-16 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-3 text-gray-500 font-medium">
                  {newRemittance.fromCurrency}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exchange Rate</label>
              <input
                placeholder="91500"
                type="number"
                step="0.01"
                value={newRemittance.exchangeRate}
                onChange={(e) => setNewRemittance({...newRemittance, exchangeRate: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Name</label>
              <input
                placeholder="علی رضایی"
                value={newRemittance.receiverName}
                onChange={(e) => setNewRemittance({...newRemittance, receiverName: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Account/IBAN</label>
              <input
                placeholder="IR123456789012345678901234"
                value={newRemittance.receiverAccount}
                onChange={(e) => setNewRemittance({...newRemittance, receiverAccount: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Group</label>
              <select
                value={newRemittance.whatsappGroup}
                onChange={(e) => setNewRemittance({...newRemittance, whatsappGroup: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Tehran Exchange Group">Tehran Exchange Group</option>
                <option value="Dubai Exchange Group">Dubai Exchange Group</option>
                <option value="Istanbul Exchange Group">Istanbul Exchange Group</option>
                <option value="Beijing Exchange Group">Beijing Exchange Group</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              placeholder="Additional notes or instructions..."
              value={newRemittance.description}
              onChange={(e) => setNewRemittance({...newRemittance, description: e.target.value})}
              rows={2}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Preview */}
          {newRemittance.amount && newRemittance.exchangeRate && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Send:</span> 
                  <span className="font-semibold ml-1">
                    {parseFloat(newRemittance.amount).toLocaleString()} {newRemittance.fromCurrency}
                  </span>
                </div>
                <div>
                  <span className="text-blue-600">Rate:</span> 
                  <span className="font-semibold ml-1">{parseFloat(newRemittance.exchangeRate).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-blue-600">Receive:</span> 
                  <span className="font-semibold ml-1">
                    {(parseFloat(newRemittance.amount) * parseFloat(newRemittance.exchangeRate)).toLocaleString()} {newRemittance.toCurrency}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={createRemittance}
            disabled={!newRemittance.customerName || !newRemittance.amount}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🚀 Create Remittance & Send to WhatsApp
          </button>
        </div>

        {/* Mock WhatsApp Sender */}
        {showWhatsApp && currentRemittance && (
          <MockWhatsAppSender
            message={generateWhatsAppMessage(currentRemittance)}
            groupName={currentRemittance.whatsappGroup}
            onSent={() => {
              setShowWhatsApp(false);
              setShowSMS(true);
            }}
          />
        )}

        {/* Mock SMS Sender */}
        {showSMS && currentRemittance && (
          <MockSMSSender
            phoneNumber={currentRemittance.customerPhone}
            message={generateSMSMessage(currentRemittance)}
            onSent={() => {
              setShowSMS(false);
              setCurrentRemittance(null);
            }}
          />
        )}

        {/* Remittances List */}
        <div className="bg-white rounded-2xl shadow-xl">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold flex items-center">
              📋 Recent Remittances
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {remittances.map(remittance => (
                  <tr key={remittance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{remittance.trackingNumber}</div>
                      <div className="text-sm text-gray-500">{new Date(remittance.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{remittance.customerName}</div>
                      <div className="text-sm text-gray-500">{remittance.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {countries.find(c => c.code === remittance.fromCountry)?.flag} {remittance.fromCountry} 
                        <span className="mx-2">→</span>
                        {countries.find(c => c.code === remittance.toCountry)?.flag} {remittance.toCountry}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {parseFloat(remittance.amount).toLocaleString()} {remittance.fromCurrency}
                      </div>
                      <div className="text-sm text-gray-500">
                        Rate: {parseFloat(remittance.exchangeRate).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(remittance.status)}`}>
                        {remittance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {remittance.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateRemittanceStatus(remittance.id, 'processing')}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Process
                          </button>
                          <button
                            onClick={() => updateRemittanceStatus(remittance.id, 'completed')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Complete
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setCurrentRemittance(remittance);
                          setShowWhatsApp(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        📱 Resend
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {remittances.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💸</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No remittances yet</h3>
              <p className="text-gray-500">Create your first remittance to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemittanceManager;