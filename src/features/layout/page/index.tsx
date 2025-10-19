import { Link } from "react-router-dom";
import { useState } from "react";

interface IProps {
  children: React.ReactNode;
}

const Layout = ({ children }: IProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <nav className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-20 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span className="text-white text-xl font-bold">GWHC</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  GeoSenseWhc
                </h1>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="flex items-center space-x-2">
                <Link
                  to="/"
                  className="group relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2 text-gray-700 group-hover:text-blue-600">
                    <span className="text-lg">🌤️</span>
                    <span>Mapa del Clima</span>
                    <div className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </span>
                </Link>
                <Link
                  to="/map-delivery"
                  className="group relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2 text-gray-700 group-hover:text-orange-600">
                    <span className="text-lg">🗺️</span>
                    <span>Mapa de Rutas</span>
                    <div className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </span>
                </Link>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="relative p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:scale-105 group"
                aria-label="Toggle menu"
              >
                <svg
                  className="h-6 w-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          <div
            className={`md:hidden transition-all duration-500 ease-out ${
              isMenuOpen
                ? "max-h-64 opacity-100 transform translate-y-0"
                : "max-h-0 opacity-0 transform -translate-y-2"
            } overflow-hidden`}
          >
            <div className="px-4 pt-4 pb-6 space-y-3">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4"></div>

              <Link
                to="/"
                onClick={toggleMenu}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 hover:scale-105"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors duration-300">
                  <span className="text-lg">🌤️</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium">
                    Mapa del Clima
                  </span>
                  <span className="text-xs text-gray-500">
                    Condiciones meteorológicas
                  </span>
                </div>
              </Link>

              <Link
                to="/map-delivery"
                onClick={toggleMenu}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 hover:scale-105"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-red-200 transition-colors duration-300">
                  <span className="text-lg">🗺️</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium">
                    Mapa de Rutas
                  </span>
                  <span className="text-xs text-gray-500">
                    Planificación y navegación
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black border-t border-gray-200 shadow-lg p-[30px]">
        <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
          <span>Desarrollado por</span>
          <a
            href="https://www.linkedin.com/in/wilson-herney-castro-cabrera-73560a19a/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-3 py-1.5 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span className="text-white font-medium">
              Wilson Herney Castro Cabrera
            </span>
            <svg
              className="w-3 h-3 text-white opacity-70 group-hover:opacity-100 transform group-hover:translate-x-0.5 transition-all duration-200"
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
