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
          <div className="absolute top-4 left-4 bg-white/80 p-3 rounded-lg text-sm shadow-lg">
            <h2 className="font-bold">{weather.name}</h2>
            <p>🌡️ {Math.round(weather.main.temp)}°C</p>
            <p>💨 {weather.wind.speed} m/s</p>
            <p>☁️ {weather.weather[0].description}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default WeatherPage;
