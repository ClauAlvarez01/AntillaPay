import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, SmartphoneCharging, Wallet, SmartphoneNfc, Gift, QrCode, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../components/i18n/LanguageContext';

export default function Issuing() {
  const { t } = useLanguage();

  const features = [
    {
      icon: CreditCard,
      title: 'Tarjetas Clásicas',
      desc: 'Tarjetas tradicionales aceptadas en toda Cuba'
    },
    {
      icon: Smartphone,
      title: 'Tarjetas Tropicales',
      desc: 'Diseños exclusivos con motivos cubanos'
    },
    {
      icon: Wallet,
      title: 'Billeteras Digitales',
      desc: 'Gestiona tu dinero desde tu dispositivo móvil'
    },
    {
      icon: SmartphoneNfc,
      title: 'Pagos Móviles',
      desc: 'Realiza y recibe pagos directamente desde tu teléfono móvil'
    },
    {
      icon: Gift,
      title: 'Beneficios Exclusivos',
      desc: 'Descuentos en comercios afiliados en toda la isla'
    },
    {
      icon: QrCode,
      title: 'Pagos por QR',
      desc: 'Realiza pagos rápidos escaneando códigos QR'
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
          {/* Flecha móvil */}
          <div className="flex justify-end sm:hidden mb-4">
            <Link
              to="/?section=modular&slide=2#soluciones-modulares"
              className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-gray-200 bg-white text-blue-900 shadow-sm hover:bg-gray-50 hover:text-blue-900 transition-colors"
              aria-label="Volver a la sección interactiva del inicio"
            >
              <ArrowLeft className="w-6 h-6 text-blue-900" />
            </Link>
          </div>

          <div className="relative flex items-center justify-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-900 mb-0 text-center">
              Emisión de Medios de Pago
            </h1>
            <Link
              to="/?section=modular&slide=2#soluciones-modulares"
              className="hidden sm:inline-flex items-center justify-center w-11 h-11 rounded-lg border border-gray-200 bg-white text-blue-900 shadow-sm hover:bg-gray-50 hover:text-blue-900 transition-colors absolute right-0 top-1/2 -translate-y-1/2"
              aria-label="Volver a la sección interactiva del inicio"
            >
              <ArrowLeft className="w-6 h-6 text-blue-900" />
            </Link>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            Soluciones de pago adaptadas al mercado cubano
          </p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mt-6 leading-relaxed">
            {t('pages.issuing.content')}
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
