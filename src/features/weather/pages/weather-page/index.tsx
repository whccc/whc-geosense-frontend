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
    <div className="relative w-full min-h-screen p-5 sm:p-8 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.15),rgba(255,255,255,0.2)_60%,transparent_75%)]"></div>
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-blue-400/25 via-indigo-400/15 to-cyan-300/10 blur-3xl opacity-60 animate-pulse"></div>
      <div className="pointer-events-none absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-400/25 via-fuchsia-300/15 to-pink-300/10 blur-3xl opacity-50 animate-spin-slow"></div>
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[38rem] h-64 bg-gradient-to-r from-cyan-400/8 via-blue-500/8 to-indigo-500/8 blur-2xl opacity-70 rounded-full"></div>

      <div className="text-center mb-8 relative z-10">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden group hover:shadow-3xl transition-all duration-700">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/3 to-cyan-500/5 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent group-hover:via-white/20 transition-all duration-500 rounded-3xl"></div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-b-full opacity-60 group-hover:w-32 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="flex items-center justify-center gap-4 mb-8 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
              <span className="text-white text-xl">🌍</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-cyan-600 transition-all duration-500">
              Mapa del Clima
            </h1>
          </div>

          <p className="text-gray-700 text-xl mb-10 max-w-3xl mx-auto font-medium leading-relaxed relative z-10">
            Explora las condiciones meteorológicas en tiempo real de cualquier
            ciudad del mundo con nuestra plataforma interactiva
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-4xl mx-auto relative z-10">
            <div className="relative flex-1 w-full sm:w-auto group/search">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/10 to-cyan-500/20 rounded-2xl blur opacity-0 group-focus-within/search:opacity-100 transition-all duration-500"></div>

              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/40 shadow-xl group-focus-within/search:shadow-2xl group-focus-within/search:border-blue-300/50 transition-all duration-300">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <svg
                    className="w-6 h-6 text-gray-400 group-focus-within/search:text-blue-500 transition-colors duration-300"
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
                  className="w-full pl-14 pr-6 py-4 text-lg border-0 rounded-2xl focus:ring-0 focus:outline-none bg-transparent text-gray-800 placeholder-gray-500 font-medium"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCitySearch();
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="group flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/30 relative overflow-hidden"
                onClick={handleCitySearch}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <svg
                  className="w-5 h-5 relative z-10"
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
                <span className="relative z-10">Buscar</span>
                <svg
                  className="w-4 h-4 opacity-70 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300 relative z-10"
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
                className="group flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 relative overflow-hidden"
                onClick={() => {
                  setResetMap(!resetMap);
                  setCity("");
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <svg
                  className="w-5 h-5 relative z-10 group-hover:rotate-180 transition-transform duration-500"
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
                <span className="relative z-10">Reiniciar</span>
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 relative z-10">
            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
              <span className="text-blue-500 text-base">💡</span>
              <span className="font-medium">
                Presiona Enter para buscar rápido
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
              <span className="text-green-500 text-base">🗺️</span>
              <span className="font-medium">Capas climáticas interactivas</span>
            </div>
            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
              <span className="text-purple-500 text-base">🌦️</span>
              <span className="font-medium">Datos en tiempo real</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <WeatherComponent coords={coordinates} resetMap={resetMap} />
        {weather && (
          <div className="absolute top-6 left-6 z-30 animate-slideInUp">
            <div className="group relative overflow-hidden bg-white/85 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 min-w-[320px] max-w-[380px]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-purple-500/4 to-cyan-500/8 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent group-hover:via-white/15 transition-all duration-700 rounded-3xl"></div>

              <div className="absolute top-3 right-3 w-2 h-2 bg-blue-400/50 rounded-full animate-pulse"></div>
              <div className="absolute top-6 right-8 w-1 h-1 bg-cyan-400/50 rounded-full animate-ping"></div>
              <div className="absolute bottom-4 left-3 w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-bounce"></div>

              <div className="relative mb-5 pb-4 border-b border-white/25">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                    <svg
                      className="w-5 h-5 text-white"
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
                    <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-gray-800 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-blue-600 transition-all duration-500">
                      {weather.name}
                    </h2>
                    <p className="text-sm text-gray-600/90 font-medium">
                      Condiciones actuales
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative space-y-4">
                <div className="group/item flex items-center gap-4 p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 hover:border-white/40 transition-all duration-500">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-500">
                    <span className="text-white text-xl font-bold">🌡️</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-gray-800 group-hover/item:text-orange-600 transition-colors duration-500">
                        {Math.round(weather.main.temp)}
                      </span>
                      <span className="text-xl font-bold text-gray-600">
                        °C
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      Temperatura
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
                </div>

                <div className="group/item flex items-center gap-4 p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 hover:border-white/40 transition-all duration-500">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-500">
                    <span className="text-white text-xl font-bold">💨</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-gray-800 group-hover/item:text-cyan-600 transition-colors duration-500">
                        {weather.wind.speed}
                      </span>
                      <span className="text-lg font-bold text-gray-600">
                        m/s
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Viento</p>
                  </div>

                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover/item:opacity-70 transition-opacity duration-500">
                    <div className="flex gap-1">
                      <div className="w-1 h-5 bg-cyan-400 rounded animate-pulse"></div>
                      <div
                        className="w-1 h-4 bg-cyan-400 rounded animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-1 h-3 bg-cyan-400 rounded animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
                </div>

                <div className="group/item flex items-center gap-4 p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 hover:border-white/40 transition-all duration-500">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform duration-500">
                    <span className="text-white text-xl font-bold">☁️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-800 capitalize group-hover/item:text-purple-600 transition-colors duration-500 leading-relaxed">
                      {weather.weather[0].description}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      Descripción
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
                </div>
              </div>

              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>

              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-t-full opacity-60 group-hover:opacity-100 group-hover:w-28 transition-all duration-700"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default WeatherPage;
