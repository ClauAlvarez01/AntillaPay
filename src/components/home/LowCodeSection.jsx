import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../i18n/LanguageContext';

export default function LowCodeSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const options = [
    {
      id: 'platform',
      title: 'Usa una plataforma prediseñada',
      description: 'Conecta tu negocio a una pasarela preparada para operar en Cuba y comunicarse con bancos y redes internacionales mediante integraciones seguras',
      // links: ['Squarespace', 'Lightspeed'],
      // route: 'Solutions',
      logos: ['S', 'L', 'I', 'H']
    },
    {
      id: 'experts',
      title: 'Crea con expertos certificados por AntillaPay',
      description: 'Trabaja con un socio consultor de AntillaPay que puede integrar y desplegar soluciones de AntillaPay para ti',
      route: 'Solutions',
      icons: ['🚀', '💼', '🔧']
    },
    {
      id: 'nocode',
      title: 'Prueba nuestros productos sin código',
      description: 'Configura desde tu Dashboard',
      description2: ' cómo cobras y cómo liquidas: pagos locales, cobros internacionales y transferencias hacia/desde bancos del mundo para recibir ingresos sin fricción.',
      route: 'Solutions',
      features: [
        { label: 'Icono', value: 'T' },
        { label: 'Logotipo', value: 'Typeform' }
      ]
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-violet-600 font-semibold mb-4 text-sm tracking-wide uppercase">
            {t('home.lowCode.eyebrow')}
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('home.lowCode.title')}
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('home.lowCode.subtitle')}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {options.map((option, i) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white rounded-2xl shadow-lg transition-all overflow-hidden group border border-gray-100"
            >
              {/* Visual Area */}
              <div className="h-40 md:h-48 bg-gradient-to-br from-violet-50 to-purple-50 p-6 md:p-8 flex items-center justify-center">
                {option.logos ? (
                  <div className="grid grid-cols-2 gap-4">
                    {option.logos.map((logo, idx) => (
                      <div
                        key={idx}
                        className="w-16 h-16 rounded-xl bg-white shadow-md flex items-center justify-center font-bold text-gray-700 text-xl"
                      >
                        {logo}
                      </div>
                    ))}
                  </div>
                ) : option.icons ? (
                  <div className="flex gap-4">
                    {option.icons.map((icon, idx) => (
                      <div key={idx} className="text-4xl">
                        {icon}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs">
                    <div className="text-xs text-gray-500 mb-4">Elementos de la marca</div>
                    <div className="space-y-3">
                      {option.features.map((feature, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">{feature.label}</span>
                          <span className="font-semibold text-gray-900">{feature.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {option.title}
                </h3>
                <div className="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                  {option.description}
                  {option.links && option.links.map((link, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && ' y '}
                      <span className="text-violet-600 font-medium hover:underline">
                        {link}
                      </span>
                    </React.Fragment>
                  ))}
                  {option.description && !option.links && '.'}
                  {option.description2 && (
                    <span> {option.description2}</span>
                  )}
                </div>

                {/* Learn More button removed as per request */}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}