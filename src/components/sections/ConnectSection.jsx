import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Building2, Store, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../i18n/LanguageContext';

const modes = [
  { id: 'marketplace', name: 'Marketplaces', icon: Store },
  { id: 'saas', name: 'Plataformas SaaS', icon: Building2 },
];

const orders = [
  { id: '#9125', name: 'Horacio Ruiz', status: 'Procesando', amount: 150 },
  { id: '#9124', name: 'José Miranda', status: 'Completado', amount: 200 },
  { id: '#9123', name: 'John Appleseed', status: 'En espera', amount: 178 },
  { id: '#9122', name: 'Jane Diaz', status: 'Completado', amount: 200 },
];

export default function ConnectSection() {
  const { t } = useLanguage();
  const [activeMode, setActiveMode] = useState('marketplace');
  const [animatedOrders, setAnimatedOrders] = useState([]);

  useEffect(() => {
    // Animate orders appearing one by one
    orders.forEach((order, i) => {
      setTimeout(() => {
        setAnimatedOrders(prev => [...prev, order]);
      }, i * 200);
    });
  }, []);

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
            <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">
              {t('connectSection.eyebrow')}
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
              {t('connectSection.title')}
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              {t('connectSection.subtitle')}
            </p>

            <ul className="space-y-4 mb-8">
              {t('connectSection.features').map((feature, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-teal-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <Button className="rounded-full bg-teal-600 hover:bg-teal-700 mb-6">
              {t('connectSection.cta')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            <div>
              <p className="text-sm text-gray-500 mb-2">{t('connectSection.alsoInterested')}</p>
              <div className="flex gap-3">
                {t('connectSection.links').map((link) => (
                  <a 
                    key={link} 
                    href={`/products/${link.toLowerCase()}`}
                    className="text-sm text-teal-600 hover:text-teal-800 underline-offset-4 hover:underline"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Connect Diagram */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Mode Selector */}
            <div className="flex gap-2 mb-6">
              {modes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeMode === mode.id
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {mode.name}
                  </button>
                );
              })}
            </div>

            {/* Flow Diagram */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
              {/* Connection Lines */}
              <div className="flex items-center justify-between mb-6 sm:mb-8 gap-2">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center flex-shrink-0"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-1 sm:mb-2">
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-500">Compradores</span>
                </motion.div>

                {/* Animated Arrow */}
                <div className="flex-1 relative h-1 mx-4">
                  <div className="absolute inset-0 bg-gray-200 rounded-full" />
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                  <motion.div
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    <ChevronRight className="w-4 h-4 text-teal-500" />
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center flex-shrink-0"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-1 sm:mb-2 shadow-lg shadow-teal-500/30">
                    <Building2 className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-500">Plataforma</span>
                </motion.div>

                {/* Animated Arrow */}
                <div className="flex-1 relative h-1 mx-4">
                  <div className="absolute inset-0 bg-gray-200 rounded-full" />
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-400 to-green-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                  <motion.div
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2 }}
                  >
                    <ChevronRight className="w-4 h-4 text-green-500" />
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center flex-shrink-0"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-1 sm:mb-2">
                    <Store className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-500">Vendedores</span>
                </motion.div>
              </div>

              {/* Money Flow Indicators */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-blue-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                  <p className="text-sm sm:text-lg font-bold text-blue-700">USD350</p>
                  <p className="text-[10px] sm:text-xs text-blue-500">Pagado</p>
                </div>
                <div className="bg-teal-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                  <p className="text-sm sm:text-lg font-bold text-teal-700">USD10.50</p>
                  <p className="text-[10px] sm:text-xs text-teal-500">Comisión</p>
                </div>
                <div className="bg-green-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                  <p className="text-sm sm:text-lg font-bold text-green-700">USD339.50</p>
                  <p className="text-[10px] sm:text-xs text-green-500">Transferido</p>
                </div>
              </div>

              {/* Orders List */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Pedidos recientes</h4>
                <div className="space-y-2">
                  {orders.slice(0, 3).map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-gray-400">{order.id}</span>
                        <span className="text-sm text-gray-700">{order.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === 'Completado' 
                            ? 'bg-green-100 text-green-700' 
                            : order.status === 'Procesando'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-600'
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-sm font-medium text-gray-900">USD{order.amount}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-br from-teal-50 via-transparent to-cyan-50 rounded-full blur-3xl opacity-50" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}