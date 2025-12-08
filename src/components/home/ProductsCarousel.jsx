import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, Receipt, Share2, Calculator, 
  Wallet, Building2, TrendingUp, ArrowRight,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../i18n/LanguageContext';

export default function ProductsCarousel() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const products = [
    {
      id: 'payments',
      name: 'Payments',
      desc: 'Acepta pagos en toda Cuba con tarjetas, billeteras digitales y métodos de pago locales.',
      icon: CreditCard,
      gradient: 'from-blue-500 to-indigo-600',
      features: ['100+ métodos de pago', 'Pagos internacionales', 'Optimización de conversión']
    },
    {
      id: 'tax',
      name: 'Tax',
      desc: 'Automatiza el cálculo, recolección y reporteo de impuestos en toda Cuba.',
      icon: Calculator,
      gradient: 'from-amber-500 to-orange-600',
      features: ['Cálculo automático', 'Cumplimiento global', 'Integración con Billing', 'Reportes fiscales']
    },
    {
      id: 'issuing',
      name: 'Issuing',
      desc: 'Crea tarjetas clásicas y tropicales para tu negocio o plataforma.',
      icon: Wallet,
      gradient: 'from-emerald-500 to-green-600',
      features: ['Tarjetas virtuales', 'Tarjetas físicas', 'Control de gastos']
    },
    {
      id: 'billing',
      name: 'Billing',
      desc: 'Gestiona suscripciones y facturación recurrente con modelos de precios flexibles.',
      icon: Receipt,
      gradient: 'from-purple-500 to-pink-600',
      features: ['Suscripciones recurrentes', 'Precios por uso', 'Portal de clientes', 'Recuperación de pagos']
    },
    {
      id: 'connect',
      name: 'Connect',
      desc: 'Pagos para plataformas y marketplaces con splits automáticos y onboarding de vendedores.',
      icon: Share2,
      gradient: 'from-teal-500 to-cyan-600',
      features: ['Pagos multi-parte', 'Onboarding KYC', 'Transferencias instantáneas', 'Reportes consolidados']
    },
    {
      id: 'treasury',
      name: 'Treasury',
      desc: 'Banca como servicio para integrar cuentas y pagos en tu producto.',
      icon: Building2,
      gradient: 'from-slate-600 to-gray-800',
      features: ['Cuentas bancarias', 'ACH y transferencias', 'Gestión de fondos', 'API unificada']
    },
    {
      id: 'capital',
      name: 'Capital',
      desc: 'Acceso a financiamiento flexible basado en tu volumen de ventas.',
      icon: TrendingUp,
      gradient: 'from-violet-500 to-purple-600',
      features: ['Pre-aprobación automática', 'Pagos flexibles', 'Sin garantías', 'Fondos en 24h']
    },
  ];

  const visibleCards = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, products.length - visibleCards);

  const next = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Productos AntillaPay
            </h2>
            <p className="text-xl text-gray-600">
              Una suite completa de productos financieros y de pagos para impulsar tu negocio
            </p>
          </motion.div>

          {/* Navigation Arrows */}
          <div className="flex gap-2 self-end sm:self-auto">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-violet-50 hover:bg-violet-100 flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-violet-600" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-violet-50 hover:bg-violet-100 flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-4 h-4 text-violet-600" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: -currentIndex * (100 / (isMobile ? 1 : visibleCards)) + '%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex"
          >
              {products.map((product, i) => {
                const Icon = product.icon;
                
                return (
                  <motion.div
                    key={product.id}
                    className="flex-shrink-0 px-2 md:px-3"
                    style={{ width: `${100 / visibleCards}%` }}
                    whileHover={{ y: -8 }}
                  >
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all h-full">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center mb-4`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-600 mb-4" style={{ minHeight: '72px' }}>
                        {product.desc}
                      </p>

                      <ul className="space-y-2 mb-6">
                        {product.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* <Button variant="ghost" className="w-full text-gray-700 hover:text-gray-900">
                        Más información
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button> */}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(maxIndex + 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex ? 'w-8 bg-violet-600' : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
