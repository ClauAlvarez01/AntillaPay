# Antilla Pay

Antilla Pay es una plataforma de pagos moderna construida con React, Vite y una variedad de componentes de interfaz de usuario modernos. La plataforma está diseñada para ofrecer una experiencia de pago segura, rápida y fácil de usar para los usuarios finales.

## 🚀 Características Principales

- Interfaz de usuario moderna y receptiva
- Navegación intuitiva con menús desplegables y categorías
- Carrito de compras integrado
- Sistema de autenticación de usuarios
- Integración con pasarelas de pago
- Panel de administración para gestión de productos
- Diseño adaptable a dispositivos móviles

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18
- **Estilización**: Tailwind CSS
- **Componentes UI**: Radix UI, Shadcn/ui
- **Gestión de Estado**: React Hooks
- **Enrutamiento**: React Router
- **Formularios**: React Hook Form
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Bundler**: Vite

## 🚀 Empezando

### Requisitos Previos

- Node.js 16 o superior
- npm 8 o superior

### Instalación

1. Clona el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd flowli
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```
   VITE_API_URL=tu_url_de_api
   VITE_APP_NAME=AntillaPay
   ```

### Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173)

### Construcción para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos de producción se generarán en el directorio `dist/`.

## 📁 Estructura del Proyecto

```
src/
├── assets/          # Recursos estáticos (imágenes, fuentes, etc.)
├── components/      # Componentes reutilizables
│   ├── ui/          # Componentes de interfaz de usuario
│   └── home/        # Componentes específicos del dashboard principal
├── hooks/           # Custom Hooks de React
├── pages/           # Componentes de páginas
├── styles/          # Estilos globales
└── utils/           # Utilidades y helpers
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, lee nuestras [pautas de contribución](CONTRIBUTING.md) antes de enviar tus cambios.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.

## 📧 Contacto

Para soporte o consultas, contáctanos en [soporte@antillapay.com](mailto:soporte@antillapay.com)