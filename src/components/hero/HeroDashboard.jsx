import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

export default function HeroDashboard() {
  const { t } = useLanguage();
  const [chartProgress, setChartProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setChartProgress(100);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-gradient-to-br from-[#a8c77e] to-[#8fb35e] rounded-2xl shadow-xl shadow-black/10 w-full max-w-[420px] h-[420px] overflow-hidden flex flex-col relative"
    >
      {/* Bank Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-[#9dbe5f] px-6 py-4 flex items-center gap-3"
      >
        <div className="flex items-center gap-2">
          <div className="bg-gray-900 text-white font-bold text-xl px-2 py-1 rounded">
            m
          </div>
          <div>
            <h2 className="text-gray-900 font-bold text-lg leading-tight">Banco Metropolitano</h2>
            <p className="text-gray-800 text-xs">S.A.</p>
          </div>
        </div>
      </motion.div>

      {/* Card Body */}
      <div className="flex-1 p-8 flex flex-col justify-between relative">
        {/* Chip Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="w-12 h-12"
        >
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
            <rect x="4" y="4" width="40" height="40" rx="4" fill="#d4af37" opacity="0.3"/>
            <rect x="8" y="8" width="32" height="32" rx="2" fill="#d4af37" opacity="0.5"/>
            <rect x="12" y="12" width="24" height="24" rx="2" fill="#d4af37"/>
            <line x1="24" y1="12" x2="24" y2="36" stroke="#8b7355" strokeWidth="1"/>
            <line x1="12" y1="24" x2="36" y2="24" stroke="#8b7355" strokeWidth="1"/>
          </svg>
        </motion.div>

        {/* Card Number */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="space-y-2"
        >
          <div className="flex gap-4 text-gray-800 font-mono text-xl font-semibold tracking-wider">
            <span>4532</span>
            <span>****</span>
            <span>****</span>
            <span>8765</span>
          </div>
        </motion.div>

        {/* Card Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="flex justify-between items-end"
        >
          <div>
            <p className="text-xs text-gray-700 mb-1">Titular de la tarjeta</p>
            <p className="text-sm font-semibold text-gray-900">JUAN PÉREZ GARCÍA</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-700 mb-1">Válida hasta</p>
            <p className="text-sm font-semibold text-gray-900">12/28</p>
          </div>
        </motion.div>
      </div>

      {/* Red Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 right-6 bg-white rounded-lg p-2 shadow-lg"
      >
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 bg-blue-600 rounded transform -rotate-45 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white rounded transform rotate-45"></div>
          </div>
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">red</span>
          </div>
        </div>
      </motion.div>

      {/* Validity Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
        className="absolute bottom-3 left-6 text-xs text-gray-700"
      >
        Válida solo en Cuba · Uso electrónico exclusivo
      </motion.div>
    </motion.div>
  );
}