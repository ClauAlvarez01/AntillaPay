import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, TrendingUp, Clock, Coins, Handshake, CheckCircle } from 'lucide-react';
import { useLanguage } from '../components/i18n/LanguageContext';

export default function Capital() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Coins,
      title: 'Capital en USD, MLC y MN',
      desc: 'Financiamiento disponible tanto en moneda nacional como en divisas'
    },
    {
      icon: TrendingUp,
      title: 'Crecimiento Empresarial',
      desc: 'Impulsa el desarrollo de tu negocio con capital accesible'
    },
    {
      icon: Clock,
      title: 'Desembolsos Rápidos',
      desc: 'Recibe los fondos en tu cuenta en el menor tiempo posible'
    },
    {
      icon: Handshake,
      title: 'Términos Flexibles',
      desc: 'Plazos y condiciones adaptados a la realidad cubana'
    },
    {
      icon: CheckCircle,
      title: 'Sin Garantías Complicadas',
      desc: 'Proceso simplificado para acceder al financiamiento'
    },
    {
      icon: PieChart,
      title: 'Seguimiento en Tiempo Real',
      desc: 'Monitorea el estado de tu financiamiento en todo momento'
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
            Capital de Trabajo para Cuba
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            Soluciones de financiamiento adaptadas al ecosistema empresarial cubano
          </p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mt-6 leading-relaxed">
            {t('pages.capital.content')}
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