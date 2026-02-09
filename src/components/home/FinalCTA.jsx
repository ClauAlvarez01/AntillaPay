import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../i18n/LanguageContext';

export default function FinalCTA({ onLoginClick }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-gray-50 to-white">

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('home.finalCta.title')}
          </h2>
          <p className="text-base md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('home.finalCta.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={onLoginClick}
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-lg px-8 rounded-lg shadow-md shadow-violet-600/20 transition-all hover:shadow-lg hover:shadow-violet-600/30"
            >
              {t('home.finalCta.ctaStart')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              onClick={() => navigate(createPageUrl('Contact'))}
              size="lg"
              variant="outline"
              className="text-lg px-8 border-2 rounded-lg"
            >
              {t('home.finalCta.ctaSales')}
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-600" />
              <span>{t('home.finalCta.clearAccounts', 'Cuentas claras y transparentes')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span>{t('home.finalCta.transparentPricing', 'Precios integrados por transacción sin comisiones ocultas.')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}