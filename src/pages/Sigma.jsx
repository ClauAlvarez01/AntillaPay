import React from 'react';
import { motion } from 'framer-motion';
import { Database, Code, BarChart, Download, Shield, FileText, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '../components/i18n/LanguageContext';

export default function Sigma() {
  const { t } = useLanguage();

  const features = [
    { 
      icon: Database, 
      title: 'Análisis de Datos', 
      desc: 'Potente motor de análisis para procesar datos empresariales en Cuba' 
    },
    { 
      icon: BarChart, 
      title: 'Reportes Personalizados', 
      desc: 'Genera informes adaptados a las necesidades de tu negocio cubano' 
    },
    { 
      icon: Shield, 
      title: 'Cumplimiento', 
      desc: 'Cumple con las regulaciones de protección de datos en Cuba' 
    },
    { 
      icon: FileText, 
      title: 'Documentación', 
      desc: 'Informes detallados para presentar a las autoridades cubanas' 
    },
    { 
      icon: TrendingUp, 
      title: 'Tendencias', 
      desc: 'Identifica patrones y oportunidades en el mercado cubano' 
    },
    { 
      icon: Users, 
      title: 'Equipos', 
      desc: 'Colabora con tu equipo en tiempo real' 
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
            Análisis de Datos para Cuba
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            Soluciones de análisis de datos para empresas cubanas
          </p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mt-6 leading-relaxed">
            {t('pages.sigma.content')}
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