import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, CreditCard, Shield, Globe, Zap, ChevronRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const standardFeatures = [
  { icon: CreditCard, title: 'Solución integral de pagos', desc: 'Plataforma unificada para gestionar todos tus cobros en Cuba.' },
  { icon: Shield, title: 'Seguridad garantizada', desc: 'Cumplimiento con las regulaciones financieras cubanas y protección antifraude.' },
  { icon: Globe, title: 'Soporte local', desc: 'Atención personalizada y soporte técnico desde Cuba.' },
  { icon: Zap, title: 'Integración sencilla', desc: 'Fácil implementación con los principales sistemas de gestión empresarial.' },
];

const pricingDetails = [
  {
    category: 'Pagos en USD',
    items: [
      { name: 'Tarjetas USD', rate: '3.5%', note: 'por transacción exitosa' },
      { name: 'Transferencias USD', rate: '2.0%', note: 'mínimo $1 USD' },
      { name: 'Pagos en efectivo USD', rate: '1.5%', note: 'en puntos autorizados' },
    ]
  },
  {
    category: 'Pagos en CUP',
    items: [
      { name: 'Transfermóvil', rate: '1.5%', note: 'por transacción' },
      { name: 'EnZona', rate: '1.8%', note: 'por transacción' },
      { name: 'Pagos en efectivo CUP', rate: '1.0%', note: 'en bancos nacionales' },
    ]
  },
  {
    category: 'Servicios Adicionales',
    items: [
      { name: 'Facturación electrónica', rate: '$10/mes', note: 'hasta 100 facturas' },
      { name: 'Sistema de inventario', rate: '$15/mes', note: 'gestión básica' },
      { name: 'Soporte prioritario', rate: '$20/mes', note: 'respuesta en 1 hora' },
    ]
  },
  {
    category: 'Empresas Estatales',
    items: [
      { name: 'Implementación', rate: 'Personalizado', note: 'según requerimientos' },
      { name: 'Capacitación', rate: 'Incluido', note: 'hasta 10 usuarios' },
      { name: 'Soporte extendido', rate: 'Consultar', note: 'horario laboral' },
    ]
  },
];

const customPricingFeatures = [
  'Precios especiales para MIPYMES',
  'Descuentos por volumen de operaciones',
  'Paquetes personalizados para cadenas de tiendas',
  'Tarifas preferenciales para sectores priorizados',
  'Soporte técnico en español',
];

const faqs = [
  {
    q: '¿Qué métodos de pago están disponibles en Cuba?',
    a: 'Aceptamos Transfermóvil, EnZona, tarjetas clásicas, transferencias bancarias en CUP y MLC, y pagos en efectivo en bancos nacionales.'
  },
  {
    q: '¿Cómo se manejan los pagos en USD?',
    a: 'Los pagos en USD se procesan a través de canales autorizados por el Banco Central de Cuba, con conversión automática según el tipo de cambio oficial.'
  },
  {
    q: '¿Ofrecen soporte técnico local?',
    a: 'Sí, contamos con un equipo de soporte técnico local disponible en horario laboral para atender cualquier incidencia o consulta.'
  },
  {
    q: '¿Cumplen con las regulaciones cubanas?',
    a: 'Totalmente. Nuestra plataforma cumple con todas las regulaciones del Banco Central de Cuba y las normativas de comercio electrónico vigentes en el país.'
  },
  {
    q: '¿Ofrecen facturación electrónica?',
    a: 'Sí, nuestro sistema incluye facturación electrónica con validez fiscal según las normativas cubanas, con opciones para diferentes tipos de entidades económicas.'
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('standard');

  return (
    <div className="min-h-screen">
      {/* Hero with gradient background like AntillaPay */}
      <section className="relative pt-16 md:pt-24 pb-12 md:pb-16 overflow-hidden px-4">
        <div className="absolute inset-0">
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
          <div className="absolute top-0 right-0 w-[60%] h-[70%]" style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(167, 139, 250, 0.25) 0%, transparent 50%)' }} />
          <div className="absolute bottom-0 left-0 w-[50%] h-[60%]" style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Soluciones de pago<br className="hidden sm:block" /> para el sector empresarial cubano
            </h1>
          </motion.div>

          {/* Pricing Cards */}
          <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto">
            {/* Standard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl border border-gray-100 w-full"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Solución Básica</h2>
              <p className="text-gray-600 mb-6">
                Ideal para emprendedores y pequeñas empresas que inician su camino en el comercio electrónico en Cuba. Sin costos ocultos ni sorpresas.
              </p>
              <Button 
                className="rounded-full bg-violet-600 hover:bg-violet-700 mb-6"
                onClick={() => navigate('/login')}
              >
                Comenzar ahora <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              
              <div className="text-center py-6 border-t border-gray-100">
                <p className="text-4xl font-bold text-gray-900">2.5%</p>
                <p className="text-gray-500 mt-2">por transacción exitosa<br/>en Transfermóvil/EnZona</p>
              </div>
            </motion.div>

            {/* Custom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl text-white mt-6 sm:mt-0 w-full"
            >
              <h2 className="text-2xl font-bold mb-3">Empresarial</h2>
              <p className="text-gray-300 mb-6">
                Soluciones personalizadas para medianas y grandes empresas, cadenas de tiendas y entidades estatales con necesidades específicas de integración.
              </p>
              <Button 
                className="rounded-full bg-white text-gray-900 hover:bg-gray-100 mb-6 transition-colors"
                onClick={() => navigate('/contact')}
              >
                Solicitar cotización <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              
              <div className="space-y-3 pt-6 border-t border-gray-700">
                {customPricingFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-8 md:mb-12 px-4 sm:px-0">
            Funcionalidades disponibles para su uso inmediato:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-0">
            {standardFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-1 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full" />
                <div>
                  <feature.icon className="w-6 h-6 text-violet-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Title for Mobile */}
      <section className="sm:hidden pt-10 pb-3 bg-gradient-to-r from-violet-50 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-xl font-bold text-violet-600">Nuestras tarifas</h2>
        </div>
      </section>

      {/* Tabs Section - Sticky below features - Only for desktop */}
      <section className="hidden sm:block sticky top-0 z-40 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex justify-center">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl">
              <TabsList className="bg-gray-50 rounded-b-lg p-2.5 flex gap-4 w-full border border-t-0 border-gray-100">
                <TabsTrigger 
                  value="standard" 
                  className="relative rounded-md px-5 py-3.5 text-base data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-600 w-1/3 text-center transition-colors hover:bg-gray-100"
                >
                  Nuestras tarifas
                </TabsTrigger>
                <TabsTrigger 
                  value="custom" 
                  className="relative rounded-md px-5 py-3.5 text-base data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-600 w-1/3 text-center transition-colors hover:bg-gray-100"
                >
                  Soluciones empresariales
                </TabsTrigger>
                <TabsTrigger 
                  value="faq" 
                  className="relative rounded-md px-5 py-3.5 text-base data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-600 w-1/3 text-center transition-colors hover:bg-gray-100"
                >
                  Preguntas frecuentes
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Detailed Pricing */}
      {activeTab === 'standard' && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {pricingDetails.map((section, i) => (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                    {section.category}
                  </h3>
                  <div className="mt-8 md:mt-12 space-y-4 px-4 sm:px-0">
                    {section.items.map((item, j) => (
                      <div key={j} className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-700">{item.name}</p>
                          {item.note && <p className="text-xs text-gray-500">{item.note}</p>}
                        </div>
                        <p className="font-semibold text-gray-900 whitespace-nowrap">{item.rate}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Custom Pricing Section */}
      {activeTab === 'custom' && (
        <section className="py-10 md:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-8 md:mb-12 px-4 sm:px-0">
              Tarifas personalizadas para tu negocio
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Nuestro equipo de ventas trabajará contigo para crear un paquete de precios que se ajuste a tus necesidades específicas, incluyendo descuentos por volumen y tarifas especiales.
            </p>
            <Button size="lg" className="rounded-full bg-violet-600 hover:bg-violet-700">
              Contacta con ventas <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </section>
      )}
      
      {/* FAQ Section */}
      {activeTab === 'faq' && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-white rounded-xl border border-gray-100 px-6">
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Empieza a aceptar pagos hoy
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Crea una cuenta en minutos y comienza a procesar pagos inmediatamente. Sin contratos a largo plazo ni compromisos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="rounded-full bg-white text-gray-900 hover:bg-gray-100"
              onClick={() => navigate('/login')}
            >
              Crear cuenta <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full border-white bg-white/10 text-white hover:bg-white hover:text-gray-900 transition-colors"
            >
              Contactar ventas
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}