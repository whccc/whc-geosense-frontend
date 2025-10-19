import { useEffect, useState } from "react";
import WeatherComponent from "../../components/weather-component";
import useWeather from "../../hooks/useWeather";

const WeatherPage = () => {
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState<string>("");
  const [resetMap, setResetMap] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<Array<number>>([
    6.244338238080621, -75.57355307042599,
  ]);
  const { getWeather, getCityCoordinates } = useWeather();
  useEffect(() => {
    getWeatherNow(coordinates[0], coordinates[1]);
  }, []);

  const getWeatherNow = async (latitude: number, longitude: number) => {
    try {
      const data = await getWeather(latitude, longitude);
      setWeather(data.data);
    } catch (error) {}
  };
  const handleCitySearch = async () => {
    const coords = await getCityCoordinates(city);
    if (coords) {
      setCoordinates(coords as Array<number>);
    }
  };

  return (
    <div className="relative w-full p-5">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-lg border border-gray-200/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">🌍</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Mapa del Clima
            </h1>
          </div>

          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Explora las condiciones meteorológicas en tiempo real de cualquier
            ciudad del mundo
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1 w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Buscar ciudad (ej: Londres, París, Tokio...)"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm text-gray-700 placeholder-gray-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCitySearch();
                  }
                }}
              />
            </div>

            <div className="flex gap-2">
              <button
                className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={handleCitySearch}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Buscar</span>
                <svg
                  className="w-3 h-3 opacity-70 group-hover:opacity-100 transform group-hover:translate-x-0.5 transition-all duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <button
                className="group flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                onClick={() => {
                  setResetMap(!resetMap);
                  setCity("");
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Reiniciar</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span className="text-blue-500">💡</span>
              <span>Presiona Enter para buscar rápido</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1">
              <span className="text-green-500">🗺️</span>
              <span>Capas climáticas interactivas</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1">
              <span className="text-purple-500">🌦️</span>
              <span>Datos en tiempo real</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <WeatherComponent coords={coordinates} resetMap={resetMap} />
        {weather && (
          <div className="absolute top-4 left-4 z-30 animate-slideInUp">
            <div className="group relative overflow-hidden bg-white/80 border border-white/30 rounded-2xl p-5 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 min-w-[280px]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent group-hover:via-white/10 transition-all duration-500"></div>

              <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400/60 rounded-full animate-pulse"></div>
              <div className="absolute top-4 right-6 w-1 h-1 bg-cyan-400/60 rounded-full animate-ping"></div>
              <div className="absolute bottom-3 left-2 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-bounce"></div>

              <div className="relative mb-4 pb-3 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-gray-800 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-blue-600 transition-all duration-300">
                      {weather.name}
                    </h2>
                    <p className="text-xs text-gray-600/80 font-medium">
                      Condiciones actuales
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative space-y-3">
                <div className="group/item flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform duration-300">
                    <span className="text-white text-lg font-bold">🌡️</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-gray-800 group-hover/item:text-orange-600 transition-colors duration-300">
                        {Math.round(weather.main.temp)}
                      </span>
                      <span className="text-lg font-bold text-gray-600">
                        °C
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      Temperatura
                    </p>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-700 rounded-xl"></div>
                </div>

                <div className="group/item flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-300">
                    <span className="text-white text-lg font-bold">💨</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-gray-800 group-hover/item:text-cyan-600 transition-colors duration-300">
                        {weather.wind.speed}
                      </span>
                      <span className="text-sm font-bold text-gray-600">
                        m/s
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Viento</p>
                  </div>

                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover/item:opacity-60 transition-opacity duration-300">
                    <div className="flex gap-0.5">
                      <div className="w-0.5 h-4 bg-cyan-400 rounded animate-pulse"></div>
                      <div
                        className="w-0.5 h-3 bg-cyan-400 rounded animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-0.5 h-2 bg-cyan-400 rounded animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-700 rounded-xl"></div>
                </div>

                <div className="group/item flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform duration-300">
                    <span className="text-white text-lg font-bold">☁️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 capitalize group-hover/item:text-purple-600 transition-colors duration-300 leading-relaxed">
                      {weather.weather[0].description}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      Descripción
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-700 rounded-xl"></div>
                </div>
              </div>

              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>

              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-t-full opacity-60 group-hover:opacity-100 group-hover:w-24 transition-all duration-500"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default WeatherPage;
