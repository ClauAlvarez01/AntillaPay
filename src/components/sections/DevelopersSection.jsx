import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Book, FileCode, Copy, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../i18n/LanguageContext';
import { toast } from 'sonner';

const cardIcons = [Code, Book, FileCode];

const codeExamples = {
  curl: `curl https://api.antillapay.com/v1/charges \\
  -u sk_test_4eC39HqLyjWDarjtT1zdp7dc: \\
  -d amount=2000 \\
  -d currency=usd \\
  -d source=tok_visa \\
  -d description="Charge for jenny@example.com"`,
  
  javascript: `const antillapay = require('antillapay')('sk_test_...');

const charge = await antillapay.charges.create({
  amount: 2000,
  currency: 'usd',
  source: 'tok_visa',
  description: 'Charge for jenny@example.com',
});

console.log(charge.id);`,
  
  python: `import antillapay
antillapay.api_key = "sk_test_..."

charge = antillapay.Charge.create(
  amount=2000,
  currency="usd",
  source="tok_visa",
  description="Charge for jenny@example.com"
)

print(charge.id)`,
};

export default function DevelopersSection() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('javascript');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab]);
    setCopied(true);
    toast.success(t('developers.copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 lg:py-32 bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {t('developers.title')}
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              {t('developers.subtitle')}
            </p>

            <div className="space-y-4 mb-8">
              {t('developers.cards').map((card, i) => {
                const Icon = cardIcons[i];
                
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 8 }}
                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {card.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Button className="rounded-full bg-cyan-500 hover:bg-cyan-600 text-white">
              {t('common.learnMore')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>

          {/* Right Column - Code Example */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex gap-2">
                  {Object.keys(codeExamples).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveTab(lang)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === lang
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {lang === 'curl' ? 'cURL' : lang === 'javascript' ? 'JavaScript' : 'Python'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {t('developers.copyCode')}
                </button>
              </div>

              {/* Code */}
              <div className="p-3 sm:p-6 overflow-x-auto">
                <pre className="text-sm leading-relaxed">
                  <code className="text-gray-300">
                    {codeExamples[activeTab].split('\n').map((line, i) => (
                      <div key={i} className="flex">
                        <span className="select-none text-gray-600 w-8 text-right mr-4">
                          {i + 1}
                        </span>
                        <span>
                          {line.split(/('.*?'|".*?"|\d+|true|false|null)/).map((part, j) => {
                            if (/^['"].*['"]$/.test(part)) {
                              return <span key={j} className="text-green-400">{part}</span>;
                            }
                            if (/^\d+$/.test(part)) {
                              return <span key={j} className="text-orange-400">{part}</span>;
                            }
                            if (/^(true|false|null)$/.test(part)) {
                              return <span key={j} className="text-purple-400">{part}</span>;
                            }
                            return <span key={j}>{part}</span>;
                          })}
                        </span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                <p className="text-xs text-gray-500">
                  {t('developers.codeExample')} • AntillaPay API v2025.01
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}