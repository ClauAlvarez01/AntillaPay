import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, Receipt, Share2, Calculator, 
  Shield, Wallet, Building2, TrendingUp, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 'payments',
    name: 'AntillaPay Payments',
    desc: 'Acepta pagos en toda Cuba con tarjetas, billeteras digitales y métodos de pago locales.',
    icon: CreditCard,
    gradient: 'from-blue-500 to-indigo-600',
    features: ['100+ métodos de pago', 'Pagos internacionales', 'Optimización de conversión']
  },
  {
    id: 'billing',
    name: 'AntillaPay Billing',
    desc: 'Gestiona suscripciones y facturación recurrente con modelos de precios flexibles.',
    icon: Receipt,
    gradient: 'from-purple-500 to-pink-600',
    features: ['Suscripciones recurrentes', 'Precios por uso', 'Portal de clientes', 'Recuperación de pagos']
  },
  {
    id: 'connect',
    name: 'AntillaPay Connect',
    desc: 'Pagos para plataformas y marketplaces con splits automáticos y onboarding de vendedores.',
    icon: Share2,
    gradient: 'from-teal-500 to-cyan-600',
    features: ['Pagos multi-parte', 'Onboarding KYC', 'Transferencias instantáneas', 'Reportes consolidados']
  },
  {
    id: 'tax',
    name: 'AntillaPay Tax',
    desc: 'Automatiza el cálculo, recolección y reporteo de impuestos en toda Cuba.',
    icon: Calculator,
    gradient: 'from-amber-500 to-orange-600',
    features: ['Cálculo automático', 'Cumplimiento global', 'Integración con Billing', 'Reportes fiscales']
  },
  {
    id: 'issuing',
    name: 'AntillaPay Issuing',
    desc: 'Crea tarjetas clásicas y tropicales para tu negocio o plataforma.',
    icon: Wallet,
    gradient: 'from-emerald-500 to-green-600',
    features: ['Tarjetas virtuales', 'Tarjetas físicas', 'Control de gastos']
  },
  {
    id: 'treasury',
    name: 'AntillaPay Treasury',
    desc: 'Banca como servicio para integrar cuentas y pagos en tu producto.',
    icon: Building2,
    gradient: 'from-slate-600 to-gray-800',
    features: ['Cuentas bancarias', 'ACH y transferencias', 'Gestión de fondos', 'API unificada']
  },
  {
    id: 'capital',
    name: 'AntillaPay Capital',
    desc: 'Acceso a financiamiento flexible basado en tu volumen de ventas.',
    icon: TrendingUp,
    gradient: 'from-violet-500 to-purple-600',
    features: ['Pre-aprobación automática', 'Pagos flexibles', 'Sin garantías', 'Fondos en 24h']
  },
];

export default function Products() {
  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
        >
          Productos Antilla Pay
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Una suite completa de productos financieros y de pagos para impulsar tu negocio
        </motion.p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => {
            const Icon = product.icon;
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {product.desc}
                </p>

                <ul className="space-y-2 mb-6">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* <Button variant="ghost" className="w-full text-gray-700 hover:text-gray-900">
                  Más información
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button> */}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}