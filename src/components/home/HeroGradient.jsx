import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';

export default function HeroGradient({ onLoginClick }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLoginClick) {
      onLoginClick();
    }
  };

  return (
    <div className="relative lg:min-h-[650px] pt-10 sm:pt-16 overflow-hidden flex items-center">
      {/* Gradient Background - Soft Pastel */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-200/60 via-blue-200/50 to-cyan-100/60">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/40 via-transparent to-emerald-50/30" />
        {/* Radial glows */}
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-purple-200/30 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-cyan-200/30 to-transparent blur-3xl" />
      </div>

      {/* Diagonal Cut */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-white" 
           style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)' }} />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 md:mb-6 leading-tight text-center md:text-left">
              <span className="text-gray-900">{t('home.hero.title')}</span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                {t('home.hero.titleHighlight')}
              </span>
            </h1>
            <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-6 leading-relaxed max-w-2xl text-center md:text-left">
              {t('home.hero.subtitle')}
            </p>
            
            <div className="mt-12 sm:mt-4">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-stretch">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('home.hero.emailPlaceholder')}
                  className="flex-1 px-4 py-2.5 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-white shadow-lg h-12 text-sm"
                />
                <Button 
                  type="submit"
                  size="lg"
                  className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6 whitespace-nowrap shadow-lg h-12 text-sm"
                >
                  {t('home.hero.cta')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Desktop Mockups - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[550px] hidden lg:block"
          >
            {/* Back Mockup - Dashboard Analytics */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-[-5.5rem] w-[380px] bg-white rounded-2xl shadow-2xl transform rotate-1 overflow-hidden border border-gray-100"
            >
              {/* Dashboard Header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-md flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">A</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">ANTILLA PAY</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
                <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-md px-2 py-1.5">
                  <Search className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] text-gray-400">Búsqueda</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Hoy</h3>
                
                {/* Volume Section */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-gray-500">Volumen neto</span>
                      <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
                    </div>
                    <div className="text-xl font-bold text-slate-800">USD3,528,198.72</div>
                    <div className="text-[10px] text-gray-400">2:00 p.m.</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-500 mb-1">Ayer</div>
                    <div className="text-sm text-gray-600">USD2,931,556.34</div>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="h-12 mb-3 flex items-end gap-0.5">
                  {[20, 15, 25, 18, 22, 30, 28, 35, 32, 40, 38, 45, 50, 55, 60].map((h, i) => (
                    <div key={i} className="flex-1 bg-violet-100 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-1.5 h-1.5 bg-violet-600 rounded-full mb-0.5" />
                    <div className="flex-1 bg-violet-600 rounded-t-sm w-full" style={{ height: '70%' }} />
                  </div>
                </div>
                <div className="flex justify-between text-[9px] text-gray-400 mb-4">
                  <span>12:00 a.m.</span>
                  <span className="text-violet-600 font-medium">Ahora, 2:00 p.m.</span>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] text-gray-600">Volumen neto de ventas</span>
                      <span className="text-[9px] text-emerald-500 font-medium">+32.8%</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800">USD39,274.29</div>
                    <div className="text-[9px] text-gray-400">USD29,573.54</div>
                    {/* Mini line chart */}
                    <svg className="w-full h-6 mt-1" viewBox="0 0 80 20">
                      <polyline fill="none" stroke="#8b5cf6" strokeWidth="1.5" points="0,18 10,15 20,16 30,12 40,14 50,10 60,8 70,6 80,4" />
                    </svg>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] text-gray-600">Clientes nuevos</span>
                      <span className="text-[9px] text-emerald-500 font-medium">+32.1%</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-slate-800">37</span>
                      <span className="text-[10px] text-gray-400">28</span>
                    </div>
                    {/* Mini line chart */}
                    <svg className="w-full h-6 mt-1" viewBox="0 0 80 20">
                      <polyline fill="none" stroke="#8b5cf6" strokeWidth="1.5" points="0,16 15,14 25,15 35,12 50,10 60,8 75,5 80,6" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Front Mockup - Checkout */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-24 left-8 w-[280px] bg-white rounded-2xl shadow-2xl overflow-hidden z-10 transform -rotate-6 border-2 border-gray-100"
            >
              <div className="p-5 space-y-3">
                {/* Product Header */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-20 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                    <div className="text-center">
                      <div className="text-white text-[10px] font-bold mb-0.5">Issue 001</div>
                      <div className="w-10 h-10 bg-white/90 rounded-lg mx-auto flex items-center justify-center">
                        <div className="space-y-0.5">
                          <div className="w-6 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                          <div className="w-6 h-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">Abstraction Magazine</div>
                    <div className="text-[11px] text-gray-500">USD19 al mes</div>
                  </div>
                </div>

                {/* Apple Pay Button */}
                <button className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 text-sm">
                  <span>🍎</span>
                  <span>Pay</span>
                </button>

                {/* Divider */}
                <div className="relative py-1.5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-[10px] text-gray-400">{t('checkout.orPayWithCard')}</span>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-2.5">
                  <input
                    type="email"
                    placeholder={t('checkout.email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    disabled
                  />
                  
                  <div>
                    <div className="text-[10px] text-gray-600 mb-1.5 font-medium">{t('checkout.cardInfo')}</div>
                    <div className="relative">
                      <input
                        placeholder={t('checkout.cardNumber')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-t-lg text-xs"
                        disabled
                      />
                      <div className="absolute right-2 top-2 flex gap-0.5">
                        <div className="w-5 h-3.5 bg-blue-600 rounded-sm" />
                        <div className="w-5 h-3.5 bg-red-600 rounded-sm" />
                        <div className="w-5 h-3.5 bg-blue-500 rounded-sm" />
                        <div className="w-5 h-3.5 bg-orange-500 rounded-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <input 
                        placeholder="MM/AA" 
                        className="px-3 py-2 border-l border-b border-r-0 border-gray-300 rounded-bl-lg text-xs" 
                        disabled 
                      />
                      <input 
                        placeholder="CVC" 
                        className="px-3 py-2 border-r border-b border-l border-gray-300 rounded-br-lg text-xs" 
                        disabled 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-600 mb-1.5 font-medium">{t('checkout.country')}</div>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-600" disabled>
                      <option>United States</option>
                    </select>
                  </div>

                  <input
                    placeholder={t('checkout.postalCode')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    disabled
                  />
                </div>

                {/* Pay Button */}
                <button className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-semibold text-xs">
                  {t('checkout.pay')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
