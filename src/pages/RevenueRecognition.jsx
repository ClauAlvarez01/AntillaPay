import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, TrendingUp, CheckCircle, Users, FileCheck, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function RevenueRecognition() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: CheckCircle,
      title: 'Cumplimiento Automático',
      description: 'Cumple con ASC 606 e IFRS 15 automáticamente sin intervención manual ni configuraciones complejas.'
    },
    {
      icon: TrendingUp,
      title: 'Visibilidad en Tiempo Real',
      description: 'Monitorea tus ingresos reconocidos, diferidos y futuros con dashboards actualizados al instante.'
    },
    {
      icon: FileCheck,
      title: 'Informes Detallados',
      description: 'Genera reportes financieros precisos y listos para auditoría con un solo clic.'
    }
  ];

  const steps = [
    {
      title: 'Configura tus Reglas',
      description: 'Define las políticas de reconocimiento de ingresos según tu modelo de negocio y normativas aplicables.'
    },
    {
      title: 'Automatiza el Reconocimiento',
      description: 'AntillaPay reconoce ingresos automáticamente a medida que ocurren las transacciones y se cumplen las obligaciones de desempeño.'
    },
    {
      title: 'Reporta con Confianza',
      description: 'Accede a dashboards en tiempo real y genera reportes financieros conformes para auditorías y análisis.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 mb-6">
              <PieChart className="w-5 h-5" />
              Revenue Recognition
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
              Reconocimiento de Ingresos Automatizado y Conforme
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Reconoce ingresos de forma precisa y conforme a las normativas contables internacionales. Automatiza procesos, reduce errores y mantén la transparencia financiera con AntillaPay.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-amber-600 hover:bg-amber-700 text-base px-8"
                onClick={() => window.location.href = '/login'}
              >
                Comenzar ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base px-8"
              >
                Ver demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cómo Funciona
            </h2>
            <p className="text-xl text-gray-600">
              Tres pasos simples para automatizar tu reconocimiento de ingresos
            </p>
          </motion.div>

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-start gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-amber-700">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Users className="w-12 h-12 text-amber-600 mx-auto mb-6" />
            <blockquote className="text-2xl font-medium text-gray-900 mb-6">
              "AntillaPay Revenue Recognition nos permitió reducir el tiempo de cierre mensual en un 60% y tener total confianza en nuestros reportes financieros."
            </blockquote>
            <div className="text-gray-600">
              <div className="font-semibold">María González</div>
              <div>CFO, TechCorp SaaS</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              ¿Listo para automatizar tu reconocimiento de ingresos?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Únete a miles de empresas que confían en AntillaPay para su contabilidad de ingresos.
            </p>
            <Button 
              size="lg" 
              className="bg-amber-600 hover:bg-amber-700 text-base px-8"
              onClick={() => navigate(createPageUrl('Contact'))}
            >
              Comienza gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}