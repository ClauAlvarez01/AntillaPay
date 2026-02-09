import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Building, Award, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { value: '100M+', label: 'Transacciones procesadas' },
  { value: '190+', label: 'Países soportados' },
  { value: '50K+', label: 'Empresas activas' },
  { value: '99.99%', label: 'Uptime garantizado' },
];

const values = [
  {
    icon: Users,
    title: 'Usuario primero',
    desc: 'Cada decisión comienza con nuestros usuarios en mente.'
  },
  {
    icon: Globe,
    title: 'Impacto global',
    desc: 'Construimos infraestructura que funciona en todo el mundo.'
  },
  {
    icon: Building,
    title: 'Excelencia técnica',
    desc: 'Obsesión por la calidad y la fiabilidad del código.'
  },
  {
    icon: Award,
    title: 'Transparencia',
    desc: 'Comunicación abierta con equipos, usuarios y socios.'
  },
];

const offices = [
  { city: 'San Francisco', country: 'Estados Unidos', hq: true },
  { city: 'Ciudad de México', country: 'México' },
  { city: 'São Paulo', country: 'Brasil' },
  { city: 'Londres', country: 'Reino Unido' },
  { city: 'Singapur', country: 'Singapur' },
  { city: 'Tokio', country: 'Japón' },
];

const jobs = [
  { title: 'Senior Backend Engineer', team: 'Engineering', location: 'Remoto' },
  { title: 'Product Designer', team: 'Design', location: 'San Francisco' },
  { title: 'Solutions Architect', team: 'Sales', location: 'Ciudad de México' },
  { title: 'Technical Writer', team: 'Documentation', location: 'Remoto' },
];

export default function Company() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Sobre AntillaPay
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos construyendo la infraestructura financiera que impulsa el comercio global.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center"
            >
              <p className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</p>
              <p className="text-white/80 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="bg-gray-50 py-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra misión</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Aumentar el PIB de internet facilitando que cualquier empresa, 
              de cualquier tamaño y en cualquier lugar, pueda aceptar pagos 
              y gestionar sus finanzas de manera simple y confiable.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-gray-900 text-center mb-12"
        >
          Nuestros valores
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Offices */}
      <div className="bg-gray-900 text-white py-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Nuestras oficinas
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {offices.map((office, i) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-xl ${office.hq ? 'bg-indigo-600' : 'bg-gray-800'}`}
              >
                <MapPin className="w-5 h-5 mb-2 opacity-70" />
                <p className="font-medium">{office.city}</p>
                <p className="text-sm opacity-70">{office.country}</p>
                {office.hq && <span className="text-xs mt-2 inline-block bg-white/20 px-2 py-0.5 rounded">HQ</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Únete al equipo</h2>
          <p className="text-gray-600">Estamos buscando talento excepcional</p>
        </motion.div>

        <div className="space-y-4 max-w-3xl mx-auto mb-8">
          {jobs.map((job, i) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
            >
              <div>
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.team} • {job.location}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button className="rounded-lg bg-gray-900 hover:bg-gray-800">
            Ver todas las posiciones
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}