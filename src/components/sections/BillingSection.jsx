import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../i18n/LanguageContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const brandTabs = [
  { id: 'quantum', name: 'Quantum', color: 'from-violet-500 to-purple-600' },
  { id: 'abstraction', name: 'Abstraction', color: 'from-pink-500 to-rose-600' },
  { id: 'typographic', name: 'Typographic', color: 'from-amber-500 to-orange-600' },
];

const plans = {
  quantum: [
    {
      name: 'Estándar',
      price: 49,
      period: 'mes',
      features: ['Hasta 5 usuarios', '12 meses de datos históricos', 'Actualización cada 4h', '500+ integraciones'],
    },
    {
      name: 'Profesional',
      price: 149,
      period: 'mes',
      popular: true,
      features: ['Hasta 25 usuarios', '24 meses de datos históricos', 'Actualización cada 1h', '1000+ integraciones', 'Informes avanzados'],
    },
    {
      name: 'Empresa',
      price: 299,
      period: 'mes',
      features: ['Sin límite de usuarios', 'Datos históricos ilimitados', 'Actualización cada 15min', '2000+ integraciones', 'Soporte prioritario'],
    },
  ],
  abstraction: [
    {
      name: 'Básico',
      price: 9,
      period: 'mes',
      features: ['Acceso digital', 'Contenido web ilimitado', 'Contenido exclusivo'],
    },
    {
      name: 'Premium',
      price: 19,
      period: 'mes',
      popular: true,
      features: ['Acceso digital + impreso', 'Ediciones mensuales', 'Contenido exclusivo', 'Sin anuncios'],
    },
  ],
  typographic: [
    {
      name: 'Web',
      price: 99,
      period: 'mes',
      features: ['50-499 usuarios', 'Hasta 3 fuentes', '50,000 solicitudes', '5 dominios', 'Plazas ilimitadas'],
    },
  ],
};

export default function BillingSection() {
  const { t } = useLanguage();
  const [activeBrand, setActiveBrand] = useState('quantum');
  const [subscribingPlan, setSubscribingPlan] = useState(null);

  const handleSubscribe = (planName) => {
    setSubscribingPlan(planName);
    setTimeout(() => {
      setSubscribingPlan(null);
    }, 2000);
  };

  return (
    <section className="py-20 lg:py-32 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32"
          >
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
              {t('billingSection.eyebrow')}
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
              {t('billingSection.title')}
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              {t('billingSection.subtitle')}
            </p>

            <ul className="space-y-4 mb-8">
              {t('billingSection.features').map((feature, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-purple-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <Button className="rounded-full bg-purple-600 hover:bg-purple-700 mb-6">
              {t('billingSection.cta')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            <div>
              <p className="text-sm text-gray-500 mb-2">{t('billingSection.alsoInterested')}</p>
              <div className="flex gap-3">
                {t('billingSection.links').map((link) => (
                  <a 
                    key={link} 
                    href={`/products/${link.toLowerCase()}`}
                    className="text-sm text-purple-600 hover:text-purple-800 underline-offset-4 hover:underline"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Pricing Tables */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Brand Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {brandTabs.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setActiveBrand(brand.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeBrand === brand.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {brand.name}
                </button>
              ))}
            </div>

            {/* Pricing Cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBrand}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-4"
              >
                {plans[activeBrand].map((plan, i) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-white rounded-2xl p-4 sm:p-6 border-2 transition-all ${
                      plan.popular 
                        ? 'border-purple-500 shadow-xl shadow-purple-500/10' 
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                        {plan.popular && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                            {t('plans.popular')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{plan.features[0]}</p>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">USD{plan.price}</span>
                      <span className="text-gray-500">/{plan.period}</span>
                    </div>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plan.features.slice(1).map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button 
                      onClick={() => handleSubscribe(plan.name)}
                      disabled={subscribingPlan === plan.name}
                      className={`w-full rounded-xl ${
                        plan.popular 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      {subscribingPlan === plan.name ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        t('plans.subscribe')
                      )}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}