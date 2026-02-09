import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Cloud, ShoppingCart, Building2, 
  Globe, Coins, Sparkles, ArrowRight, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const solutions = [
  {
    id: 'ai',
    icon: Brain,
    name: 'Inteligencia Artificial',
    desc: 'Monetiza modelos de IA y APIs con facturación por uso',
    color: 'from-violet-500 to-purple-600',
    features: [
      'Facturación por tokens/API calls',
      'Suscripciones híbridas',
      'Límites de uso granulares',
      'Métricas de consumo en tiempo real'
    ],
    stats: { revenue: '$2.3M', growth: '+145%', customers: '15K' },
    caseStudy: 'Una startup de IA generativa aumentó sus ingresos 3x con facturación por tokens.'
  },
  {
    id: 'saas',
    icon: Cloud,
    name: 'SaaS',
    desc: 'Gestiona suscripciones y crece tu MRR',
    color: 'from-blue-500 to-indigo-600',
    features: [
      'Pruebas gratuitas automatizadas',
      'Upgrades y downgrades sin fricción',
      'Portal de autoservicio',
      'Recuperación de pagos fallidos'
    ],
    stats: { revenue: '$890K', growth: '+28%', customers: '3.2K' },
    caseStudy: 'Una plataforma B2B redujo el churn 40% con reintentos inteligentes.'
  },
  {
    id: 'marketplaces',
    icon: ShoppingCart,
    name: 'Marketplaces',
    desc: 'Facilita pagos entre compradores y vendedores',
    color: 'from-teal-500 to-cyan-600',
    features: [
      'Splits automáticos',
      'Onboarding KYC simplificado',
      'Transferencias instantáneas',
      'Reportes por vendedor'
    ],
    stats: { revenue: '$12M', growth: '+89%', customers: '45K' },
    caseStudy: 'Un marketplace de servicios locales procesa $1M+ diarios con Connect.'
  },
  {
    id: 'fintech',
    icon: Building2,
    name: 'Servicios Financieros',
    desc: 'Integra banca y pagos en tu producto',
    color: 'from-emerald-500 to-green-600',
    features: [
      'Cuentas bancarias API',
      'Emisión de tarjetas',
      'Préstamos integrados',
      'Gestión de fondos'
    ],
    stats: { revenue: '$34M', growth: '+52%', customers: '120K' },
    caseStudy: 'Una neobank lanzó su producto en 3 meses con Treasury e Issuing.'
  },
  {
    id: 'ecommerce',
    icon: Globe,
    name: 'E-commerce',
    desc: 'Optimiza checkout y acepta pagos globales',
    color: 'from-amber-500 to-orange-600',
    features: [
      '100+ métodos de pago',
      'Checkout optimizado',
      'Múltiples monedas',
      'Prevención de fraude'
    ],
    stats: { revenue: '$8.4M', growth: '+35%', customers: '280K' },
    caseStudy: 'Una marca DTC aumentó conversión 15% con métodos de pago locales.'
  },
  {
    id: 'crypto',
    icon: Coins,
    name: 'Criptomonedas',
    desc: 'On-ramps y off-ramps de cripto a fiat',
    color: 'from-slate-600 to-gray-800',
    features: [
      'Compra de cripto con tarjeta',
      'Venta a fiat',
      'Cumplimiento regulatorio',
      'APIs de liquidez'
    ],
    stats: { revenue: '$4.2M', growth: '+120%', customers: '89K' },
    caseStudy: 'Un exchange redujo fricción de onboarding 60% con on-ramps AntillaPay.'
  },
  {
    id: 'creators',
    icon: Sparkles,
    name: 'Economía de Creadores',
    desc: 'Monetiza contenido y gestiona payouts',
    color: 'from-pink-500 to-rose-600',
    features: [
      'Suscripciones para fans',
      'Tips y donaciones',
      'Ventas de contenido digital',
      'Payouts a creadores'
    ],
    stats: { revenue: '$2.1M', growth: '+78%', customers: '12K' },
    caseStudy: 'Una plataforma de creadores gestiona pagos a 50K+ creadores.'
  },
];

export default function Solutions() {
  const [activeSolution, setActiveSolution] = useState('ai');
  const active = solutions.find(s => s.id === activeSolution);
  const ActiveIcon = active?.icon;

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
        >
          Soluciones por industria
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Herramientas personalizadas para cada tipo de negocio
        </motion.p>
      </div>

      {/* Solutions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Selection */}
          <div className="space-y-3">
            {solutions.map((solution, i) => {
              const Icon = solution.icon;
              const isActive = activeSolution === solution.id;
              
              return (
                <motion.button
                  key={solution.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveSolution(solution.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
                    isActive 
                      ? 'bg-white shadow-lg border-2 border-gray-900' 
                      : 'bg-white/50 border border-gray-100 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{solution.name}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{solution.desc}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right - Detail */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSolution}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${active.color}`} />
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${active.color} flex items-center justify-center`}>
                      <ActiveIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{active.name}</h2>
                      <p className="text-gray-600">{active.desc}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{active.stats.revenue}</p>
                      <p className="text-xs text-gray-500">Volumen procesado</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">{active.stats.growth}</p>
                      <p className="text-xs text-gray-500">Crecimiento</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{active.stats.customers}</p>
                      <p className="text-xs text-gray-500">Clientes</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-gray-900 mb-4">Características clave</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {active.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Case Study */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-600 italic">"{active.caseStudy}"</p>
                  </div>

                  <Button className="rounded-lg bg-gray-900 hover:bg-gray-800">
                    Explorar solución
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}