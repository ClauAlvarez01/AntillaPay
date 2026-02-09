import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Receipt, FileText, PieChart, BarChart3, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../i18n/LanguageContext';

const TILES = [
  { 
    id: 'billing', 
    icon: Receipt, 
    color: '#8B5CF6', 
    route: 'Billing',
    position: { top: '15%', left: '-12%' }
  },
  { 
    id: 'invoicing', 
    icon: FileText, 
    color: '#10B981', 
    route: 'Invoicing',
    position: { bottom: '20%', left: '-10%' }
  },
  { 
    id: 'revenue', 
    icon: PieChart, 
    color: '#F59E0B', 
    route: 'RevenueRecognition',
    position: { top: '30%', right: '-12%' }
  },
  { 
    id: 'sigma', 
    icon: BarChart3, 
    color: '#6366F1', 
    route: 'Sigma',
    position: { bottom: '25%', right: '-10%' }
  }
];

export default function BillingShowcase({ onLoginClick }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [hoveredTile, setHoveredTile] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [highlightedConnections, setHighlightedConnections] = useState([]);
  const mockupRef = useRef(null);
  const tilesRef = useRef({});
  const [connections, setConnections] = useState([]);
  const intervalRef = useRef(null);

  // Auto-carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Dynamic connection animation
  useEffect(() => {
    const animateConnections = () => {
      if (hoveredTile) return;
      
      const colors = ['#8B5CF6', '#10B981', '#F59E0B', '#6366F1'];
      const numToHighlight = Math.floor(Math.random() * 2) + 2;
      const tileIds = TILES.map(t => t.id);
      const shuffled = [...tileIds].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, numToHighlight).map((id, i) => ({
        id,
        color: colors[i % colors.length]
      }));
      
      setHighlightedConnections(selected);
    };

    animateConnections();
    intervalRef.current = setInterval(animateConnections, 2500 + Math.random() * 1000);
    return () => clearInterval(intervalRef.current);
  }, [hoveredTile]);

  useEffect(() => {
    if (hoveredTile) {
      const tile = TILES.find(t => t.id === hoveredTile);
      setHighlightedConnections([{ id: hoveredTile, color: tile?.color || '#8B5CF6' }]);
    }
  }, [hoveredTile]);

  useEffect(() => {
    const calculateConnections = () => {
      if (!mockupRef.current) return;

      const mockupRect = mockupRef.current.getBoundingClientRect();
      const mockupCenterX = mockupRect.width / 2;
      const mockupCenterY = mockupRect.height / 2;

      const newConnections = TILES.map(tile => {
        const tileEl = tilesRef.current[tile.id];
        if (!tileEl) return null;

        const tileRect = tileEl.getBoundingClientRect();
        const mockupPos = mockupRef.current.getBoundingClientRect();
        
        const tileCenterX = tileRect.left - mockupPos.left + tileRect.width / 2;
        const tileCenterY = tileRect.top - mockupPos.top + tileRect.height / 2;

        const isLeft = tileCenterX < mockupCenterX;
        const controlX = isLeft ? tileCenterX + 80 : tileCenterX - 80;
        const controlY = (tileCenterY + mockupCenterY) / 2;

        return {
          id: tile.id,
          path: `M ${tileCenterX},${tileCenterY} Q ${controlX},${controlY} ${mockupCenterX},${mockupCenterY}`,
          color: tile.color
        };
      }).filter(Boolean);

      setConnections(newConnections);
    };

    calculateConnections();
    window.addEventListener('resize', calculateConnections);
    const timer = setTimeout(calculateConnections, 100);

    return () => {
      window.removeEventListener('resize', calculateConnections);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left - Text Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 mb-8">
              <Receipt className="w-5 h-5 text-green-600" />
              {t('home.billing.label')}
            </div>
            
            {/* Title */}
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-[1.08] tracking-tight">
              {t('home.billing.title')}
            </h2>
            
            {/* Subtitle */}
            <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
              {t('home.billing.description')}
            </p>

            {/* CTA Button - identical to Payments */}
            <Button 
              onClick={onLoginClick}
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 rounded-lg px-8 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {t('home.billing.cta')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          {/* Right - Mockup with Carousel and Tiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative hidden lg:block"
            style={{ minHeight: '650px' }}
          >
            <div ref={mockupRef} className="relative h-full flex items-center justify-center py-12">
              {/* SVG Connections */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                style={{ zIndex: 5 }}
              >
                {connections.map((conn) => {
                  const highlighted = highlightedConnections.find(h => h.id === conn.id);
                  const isHighlighted = !!highlighted;
                  
                  return (
                    <motion.path
                      key={conn.id}
                      d={conn.path}
                      fill="none"
                      stroke={isHighlighted ? highlighted.color : '#E5E7EB'}
                      strokeWidth={isHighlighted ? 2 : 1}
                      strokeLinecap="round"
                      animate={{ 
                        opacity: isHighlighted ? 0.8 : 0.3,
                        strokeWidth: isHighlighted ? 2 : 1
                      }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  );
                })}
              </svg>

              {/* Billing Mockup Carousel */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative bg-white rounded-3xl shadow-2xl p-5 w-full max-w-md z-10 flex items-center"
                style={{ 
                  boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15)',
                  height: '550px'
                }}
              >
                <div className="relative overflow-hidden w-full h-[420px]">
                  {/* Slide 1 - Quantum (3 plans) */}
                  <motion.div
                    animate={{ 
                      x: currentSlide === 0 ? 0 : '-100%',
                      opacity: currentSlide === 0 ? 1 : 0
                    }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full space-y-2">
                      {/* Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">Q</span>
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">Quantum</span>
                        </div>
                        <div className="flex gap-3 text-[10px] text-gray-600">
                          <span>{t('nav.products')}</span>
                          <span>{t('nav.pricing')}</span>
                          <span>{t('nav.contactSales').split(' ')[0]}</span>
                        </div>
                      </div>

                      {/* Plans */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { name: 'Estándar', price: 49, users: 5 },
                          { name: 'Profesional', price: 149, users: 25, badge: true },
                          { name: 'Empresa', price: 299, users: '∞' }
                        ].map((plan, i) => (
                          <div key={i} className={`rounded-lg p-2.5 border flex flex-col justify-between ${plan.badge ? 'border-violet-400 bg-violet-50' : 'border-gray-200 bg-white'}`}>
                            <div>
                              {plan.badge && (
                                <div className="text-center mb-1">
                                  <span className="text-[8px] px-2 py-0.5 bg-violet-500 text-white rounded-lg">{t('plans.popular')}</span>
                                </div>
                              )}
                              <div className="text-center mb-2">
                                <div className="text-xs font-semibold text-gray-900">{plan.name}</div>
                                <div className="text-[9px] text-gray-500">Hasta {plan.users} usuarios</div>
                              </div>
                              <div className="text-center mb-2">
                                <div className="text-lg font-bold text-gray-900">USD{plan.price}</div>
                                <div className="text-[9px] text-gray-500">/mes</div>
                              </div>
                              <button className="w-full py-1.5 rounded-md text-[10px] font-medium bg-violet-600 text-white">
                                {t('plans.subscribe')}
                              </button>
                            </div>
                            <div className="mt-2 space-y-1">
                              <div className="text-[8px] font-semibold text-gray-700">{t('plans.includes')}</div>
                              {[
                                `${i === 0 ? '12' : i === 1 ? '24' : '∞'} meses datos`,
                                `Datos cada ${i === 0 ? '4' : i === 1 ? '1' : '15 min'} h`,
                                `${i === 0 ? '500' : i === 1 ? '1000' : '2000'} integrac.`
                              ].map((f, idx) => (
                                <div key={idx} className="flex items-start gap-1 text-[8px] text-gray-600">
                                  <Check className="w-2.5 h-2.5 text-violet-500 flex-shrink-0 mt-0.5" />
                                  <span>{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Slide 2 - Typographic (single plan) */}
                  <motion.div
                    animate={{ 
                      x: currentSlide === 1 ? 0 : currentSlide === 0 ? '100%' : '-100%',
                      opacity: currentSlide === 1 ? 1 : 0
                    }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="absolute inset-0 flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">Typographic</span>
                      </div>
                      <div className="flex gap-3 text-[10px] text-gray-600">
                        <span>{t('nav.products')}</span>
                        <span>{t('nav.pricing')}</span>
                        <span>{t('nav.contactSales').split(' ')[0]}</span>
                      </div>
                    </div>

                    {/* Single Plan Centered */}
                    <div className="flex justify-center items-start py-6">
                      <div className="w-full rounded-xl p-5 border-2 border-gray-200 bg-white">
                        <div className="text-center mb-3">
                          <div className="text-2xl font-bold text-gray-900 mb-1">Web</div>
                          <div className="text-xs text-gray-600">De 50 a 499 usuarios</div>
                        </div>
                        <div className="text-center mb-3">
                          <div className="text-4xl font-bold text-gray-900">USD99</div>
                          <div className="text-xs text-gray-500">/mes</div>
                        </div>
                        <button className="w-full py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700">
                          {t('plans.subscribe')}
                        </button>
                        <div className="mt-5 space-y-2">
                          <div className="text-xs font-semibold text-gray-700">{t('plans.includes')}</div>
                          {[
                            'Hasta 3 fuentes',
                            '50,000 solicitudes',
                            '5 dominios',
                            'Plazas ilimitadas'
                          ].map((f, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                              <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Slide 3 - Abstraction (2 plans) */}
                  <motion.div
                    animate={{ 
                      x: currentSlide === 2 ? 0 : '100%',
                      opacity: currentSlide === 2 ? 1 : 0
                    }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full space-y-2">
                      {/* Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A</span>
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">Abstraction</span>
                        </div>
                        <div className="flex gap-3 text-[10px] text-gray-600">
                          <span>Productos</span>
                          <span>Tarifas</span>
                          <span>Contacta</span>
                        </div>
                      </div>

                      {/* Plans */}
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: 'Básico', price: 9, desc: 'Acceso digital', features: ['Contenido web ilimitado', 'Exclusivo para suscriptores'] },
                          { name: 'Premium', price: 19, desc: 'Digital + impreso', badge: true, features: ['Contenido web ilimitado', 'Emisiones impresas', 'Contenido exclusivo'] }
                        ].map((plan, i) => (
                          <div key={i} className={`rounded-xl p-3 border-2 flex flex-col justify-between ${plan.badge ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
                            <div>
                              {plan.badge && (
                                <div className="text-center mb-2">
                                  <span className="text-[9px] px-2 py-1 bg-indigo-500 text-white rounded-lg">{t('plans.popular')}</span>
                                </div>
                              )}
                              <div className="text-center mb-2">
                                <div className="text-base font-bold text-gray-900">{plan.name}</div>
                                <div className="text-[9px] text-gray-600 mt-1">{plan.desc}</div>
                              </div>
                              <div className="text-center mb-2">
                                <div className="text-2xl font-bold text-gray-900">USD{plan.price}</div>
                                <div className="text-[10px] text-gray-500">/mes</div>
                              </div>
                              <button className="w-full py-2 rounded-lg text-[10px] font-medium bg-indigo-600 text-white">
                                {t('plans.subscribe')}
                              </button>
                            </div>
                            <div className="mt-3 space-y-1.5">
                              <div className="text-[9px] font-semibold text-gray-700">{t('plans.includes')}</div>
                              {plan.features.map((f, idx) => (
                                <div key={idx} className="flex items-start gap-1 text-[9px] text-gray-600">
                                  <Check className="w-2.5 h-2.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                  <span>{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Tiles */}
              {TILES.map((tile, i) => {
                const Icon = tile.icon;
                const isHighlighted = highlightedConnections.some(h => h.id === tile.id);
                const isHovered = hoveredTile === tile.id;
                
                return (
                  <Link
                    key={tile.id}
                    to={createPageUrl(tile.route)}
                    ref={el => tilesRef.current[tile.id] = el}
                    className="absolute z-20"
                    style={tile.position}
                    onMouseEnter={() => setHoveredTile(tile.id)}
                    onMouseLeave={() => setHoveredTile(null)}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                      whileHover={{ y: -2, scale: 1.05 }}
                      className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer
                        transition-all duration-500
                        ${isHighlighted || isHovered
                          ? 'bg-white shadow-lg border-2' 
                          : 'bg-white shadow-sm border border-gray-200'
                        }
                      `}
                      style={{
                        borderColor: (isHighlighted || isHovered) ? tile.color : undefined
                      }}
                    >
                      <Icon 
                        className="w-6 h-6 transition-all duration-500"
                        style={{ 
                          color: (isHighlighted || isHovered) ? tile.color : '#9CA3AF',
                          strokeWidth: (isHighlighted || isHovered) ? 2 : 1.5
                        }}
                      />
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Mobile - Mockup visible */}
          <div className="lg:hidden">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative bg-white rounded-3xl shadow-2xl p-5 w-full max-w-sm mx-auto mb-6"
              style={{ 
                boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15)',
                height: '500px'
              }}
            >
              <div className="relative overflow-hidden h-full">
                {/* Just show first slide on mobile */}
                <div className="space-y-3 flex flex-col h-full">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">Q</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">Quantum</span>
                    </div>
                    <div className="flex gap-3 text-[10px] text-gray-600">
                      <span>{t('nav.products')}</span>
                      <span>{t('nav.pricing')}</span>
                      <span>{t('nav.contactSales').split(' ')[0]}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    {[
                      { name: 'Estándar', price: 49, users: 5 },
                      { name: 'Profesional', price: 149, users: 25, badge: true },
                      { name: 'Empresa', price: 299, users: '∞' }
                    ].map((plan, i) => (
                      <div key={i} className={`rounded-lg p-2.5 border flex flex-col justify-between ${plan.badge ? 'border-violet-400 bg-violet-50' : 'border-gray-200 bg-white'}`}>
                        <div>
                          {plan.badge && (
                            <div className="text-center mb-1">
                              <span className="text-[8px] px-2 py-0.5 bg-violet-500 text-white rounded-lg">{t('plans.popular')}</span>
                            </div>
                          )}
                          <div className="text-center mb-2">
                            <div className="text-xs font-semibold text-gray-900">{plan.name}</div>
                            <div className="text-[9px] text-gray-500">Hasta {plan.users} usuarios</div>
                          </div>
                          <div className="text-center mb-2">
                            <div className="text-lg font-bold text-gray-900">USD{plan.price}</div>
                            <div className="text-[9px] text-gray-500">/mes</div>
                          </div>
                          <button className="w-full py-1.5 rounded-md text-[10px] font-medium bg-violet-600 text-white">
                            {t('plans.subscribe')}
                          </button>
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="text-[8px] font-semibold text-gray-700">{t('plans.includes')}</div>
                          {[
                            `${i === 0 ? '12' : i === 1 ? '24' : '∞'} meses datos`,
                            `Datos cada ${i === 0 ? '4' : i === 1 ? '1' : '15 min'} h`,
                            `${i === 0 ? '500' : i === 1 ? '1000' : '2000'} integrac.`
                          ].map((f, idx) => (
                            <div key={idx} className="flex items-start gap-1 text-[8px] text-gray-600">
                              <Check className="w-2.5 h-2.5 text-violet-500 flex-shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tiles below */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {TILES.map(tile => {
                const Icon = tile.icon;
                return (
                  <Link
                    key={tile.id}
                    to={createPageUrl(tile.route)}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                  >
                    <Icon className="w-5 h-5" style={{ color: tile.color }} />
                    <span className="text-sm font-medium text-gray-900">{tile.id}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}