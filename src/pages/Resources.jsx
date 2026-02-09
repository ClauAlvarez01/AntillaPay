import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, FileText, Video, Users, 
  Calendar, Clock, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const categories = ['Todos', 'Guías', 'Blog', 'Webinars', 'Casos de éxito'];

const resources = [
  {
    type: 'guide',
    category: 'Guías',
    title: 'Guía completa para MIPYMES en Cuba',
    desc: 'Todo lo que necesitas saber para registrar y operar una Micro, Pequeña o Mediana Empresa en el contexto cubano.',
    icon: BookOpen,
    readTime: '25 min',
    date: '2024-07-15'
  },
  {
    type: 'blog',
    category: 'Blog',
    title: 'Navegando Transfermóvil y EnZona para tu negocio',
    desc: 'Estrategias para integrar las principales pasarelas de pago cubanas y optimizar tus cobros.',
    icon: FileText,
    readTime: '10 min',
    date: '2024-07-12'
  },
  {
    type: 'webinar',
    category: 'Webinars',
    title: 'Marketing Digital desde Cuba: Retos y Oportunidades',
    desc: 'Aprende a promocionar tu marca en redes sociales y buscadores con las limitaciones y ventajas del mercado local.',
    icon: Video,
    readTime: '50 min',
    date: '2024-07-10'
  },
  {
    type: 'case',
    category: 'Casos de éxito',
    title: 'Cómo "Mandao" optimizó su logística con AntillaPay',
    desc: 'Un caso de estudio sobre la implementación de soluciones de pago y logística para servicios de entrega en la isla.',
    icon: Users,
    readTime: '12 min',
    date: '2024-07-08'
  },
  {
    type: 'guide',
    category: 'Guías',
    title: 'Importación para TCP y MIPYMES: Paso a paso',
    desc: 'Una guía detallada sobre el proceso de importación de mercancías para el sector no estatal en Cuba.',
    icon: BookOpen,
    readTime: '20 min',
    date: '2024-07-05'
  },
  {
    type: 'blog',
    category: 'Blog',
    title: 'El auge del comercio electrónico en la isla',
    desc: 'Análisis de las plataformas y tendencias que están definiendo el e-commerce en el panorama cubano actual.',
    icon: FileText,
    readTime: '8 min',
    date: '2024-07-03'
  },
];

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  const filteredResources = resources.filter(r => {
    const matchesCategory = activeCategory === 'Todos' || r.category === activeCategory;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Recursos para Emprendedores en Cuba
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Guías, artículos y herramientas para impulsar tu negocio en el mercado cubano.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-blue-100 to-yellow-50 text-gray-900 border border-gray-200 shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <Input
            type="search"
            placeholder="Buscar recursos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 rounded-lg"
          />
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, i) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                    {resource.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {resource.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {resource.desc}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4 w-full justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {resource.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(resource.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No se encontraron recursos</p>
          </div>
        )}
      </div>

      {/* Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            Mantente al día
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Recibe las últimas guías, noticias y consejos para emprendedores en Cuba directamente en tu inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="tu@email.com" 
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg"
            />
            <Button className="bg-white text-indigo-600 hover:bg-white/90 rounded-lg">
              Suscribirse
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}