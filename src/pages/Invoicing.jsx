import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, CheckCircle, Receipt } from 'lucide-react';
import { useLanguage } from '../components/i18n/LanguageContext';

export default function Invoicing() {
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
            Facturación Electrónica en Cuba
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            Solución integral para la emisión de facturas según normativas fiscales cubanas
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <p className="text-lg text-gray-700 mb-8 text-center">
            Emite facturas electrónicas válidas según las regulaciones del Ministerio de Finanzas y Precios de Cuba.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: FileText, 
                title: 'Facturación Electrónica', 
                desc: 'Cumplimiento con las normativas fiscales cubanas vigentes' 
              },
              { 
                icon: CheckCircle, 
                title: 'Validación ONAT', 
                desc: 'Códigos QR y firma digital según normativas' 
              },
              { 
                icon: Send, 
                title: 'Envío Automatizado', 
                desc: 'Entrega inmediata a clientes vía email o mensajería' 
              },
              { 
                icon: Receipt, 
                title: 'Control Fiscal', 
                desc: 'Registro detallado para auditorías y controles' 
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
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