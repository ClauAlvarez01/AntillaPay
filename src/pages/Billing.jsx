import React from 'react';
import { motion } from 'framer-motion';
import { Receipt, RefreshCw, CreditCard, Shield, Clock, Globe, Zap, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../components/i18n/LanguageContext';

export default function Billing() {
  const { t } = useLanguage();

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          {/* Flecha móvil */}
          <div className="flex justify-end sm:hidden mb-4">
            <Link
              to="/?section=modular&slide=2#soluciones-modulares"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-gray-200 bg-white text-blue-900 shadow-sm hover:bg-gray-50 hover:text-blue-900 transition-colors"
              aria-label="Volver a la sección interactiva del inicio"
            >
              <ArrowLeft className="w-6 h-6 text-blue-900" />
            </Link>
          </div>

          <div className="relative flex items-center justify-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-900 mb-0 text-center">
              Facturación Automatizada para Cuba
            </h1>
            <Link
              to="/?section=modular&slide=2#soluciones-modulares"
              className="hidden sm:inline-flex items-center justify-center w-11 h-11 rounded-full border border-gray-200 bg-white text-blue-900 shadow-sm hover:bg-gray-50 hover:text-blue-900 transition-colors absolute right-0 top-1/2 -translate-y-1/2"
              aria-label="Volver a la sección interactiva del inicio"
            >
              <ArrowLeft className="w-6 h-6 text-blue-900" />
            </Link>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            Soluciones de facturación y cobros recurrentes adaptadas al mercado cubano
          </p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mt-6 leading-relaxed">
            {t('pages.billing.content')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: Receipt, 
                title: 'Facturación Recurrente', 
                desc: 'Cobros automáticos en moneda nacional y divisas aceptadas en Cuba' 
              },
              { 
                icon: RefreshCw, 
                title: 'Reintentos Inteligentes', 
                desc: 'Gestión automática de pagos fallidos con notificaciones' 
              },
              { 
                icon: Shield, 
                title: 'Seguridad Garantizada', 
                desc: 'Protección de datos según regulaciones cubanas' 
              },
              { 
                icon: Clock, 
                title: 'Disponibilidad 24/7', 
                desc: 'Sistema en la nube accesible desde cualquier lugar' 
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-center p-6 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-16 h-16 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
