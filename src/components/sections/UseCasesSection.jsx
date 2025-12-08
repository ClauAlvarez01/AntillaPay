import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Cloud, ShoppingCart, Building2, 
  Globe, Coins, Sparkles, ArrowRight 
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '@/components/ui/button';

const useCaseIcons = {
  ai: Brain,
  saas: Cloud,
  marketplaces: ShoppingCart,
  fintech: Building2,
  ecommerce: Globe,
  crypto: Coins,
  creators: Sparkles,
};

const useCaseColors = {
  ai: { bg: 'bg-violet-100', text: 'text-violet-600', gradient: 'from-violet-500 to-purple-600' },
  saas: { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-500 to-indigo-600' },
  marketplaces: { bg: 'bg-teal-100', text: 'text-teal-600', gradient: 'from-teal-500 to-cyan-600' },
  fintech: { bg: 'bg-emerald-100', text: 'text-emerald-600', gradient: 'from-emerald-500 to-green-600' },
  ecommerce: { bg: 'bg-amber-100', text: 'text-amber-600', gradient: 'from-amber-500 to-orange-600' },
  crypto: { bg: 'bg-slate-100', text: 'text-slate-600', gradient: 'from-slate-600 to-gray-800' },
  creators: { bg: 'bg-pink-100', text: 'text-pink-600', gradient: 'from-pink-500 to-rose-600' },
};

const useCaseMockData = {
  ai: {
    kpis: [
      { label: 'API Calls', value: '2.3M', change: '+45%' },
      { label: 'MRR', value: '$127K', change: '+32%' },
      { label: 'Active Users', value: '15.2K', change: '+28%' },
    ],
    story: 'Monetiza modelos de IA con facturación por tokens y suscripciones híbridas.'
  },
  saas: {
    kpis: [
      { label: 'MRR', value: '$89K', change: '+18%' },
      { label: 'Churn', value: '1.2%', change: '-0.3%' },
      { label: 'LTV', value: '$2,400', change: '+15%' },
    ],
    story: 'Gestiona suscripciones, pruebas gratuitas y upgrades sin fricción.'
  },
  marketplaces: {
    kpis: [
      { label: 'GMV', value: '$1.2M', change: '+52%' },
      { label: 'Sellers', value: '4,320', change: '+89' },
      { label: 'Take Rate', value: '12.5%', change: '+0.5%' },
    ],
    story: 'Facilita pagos entre compradores y vendedores con splits automáticos.'
  },
  fintech: {
    kpis: [
      { label: 'Accounts', value: '45K', change: '+2.3K' },
      { label: 'Volume', value: '$34M', change: '+28%' },
      { label: 'Cards Issued', value: '12K', change: '+890' },
    ],
    story: 'Integra cuentas bancarias, tarjetas y préstamos en tu producto.'
  },
  ecommerce: {
    kpis: [
      { label: 'Orders', value: '8.4K', change: '+15%' },
      { label: 'AOV', value: '$156', change: '+8%' },
      { label: 'Conversion', value: '3.2%', change: '+0.4%' },
    ],
    story: 'Optimiza el checkout y acepta pagos locales en todo el mundo.'
  },
  crypto: {
    kpis: [
      { label: 'On-ramp', value: '$4.2M', change: '+67%' },
      { label: 'Off-ramp', value: '$2.8M', change: '+43%' },
      { label: 'Users', value: '23K', change: '+4.5K' },
    ],
    story: 'Conecta cripto y fiat con on-ramps y off-ramps seguros.'
  },
  creators: {
    kpis: [
      { label: 'Revenue', value: '$234K', change: '+41%' },
      { label: 'Creators', value: '1.2K', change: '+180' },
      { label: 'Fans', value: '89K', change: '+12K' },
    ],
    story: 'Monetiza contenido con suscripciones, tips y ventas digitales.'
  },
};

export default function UseCasesSection() {
  const { t } = useLanguage();
  const [activeCase, setActiveCase] = useState('ai');
  const detailRef = useRef(null);

  const useCases = [
    { id: 'ai', title: t('useCases.ai.title'), desc: t('useCases.ai.desc') },
    { id: 'saas', title: t('useCases.saas.title'), desc: t('useCases.saas.desc') },
    { id: 'marketplaces', title: t('useCases.marketplaces.title'), desc: t('useCases.marketplaces.desc') },
    { id: 'fintech', title: t('useCases.fintech.title'), desc: t('useCases.fintech.desc') },
    { id: 'ecommerce', title: t('useCases.ecommerce.title'), desc: t('useCases.ecommerce.desc') },
    { id: 'crypto', title: t('useCases.crypto.title'), desc: t('useCases.crypto.desc') },
    { id: 'creators', title: t('useCases.creators.title'), desc: t('useCases.creators.desc') },
  ];

  const handleCaseClick = (caseId) => {
    setActiveCase(caseId);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const activeData = useCaseMockData[activeCase];
  const activeColor = useCaseColors[activeCase];
  const ActiveIcon = useCaseIcons[activeCase];

  return (
    <section className="py-20 lg:py-32 bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {t('useCases.title')}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t('useCases.subtitle')}
          </p>
        </motion.div>

        {/* Use Case Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 mb-8 sm:mb-12">
          {useCases.map((useCase, i) => {
            const Icon = useCaseIcons[useCase.id];
            const color = useCaseColors[useCase.id];
            const isActive = activeCase === useCase.id;
            
            return (
              <motion.button
                key={useCase.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleCaseClick(useCase.id)}
                className={`p-3 sm:p-4 rounded-xl text-left transition-all ${
                  isActive 
                    ? 'bg-white text-gray-900 shadow-xl' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg ${color.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${color.text}`} />
                </div>
                <p className={`font-medium text-sm ${isActive ? 'text-gray-900' : 'text-white'}`}>
                  {useCase.title}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div ref={detailRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800 rounded-2xl overflow-hidden"
            >
              <div className={`h-1 bg-gradient-to-r ${activeColor.gradient}`} />
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left - Info */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${activeColor.bg} flex items-center justify-center`}>
                        <ActiveIcon className={`w-6 h-6 ${activeColor.text}`} />
                      </div>
                      <h3 className="text-2xl font-bold">
                        {useCases.find(u => u.id === activeCase)?.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 mb-6">
                      {activeData.story}
                    </p>
                    <p className="text-gray-300">
                      {useCases.find(u => u.id === activeCase)?.desc}
                    </p>
                    <Button className="mt-6 rounded-full bg-white text-gray-900 hover:bg-gray-100">
                      {t('common.learnMore')}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>

                  {/* Right - KPIs */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    {activeData.kpis.map((kpi, i) => (
                      <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-gray-900/50 rounded-lg sm:rounded-xl p-2 sm:p-4 text-center"
                      >
                        <p className="text-xl sm:text-3xl font-bold mb-1">{kpi.value}</p>
                        <p className="text-xs text-gray-400 mb-2">{kpi.label}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          kpi.change.startsWith('+') 
                            ? 'bg-green-900/50 text-green-400' 
                            : 'bg-red-900/50 text-red-400'
                        }`}>
                          {kpi.change}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}