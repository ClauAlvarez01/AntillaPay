import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Layers, Box, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../i18n/LanguageContext';

const cardIcons = [Palette, Layers, Box];

const mockComponents = {
  0: [ // Design System
    { type: 'color', colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'] },
    { type: 'typography', items: ['Heading 1', 'Heading 2', 'Body', 'Caption'] },
  ],
  1: [ // UI Library
    { type: 'buttons', items: ['Primary', 'Secondary', 'Outline', 'Ghost'] },
    { type: 'inputs', items: ['Text', 'Select', 'Checkbox', 'Radio'] },
  ],
  2: [ // Brand Resources
    { type: 'logos', items: ['Logo Full', 'Logo Icon', 'Logo Dark', 'Logo Light'] },
    { type: 'icons', items: ['24 icon sets', '500+ icons', 'SVG & PNG'] },
  ],
};

export default function DesignersSection() {
  const { t } = useLanguage();
  const [activeCard, setActiveCard] = useState(null);

  return (
    <section className="py-20 lg:py-32 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('designers.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('designers.subtitle')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {t('designers.cards').map((card, i) => {
            const Icon = cardIcons[i];
            const isActive = activeCard === i;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveCard(isActive ? null : i)}
                className={`bg-white rounded-2xl p-4 sm:p-6 border-2 transition-all cursor-pointer ${
                  isActive 
                    ? 'border-indigo-500 shadow-xl' 
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      {mockComponents[i].map((section, j) => (
                        <div key={j} className="mb-4 last:mb-0">
                          {section.type === 'color' && (
                            <div className="flex gap-2">
                              {section.colors.map((color) => (
                                <div
                                  key={color}
                                  className="w-8 h-8 rounded-lg"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          )}
                          {section.type === 'typography' && (
                            <div className="space-y-1">
                              {section.items.map((item, k) => (
                                <p 
                                  key={k} 
                                  className="text-gray-600"
                                  style={{ fontSize: `${16 - k * 2}px`, fontWeight: k < 2 ? 600 : 400 }}
                                >
                                  {item}
                                </p>
                              ))}
                            </div>
                          )}
                          {section.type === 'buttons' && (
                            <div className="flex flex-wrap gap-2">
                              {section.items.map((item, k) => (
                                <button
                                  key={k}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                                    k === 0 ? 'bg-indigo-600 text-white' :
                                    k === 1 ? 'bg-gray-200 text-gray-700' :
                                    k === 2 ? 'border border-gray-300 text-gray-700' :
                                    'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          )}
                          {section.type === 'inputs' && (
                            <div className="flex flex-wrap gap-2">
                              {section.items.map((item) => (
                                <span key={item} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                                  {item}
                                </span>
                              ))}
                            </div>
                          )}
                          {section.type === 'logos' && (
                            <div className="grid grid-cols-2 gap-2">
                              {section.items.map((item) => (
                                <div key={item} className="p-2 bg-gray-50 rounded-lg text-center text-xs text-gray-500">
                                  {item}
                                </div>
                              ))}
                            </div>
                          )}
                          {section.type === 'icons' && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {section.items.map((item) => (
                                <span key={item} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs">
                                  {item}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                >
                  {t('common.learnMore')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}