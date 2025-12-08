import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

const companies = [
  { name: 'OpenAI', color: '#10a37f' },
  { name: 'amazon', color: '#ff9900', style: 'lowercase' },
  { name: 'Google', color: '#4285f4' },
  { name: 'ANTHROPIC', color: '#1a1a1a', style: 'uppercase tracking-widest' },
  { name: 'MARRIOTT', color: '#a4373a', style: 'uppercase tracking-wider' },
  { name: 'shopify', color: '#96bf48', style: 'lowercase' },
  { name: 'airbnb', color: '#ff5a5f', style: 'lowercase' },
  { name: 'URBN', color: '#1a1a1a', style: 'uppercase font-black' },
];

export default function TrustSection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 text-sm mb-10"
        >
          {t('trust.title')}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 items-center justify-items-center"
        >
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, opacity: 1 }}
              className="opacity-60 hover:opacity-100 transition-all cursor-pointer"
            >
              <span 
                className={`text-2xl lg:text-3xl font-bold ${company.style || ''}`}
                style={{ color: company.color }}
              >
                {company.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}