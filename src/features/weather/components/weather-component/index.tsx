import { useEffect, useRef, useState } from "react";
import { Map } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import {
  PrecipitationLayer,
  RadarLayer,
  TemperatureLayer,
  WindLayer,
} from "@maptiler/weather";
import SpaceBackground from "../space";

interface WeatherMapProps {
  coords: Array<number>;
  resetMap: boolean;
}
const WeatherComponent = ({ coords, resetMap }: WeatherMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const layerRefs = useRef<{
    precipitation?: PrecipitationLayer;
    wind?: WindLayer;
    temperature?: TemperatureLayer;
    radar?: RadarLayer;
  }>({});

  const [layersState, setLayersState] = useState({
    precipitation: false,
    wind: false,
    temperature: false,
    radar: false,
  });
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;

  useEffect(() => {
    if (resetMap) {
      if (!mapRef.current) return;
      mapRef.current.flyTo({
        center: [-60, -10],
        zoom: 3,
        speed: 1.5,
      });
    }
  }, [resetMap]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [coords[1], coords[0]],
      zoom: 12,
      speed: 1.5,
    });
  }, [coords]);

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new Map({
      container: mapContainer.current,
      center: [coords[1], coords[0]],
      zoom: 3,
      apiKey: MAPTILER_KEY,
      projection: "globe",
      fullscreenControl: true,
    });
    mapRef.current = map;
    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    setTimeout(() => {
      toggleRadarLayer();
    }, 1000);
  }, [mapRef]);

  const togglePrecipitationLayer = () => {
    const map = mapRef.current;
    if (!map) return;
    const { precipitation } = layerRefs.current;
    if (!precipitation) {
      const precipitationLayer = new PrecipitationLayer({
        opacity: 0.7,
      });
      layerRefs.current.precipitation = precipitationLayer;
      setLayersStateProp({ precipitation: true });
      precipitationLayer.animateByFactor(1000);
      map.addLayer(precipitationLayer);
    }
    removeAllLayers();
  };
  const toggleWindLayer = () => {
    const map = mapRef.current;
    if (!map) return;
    const { wind } = layerRefs.current;

    if (!wind) {
      const windLayer = new WindLayer({
        opacity: 0.7,
      });
      layerRefs.current.wind = windLayer;
      map.addLayer(windLayer);
      windLayer.animateByFactor(1000);
      setLayersStateProp({ wind: true });
    }
    removeAllLayers();
  };
  const toggleTemperatureLayer = () => {
    const map = mapRef.current;
    if (!map) return;
    const { temperature } = layerRefs.current;
    if (!temperature) {
      const temperatureLayer = new TemperatureLayer({
        opacity: 0.7,
      });
      layerRefs.current.temperature = temperatureLayer;
      setLayersStateProp({ temperature: true });
      map.addLayer(temperatureLayer);
    }
    removeAllLayers();
  };
  const toggleRadarLayer = () => {
    const map = mapRef.current;
    if (!map) return;
    const { radar } = layerRefs.current;
    if (!radar) {
      const radarLayer = new RadarLayer({
        opacity: 0.7,
      });
      layerRefs.current.radar = radarLayer;
      setLayersStateProp({ radar: true });
      radarLayer.animateByFactor(1000);
      map.addLayer(radarLayer);
    }
    removeAllLayers();
  };

  const removeAllLayers = () => {
    const map = mapRef.current;
    if (!map) return;
    const { precipitation, wind, temperature, radar } = layerRefs.current;
    const {
      precipitation: precipitationState,
      wind: windState,
      temperature: temperatureState,
      radar: radarState,
    } = layersState;
    if (precipitation && precipitationState) {
      map.removeLayer(precipitation.id);
      delete layerRefs.current.precipitation;
      setLayersStateProp({ precipitation: false });
    }
    if (wind && windState) {
      map.removeLayer(wind.id);
      delete layerRefs.current.wind;
      setLayersStateProp({ wind: false });
    }
    if (temperature && temperatureState) {
      map.removeLayer(temperature.id);
      delete layerRefs.current.temperature;
      setLayersStateProp({ temperature: false });
    }
    if (radar && radarState) {
      map.removeLayer(radar.id);
      delete layerRefs.current.radar;
      setLayersStateProp({ radar: false });
    }
  };
  const setLayersStateProp = (newState: any) => {
    setLayersState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };
  return (
    <div className="relative w-full h-[calc(100vh-304px)] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full">
        <SpaceBackground />
        <div className="absolute top-4 left-0 right-0 p-3 z-10">
          <div className="bg-black rounded-lg shadow-lg max-w-md mx-auto overflow-hidden">
            <div className="p-3 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Capas Climáticas</h3>
              <button
                onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                className="text-white hover:text-blue-400 transition-colors duration-200 p-1 rounded hover:bg-gray-800"
                aria-label={
                  isPanelExpanded ? "Contraer panel" : "Expandir panel"
                }
              >
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isPanelExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            <div
              className={`transition-all duration-300 ease-in-out ${
                isPanelExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="px-3 pb-3">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                  <button
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      layersState.precipitation
                        ? "bg-blue-500 text-white shadow-lg scale-105"
                        : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                    } border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                    onClick={togglePrecipitationLayer}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">🌧️</span>
                      <span className="text-xs lg:text-sm">Precipitación</span>
                    </div>
                  </button>
                  <button
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      layersState.wind
                        ? "bg-green-500 text-white shadow-lg scale-105"
                        : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 hover:shadow-md"
                    } border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
                    onClick={toggleWindLayer}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">💨</span>
                      <span className="text-xs lg:text-sm">Viento</span>
                    </div>
                  </button>
                  <button
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      layersState.temperature
                        ? "bg-red-500 text-white shadow-lg scale-105"
                        : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-md"
                    } border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50`}
                    onClick={toggleTemperatureLayer}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">🌡️</span>
                      <span className="text-xs lg:text-sm">Temperatura</span>
                    </div>
                  </button>
                  <button
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      layersState.radar
                        ? "bg-purple-500 text-white shadow-lg scale-105"
                        : "bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:shadow-md"
                    } border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
                    onClick={toggleRadarLayer}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">📡</span>
                      <span className="text-xs lg:text-sm">Radar</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherComponent;
