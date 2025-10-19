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
          <div className="bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-black/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 max-w-lg mx-auto overflow-hidden">
            <div className="p-4 flex items-center justify-between bg-gradient-to-r from-blue-900/30 to-purple-900/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">🌤️</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Control de Capas</h3>
                  <p className="text-blue-200 text-xs">Visualización meteorológica</p>
                </div>
              </div>
              <button
                onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                className="group relative p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                aria-label={
                  isPanelExpanded ? "Contraer panel" : "Expandir panel"
                }
              >
                <svg
                  className={`w-5 h-5 text-white transition-all duration-300 ${
                    isPanelExpanded ? "rotate-180" : ""
                  } group-hover:text-blue-300`}
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
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </div>
            <div
              className={`transition-all duration-500 ease-out ${
                isPanelExpanded 
                  ? "max-h-48 opacity-100 transform translate-y-0" 
                  : "max-h-0 opacity-0 transform -translate-y-2"
              } overflow-hidden`}
            >
              <div className="p-4 bg-gradient-to-b from-transparent to-black/20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    className={`group relative p-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                      layersState.precipitation
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl shadow-blue-500/30 scale-105"
                        : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl border border-white/20"
                    }`}
                    onClick={togglePrecipitationLayer}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        layersState.precipitation ? "bg-white/20" : "bg-blue-100"
                      }`}>
                        <span className="text-xl">🌧️</span>
                      </div>
                      <span className="text-xs font-semibold">Precipitación</span>
                      {layersState.precipitation && (
                        <div className="w-full h-0.5 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full bg-white animate-shimmer bg-[length:200%_100%]"></div>
                        </div>
                      )}
                    </div>
                  </button>
                  <button
                    className={`group relative p-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                      layersState.wind
                        ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-2xl shadow-green-500/30 scale-105"
                        : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl border border-white/20"
                    }`}
                    onClick={toggleWindLayer}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        layersState.wind ? "bg-white/20" : "bg-green-100"
                      }`}>
                        <span className="text-xl">💨</span>
                      </div>
                      <span className="text-xs font-semibold">Viento</span>
                      {layersState.wind && (
                        <div className="w-full h-0.5 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full bg-white animate-shimmer bg-[length:200%_100%]"></div>
                        </div>
                      )}
                    </div>
                  </button>
                  <button
                    className={`group relative p-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                      layersState.temperature
                        ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-2xl shadow-red-500/30 scale-105"
                        : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl border border-white/20"
                    }`}
                    onClick={toggleTemperatureLayer}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        layersState.temperature ? "bg-white/20" : "bg-red-100"
                      }`}>
                        <span className="text-xl">🌡️</span>
                      </div>
                      <span className="text-xs font-semibold">Temperatura</span>
                      {layersState.temperature && (
                        <div className="w-full h-0.5 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full bg-white animate-shimmer bg-[length:200%_100%]"></div>
                        </div>
                      )}
                    </div>
                  </button>
                  <button
                    className={`group relative p-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                      layersState.radar
                        ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-2xl shadow-purple-500/30 scale-105"
                        : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl border border-white/20"
                    }`}
                    onClick={toggleRadarLayer}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        layersState.radar ? "bg-white/20" : "bg-purple-100"
                      }`}>
                        <span className="text-xl">📡</span>
                      </div>
                      <span className="text-xs font-semibold">Radar</span>
                      {layersState.radar && (
                        <div className="w-full h-0.5 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full bg-white animate-shimmer bg-[length:200%_100%]"></div>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-center gap-2 text-xs text-blue-200">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Haz clic para activar/desactivar capas</span>
                  </div>
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
