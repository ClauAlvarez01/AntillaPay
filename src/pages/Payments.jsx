import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ArrowRight, Globe2, Shield, Zap, TrendingUp,
  Smartphone, Check, ChevronDown, ChevronUp, Star, Clock, QrCode,
  Banknote, Building2, DollarSign, Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/LanguageContext';

export default function Payments() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  const paymentMethods = [
    {
      icon: Banknote,
      title: 'Efectivo',
      desc: 'Peso cubano (CUP) y USD en comercios autorizados',
      color: 'bg-green-100 text-green-600',
      details: [
        'CUP: medio más común para compras del día a día',
        'USD en efectivo en comercios autorizados'
      ]
    },
    {
      icon: QrCode,
      title: 'Pagos QR',
      desc: 'Transfermóvil y EnZona para pagos electrónicos',
      color: 'bg-blue-100 text-blue-600',
      details: [
        'Transfermóvil: pagos en línea y QR',
        'EnZona: escanea, ingresa importe y confirma'
      ]
    },
    {
      icon: CreditCard,
      title: 'Tarjetas Nacionales',
      desc: 'Tarjetas bancarias emitidas en Cuba',
      color: 'bg-purple-100 text-purple-600',
      details: [
        'BANDEC, BPA, Metropolitano',
        'Tarjetas prepagadas FINCIMEX'
      ]
    },
    {
      icon: Globe2,
      title: 'Tarjetas Internacionales',
      desc: 'MIR, UnionPay, Visa/Mastercard',
      color: 'bg-orange-100 text-orange-600',
      details: [
        'MIR (Rusia): cajeros y POS',
        'UnionPay (China): red local RED S.A.',
        'Visa/Mastercard: según comercio'
      ]
    }
  ];

  const features = [
    {
      icon: QrCode,
      title: 'Enlaces de pagos',
      subtitle: 'Acepta tu primer pago en minutos, sin necesidad de programación',
      desc: 'Comparte enlaces por correo electrónico, SMS o cualquier otro canal. Acepta pagos únicos, recurrentes o de importe personalizado.',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      features: [
        'Comparte enlaces por correo electrónico, SMS o cualquier otro canal',
        'Acepta pagos únicos, recurrentes o de importe personalizado',
        'Convierte tu enlace en un código QR o en un botón de compra incrustable'
      ]
    },
    {
      icon: Smartphone,
      title: 'Checkout',
      subtitle: 'Formulario de pago prediseñado',
      desc: 'Acelera tu lanzamiento gracias a un proceso de finalización de compra optimizado para la conversión.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      features: [
        'Insértalo en tu sitio web o redirige a tus clientes a una página alojada en AntillaPay',
        'Personaliza los colores y el tipo de fuente para que se ajuste a tu marca',
        'Empieza a aceptar pagos recurrentes y activa AntillaPay Tax sin ningún trabajo adicional de integración'
      ]
    }
  ];

  const internationalCards = [
    {
      desc: 'Acepta el método de pago predominante en todo el mundo con una de las mayores redes de tarjetas del mundo.',
      badge: 'Tarjetas',
      color: 'bg-blue-600',
      logo: 'VISA'
    },
    {
      desc: 'Acepta el método de pago predominante en todo el mundo con una de las mayores redes de tarjetas del mundo.',
      badge: 'Tarjetas',
      color: 'bg-orange-500',
      logo: 'mastercard'
    },
    {
      desc: 'PayPal es una opción de pago de confianza utilizada por cientos de millones de clientes de todo el mundo en más de 200 países para pagar de forma segura.',
      badge: 'Carteras digitales',
      color: 'bg-blue-600',
      logo: 'PayPal'
    },
    {
      desc: 'Ofrece Google Pay listo para usar a los clientes que lo tienen configurado en su dispositivo o navegador.',
      badge: 'Carteras digitales',
      color: 'bg-blue-500',
      logo: 'G Pay'
    },
    {
      desc: 'Permite que tus clientes paguen mediante la misma experiencia de proceso de compra que millones de usuarios de Amazon conocen y eligen.',
      badge: 'Carteras digitales',
      color: 'bg-orange-500',
      logo: 'amazon pay'
    },
    {
      desc: 'Permite a los clientes de China, además de a los viajeros chinos, pagar con Alipay en 11 monedas principales.',
      badge: 'Carteras digitales',
      color: 'bg-blue-500',
      logo: 'Alipay'
    },
    {
      desc: 'Ofrece opciones de pago flexibles que dan a tus clientes más libertad para elegir cuándo y cómo pagar sus compras. Accede a más de 150 millones de consumidores en 27 mercados.',
      badge: 'Compra ahora, paga después',
      color: 'bg-pink-400',
      logo: 'Klarna.'
    },
    {
      desc: 'Ofrece una experiencia de pagos fluida y sin fricciones con Link, el método de pago que rellena automáticamente los datos de pago y envío del cliente.',
      badge: 'Carteras digitales',
      color: 'bg-green-600',
      logo: 'link'
    },
    {
      desc: 'Llega a más clientes globales, reduce los costos y minimiza las tarifas de cambio internacional ofreciendo monedas estables como método de pago directamente en tu proceso de compra.',
      badge: 'Criptomoneda',
      color: 'bg-indigo-600',
      logo: '₡',
      subtitle: '(Versión preliminar)'
    },
    {
      desc: 'Las transferencias bancarias son ideales para transacciones puntuales de importes elevados (como los pagos B2B) porque tienen los costos de transacción más bajos y reducen la carga operativa.',
      badge: 'Transferencia bancaria',
      color: 'bg-purple-600',
      logo: 'USD'
    },
    {
      desc: 'Acepta pagos de la red de tarjetas más grande de China, con presencia en Cuba mediante cooperación con RED S.A.',
      badge: 'Tarjetas',
      color: 'bg-red-600',
      logo: 'UnionPay'
    },
    {
      desc: 'Sistema de pago ruso oficializado en Cuba para cajeros automáticos y terminales punto de venta (POS).',
      badge: 'Tarjetas',
      color: 'bg-green-700',
      logo: 'MIR'
    }
  ];

  const faqs = [
    {
      q: '¿Qué métodos de pago están disponibles en Cuba?',
      a: 'En Cuba conviven varios métodos: efectivo (CUP y USD en comercios autorizados), pagos electrónicos nacionales (Transfermóvil y EnZona con QR), tarjetas bancarias cubanas (BANDEC, BPA, Metropolitano, FINCIMEX), y tarjetas internacionales (MIR, UnionPay, Visa/Mastercard según el comercio).'
    },
    {
      q: '¿Cómo funcionan los pagos con QR en Cuba?',
      a: 'Los pagos QR en Cuba se realizan principalmente a través de Transfermóvil (ETECSA) y EnZona. El cliente escanea el código QR del comercio, ingresa el importe y confirma el pago usando su tarjeta bancaria asociada.'
    },
    {
      q: '¿Qué tarjetas internacionales se aceptan?',
      a: 'Se aceptan tarjetas MIR (Rusia) en cajeros automáticos y POS, UnionPay (China) mediante cooperación con RED S.A., y Visa/Mastercard en determinados comercios según restricciones y red de adquirencia.'
    },
    {
      q: '¿Qué puede ofrecer un comercio en Cuba?',
      a: 'Un comercio típicamente puede ofrecer: pagos QR (Transfermóvil/EnZona) para transacciones locales, terminales POS para tarjetas nacionales e internacionales donde aplique, y aceptación de efectivo en CUP y USD (en circuitos autorizados).'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Varias formas de aceptar pagos en línea
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Acepta pagos en efectivo, QR, tarjetas nacionales e internacionales. Soluciones adaptadas al mercado cubano.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Payment Methods in Cuba */}
      <section className="pt-0 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Métodos de pago en Cuba
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              En Cuba conviven múltiples formas de pago para adaptarse a las necesidades de comercios y clientes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {paymentMethods.map((method, i) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                >
                  <div className={`w-14 h-14 rounded-xl ${method.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {method.desc}
                  </p>
                  <ul className="space-y-2">
                    {method.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Payment Features - Similar to images */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-white rounded-3xl p-8 shadow-lg border-t-4 border-violet-600"
                >
                  <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-700 mb-4 font-medium">
                    {feature.subtitle}
                  </p>
                  <ul className="space-y-3">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-600">
                        <Check className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* International Payment Methods - Cards style from images */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Métodos de pago internacionales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Acepta pagos de clientes internacionales con las opciones más populares
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {internationalCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all"
              >
                {/* Thin colored top bar */}
                <div className={`${card.color} h-2 w-full`}></div>
                
                {/* Logo section */}
                <div className="flex items-center justify-center py-8 border-b border-gray-100">
                  <span className="text-gray-900 text-2xl font-bold tracking-tight">
                    {card.logo}
                  </span>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {card.name}
                  </h3>
                  {card.subtitle && (
                    <p className="text-sm text-gray-500 mb-3">{card.subtitle}</p>
                  )}
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {card.desc}
                  </p>
                  
                  {/* Footer with badge */}
                  <div className="mt-4">
                    <span className="inline-block text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                      {card.badge}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Merchants Can Offer */}
      <section className="py-20 bg-gradient-to-br from-violet-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Qué puede ofrecer un comercio?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Opciones típicas que un negocio en Cuba puede implementar
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: QrCode, 
                title: 'Pagos QR', 
                desc: 'Transfermóvil y EnZona para pagos locales rápidos y seguros',
                color: 'bg-blue-100',
                iconColor: 'text-blue-600'
              },
              { 
                icon: CreditCard, 
                title: 'Terminales POS', 
                desc: 'Tarjetas nacionales e internacionales donde aplique',
                color: 'bg-purple-100',
                iconColor: 'text-purple-600'
              },
              { 
                icon: Banknote, 
                title: 'Efectivo', 
                desc: 'CUP y USD en circuitos autorizados',
                color: 'bg-green-100',
                iconColor: 'text-green-600'
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="p-6 text-center">
                    <div className={`w-14 h-14 ${item.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Preguntas frecuentes
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 text-gray-600">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-violet-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Moderniza tu sistema de pagos
            </h2>
            <p className="text-xl mb-8 text-violet-100">
              Acepta todas las formas de pago disponibles en Cuba y expande tu negocio
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-violet-600 hover:bg-gray-100 rounded-full px-6 py-2 text-sm font-medium shadow-md shadow-violet-600/20 transition-all hover:shadow-lg hover:shadow-violet-600/30 active:scale-[0.98]"
                onClick={() => window.location.href = '/login'}
              >
                Comenzar ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                className="bg-white text-violet-600 hover:bg-gray-100 rounded-full px-6 py-2 text-sm font-medium shadow-md shadow-violet-600/20 transition-all hover:shadow-lg hover:shadow-violet-600/30 active:scale-[0.98]"
                onClick={() => window.location.href = '/contact'}
              >
                Contactar ventas
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}