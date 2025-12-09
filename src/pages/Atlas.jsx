import React from 'react';
import { motion } from 'framer-motion';
import { Building2, FileCheck, Globe2, Zap, MapPin, Users, Banknote, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../components/i18n/LanguageContext';

export default function Atlas() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Building2,
      title: 'Constitución Empresarial',
      desc: 'Crea tu empresa en Cuba de manera rápida y segura'
    },
    {
      icon: FileCheck,
      title: 'Trámites Simplificados',
      desc: 'Gestionamos toda la documentación necesaria para tu negocio'
    },
    {
      icon: Globe2,
      title: 'Conexión Global',
      desc: 'Facilita operaciones internacionales desde Cuba'
    },
    {
      icon: MapPin,
      title: 'Ubicación Estratégica',
      desc: 'Asesoría para establecer tu negocio en zonas de desarrollo'
    },
    {
      icon: Users,
      title: 'Asesoría Legal',
      desc: 'Expertos en legislación empresarial cubana'
    },
    {
      icon: Banknote,
      title: 'Soporte Financiero',
      desc: 'Ayuda con la gestión de cuentas y operaciones bancarias'
    }
  ];

  const steps = [
    {
      icon: 1,
      title: 'Asesoría Inicial',
      description: 'Analizamos tu modelo de negocio y necesidades específicas',
      iconColor: 'bg-blue-100 text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      icon: 2,
      title: 'Proceso de Constitución',
      description: 'Gestionamos toda la documentación legal requerida',
      iconColor: 'bg-violet-100 text-violet-600',
      borderColor: 'border-violet-200'
    },
    {
      icon: 3,
      title: 'Puesta en Marcha',
      description: 'Tu negocio listo para operar en el mercado cubano',
      iconColor: 'bg-emerald-100 text-emerald-600',
      borderColor: 'border-emerald-200'
    }
  ];


  return (
    <div className="pt-32 pb-20 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
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
              Constitución de Empresas en Cuba
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
            Soluciones integrales para la creación y gestión de tu negocio en Cuba
          </p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mt-6 leading-relaxed">
            {t('pages.atlas.content')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-20"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Nuestros Servicios</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="p-6 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
              >
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Cómo Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`p-6 rounded-xl border-t-4 ${step.borderColor} bg-white shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className={`w-10 h-10 ${step.iconColor} rounded-full flex items-center justify-center text-lg font-bold mb-4`}>
                  {step.icon}
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
