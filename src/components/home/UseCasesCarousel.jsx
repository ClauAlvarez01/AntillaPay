import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function UseCasesCarousel() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const useCases = [
    {
      id: 'ia',
      title: 'IA',
      description: 'AntillaPay admite empresas de todo el ecosistema de IA, desde el cobro por consumo para asistentes de IA como Perplexity hasta suscripciones prémium para proveedores de infraestructura como OpenAI.',
      companies: ['OpenAI', 'CURSOR', 'ANTHROPIC'],
      route: 'Solutions',
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      id: 'saas',
      title: 'SaaS',
      description: 'Haz lanzamientos rápidamente y haz crecer los ingresos recurrentes con una plataforma unificada para pagos, suscripciones, facturación, impuestos y más.',
      companies: ['slack', 'twilio', 'Linear'],
      route: 'Solutions',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Obtén todo lo que necesitas para lanzar tu marketplace: desde onboarding a los procesos de KYC, gestionar pagos a múltiples partes, transferencias, todo en un solo lugar.',
      companies: ['BLOOMNATION', 'Deliveroo', 'Instacart'],
      route: 'Solutions',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 'fintech',
      title: 'Servicios financieros integrados',
      description: 'Integra servicios bancarios y financieros directamente en tu producto para mejorar la experiencia del usuario y crear nuevas fuentes de ingresos.',
      companies: ['Nubank', 'Revolut', 'Chime'],
      route: 'Solutions',
      gradient: 'from-indigo-500 to-blue-600'
    },
    {
      id: 'ecommerce',
      title: 'Comercio electrónico',
      description: 'Optimiza tu checkout y aumenta conversiones con métodos de pago locales dentro de Cuba. Aumenta experiencias de compra en un clic.',
      companies: ['Shopify', 'WooCommerce', 'BigCommerce'],
      route: 'Solutions',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      id: 'crypto',
      title: 'Criptomoneda',
      description: 'Facilita la conversión entre cripto y fiat con on-ramps y off-ramps seguros, cumpliendo con todas las regulaciones.',
      companies: ['Coinbase', 'Binance', 'Kraken'],
      route: 'Solutions',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'creators',
      title: 'Economía de los creadores',
      description: 'Monetiza contenido y gestiona pagos a creadores con herramientas de suscripción, donaciones y distribución de ingresos.',
      companies: ['Patreon', 'Substack', 'OnlyFans'],
      route: 'Solutions',
      gradient: 'from-pink-500 to-rose-600'
    }
  ];

  const visibleCards = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, useCases.length - visibleCards);

  const next = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center w-full max-w-3xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('home.useCases.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.useCases.subtitle')}
            </p>
          </motion.div>

          {/* Navigation Arrows */}
          <div className="flex gap-2 mt-8 justify-center">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-lg bg-violet-50 hover:bg-violet-100 flex items-center justify-center transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 text-violet-600" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-lg bg-violet-50 hover:bg-violet-100 flex items-center justify-center transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 text-violet-600" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative w-full">
          <div className="w-full overflow-hidden">
            <motion.div
              animate={{ x: `-${currentIndex * (100 / (isMobile ? 1 : visibleCards))}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex w-full"
            >
              {useCases.map((useCase, i) => (
                <motion.div
                  key={useCase.id}
                  className="flex-shrink-0 px-2 md:px-0"
                  style={{ width: `calc(100% / ${visibleCards})` }}
                >
                  <div className={`
                    relative h-full bg-white rounded-2xl border-t-4 shadow-lg 
                    transition-all duration-300 overflow-visible flex flex-col
                    hover:shadow-xl hover:-translate-y-1 mx-3
                  `}
                  style={{
                    borderTopColor: `rgb(${i % 2 === 0 ? '139, 92, 246' : '59, 130, 246'})`,
                    minHeight: '320px',
                  }}
                  >
                    <div className="p-6 flex flex-col h-full text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {useCase.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed flex-1">
                        {useCase.description}
                      </p>

                      {/* Company Logos */}
                      <div className="flex flex-wrap justify-center gap-4 pt-6 border-t border-gray-100">
                        {useCase.companies.map((company) => (
                          <div key={company} className="text-gray-400 font-semibold text-sm">
                            {company}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(maxIndex + 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-lg transition-all ${
                  i === currentIndex ? 'w-8 bg-violet-600' : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}