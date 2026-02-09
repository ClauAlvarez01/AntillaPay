import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, CreditCard, Wallet, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../i18n/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const countryPaymentMethods = {
  US: { currency: 'USD', methods: ['Tarjeta', 'Apple Pay', 'Google Pay', 'ACH'] },
  ES: { currency: 'EUR', methods: ['Tarjeta', 'Bizum', 'Transferencia SEPA'] },
  MX: { currency: 'MXN', methods: ['Tarjeta', 'OXXO', 'SPEI'] },
  BR: { currency: 'BRL', methods: ['Tarjeta', 'PIX', 'Boleto'] },
  DE: { currency: 'EUR', methods: ['Tarjeta', 'SEPA', 'Giropay', 'Sofort'] },
  JP: { currency: 'JPY', methods: ['Tarjeta', 'Konbini', 'PayPay'] },
  CN: { currency: 'CNY', methods: ['WeChat Pay', 'Alipay', 'UnionPay'] },
  NL: { currency: 'EUR', methods: ['Tarjeta', 'iDEAL', 'Bancontact'] },
};

const countryFlags = {
  US: '🇺🇸 Estados Unidos',
  ES: '🇪🇸 España',
  MX: '🇲🇽 México',
  BR: '🇧🇷 Brasil',
  DE: '🇩🇪 Alemania',
  JP: '🇯🇵 Japón',
  CN: '🇨🇳 China',
  NL: '🇳🇱 Países Bajos',
};

const methodIcons = {
  'Tarjeta': CreditCard,
  'Apple Pay': Wallet,
  'Google Pay': Wallet,
  'ACH': Building,
  'Bizum': Wallet,
  'Transferencia SEPA': Building,
  'OXXO': Building,
  'SPEI': Building,
  'PIX': Wallet,
  'Boleto': Building,
  'SEPA': Building,
  'Giropay': Building,
  'Sofort': Building,
  'Konbini': Building,
  'PayPay': Wallet,
  'WeChat Pay': Wallet,
  'Alipay': Wallet,
  'UnionPay': CreditCard,
  'iDEAL': Building,
  'Bancontact': CreditCard,
};

export default function PaymentsSection() {
  const { t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState('US');
  const { currency, methods } = countryPaymentMethods[selectedCountry];

  return (
    <section className="py-20 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              {t('paymentsSection.eyebrow')}
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
              {t('paymentsSection.title')}
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              {t('paymentsSection.subtitle')}
            </p>

            <ul className="space-y-4 mb-8">
              {t('paymentsSection.features').map((feature, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-lg bg-blue-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <Button className="rounded-lg bg-blue-600 hover:bg-blue-700 mb-6">
              {t('paymentsSection.cta')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            <div>
              <p className="text-sm text-gray-500 mb-2">{t('paymentsSection.alsoInterested')}</p>
              <div className="flex gap-3">
                {t('paymentsSection.links').map((link) => (
                  <a 
                    key={link} 
                    href={`/products/${link.toLowerCase()}`}
                    className="text-sm text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Interactive Checkout */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-sm sm:max-w-md mx-auto">
              {/* Product Header */}
              <div className="bg-gray-50 p-6 border-b">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                    <span className="text-4xl">🪑</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Wood Chair 001</h3>
                    <p className="text-2xl font-bold text-gray-900">{currency} 149</p>
                  </div>
                </div>
              </div>

              {/* Country Selector */}
              <div className="p-6">
                <label className="text-sm text-gray-500 mb-2 block">Selecciona tu país</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-full h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(countryFlags).map(([code, name]) => (
                      <SelectItem key={code} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Payment Methods */}
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-3">Métodos de pago disponibles</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {methods.map((method, i) => {
                      const Icon = methodIcons[method] || CreditCard;
                      return (
                        <motion.div
                          key={method}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Icon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">{method}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Pay Button */}
                <Button className="w-full h-12 mt-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-base font-medium">
                  Pay {currency} 149
                </Button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-br from-blue-50 via-transparent to-purple-50 rounded-lg blur-3xl opacity-50" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}