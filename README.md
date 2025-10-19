# 🌍 GeoSenseWhc - Weather & Navigation Intelligence

<div align="center">

![GeoSenseWhc](https://img.shields.io/badge/GeoSenseWhc-Premium%20Weather%20App-blue?style=for-the-badge&logo=react)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.14-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat&logo=vite)](https://vitejs.dev/)

*Una aplicación web premium que combina información meteorológica en tiempo real con navegación inteligente*

[🌟 Demo Live](https://whc-geosense-frontend.vercel.app/)
</div>

---

## ✨ Características Destacadas

### 🌤️ **Mapa Meteorológico Interactivo**
- **Capas climáticas dinámicas**: Precipitación, viento, temperatura y radar
- **Visualización en tiempo real** con datos actualizados
- **Interfaz glassmorphism premium** con efectos visuales avanzados
- **Búsqueda global de ciudades** con autocompletado

### 🗺️ **Sistema de Navegación Avanzado**
- **Planificación de rutas inteligente** entre dos puntos
- **Navegación paso a paso** con síntesis de voz en español
- **Cálculo automático de trayectorias** usando OpenRouteService
- **Visualización 3D de rutas** con perspectiva orbital

### 🎨 **Experiencia Visual Premium**
- **Fondo espacial animado** con sistema de partículas Canvas
- **Efectos glassmorphism** y gradientes dinámicos
- **Animaciones fluidas** con Tailwind CSS
- **Diseño responsive** optimizado para todos los dispositivos

---

## 🛠️ Stack Tecnológico

### **Frontend Core**
- **⚛️ React 19.1.1** - Biblioteca de interfaz de usuario
- **📘 TypeScript 5.9.3** - Tipado estático y desarrollo seguro
- **⚡ Vite 7.1.7** - Build tool y desarrollo rápido
- **🎨 Tailwind CSS 4.1.14** - Framework de diseño utilitario

### **Mapas y Visualización**
- **🗺️ MapTiler SDK** - Renderizado de mapas interactivos
- **🌦️ MapTiler Weather** - Capas meteorológicas avanzadas
- **🚗 OpenRouteService** - Motor de rutas y navegación
- **🖼️ Canvas API** - Animaciones y efectos visuales

### **Herramientas de Desarrollo**
- **🔍 ESLint** - Análisis estático de código
- **🎯 PostCSS** - Procesamiento de CSS
- **📦 Lodash** - Utilidades de JavaScript optimizadas

---

## 🚀 Instalación

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn
- Claves API (ver [configuración](#configuración))

### **Pasos de instalación**

```bash
# 1. Clonar el repositorio
git clone https://github.com/whccc/whc-geosense-frontend.git
cd whc-geosense-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus claves API

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:5173
```

### **📋 Scripts disponibles**

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Análisis de código
```

---

## ⚙️ Configuración

### **🔐 Variables de Entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# API del Backend
VITE_API=https://tu-backend-api.com

# MapTiler (Mapas y clima)
VITE_MAPTILER_KEY=tu_maptiler_key

# OpenRouteService (Rutas)
VITE_KEY_ROUTER=tu_openroute_key
```

### **📍 Obtener Claves API**

1. **MapTiler**: [Registrarse en MapTiler](https://www.maptiler.com/)
2. **OpenRouteService**: [Registrarse en OpenRouteService](https://openrouteservice.org/)

---

## 🎯 Funcionalidades

### **🌍 Mapa del Clima**
- 🔍 **Búsqueda de ciudades** con sugerencias inteligentes
- 🌡️ **Información meteorológica** detallada en tiempo real
- ☁️ **Capas climáticas**:
  - Precipitación con animación
  - Patrones de viento
  - Mapas de temperatura  
  - Datos de radar meteorológico
- 🎛️ **Panel de control** expandible y personalizable

### **🚗 Mapa de Rutas**
- 📍 **Marcadores interactivos** para origen y destino
- 🛣️ **Cálculo de rutas optimizadas** 
- 🗣️ **Navegación por voz** en español
- 📱 **Interfaz responsive** para móviles
- ✨ **Animaciones de progreso** durante la navegación

### **🎨 Experiencia Visual**
- 🌌 **Fondo espacial dinámico** con:
  - 400+ estrellas animadas con parpadeo realista
  - Cometas con colas de partículas
  - Planetas orbitales con efectos de glow
  - Nebulosas con gradientes complejos
- 💎 **Efectos glassmorphism** premium
- 🌈 **Gradientes dinámicos** y transiciones suaves

---

## 📁 Estructura del Proyecto

```
src/
├── 🎨 styles/           # Estilos globales y animaciones
├── 🧩 features/        # Módulos principales
│   ├── 🏗️ layout/      # Componente de layout base
│   ├── 🤝 shared/      # APIs y utilidades compartidas
│   └── 🌤️ weather/     # Módulo meteorológico
│       ├── 📄 pages/       # Páginas principales
│       ├── 🧱 components/  # Componentes reutilizables
│       ├── 🎣 hooks/       # Custom hooks
│       └── 📝 interfaces/  # Tipos TypeScript
└── 📋 main.tsx         # Punto de entrada
```

### **🧱 Componentes Principales**
- **`WeatherComponent`** - Mapa meteorológico con capas
- **`MapDelivery`** - Sistema de navegación y rutas  
- **`SpaceBackground`** - Fondo animado con Canvas
- **`Layout`** - Estructura base de la aplicación

---

## 👨‍💻 Contribución

¡Las contribuciones son bienvenidas! Por favor:

1. 🍴 Fork el proyecto
2. 🌿 Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. 📝 Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push a la rama (`git push origin feature/AmazingFeature`)
5. 🔄 Abre un Pull Request

### **📋 Guías de Contribución**
- Sigue las convenciones de código existentes
- Incluye tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Usa commits descriptivos y claros

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👤 Autor

**Wilson Herney Castro Cabrera**
- 💼 LinkedIn: [Wilson Herney Castro Cabrera](https://www.linkedin.com/in/wilson-herney-castro-cabrera-73560a19a/)
- 🐙 GitHub: [@whccc](https://github.com/whccc)
- 📧 Email: [contacto@wilsoncastro.dev]

---

## 🙏 Agradecimientos

- **MapTiler** por las APIs de mapas y clima
- **OpenRouteService** por el motor de rutas
- **Tailwind CSS** por el increíble framework de diseño
- **React Team** por la excelente biblioteca
- **Comunidad Open Source** por las herramientas y librerías

---

<div align="center">

**⭐ Si este proyecto te resulta útil, ¡no olvides darle una estrella! ⭐**

*Construido con ❤️ y ☕ por Wilson Herney Castro Cabrera*

</div>
