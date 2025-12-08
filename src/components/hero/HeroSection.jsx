import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '../i18n/LanguageContext';
import HeroCheckout from './HeroCheckout';
import HeroDashboard from './HeroDashboard';

export default function HeroSection() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setSubmitState('loading');
    setTimeout(() => {
      setSubmitState('success');
      setTimeout(() => {
        setSubmitState('idle');
        setEmail('');
      }, 2000);
    }, 1500);
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-20 lg:pt-24">
      {/* Light gradient background - AntillaPay style */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base light gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, 
              #fdf4ff 0%,
              #fae8ff 10%,
              #e0e7ff 25%,
              #dbeafe 40%,
              #cffafe 55%,
              #d1fae5 70%,
              #fef3c7 85%,
              #ffedd5 100%
            )`
          }}
        />
        
        {/* Soft color blobs */}
        <div 
          className="absolute top-0 right-0 w-[60%] h-[70%]"
          style={{
            background: 'radial-gradient(ellipse at 70% 30%, rgba(167, 139, 250, 0.3) 0%, transparent 50%)'
          }}
        />
        <div 
          className="absolute top-[20%] left-[10%] w-[40%] h-[50%]"
          style={{
            background: 'radial-gradient(ellipse at 30% 40%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)'
          }}
        />
        <div 
          className="absolute bottom-0 right-[20%] w-[50%] h-[60%]"
          style={{
            background: 'radial-gradient(ellipse at 60% 80%, rgba(34, 211, 238, 0.2) 0%, transparent 50%)'
          }}
        />
        <div 
          className="absolute bottom-[10%] left-0 w-[40%] h-[50%]"
          style={{
            background: 'radial-gradient(ellipse at 20% 70%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left z-10"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-4 sm:mb-6">
              {t('hero.title')}
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('hero.emailPlaceholder')}
                className="h-12 px-5 rounded-lg bg-white border-gray-200 shadow-sm text-base placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                disabled={submitState === 'loading'}
              />
              <Button 
                type="submit"
                disabled={submitState === 'loading' || submitState === 'success'}
                className={`h-12 px-6 rounded-lg font-semibold text-base shadow-md transition-all whitespace-nowrap ${
                  submitState === 'success'
                    ? 'bg-green-500 hover:bg-green-500'
                    : 'bg-violet-600 hover:bg-violet-700 hover:shadow-lg'
                }`}
              >
                {submitState === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : submitState === 'success' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <>
                    {t('hero.cta')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-sm text-gray-500 mt-4">
              {t('hero.disclaimer')}
            </p>
          </motion.div>

          {/* Right Column - Interactive Mockups */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex flex-col sm:flex-row items-center justify-center lg:justify-end"
            style={{ position: 'relative', minHeight: '500px' }}
          >
            {/* Dashboard - back layer, positioned absolutely */}
            <div 
              className="absolute sm:relative w-full sm:w-auto flex justify-center"
              style={{ 
                position: 'absolute',
                top: '60px',
                right: '0',
                zIndex: 1
              }}
            >
              <div className="scale-90 sm:scale-100">
                <HeroDashboard />
              </div>
            </div>
            {/* Checkout card - front layer, overlapping */}
            <div 
              className="relative w-full sm:w-auto flex justify-center mt-0"
              style={{ 
                position: 'relative',
                zIndex: 2,
                marginRight: '-80px'
              }}
            >
              <div className="scale-90 sm:scale-100">
                <HeroCheckout />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}