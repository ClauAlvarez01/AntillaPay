import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, FileText, TrendingUp, Shield } from 'lucide-react';
import { useLanguage } from '../components/i18n/LanguageContext';

export default function Tax() {
  const { t } = useLanguage();

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-900 mb-8">
            Solución Fiscal para Cuba
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            Gestión de impuestos simplificada para el ecosistema empresarial cubano
          </p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mt-6 leading-relaxed">
            {t('pages.tax.content')}
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
                icon: Calculator, 
                title: 'Cálculo Automático', 
                desc: 'Cálculo preciso de impuestos según la legislación fiscal cubana actualizada' 
              },
              { 
                icon: FileText, 
                title: 'Reportes Fiscales', 
                desc: 'Generación automática de reportes para empresas.' 
              },
              { 
                icon: TrendingUp, 
                title: 'Gestión de Ventas', 
                desc: 'Seguimiento de transacciones y cálculo de impuestos sobre ventas' 
              },
              { 
                icon: Shield, 
                title: 'Cumplimiento', 
                desc: 'Garantiza el cumplimiento con las regulaciones fiscales cubanas' 
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-green-600" />
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