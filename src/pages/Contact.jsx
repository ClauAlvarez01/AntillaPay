import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check } from 'lucide-react';
import { useLanguage } from '../components/i18n/LanguageContext';
import { createPageUrl } from '@/utils';

const revenueRanges = [
  { value: 'none', label: 'Ninguno, ya que recién empiezo' },
  { value: 'under_100k', label: 'Menos de USD100,000' },
  { value: '100k_1m', label: 'De USD100,000 a USD1 millón' },
  { value: '1m_2.5m', label: 'De USD1 millón a USD2.5 millones' },
  { value: '2.5m_10m', label: 'De USD2.5 millones a USD10 millones' },
  { value: 'over_10m', label: 'Más de USD10 millones' },
];

const jobLevels = [
  { value: 'executive', label: 'Cargo directivo' },
  { value: 'vp', label: 'Vicepresidente' },
  { value: 'director', label: 'Director' },
  { value: 'manager', label: 'Gerente' },
  { value: 'individual', label: 'Cargo no gerencial' },
];

const jobFunctions = [
  { value: 'ceo', label: 'Director ejecutivo' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'finance', label: 'Finanzas' },
  { value: 'it', label: 'Tecnología de la información' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'operations', label: 'Operaciones' },
  { value: 'product', label: 'Producto' },
  { value: 'sales', label: 'Ventas' },
];

export default function Contact() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    country: 'US',
    revenue: '',
    firstName: '',
    lastName: '',
    phone: '',
    website: '',
    jobLevel: '',
    jobFunction: '',
  });

  const handleContinueStep1 = (e) => {
    e.preventDefault();
    if (formData.email && formData.country && formData.revenue) {
      setStep(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Gradient Background */}
        <div className="fixed inset-0 -z-10">
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
          <div className="absolute top-0 right-0 w-[60%] h-[70%]" style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(167, 139, 250, 0.3) 0%, transparent 50%)' }} />
          <div className="absolute bottom-0 left-0 w-[50%] h-[60%]" style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('contact.successTitle')}</h1>
          <p className="text-lg text-gray-600">{t('contact.successMessage')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pt-20">
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-10">
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
        <div className="absolute top-0 right-0 w-[60%] h-[70%]" style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(167, 139, 250, 0.3) 0%, transparent 50%)' }} />
        <div className="absolute bottom-0 left-0 w-[50%] h-[60%]" style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)' }} />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          {step === 1 ? (
            <form onSubmit={handleContinueStep1} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.fields.email')}
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-12 rounded-lg border-gray-300"
                  placeholder="tu@empresa.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.fields.country')}
                </label>
                <Select value={formData.country} onValueChange={(v) => setFormData({...formData, country: v})}>
                  <SelectTrigger className="h-12 rounded-lg border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">Estados Unidos</SelectItem>
                    <SelectItem value="MX">México</SelectItem>
                    <SelectItem value="ES">España</SelectItem>
                    <SelectItem value="AR">Argentina</SelectItem>
                    <SelectItem value="CO">Colombia</SelectItem>
                    <SelectItem value="CL">Chile</SelectItem>
                    <SelectItem value="PE">Perú</SelectItem>
                    <SelectItem value="VE">Venezuela</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.fields.revenue')}
                </label>
                <Select value={formData.revenue} onValueChange={(v) => setFormData({...formData, revenue: v})}>
                  <SelectTrigger className="h-12 rounded-lg border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {revenueRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl('Home'))}
                  className="flex-1 h-12 rounded-full border-gray-300"
                >
                  {t('common.back', 'Volver')}
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 h-12 bg-violet-600 hover:bg-violet-700 rounded-full shadow-md shadow-violet-600/20 transition-all hover:shadow-lg hover:shadow-violet-600/30"
                >
                  {t('contact.continueButton')}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.fields.firstName')}
                  </label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="h-12 rounded-lg border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.fields.lastName')}
                  </label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="h-12 rounded-lg border-gray-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.fields.phone')}
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="h-12 rounded-lg border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.fields.website')}
                </label>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="h-12 rounded-lg border-gray-300"
                  placeholder="https://"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.fields.jobLevel')}
                </label>
                <Select value={formData.jobLevel} onValueChange={(v) => setFormData({...formData, jobLevel: v})}>
                  <SelectTrigger className="h-12 rounded-lg border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jobLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.fields.jobFunction')}
                </label>
                <Select value={formData.jobFunction} onValueChange={(v) => setFormData({...formData, jobFunction: v})}>
                  <SelectTrigger className="h-12 rounded-lg border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jobFunctions.map((func) => (
                      <SelectItem key={func.value} value={func.value}>
                        {func.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 rounded-full border-gray-300"
                >
                  {t('common.back', 'Volver')}
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 h-12 bg-violet-600 hover:bg-violet-700 rounded-full shadow-md shadow-violet-600/20 transition-all hover:shadow-lg hover:shadow-violet-600/30"
                >
                  {t('contact.submitButton')}
                </Button>
              </div>
            </form>
          )}
        </motion.div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Al enviar este formulario, aceptas que AntillaPay use tus datos para contactarte.
        </p>
      </div>
    </div>
  );
}