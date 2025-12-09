import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Zap, Puzzle, Smartphone, ArrowRight, Terminal } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const CODE_SNIPPETS = [
  {
    language: 'stripe.js',
    code: `const stripe = require('stripe')('sk_test_B0cK1b30v8i2HLi...');

await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'usd'
});`
  },
  {
    language: 'server.js',
    code: `node server.js && stripe listen

> Ready! Waiting for requests...`
  }
];

const TERMINAL_LOGS = [
  { time: '2025-12-06 17:32:12', code: '200', event: 'payment_intent.created' },
  { time: '2025-12-06 17:32:13', code: '200', event: 'charge.succeeded' },
  { time: '2025-12-06 17:32:13', code: '200', event: 'payment_intent.succeeded' }
];

export default function DeveloperAPISection() {
  const { t } = useLanguage();
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

  const features = [
    {
      icon: Code2,
      title: t('home.developerAPI.features.libraries.title'),
      description: t('home.developerAPI.features.libraries.description'),
      link: t('home.developerAPI.features.libraries.link')
    },
    {
      icon: Zap,
      title: t('home.developerAPI.features.agents.title'),
      description: t('home.developerAPI.features.agents.description'),
      link: t('home.developerAPI.features.agents.link')
    },
    {
      icon: Puzzle,
      title: t('home.developerAPI.features.integrations.title'),
      description: t('home.developerAPI.features.integrations.description'),
      link: t('home.developerAPI.features.integrations.link')
    },
    {
      icon: Smartphone,
      title: t('home.developerAPI.features.apps.title'),
      description: t('home.developerAPI.features.apps.description'),
      link: t('home.developerAPI.features.apps.link')
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center mb-12 md:mb-20">
          {/* Left - Text Content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}          >
            <div className="inline-flex items-center gap-2 text-sm font-semibold mb-6 text-cyan-400">
              {t('home.developerAPI.eyebrow')}
            </div>
            
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight text-white lg:text-left text-center">
              {t('home.developerAPI.title')}
            </h2>
            
            <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-6 max-w-xl lg:text-left text-center">
              {t('home.developerAPI.description')}
            </p>

            {/* Button commented out as per request
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-full transition-all shadow-lg shadow-cyan-500/25"
            >
              {t('home.developerAPI.cta')}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            */}
          </motion.div>

          {/* Right - Code Window */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Code Editor Window */}
            <div className="bg-slate-950 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="ml-3 text-xs text-slate-400 font-mono">
                    {CODE_SNIPPETS[currentSnippet].language}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs font-mono rounded">
                    NORMAL
                  </div>
                  <Terminal className="w-4 h-4 text-slate-500" />
                </div>
              </div>

              {/* Code Content */}
              <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm h-48 sm:h-auto overflow-y-auto">
                <pre className="text-slate-300 whitespace-pre-wrap">
                  <code>
                    {displayedCode.split('\n').map((line, i) => (
                      <div key={i} className="flex">
                        <span className="text-slate-600 select-none mr-3 sm:mr-4 text-right" style={{ minWidth: '20px' }}>
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
                          ) : line.includes('stripe') ? (
                            <>
                              {line.split('stripe')[0]}
                              <span className="text-cyan-400">stripe</span>
                              {line.split('stripe')[1]}
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
              {currentSnippet === 1 && !isTyping && (
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
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-center lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all h-full flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2 text-center">{feature.title}</h3>
                
                <p className="text-slate-300 text-sm mb-4 text-center">{feature.description}</p>

                {/* Link removed as per request */}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
