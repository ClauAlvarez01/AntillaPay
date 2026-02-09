import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

export default function GlobalScale() {
  const { t, language } = useLanguage();
  
  const metrics = [
    { value: '500M+', label: language === 'es' ? 'de solicitudes de API por día y hasta 13,000 solicitudes por segundo.' : language === 'en' ? 'API requests per day, up to 13,000 requests per second.' : 'API 请求/天，每秒最多 13,000 个请求。' },
    { value: '99.999%', label: language === 'es' ? 'tiempo de actividad histórico para los servicios de AntillaPay.' : language === 'en' ? 'historical uptime for AntillaPay services.' : 'AntillaPay 服务的历史正常运行时间。' },
    { value: '90%', label: language === 'es' ? 'de las personas en Cuba compran en negocios que usan AntillaPay.' : language === 'en' ? 'of US adults have purchased from businesses powered by AntillaPay.' : '的美国成年人从使用 AntillaPay 的企业购买商品。' },
    { value: language === 'es' ? 'Más métodos de pago' : language === 'en' ? 'More payment methods' : '+', label: language === 'es' ? 'para que más compras se completen.' : language === 'en' ? 'so more purchases are completed' : '种货币和支付方式。' }
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Glowing Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-500/30 rounded-lg blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-blue-500/30 rounded-lg blur-3xl"
      />

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
              {t('home.globalScale.eyebrow')}
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {t('home.globalScale.title')}
            </h2>
            <p className="text-base md:text-xl text-gray-300 leading-relaxed">
              {t('home.globalScale.description')}
            </p>
          </motion.div>

          {/* Right Column - Globe Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-64 md:h-96"
          >
            {/* Simplified Globe */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative w-80 h-80">
                {/* Globe Circle */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-600/20 to-violet-600/20 border-2 border-violet-400/30" />
                
                {/* Orbit Rings */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-lg border-2 border-dashed border-cyan-400/20"
                />
                
                {/* Dots representing locations */}
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 360) / 12;
                  const radius = 120;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                      }}
                      className="w-3 h-3 bg-cyan-400 rounded-lg shadow-lg shadow-cyan-400/50"
                    />
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Metrics Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-12 md:mt-20 pt-8 md:pt-12 border-t border-white/10"
        >
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              <div className="text-2xl lg:text-4xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {metric.value}
              </div>
              <div className="text-sm text-gray-400 leading-relaxed">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}