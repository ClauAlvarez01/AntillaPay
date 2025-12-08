import React from 'react';
import { motion } from 'framer-motion';
import { User, Fingerprint, ShieldCheck, FileText, Smartphone, CheckCircle } from 'lucide-react';
import { useLanguage } from '../components/i18n/LanguageContext';

export default function Identity() {
  const { t } = useLanguage();

  const features = [
    {
      icon: User,
      title: 'Verificación de Identidad',
      desc: 'Validación segura de documentos de identidad cubanos'
    },
    {
      icon: Fingerprint,
      title: 'Autenticación Biométrica',
      desc: 'Sistema seguro de reconocimiento facial y huellas dactilares'
    },
    {
      icon: ShieldCheck,
      title: 'Seguridad Garantizada',
      desc: 'Protección de datos personales según regulaciones cubanas'
    },
    {
      icon: FileText,
      title: 'Documentos Digitales',
      desc: 'Almacenamiento seguro de documentos de identificación'
    },
    {
      icon: Smartphone,
      title: 'Acceso Móvil',
      desc: 'Gestiona tu identidad digital desde cualquier dispositivo'
    },
    {
      icon: CheckCircle,
      title: 'Verificación Instantánea',
      desc: 'Confirma tu identidad de forma rápida y segura'
    }
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-900 mb-8">
            Identidad Digital en Cuba
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            Soluciones seguras de verificación de identidad para el ecosistema cubano
          </p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mt-6 leading-relaxed">
            {t('pages.identity.content')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
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