import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CreditCard, Shield, Calculator, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../i18n/LanguageContext';

const TILES = [
  { 
    id: 'payments', 
    icon: CreditCard, 
    color: '#635BFF', 
    route: 'Payments',
    position: { top: '10%', left: '-5%' }
  },
  { 
    id: 'terminal', 
    icon: Smartphone, 
    color: '#0EA5E9', 
    route: 'Terminal',
    position: { bottom: '15%', left: '0%' }
  },
  { 
    id: 'tax', 
    icon: Calculator, 
    color: '#10B981', 
    route: 'Tax',
    position: { bottom: '20%', right: '5%' }
  }
];

export default function PaymentsShowcase({ onLoginClick }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [hoveredTile, setHoveredTile] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [highlightedConnections, setHighlightedConnections] = useState([]);
  const phoneRef = useRef(null);
  const tilesRef = useRef({});
  const [connections, setConnections] = useState([]);
  const intervalRef = useRef(null);

  // Auto-carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic connection animation
  useEffect(() => {
    const animateConnections = () => {
      if (hoveredTile) return;
      
      const colors = ['#635BFF', '#00D4FF', '#10B981', '#EC4899'];
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
      setHighlightedConnections([{ id: hoveredTile, color: tile?.color || '#635BFF' }]);
    }
  }, [hoveredTile]);

  useEffect(() => {
    const calculateConnections = () => {
      if (!phoneRef.current) return;

      const phoneRect = phoneRef.current.getBoundingClientRect();
      const phoneCenterX = phoneRect.width / 2;
      const phoneCenterY = phoneRect.height / 2;

      const newConnections = TILES.map(tile => {
        const tileEl = tilesRef.current[tile.id];
        if (!tileEl) return null;

        const tileRect = tileEl.getBoundingClientRect();
        const phonePos = phoneRef.current.getBoundingClientRect();
        
        const tileCenterX = tileRect.left - phonePos.left + tileRect.width / 2;
        const tileCenterY = tileRect.top - phonePos.top + tileRect.height / 2;

        // Calculate control points for curved path
        const isLeft = tileCenterX < phoneCenterX;
        const controlX = isLeft ? tileCenterX + 80 : tileCenterX - 80;
        const controlY = (tileCenterY + phoneCenterY) / 2;

        return {
          id: tile.id,
          path: `M ${tileCenterX},${tileCenterY} Q ${controlX},${controlY} ${phoneCenterX},${phoneCenterY}`,
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
    <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Text Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-sm font-semibold text-slate-600 mb-4 w-full lg:w-auto">
              <div className="w-5 h-5 bg-gradient-to-br from-indigo-400 to-purple-500 rounded" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
              Payments
            </div>
            
            {/* Title */}
            <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight lg:leading-[1.08] tracking-tight">
              {t('home.payments.title')}
            </h2>
            
            {/* Subtitle */}
            <p className="text-base md:text-xl text-slate-600 mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
              {t('home.payments.description')}
            </p>

            {/* CTA Button - Commented out as per request
            <Button 
              onClick={onLoginClick}
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 rounded-lg px-8 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {t('home.payments.cta')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            */}
          </motion.div>

          {/* Right - Phone Mockup with Tiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative hidden lg:block"
            style={{ minHeight: '550px' }}
          >
            <div ref={phoneRef} className="relative h-full flex items-center justify-center">
              {/* SVG Connections */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                style={{ zIndex: 5 }}
              >
                {connections.map((conn) => {
                  const highlighted = highlightedConnections.find(h => h.id === conn.id);
                  const isHighlighted = !!highlighted;
                  
                  return (
                    <g key={conn.id}>
                      {/* Base line - always visible */}
                      <motion.path
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
                    </g>
                  );
                })}
              </svg>

              {/* iPhone Mockup */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative bg-white rounded-[2rem] shadow-2xl p-2.5 w-[240px] z-10"
                style={{ 
                  border: '8px solid #ffffff',
                  boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <div className="bg-gray-50 rounded-[1.5rem] p-3 overflow-hidden relative" style={{ height: '440px' }}>
                  {/* Slide 1 - USD */}
                  <motion.div
                    animate={{ 
                      x: currentSlide === 0 ? 0 : '-100%',
                      opacity: currentSlide === 0 ? 1 : 0
                    }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="absolute inset-0 p-3 space-y-2"
                  >
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <svg className="w-7 h-7 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900 text-[10px]">Wood Chair 001</div>
                        <div className="text-base font-bold text-gray-900">USD149</div>
                      </div>
                    </div>

                    <button className="w-full bg-black text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                      <span className="text-sm">🍎</span>
                      Pay
                    </button>

                    <button className="w-full bg-green-500 text-white py-2 rounded-lg text-xs font-medium">
                      Pay with <span className="font-bold">Link</span>
                    </button>

                    <div className="flex items-center gap-1.5 py-0.5">
                      <div className="flex-1 h-px bg-gray-300" />
                      <span className="text-[8px] text-gray-500">Or pay another way</span>
                      <div className="flex-1 h-px bg-gray-300" />
                    </div>

                    <div>
                      <label className="block text-[8px] font-medium text-gray-700 mb-0.5">Email</label>
                      <input
                        type="text"
                        value="jane.diaz@example.com"
                        readOnly
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-md bg-white text-[10px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-medium text-gray-700 mb-0.5">Card information</label>
                      <div className="space-y-0 border border-gray-300 rounded-md overflow-hidden bg-white">
                        <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-300">
                          <input
                            type="text"
                            value="4242 4242 4242"
                            readOnly
                            className="flex-1 text-[10px] border-none outline-none"
                          />
                          <div className="text-[8px] font-bold text-blue-600 px-1 py-0.5 bg-blue-50 rounded">VISA</div>
                        </div>
                        <div className="flex">
                          <input
                            type="text"
                            value="05/26"
                            readOnly
                            className="flex-1 px-2 py-1.5 text-[10px] border-none outline-none border-r border-gray-300"
                          />
                          <input
                            type="text"
                            value="123"
                            readOnly
                            className="flex-1 px-2 py-1.5 text-[10px] border-none outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] font-medium text-gray-700 mb-0.5">Country</label>
                      <input
                        type="text"
                        value="United States"
                        readOnly
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-md bg-white text-[10px]"
                      />
                    </div>

                    <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-medium">
                      Pay USD149
                    </button>
                  </motion.div>

                  {/* Slide 2 - EUR */}
                  <motion.div
                    animate={{ 
                      x: currentSlide === 1 ? 0 : '100%',
                      opacity: currentSlide === 1 ? 1 : 0
                    }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="absolute inset-0 p-3 space-y-2"
                  >
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <svg className="w-7 h-7 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900 text-[10px]">Wood Chair 001</div>
                        <div className="text-base font-bold text-gray-900">EUR135.00</div>
                      </div>
                    </div>

                    <button className="w-full bg-black text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                      <span className="text-sm">🍎</span>
                      Pay
                    </button>

                    <button className="w-full bg-green-500 text-white py-2 rounded-lg text-xs font-medium">
                      Pay with <span className="font-bold">Link</span>
                    </button>

                    <div className="flex items-center gap-1.5 py-0.5">
                      <div className="flex-1 h-px bg-gray-300" />
                      <span className="text-[8px] text-gray-500">Of betaal anders</span>
                      <div className="flex-1 h-px bg-gray-300" />
                    </div>

                    <div>
                      <label className="block text-[8px] font-medium text-gray-700 mb-0.5">E-mail</label>
                      <input
                        type="text"
                        value="maria@example.nl"
                        readOnly
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-md bg-white text-[10px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-medium text-gray-700 mb-0.5">Betaalmethode</label>
                      <div className="flex gap-1">
                        <div className="flex-1 border border-gray-300 rounded-md p-1.5 bg-white flex flex-col items-center gap-0.5">
                          <CreditCard className="w-3 h-3 text-gray-500" />
                          <span className="text-[7px] text-gray-600">Kaart</span>
                        </div>
                        <div className="flex-1 border-2 border-indigo-600 rounded-md p-1.5 bg-indigo-50 flex flex-col items-center gap-0.5">
                          <div className="w-3 h-3 rounded bg-gradient-to-br from-pink-500 to-purple-600" />
                          <span className="text-[7px] font-semibold text-gray-900">iDEAL</span>
                        </div>
                        <div className="flex-1 border border-gray-300 rounded-md p-1.5 bg-white flex flex-col items-center gap-0.5">
                          <div className="w-3 h-3 rounded bg-blue-600 flex items-center justify-center text-white text-[6px] font-bold">S</div>
                          <span className="text-[7px] text-gray-600">SEPA</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] font-medium text-gray-700 mb-0.5">iDEAL-bank</label>
                      <div className="w-full px-2 py-1.5 border border-gray-300 rounded-md bg-white text-[10px] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 bg-orange-500 rounded" />
                          <span>ING bank</span>
                        </div>
                        <span className="text-gray-400 text-[8px]">▼</span>
                      </div>
                    </div>

                    <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-medium">
                      Betaal EUR135.00
                    </button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Tiles - Hidden on mobile */}
              <div className="hidden lg:block">
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
            </div>
          </motion.div>

          {/* Mobile - Phone Mockup visible */}
          <div className="lg:hidden mt-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative bg-white rounded-2xl shadow-xl p-2 w-[220px] mx-auto"
              style={{ 
                border: '6px solid #ffffff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="bg-gray-50 rounded-xl p-3 overflow-hidden relative" style={{ height: '400px' }}>
                {/* Slide 1 - USD */}
                <motion.div
                  animate={{ 
                    x: currentSlide === 0 ? 0 : '-100%',
                    opacity: currentSlide === 0 ? 1 : 0
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="absolute inset-0 p-3 space-y-2"
                >
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex items-center justify-center">
                      <svg className="w-7 h-7 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 text-[10px]">Wood Chair 001</div>
                      <div className="text-base font-bold text-gray-900">USD149</div>
                    </div>
                  </div>
                  <button className="w-full bg-black text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                    <span className="text-sm">🍎</span>
                    Pay
                  </button>
                  <button className="w-full bg-green-500 text-white py-2 rounded-lg text-xs font-medium">
                    Pay with <span className="font-bold">Link</span>
                  </button>
                  <div className="flex items-center gap-1.5 py-0.5">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="text-[8px] text-gray-500">Or pay another way</span>
                    <div className="flex-1 h-px bg-gray-300" />
                  </div>
                  <div>
                    <label className="block text-[8px] font-medium text-gray-700 mb-0.5">Email</label>
                    <input type="text" value="jane.diaz@example.com" readOnly className="w-full px-2 py-1.5 border border-gray-300 rounded-md bg-white text-[10px]" />
                  </div>
                  <div>
                    <label className="block text-[8px] font-medium text-gray-700 mb-0.5">Card information</label>
                    <div className="space-y-0 border border-gray-300 rounded-md overflow-hidden bg-white">
                      <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-300">
                        <input type="text" value="4242 4242 4242" readOnly className="flex-1 text-[10px] border-none outline-none" />
                        <div className="text-[8px] font-bold text-blue-600 px-1 py-0.5 bg-blue-50 rounded">VISA</div>
                      </div>
                      <div className="flex">
                        <input type="text" value="05/26" readOnly className="flex-1 px-2 py-1.5 text-[10px] border-none outline-none border-r border-gray-300" />
                        <input type="text" value="123" readOnly className="flex-1 px-2 py-1.5 text-[10px] border-none outline-none" />
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-medium">
                    Pay USD149
                  </button>
                </motion.div>

                {/* Slide 2 - EUR */}
                <motion.div
                  animate={{ 
                    x: currentSlide === 1 ? 0 : '100%',
                    opacity: currentSlide === 1 ? 1 : 0
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="absolute inset-0 p-3 space-y-2"
                >
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex items-center justify-center">
                      <svg className="w-7 h-7 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 text-[10px]">Wood Chair 001</div>
                      <div className="text-base font-bold text-gray-900">EUR135.00</div>
                    </div>
                  </div>
                  <button className="w-full bg-black text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                    <span className="text-sm">🍎</span>
                    Pay
                  </button>
                  <button className="w-full bg-green-500 text-white py-2 rounded-lg text-xs font-medium">
                    Pay with <span className="font-bold">Link</span>
                  </button>
                  <div className="flex items-center gap-1.5 py-0.5">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="text-[8px] text-gray-500">Of betaal anders</span>
                    <div className="flex-1 h-px bg-gray-300" />
                  </div>
                  <div>
                    <label className="block text-[8px] font-medium text-gray-700 mb-0.5">E-mail</label>
                    <input type="text" value="maria@example.nl" readOnly className="w-full px-2 py-1.5 border border-gray-300 rounded-md bg-white text-[10px]" />
                  </div>
                  <div>
                    <label className="block text-[8px] font-medium text-gray-700 mb-0.5">Betaalmethode</label>
                    <div className="flex gap-1">
                      <div className="flex-1 border border-gray-300 rounded-md p-1.5 bg-white flex flex-col items-center gap-0.5">
                        <CreditCard className="w-3 h-3 text-gray-500" />
                        <span className="text-[7px] text-gray-600">Kaart</span>
                      </div>
                      <div className="flex-1 border-2 border-indigo-600 rounded-md p-1.5 bg-indigo-50 flex flex-col items-center gap-0.5">
                        <div className="w-3 h-3 rounded bg-gradient-to-br from-pink-500 to-purple-600" />
                        <span className="text-[7px] font-semibold text-gray-900">iDEAL</span>
                      </div>
                      <div className="flex-1 border border-gray-300 rounded-md p-1.5 bg-white flex flex-col items-center gap-0.5">
                        <div className="w-3 h-3 rounded bg-blue-600 flex items-center justify-center text-white text-[6px] font-bold">S</div>
                        <span className="text-[7px] text-gray-600">SEPA</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8px] font-medium text-gray-700 mb-0.5">iDEAL-bank</label>
                    <div className="w-full px-2 py-1.5 border border-gray-300 rounded-md bg-white text-[10px] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-orange-500 rounded" />
                        <span>ING bank</span>
                      </div>
                      <span className="text-gray-400 text-[8px]">▼</span>
                    </div>
                  </div>
                  <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-medium">
                    Betaal EUR135.00
                  </button>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}