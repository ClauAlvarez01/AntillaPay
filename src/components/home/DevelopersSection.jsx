import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Package, Blocks, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../i18n/LanguageContext';

export default function DevelopersSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const tools = [
    {
      icon: Code,
      title: 'Utiliza AntillaPay con tu conjunto de herramientas',
      description: 'Ofrecemos una amplia gama de bibliotecas de clientes y de servidor, incluidas React, PHP, Ruby, .NET y iOS.'
    },
    {
      icon: Package,
      title: 'Desarrolla agentes con IA',
      description: 'Crea agentes capaces de gestionar dinero y realizar tareas de soporte con la API de AntillaPay.'
    },
    {
      icon: Blocks,
      title: 'Descubre integraciones prediseñadas',
      description: 'Conecta AntillaPay con más de cien herramientas, incluidas Adobe, Salesforce y Xero.'
    },
    {
      icon: Smartphone,
      title: 'Desarrolla en AntillaPay Apps',
      description: 'Crea una aplicación solo para tu equipo o para los millones de empresas en AntillaPay.'
    }
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(139, 92, 246) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-cyan-400 font-semibold mb-4 text-sm tracking-wide uppercase">
              {t('home.developers.eyebrow')}
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {t('home.developers.title')}
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {t('home.developers.description')}
            </p>

            <Button 
              onClick={() => navigate(createPageUrl('Developers'))}
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full"
            >
              {t('home.developers.cta')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          {/* Right Column - Code Editor Mock */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Code Block */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
              <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                <div className="text-sm text-gray-400 ml-4">payment-intent.js</div>
              </div>
              <div className="p-6 font-mono text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="text-purple-400">const</span>
                    <span className="text-blue-300"> AntillaPay</span>
                    <span className="text-gray-400"> = </span>
                    <span className="text-yellow-300">require</span>
                    <span className="text-gray-400">(</span>
                    <span className="text-green-300">'AntillaPay'</span>
                    <span className="text-gray-400">)(</span>
                    <span className="text-green-300">'sk_test_BQokikJOvBiI2HlWgH4olfQ2'</span>
                    <span className="text-gray-400">);</span>
                  </div>
                  <div className="h-4" />
                  <div>
                    <span className="text-purple-400">await</span>
                    <span className="text-blue-300"> AntillaPay.paymentIntents</span>
                    <span className="text-gray-400">.</span>
                    <span className="text-yellow-300">create</span>
                    <span className="text-gray-400">({`{`}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-300">amount</span>
                    <span className="text-gray-400">: </span>
                    <span className="text-orange-400">2000</span>
                    <span className="text-gray-400">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-300">currency</span>
                    <span className="text-gray-400">: </span>
                    <span className="text-green-300">'usd'</span>
                  </div>
                  <div>
                    <span className="text-gray-400">{`});`}</span>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Tools Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer group"
              >
                <Icon className="w-10 h-10 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-semibold mb-2 text-sm">
                  {tool.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {tool.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}