import { Link } from "react-router-dom";
import { useState } from "react";

interface IProps {
  children: React.ReactNode;
}

const Layout = ({ children }: IProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.12),rgba(255,255,255,0.15)_50%,transparent_70%)]"></div>
      <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-400/20 via-purple-400/10 to-indigo-300/5 blur-3xl animate-pulse"></div>
      <div className="pointer-events-none absolute bottom-0 -left-32 w-80 h-40 bg-gradient-to-r from-cyan-400/8 via-blue-500/8 to-indigo-500/8 blur-2xl rounded-full"></div>
      
      <nav className="bg-white/98 backdrop-blur-xl shadow-2xl border-b border-white/30 sticky top-0 z-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-purple-500/2 to-indigo-500/3"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-4 group">
              <div className="w-20 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-3 group-hover:rotate-6">
                <span className="text-white text-lg font-black">GWHC</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-indigo-500 transition-all duration-500">
                  GeoSenseWhc
                </h1>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="flex items-center space-x-3">
                <Link
                  to="/"
                  className="group relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-500 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/40 group-hover:border-blue-300/50 transition-all duration-500"></div>
                  <span className="relative flex items-center gap-3 text-gray-700 group-hover:text-blue-600">
                    <span className="text-xl">🌤️</span>
                    <span>Mapa del Clima</span>
                    <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>
                  </span>
                </Link>
                <Link
                  to="/map-delivery"
                  className="group relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-500 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/40 group-hover:border-orange-300/50 transition-all duration-500"></div>
                  <span className="relative flex items-center gap-3 text-gray-700 group-hover:text-orange-600">
                    <span className="text-xl">🗺️</span>
                    <span>Mapa de Rutas</span>
                    <div className="w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>
                  </span>
                </Link>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="relative p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 hover:bg-white/80 hover:border-blue-300/50 transition-all duration-500 hover:scale-110 hover:rotate-3 group shadow-lg hover:shadow-xl"
                aria-label="Toggle menu"
              >
                <svg
                  className="h-7 w-7 text-gray-700 group-hover:text-blue-600 transition-all duration-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>
          </div>

          <div
            className={`md:hidden transition-all duration-700 ease-out ${
              isMenuOpen
                ? "max-h-72 opacity-100 transform translate-y-0"
                : "max-h-0 opacity-0 transform -translate-y-4"
            } overflow-hidden`}
          >
            <div className="px-6 pt-6 pb-8 space-y-4 bg-white/80 backdrop-blur-xl border-t border-white/50">
              <div className="h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent mb-6 rounded-full"></div>

              <Link
                to="/"
                onClick={toggleMenu}
                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-cyan-50/80 transition-all duration-500 hover:scale-105 border border-transparent hover:border-blue-200/50 shadow-sm hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-cyan-200 group-hover:scale-110 transition-all duration-500 shadow-md">
                  <span className="text-xl">🌤️</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-bold text-base">
                    Mapa del Clima
                  </span>
                  <span className="text-sm text-gray-600 font-medium">
                    Condiciones meteorológicas en tiempo real
                  </span>
                </div>
                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>
              </Link>

              <Link
                to="/map-delivery"
                onClick={toggleMenu}
                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-orange-50/80 hover:to-red-50/80 transition-all duration-500 hover:scale-105 border border-transparent hover:border-orange-200/50 shadow-sm hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center group-hover:from-orange-200 group-hover:to-red-200 group-hover:scale-110 transition-all duration-500 shadow-md">
                  <span className="text-xl">🗺️</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-bold text-base">
                    Mapa de Rutas
                  </span>
                  <span className="text-sm text-gray-600 font-medium">
                    Planificación y navegación inteligente
                  </span>
                </div>
                <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="bg-gradient-to-r from-slate-800 via-gray-900 to-slate-800 border-t border-white/20 shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/5 to-indigo-900/10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-b-full opacity-60"></div>
        
        <div className="flex items-center justify-center gap-3 text-gray-300 text-base relative z-10">
          <span className="font-medium">Desarrollado con ❤️ por</span>
          <a
            href="https://www.linkedin.com/in/wilson-herney-castro-cabrera-73560a19a/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-5 py-3 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:scale-110 hover:rotate-1 border border-blue-500/30 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <svg
              className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm">
                Wilson Herney Castro Cabrera
              </span>
              <span className="text-blue-200 text-xs font-medium">
                Full Stack Developer
              </span>
            </div>
            
            <svg
              className="w-4 h-4 text-white opacity-70 group-hover:opacity-100 transform group-hover:translate-x-1 group-hover:scale-125 transition-all duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
};
export default Layout;
