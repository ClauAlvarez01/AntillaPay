import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Receipt, Share2, Calculator, 
  Shield, Wallet, Building2, TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../i18n/LanguageContext';

const productIcons = {
  payments: CreditCard,
  billing: Receipt,
  connect: Share2,
  tax: Calculator,
  issuing: Wallet,
  treasury: Building2,
  capital: TrendingUp,
};

const productColors = {
  payments: 'from-blue-500 to-indigo-600',
  billing: 'from-purple-500 to-pink-600',
  connect: 'from-teal-500 to-cyan-600',
  tax: 'from-amber-500 to-orange-600',
  issuing: 'from-emerald-500 to-green-600',
  treasury: 'from-slate-600 to-gray-800',
  capital: 'from-violet-500 to-purple-600',
};

export default function ProductsGrid() {
  const { t } = useLanguage();
  const [activeProduct, setActiveProduct] = useState('payments');
  const detailRef = useRef(null);

  const products = [
    { id: 'payments', name: t('products.payments.name'), desc: t('products.payments.desc') },
    { id: 'billing', name: t('products.billing.name'), desc: t('products.billing.desc') },
    { id: 'connect', name: t('products.connect.name'), desc: t('products.connect.desc') },
    { id: 'tax', name: t('products.tax.name'), desc: t('products.tax.desc') },
    { id: 'issuing', name: t('products.issuing.name'), desc: t('products.issuing.desc') },
    { id: 'treasury', name: t('products.treasury.name'), desc: t('products.treasury.desc') },
    { id: 'capital', name: t('products.capital.name'), desc: t('products.capital.desc') },
  ];

  const handleProductClick = (productId) => {
    setActiveProduct(productId);
    // Smooth scroll to detail panel
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const getProductDetail = () => {
    const product = products.find(p => p.id === activeProduct);
    const Icon = productIcons[activeProduct];
    const gradient = productColors[activeProduct];

    return (
      <motion.div
        key={activeProduct}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className={`h-2 bg-gradient-to-r ${gradient}`} />
        <div className="p-6 lg:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
              <p className="text-gray-600 mt-1">{product.desc}</p>
            </div>
          </div>

          {/* Mock UI based on product */}
          <div className="bg-gray-50 rounded-xl p-4 min-h-[200px]">
            {activeProduct === 'payments' && <PaymentsMock />}
            {activeProduct === 'billing' && <BillingMock />}
            {activeProduct === 'connect' && <ConnectMock />}
            {activeProduct === 'tax' && <TaxMock />}
            {activeProduct === 'issuing' && <IssuingMock />}
            {activeProduct === 'treasury' && <TreasuryMock />}
            {activeProduct === 'capital' && <CapitalMock />}
          </div>

          {/* Removed Learn More button */}
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-20 lg:py-32 bg-gray-50 w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column */}
          <div className="w-full text-left">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-semibold text-indigo-600 uppercase tracking-wider inline-block text-left"
            >
              {t('products.eyebrow')}
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6 leading-tight"
            >
              {t('products.title')}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 mb-8"
            >
              {t('products.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Button className="rounded-lg bg-indigo-600 hover:bg-indigo-700">
                {t('products.cta')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {/* Right Column - Product Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3"
          >
            {products.map((product, index) => {
              const Icon = productIcons[product.id];
              const isActive = activeProduct === product.id;
              const gradient = productColors[product.id];
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all ${
                    isActive 
                      ? 'border-gray-900 bg-white shadow-lg' 
                      : 'border-gray-200 bg-white/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{product.name}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Product Detail Panel */}
        <div ref={detailRef} className="mt-12">
          <AnimatePresence mode="wait">
            {getProductDetail()}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// Mock Components for each product
function PaymentsMock() {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {['🇺🇸 USD', '🇪🇺 EUR', '🇯🇵 JPY', '🇬🇧 GBP'].map((currency) => (
        <div key={currency} className="bg-white rounded-lg px-4 py-2 shadow-sm border">
          <span className="text-sm font-medium">{currency}</span>
        </div>
      ))}
    </div>
  );
}

function BillingMock() {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="bg-white rounded-lg p-4 shadow-sm border flex-1 max-w-[150px]">
        <p className="text-xs text-gray-500 mb-1">Mensual</p>
        <p className="text-2xl font-bold">$49</p>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border border-indigo-500 flex-1 max-w-[150px]">
        <p className="text-xs text-gray-500 mb-1">Anual</p>
        <p className="text-2xl font-bold">$39</p>
        <span className="text-xs text-green-600">Ahorra 20%</span>
      </div>
    </div>
  );
}

function ConnectMock() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="bg-blue-100 rounded-lg px-3 py-2 text-blue-700 text-sm">Comprador</div>
      <div className="w-8 h-0.5 bg-gray-300" />
      <div className="bg-indigo-600 rounded-lg px-3 py-2 text-white text-sm">Plataforma</div>
      <div className="w-8 h-0.5 bg-gray-300" />
      <div className="bg-green-100 rounded-lg px-3 py-2 text-green-700 text-sm">Vendedor</div>
    </div>
  );
}

function TaxMock() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border max-w-[200px] mx-auto">
      <p className="text-sm text-gray-500 mb-2">IVA calculado</p>
      <p className="text-2xl font-bold">$21.00</p>
      <p className="text-xs text-gray-400">21% sobre $100.00</p>
    </div>
  );
}


function IssuingMock() {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 max-w-[240px] mx-auto text-white">
      <div className="flex justify-between items-start mb-6">
        <span className="text-xs opacity-70">AntillaPay</span>
        <Wallet className="w-5 h-5 opacity-70" />
      </div>
      <p className="text-lg tracking-widest mb-4">•••• •••• •••• 4242</p>
      <div className="flex justify-between text-xs opacity-70">
        <span>JANE DOE</span>
        <span>12/25</span>
      </div>
    </div>
  );
}

function TreasuryMock() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border max-w-[200px] mx-auto">
      <p className="text-sm text-gray-500 mb-2">Saldo disponible</p>
      <p className="text-2xl font-bold">$125,430.00</p>
      <div className="h-1 bg-gray-200 rounded mt-3">
        <div className="h-1 bg-emerald-500 rounded w-3/4" />
      </div>
    </div>
  );
}

function CapitalMock() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border max-w-[200px] mx-auto">
      <p className="text-sm text-gray-500 mb-2">Línea de crédito</p>
      <p className="text-2xl font-bold">$50,000</p>
      <p className="text-xs text-violet-600 mt-2">Pre-aprobado ✓</p>
    </div>
  );
}