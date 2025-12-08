import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, Loader2, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'ES', name: 'España' },
  { code: 'MX', name: 'México' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CO', name: 'Colombia' },
  { code: 'DE', name: 'Deutschland' },
  { code: 'FR', name: 'France' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'JP', name: '日本' },
];

export default function HeroCheckout() {
  const { t } = useLanguage();
  const [paymentState, setPaymentState] = useState('idle'); // idle, loading, success, error
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    country: 'US',
    postalCode: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setPaymentState('loading');
    
    // Simulate payment processing
    setTimeout(() => {
      if (formData.cardNumber.length >= 16) {
        setPaymentState('success');
        setTimeout(() => setPaymentState('idle'), 3000);
      } else {
        setPaymentState('error');
        setTimeout(() => setPaymentState('idle'), 3000);
      }
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative"
    >
      {/* Phone Frame - Made taller/rectangular */}
      <div className="relative bg-white rounded-[2.5rem] shadow-xl shadow-black/15 p-3 w-[340px] h-[580px]">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-xl" />
        
        {/* Screen */}
        <div className="bg-gray-50 rounded-[2rem] overflow-hidden pt-7 h-full">
          {/* Product Info */}
          <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-5 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-3 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg">{t('checkout.subscription')}</h3>
            <p className="text-white/80 text-sm">USD19 {t('checkout.perMonth')}</p>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-3">
            {/* Wallet Pay Button */}
            <Button 
              type="button"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg h-11 flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 12.5c0-.8-.5-1.5-1.2-1.8l1.4-4.2h-4.6l1.4 4.2c-.7.3-1.2 1-1.2 1.8s.5 1.5 1.2 1.8l-1.4 4.2h4.6l-1.4-4.2c.8-.3 1.2-1 1.2-1.8z"/>
              </svg>
              {t('checkout.walletPay')}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">{t('checkout.orPayWithCard')}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">{t('checkout.email')}</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="h-10 rounded-lg border-gray-200 text-sm"
                placeholder="correo@ejemplo.com"
              />
            </div>

            {/* Card Info */}
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">{t('checkout.cardInfo')}</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="relative">
                  <Input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({...formData, cardNumber: formatCardNumber(e.target.value)})}
                    className="h-10 border-0 border-b border-gray-200 rounded-none text-sm pr-20"
                    placeholder="1234 1234 1234 1234"
                    maxLength={19}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-400 rounded text-white text-[6px] flex items-center justify-center font-bold">VISA</div>
                    <div className="w-8 h-5 bg-gradient-to-r from-red-500 to-orange-400 rounded flex items-center justify-center">
                      <div className="w-3 h-3 bg-red-600 rounded-full opacity-80" />
                      <div className="w-3 h-3 bg-orange-400 rounded-full -ml-1.5 opacity-80" />
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <Input
                    type="text"
                    value={formData.expiry}
                    onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                    className="h-10 border-0 border-r border-gray-200 rounded-none text-sm flex-1"
                    placeholder={t('checkout.expiry')}
                    maxLength={5}
                  />
                  <Input
                    type="text"
                    value={formData.cvc}
                    onChange={(e) => setFormData({...formData, cvc: e.target.value})}
                    className="h-10 border-0 rounded-none text-sm flex-1"
                    placeholder={t('checkout.cvc')}
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">{t('checkout.country')}</label>
              <Select value={formData.country} onValueChange={(v) => setFormData({...formData, country: v})}>
                <SelectTrigger className="h-10 rounded-lg border-gray-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Postal Code */}
            <Input
              type="text"
              value={formData.postalCode}
              onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
              className="h-10 rounded-lg border-gray-200 text-sm"
              placeholder={t('checkout.postalCode')}
            />

            {/* Submit Button */}
            <Button 
              type="submit"
              disabled={paymentState === 'loading'}
              className={`w-full h-12 rounded-lg font-medium text-base transition-all ${
                paymentState === 'success' 
                  ? 'bg-green-500 hover:bg-green-500' 
                  : paymentState === 'error'
                    ? 'bg-red-500 hover:bg-red-500'
                    : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {paymentState === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : paymentState === 'success' ? (
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  {t('checkout.success')}
                </span>
              ) : paymentState === 'error' ? (
                <span className="flex items-center gap-2">
                  <X className="w-5 h-5" />
                  {t('checkout.error')}
                </span>
              ) : (
                t('checkout.pay')
              )}
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}