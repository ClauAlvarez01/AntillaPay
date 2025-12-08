import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Smartphone, Package, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../i18n/LanguageContext';

const TILES = [
  { 
    id: 'connect', 
    icon: Users, 
    color: '#06B6D4', 
    route: 'Connect',
    position: { top: '20%', left: '-10%' }
  },
  { 
    id: 'terminal', 
    icon: Smartphone, 
    color: '#0EA5E9', 
    route: 'Terminal',
    position: { bottom: '25%', left: '-8%' }
  },
  { 
    id: 'elements', 
    icon: Package, 
    color: '#4F46E5', 
    route: 'Elements',
    position: { top: '35%', right: '-10%' }
  }
];

export default function ConnectShowcase({ onLoginClick }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [hoveredTile, setHoveredTile] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [highlightedConnections, setHighlightedConnections] = useState([]);
  const mockupRef = useRef(null);
  const tilesRef = useRef({});
  const [connections, setConnections] = useState([]);
  const intervalRef = useRef(null);

  // Auto-carousel: 3 slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Dynamic connection animation
  useEffect(() => {
    const animateConnections = () => {
      if (hoveredTile) return;
      
      const colors = ['#06B6D4', '#0EA5E9', '#4F46E5'];
      const numToHighlight = Math.floor(Math.random() * 2) + 1;
      const tileIds = TILES.map(t => t.id);
      const shuffled = [...tileIds].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, numToHighlight).map((id, i) => ({
        id,
        color: colors[i % colors.length]
      }));
      
      setHighlightedConnections(selected);
    };

    animateConnections();
    intervalRef.current = setInterval(animateConnections, 2600);
    return () => clearInterval(intervalRef.current);
  }, [hoveredTile]);

  useEffect(() => {
    if (hoveredTile) {
      const tile = TILES.find(t => t.id === hoveredTile);
      setHighlightedConnections([{ id: hoveredTile, color: tile?.color || '#06B6D4' }]);
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

        // Define anchor points on mockup based on tile position
        let anchorX, anchorY;
        if (tile.id === 'connect') {
          anchorX = mockupCenterX - 80;
          anchorY = mockupCenterY - 60;
        } else if (tile.id === 'terminal') {
          anchorX = mockupCenterX - 80;
          anchorY = mockupCenterY + 40;
        } else {
          anchorX = mockupCenterX + 80;
          anchorY = mockupCenterY;
        }

        const isLeft = tileCenterX < mockupCenterX;
        const controlX = isLeft ? tileCenterX + 60 : tileCenterX - 60;
        const controlY = (tileCenterY + anchorY) / 2;

        return {
          id: tile.id,
          path: `M ${tileCenterX},${tileCenterY} Q ${controlX},${controlY} ${anchorX},${anchorY}`,
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

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Left - Text Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 text-sm font-semibold mb-4" style={{ color: '#06B6D4' }}>
              Connect
            </div>
            
            {/* Title */}
            <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight lg:leading-[1.08] tracking-tight">
              {t('home.connect.title')}
            </h2>
            
            {/* Subtitle */}
            <p className="text-base md:text-xl text-slate-600 mb-6 leading-relaxed max-w-lg">
              {t('home.connect.description')}
            </p>

            {/* CTA Button - Commented out as per request
            <Button 
              onClick={onLoginClick}
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 rounded-full px-8 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {t('home.connect.cta')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            */}
          </motion.div>

          {/* Right - Mockup with Carousel and Tiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative hidden lg:block"
            style={{ minHeight: '580px' }}
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
                    <g key={conn.id}>
                      <motion.path
                        d={conn.path}
                        fill="none"
                        stroke={isHighlighted ? highlighted.color : '#E5E7EB'}
                        strokeWidth={isHighlighted ? 2.5 : 1.5}
                        strokeLinecap="round"
                        animate={{ 
                          opacity: isHighlighted ? 0.85 : 0.4,
                          strokeWidth: isHighlighted ? 2.5 : 1.5
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{
                          filter: isHighlighted ? 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.3))' : 'none'
                        }}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Mockup Card - 3 Views Carousel */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative bg-white rounded-3xl shadow-2xl p-4 w-full max-w-sm z-10 mx-auto"
                style={{ 
                  boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15)',
                  height: '480px'
                }}
              >
                <div className="relative overflow-hidden w-full h-full">
                  {/* Slide 1 - Orders List */}
                  <motion.div
                    animate={{ 
                      x: currentSlide === 0 ? 0 : '-100%',
                      opacity: currentSlide === 0 ? 1 : 0
                    }}
                    transition={{ duration: 0.55, ease: 'easeInOut' }}
                    className="absolute inset-0 space-y-2"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900">Pedidos</h3>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-indigo-600" />
                        <div className="w-1 h-1 rounded-full bg-indigo-600" />
                        <div className="w-1 h-1 rounded-full bg-indigo-600" />
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 font-medium mt-3 mb-2">HOY</div>

                    {[
                      { id: '#9125', name: 'Horacio Ruiz', amount: 'USD150.00', status: 'Procesando', color: 'green' },
                    ].map((order, i) => (
                      <div key={i} className="flex items-center justify-between py-3 bg-white border border-gray-200 rounded-lg px-3 shadow-sm">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-900">{order.id}</span>
                            <span className="text-sm text-gray-600">{order.name}</span>
                          </div>
                          <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                            order.status === 'Completado' ? 'bg-gray-100 text-gray-700' :
                            order.status === 'Procesando' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="text-base font-bold text-gray-900">{order.amount}</div>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}

                    <div className="text-xs text-gray-500 font-medium mt-4 mb-2">AYER</div>

                    {[
                      { id: '#9124', name: 'José Miranda', amount: 'USD200.00', status: 'Procesando', color: 'green' },
                      { id: '#9123', name: 'John Appleseed', amount: 'USD178.00', status: 'En espera', color: 'purple' },
                      { id: '#9122', name: 'Jane Diaz', amount: 'USD200.00', status: 'Completado', color: 'gray' },
                      { id: '#9121', name: 'Analía Núñez', amount: 'USD200.00', status: 'Completado', color: 'gray' },
                    ].map((order, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">{order.id}</span>
                            <span className="text-sm text-gray-600">{order.name}</span>
                          </div>
                          <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-medium ${
                            order.status === 'Completado' ? 'bg-gray-100 text-gray-700' :
                            order.status === 'Procesando' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="text-sm font-semibold text-gray-900">{order.amount}</div>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </motion.div>

                  {/* Slide 2 - Flow Diagram */}
                  <motion.div
                    animate={{ 
                      x: currentSlide === 1 ? 0 : currentSlide === 0 ? '100%' : '-100%',
                      opacity: currentSlide === 1 ? 1 : 0
                    }}
                    transition={{ duration: 0.55, ease: 'easeInOut' }}
                    className="absolute inset-0 flex flex-col items-center justify-center space-y-4 px-4"
                  >
                    {/* Order Card at Top */}
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-lg w-full">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-sm font-bold text-gray-900">#9124</span>
                            <span className="text-xs text-gray-700">José Miranda</span>
                          </div>
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-100 text-purple-700">
                            Completado
                          </span>
                        </div>
                        <div className="text-base font-bold text-gray-900">USD200.00</div>
                      </div>
                    </div>

                    {/* Arrow Down */}
                    <div className="flex flex-col items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-cyan-400 -my-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      ))}
                    </div>

                    {/* Compradores */}
                    <div className="bg-blue-600 text-white px-8 py-2 rounded-full shadow-lg font-bold text-sm">
                      Compradores
                    </div>

                    {/* Arrow Down */}
                    <div className="flex flex-col items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-cyan-400 -my-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      ))}
                    </div>

                    {/* Plataforma with amount */}
                    <div className="relative">
                      <div className="bg-cyan-400 text-white px-8 py-2 rounded-full shadow-lg font-bold text-sm border-2 border-dashed border-cyan-300">
                        Plataforma
                      </div>
                      <div className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded-lg shadow-md border border-gray-200">
                        <div className="text-[10px] font-bold text-gray-900">USD6.00</div>
                      </div>
                    </div>

                    {/* Arrow Down */}
                    <div className="flex flex-col items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-cyan-400 -my-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      ))}
                    </div>

                    {/* Vendedores */}
                    <div className="bg-cyan-400 text-white px-4 py-2 rounded-full shadow-lg font-bold text-xs border-2 border-dashed border-cyan-300 flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>Vendedores o proveedores de servicios</span>
                    </div>
                  </motion.div>

                  {/* Slide 3 - Flow Diagram (variant) */}
                  <motion.div
                    animate={{ 
                      x: currentSlide === 2 ? 0 : '100%',
                      opacity: currentSlide === 2 ? 1 : 0
                    }}
                    transition={{ duration: 0.55, ease: 'easeInOut' }}
                    className="absolute inset-0 flex flex-col items-center justify-center space-y-4 px-4"
                  >
                    {/* Order Card at Top */}
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-lg w-full">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-sm font-bold text-gray-900">#9125</span>
                            <span className="text-xs text-gray-700">Horacio Ruiz</span>
                          </div>
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-green-100 text-green-700">
                            Procesando
                          </span>
                        </div>
                        <div className="text-base font-bold text-gray-900">USD150.00</div>
                      </div>
                    </div>

                    {/* Arrow Down */}
                    <div className="flex flex-col items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-cyan-400 -my-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      ))}
                    </div>

                    {/* Compradores */}
                    <div className="bg-blue-600 text-white px-8 py-2 rounded-full shadow-lg font-bold text-sm">
                      Compradores
                    </div>

                    {/* Arrow Down */}
                    <div className="flex flex-col items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-cyan-400 -my-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      ))}
                    </div>

                    {/* Plataforma */}
                    <div className="bg-cyan-400 text-white px-8 py-2 rounded-full shadow-lg font-bold text-sm border-2 border-dashed border-cyan-300">
                      Plataforma
                    </div>

                    {/* Arrow Down */}
                    <div className="flex flex-col items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-cyan-400 -my-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      ))}
                    </div>

                    {/* Vendedores */}
                    <div className="bg-cyan-400 text-white px-4 py-2 rounded-full shadow-lg font-bold text-xs border-2 border-dashed border-cyan-300">
                      Vendedores o proveedores de servicios
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
                        w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer
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
                        className="w-5 h-5 transition-all duration-500"
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
              className="relative bg-white rounded-3xl shadow-2xl p-4 w-full max-w-sm mx-auto mb-6"
              style={{ 
                boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15)',
                height: '480px'
              }}
            >
              <div className="relative overflow-hidden w-full h-full">
                {/* Slide 1 - Orders List */}
                <motion.div
                  animate={{ 
                    x: currentSlide === 0 ? 0 : '-100%',
                    opacity: currentSlide === 0 ? 1 : 0
                  }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                  className="absolute inset-0 space-y-2 p-1"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">Pedidos</h3>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-indigo-600" />
                      <div className="w-1 h-1 rounded-full bg-indigo-600" />
                      <div className="w-1 h-1 rounded-full bg-indigo-600" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 font-medium mt-3 mb-2">HOY</div>
                  <div className="flex items-center justify-between py-3 bg-white border border-gray-200 rounded-lg px-3 shadow-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-900">#9125</span>
                        <span className="text-sm text-gray-600">Horacio Ruiz</span>
                      </div>
                      <span className="inline-block px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">Procesando</span>
                    </div>
                    <div className="text-base font-bold text-gray-900">USD150.00</div>
                  </div>
                  <div className="text-xs text-gray-500 font-medium mt-4 mb-2">AYER</div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">#9124</span>
                        <span className="text-sm text-gray-600">José Miranda</span>
                      </div>
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700">Procesando</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">USD200.00</div>
                  </div>
                   <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">#9123</span>
                        <span className="text-sm text-gray-600">John Appleseed</span>
                      </div>
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-700">En espera</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">USD178.00</div>
                  </div>
                </motion.div>

                {/* Slide 2 - Flow Diagram */}
                <motion.div
                  animate={{ 
                    x: currentSlide === 1 ? 0 : currentSlide === 0 ? '100%' : '-100%',
                    opacity: currentSlide === 1 ? 1 : 0
                  }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                  className="absolute inset-0 flex flex-col items-center justify-center space-y-3 px-4"
                >
                  <div className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg font-bold text-sm">Compradores</div>
                  <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12l-5-5h10l-5 5z" /></svg>
                  <div className="bg-cyan-400 text-white px-6 py-2 rounded-full shadow-lg font-bold text-sm border-2 border-dashed border-cyan-300">Plataforma</div>
                  <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12l-5-5h10l-5 5z" /></svg>
                  <div className="bg-cyan-400 text-white px-4 py-2 rounded-full shadow-lg font-bold text-xs border-2 border-dashed border-cyan-300 flex items-center gap-1.5"><Check className="w-4 h-4" /><span>Vendedores</span></div>
                </motion.div>

                {/* Slide 3 - Flow Diagram (variant) */}
                <motion.div
                  animate={{ 
                    x: currentSlide === 2 ? 0 : '100%',
                    opacity: currentSlide === 2 ? 1 : 0
                  }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                  className="absolute inset-0 flex flex-col items-center justify-center space-y-2 px-4"
                >
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-lg w-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-sm font-bold text-gray-900">#9125</span>
                          <span className="text-xs text-gray-700">Horacio Ruiz</span>
                        </div>
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-green-100 text-green-700">Procesando</span>
                      </div>
                      <div className="text-base font-bold text-gray-900">USD150.00</div>
                    </div>
                  </div>
                  <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                  <div className="bg-blue-600 text-white px-8 py-2 rounded-full shadow-lg font-bold text-sm">Compradores</div>
                  <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                  <div className="bg-cyan-400 text-white px-8 py-2 rounded-full shadow-lg font-bold text-sm border-2 border-dashed border-cyan-300">Plataforma</div>
                  <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                  <div className="bg-cyan-400 text-white px-4 py-2 rounded-full shadow-lg font-bold text-xs border-2 border-dashed border-cyan-300">Vendedores</div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}