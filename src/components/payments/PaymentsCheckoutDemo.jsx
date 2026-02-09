import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentsCheckoutDemo() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => setProcessing(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div>
          <div className="text-sm text-gray-500">Suscripción</div>
          <div className="text-2xl font-bold text-gray-900">AntillaPay Pro</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">$149</div>
          <div className="text-sm text-gray-500">/mes</div>
        </div>
      </div>

      {/* Payment Methods Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setPaymentMethod('card')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
            paymentMethod === 'card'
              ? 'border-violet-600 bg-violet-50 text-violet-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span className="font-medium">Tarjeta</span>
        </button>
        <button
          onClick={() => setPaymentMethod('wallet')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
            paymentMethod === 'wallet'
              ? 'border-violet-600 bg-violet-50 text-violet-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <Smartphone className="w-5 h-5" />
          <span className="font-medium">Wallet</span>
        </button>
      </div>

      {paymentMethod === 'card' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tu@correo.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          {/* Card Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Información de la tarjeta
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="1234 1234 1234 1234"
                className="w-full px-4 py-3 border border-gray-300 rounded-t-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
              <div className="absolute right-4 top-3 flex gap-2">
                <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-400 rounded" />
                <div className="w-8 h-5 bg-gradient-to-r from-red-600 to-orange-500 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-0">
              <input
                type="text"
                placeholder="MM/AA"
                className="px-4 py-3 border border-t-0 border-r-0 border-gray-300 rounded-bl-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="CVC"
                className="px-4 py-3 border border-t-0 border-gray-300 rounded-br-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País o región
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent">
              <option>México</option>
              <option>España</option>
              <option>Argentina</option>
              <option>Chile</option>
            </select>
          </div>

          {/* Save Info */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 w-4 h-4 text-violet-600 rounded" />
            <span className="text-sm text-gray-600">
              Guardar mis datos para un proceso de compra seguro en un clic
            </span>
          </label>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {['Apple Pay', 'Google Pay', 'PayPal'].map((wallet) => (
            <button
              key={wallet}
              className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-violet-600 hover:bg-violet-50 transition-all"
            >
              <span className="font-medium text-gray-900">{wallet}</span>
              <Check className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </motion.div>
      )}

      {/* Pay Button */}
      <Button
        onClick={handlePay}
        disabled={processing}
        className="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white py-4 text-lg font-semibold"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-lg animate-spin" />
            Procesando...
          </span>
        ) : (
          `Pagar $149.00`
        )}
      </Button>

      {/* Security */}
      <div className="mt-4 text-center text-xs text-gray-500">
        <div className="flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-green-600" />
          <span>Pago seguro cifrado</span>
        </div>
      </div>
    </div>
  );
}