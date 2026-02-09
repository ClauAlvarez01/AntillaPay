import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, Code, Terminal, FileCode, 
  ArrowRight, Copy, Check, Zap, 
  Globe, Shield, Clock, Sparkles, TerminalSquare
} from 'lucide-react';

// Agregar animación de blob al CSS global
const globalStyles = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(10px, -10px) scale(1.05); }
    66% { transform: translate(-10px, 10px) scale(0.95); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
`;
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const quickstarts = [
  { 
    name: 'E-commerce', 
    icon: '🛒', 
    time: '10 min',
    desc: 'Integra pagos en tu tienda online' 
  },
  { 
    name: 'Aplicación Móvil', 
    icon: '📱', 
    time: '15 min',
    desc: 'SDK para iOS y Android' 
  },
  { 
    name: 'Transfermóvil', 
    icon: '💱', 
    time: '8 min',
    desc: 'Conexión con billetera móvil' 
  },
  { 
    name: 'EnZona', 
    icon: '🏪', 
    time: '8 min',
    desc: 'Integración con red comercial' 
  },
  { 
    name: 'Pagos Recurrentes', 
    icon: '🔄', 
    time: '12 min',
    desc: 'Suscripciones y pagos programados' 
  },
  { 
    name: 'API REST', 
    icon: '🔌', 
    time: '5 min',
    desc: 'Integración personalizada' 
  },
];

const resources = [
  {
    icon: Book,
    title: 'Guía de Integración',
    desc: 'Paso a paso para integrar pagos en tu plataforma',
    link: '/developers/integration-guide'
  },
  {
    icon: Code,
    title: 'API de Pagos',
    desc: 'Documentación técnica de nuestra API REST',
    link: '/developers/api'
  },
  {
    icon: Terminal,
    title: 'SDKs Oficiales',
    desc: 'Bibliotecas para Node.js, Python, PHP y más',
    link: '/developers/sdks'
  },
  {
    icon: FileCode,
    title: 'Casos de Uso',
    desc: 'Ejemplos para diferentes tipos de negocios',
    link: '/developers/use-cases'
  },
  {
    icon: Shield,
    title: 'Seguridad',
    desc: 'Estándares y mejores prácticas de seguridad',
    link: '/developers/security'
  },
  {
    icon: Globe,
    title: 'Métodos de Pago',
    desc: 'Soporte para múltiples opciones en Cuba',
    link: '/developers/payment-methods'
  },
  {
    icon: Clock,
    title: 'Webhooks',
    desc: 'Notificaciones en tiempo real de transacciones',
    link: '/developers/webhooks'
  },
  {
    icon: Zap,
    title: 'Solución de Problemas',
    desc: 'Guía para resolver problemas comunes',
    link: '/developers/troubleshooting'
  },
];

const features = [
  {
    icon: Zap,
    title: 'Integración Local',
    desc: 'Soporte para métodos de pago cubanos como Transfermóvil y EnZona'
  },
  {
    icon: Globe,
    title: 'Cobertura Total',
    desc: 'Acepta pagos desde cualquier parte del mundo con conversión de moneda automática'
  },
  {
    icon: Shield,
    title: 'Seguridad Garantizada',
    desc: 'Cumplimiento con estándares internacionales de seguridad de pagos'
  },
  {
    icon: Clock,
    title: 'Tiempo Real',
    desc: 'Confirmación instantánea de pagos y actualización de saldos'
  },
  {
    icon: Terminal,
    title: 'Documentación Clara',
    desc: 'Guías detalladas y ejemplos de código para una implementación rápida'
  },
  {
    icon: Code,
    title: 'SDKs Potentes',
    desc: 'Bibliotecas para los lenguajes y plataformas más populares'
  },
];

const CODE_SNIPPETS = [
  {
    language: 'server.js',
    code: `node server.js && stripe listen

> Ready! Waiting for requests...`
  },
  {
    language: 'payment-intent.js',
    code: `const antillapay = require('antillapay')('sk_test_...');

await antillapay.payments.create({
  amount: 2500,
  currency: 'CUP',
  payment_methods: ['transfermovil', 'enzona']
});`
  }
];

const TERMINAL_LOGS = [
  { time: '2025-12-06 17:32:12', code: '200', event: 'payment_intent.created' },
  { time: '2025-12-06 17:32:13', code: '200', event: 'charge.succeeded' }
];

export default function Developers() {
  const [copied, setCopied] = useState(false);
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Typing animation effect
  useEffect(() => {
    const snippet = CODE_SNIPPETS[currentSnippet];
    let currentIndex = 0;
    setDisplayedCode('');
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (currentIndex < snippet.code.length) {
        setDisplayedCode(snippet.code.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
        
        // Switch to next snippet after a delay
        setTimeout(() => {
          setCurrentSnippet((prev) => (prev + 1) % CODE_SNIPPETS.length);
        }, 3000);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [currentSnippet]);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[currentSnippet].code);
    setCopied(true);
    toast.success('¡Código copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-16 md:pt-24 pb-16 md:pb-20">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-20">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 md:p-12 lg:p-16">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-white text-blue-700 rounded-lg text-xs font-medium mb-4 shadow-sm">
                <Terminal className="w-4 h-4" />
                Para desarrolladores en Cuba
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Integra pagos en Cuba con <span className="text-blue-600">AntillaPay</span>
              </h1>
              <p className="text-base md:text-xl text-gray-600 max-w-2xl">
                La plataforma de pagos más completa para el mercado cubano. Conecta tu negocio con múltiples métodos de pago locales e internacionales a través de nuestra API fácil de usar.
              </p>
              <div className="mt-8 p-4 bg-white/50 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800">
                  <span className="font-semibold">¿Eres desarrollador?</span> Comienza con nuestra documentación técnica o explora los recursos disponibles para integrar pagos en minutos.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 relative"
            >
              <div className="bg-slate-950 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
                {/* Window Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-lg bg-red-500" />
                      <div className="w-3 h-3 rounded-lg bg-yellow-500" />
                      <div className="w-3 h-3 rounded-lg bg-green-500" />
                    </div>
                    <span className="ml-3 text-xs text-slate-400 font-mono">
                      {CODE_SNIPPETS[currentSnippet].language}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs font-mono rounded">
                      NORMAL
                    </div>
                    <button
                      onClick={handleCopy}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Code Content */}
                <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm h-48 sm:h-auto overflow-y-auto">
                  <pre className="text-slate-300 whitespace-pre-wrap">
                    <code>
                      {displayedCode.split('\n').map((line, i) => (
                        <div key={i} className="flex">
                          <span className="text-slate-600 select-none mr-3 sm:mr-4 text-right w-6">
                            {i + 1}
                          </span>
                          <span className="flex-1">
                            {line.includes('const') || line.includes('await') ? (
                              <>
                                <span className="text-purple-400">
                                  {line.match(/(const|await)/)?.[0]}
                                </span>
                                {line.replace(/(const|await)/, '')}
                              </>
                            ) : line.includes('antillapay') ? (
                              <>
                                {line.split('antillapay')[0]}
                                <span className="text-cyan-400">antillapay</span>
                                {line.split('antillapay')[1]}
                              </>
                            ) : line.includes('node') ? (
                              <span className="text-green-400">{line}</span>
                            ) : line.includes('>') ? (
                              <span className="text-cyan-300">{line}</span>
                            ) : (
                              line
                            )}
                          </span>
                        </div>
                      ))}
                      {isTyping && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="inline-block w-2 h-4 bg-cyan-400 ml-1"
                        />
                      )}
                    </code>
                  </pre>
                </div>

                {/* Terminal Output */}
                {currentSnippet === 0 && !isTyping && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-slate-700 bg-slate-950/50 p-4 font-mono text-xs"
                  >
                    {TERMINAL_LOGS.map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="flex items-center gap-3 py-1"
                      >
                        <span className="text-slate-600">{log.time}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          log.code === '200' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {log.code}
                        </span>
                        <span className="text-slate-400">{log.event}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500 rounded-lg mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Recursos para Desarrolladores</h2>
          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
            Accede a documentación detallada, guías de integración y herramientas para implementar pagos en tu aplicación o sitio web. Todo lo que necesitas para empezar a procesar pagos en Cuba.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {resources.map((resource, i) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{resource.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      {/* Sección de Beneficios */}
      <div className="bg-gray-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Beneficios Clave</h2>
            <div className="w-16 h-1 bg-cyan-400 mx-auto mb-4"></div>
            <p className="text-sm md:text-xl text-gray-300 max-w-3xl mx-auto">
              Todo lo que necesitas para integrar pagos en Cuba de manera sencilla y segura
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full"
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}