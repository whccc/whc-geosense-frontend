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
    <div className="relative w-full h-screen p-[20px]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          GeoSenseWhc: Mapa del Clima
        </h1>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Buscar ciudad..."
          className="border p-2 rounded-lg mb-4 mr-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCitySearch();
            }
          }}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-lg mb-4"
          onClick={handleCitySearch}
        >
          Buscar
        </button>
        <button
          className="bg-green-500 text-white p-2 rounded-lg mb-4 ml-4"
          onClick={() => {
            setResetMap(!resetMap);
            setCity("");
          }}
        >
          Reiniciar
        </button>
      </div>

      <div className="relative w-full h-screen">
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
