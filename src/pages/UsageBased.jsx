import React from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../components/i18n/LanguageContext';

export default function UsageBased() {
  const { t } = useLanguage();

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gradient-to-br from-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {t('pages.usageBased.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('pages.usageBased.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12"
        >
          <p className="text-lg text-gray-700 mb-8">
            {t('pages.usageBased.content')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Activity, title: 'Medición en tiempo real', desc: 'Tracking preciso de uso' },
              { icon: BarChart, title: 'Modelos flexibles', desc: 'Por API call, GB, usuarios, etc' },
              { icon: DollarSign, title: 'Facturación justa', desc: 'Clientes pagan lo que usan' },
              { icon: Clock, title: 'Períodos personalizados', desc: 'Mensual, anual o custom' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="text-center">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg rounded-full">
            {t('common.getStarted')}
          </Button>
        </div>
      </div>
    </div>
  );
}