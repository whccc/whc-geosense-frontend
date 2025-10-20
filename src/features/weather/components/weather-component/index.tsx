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
    <div className="relative w-full h-[calc(100vh)] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-blue-900/10 to-purple-900/20 backdrop-blur-sm z-0"></div>

      <div ref={mapContainer} className="w-full h-full relative">
        <SpaceBackground />
        <div className="absolute top-6 left-0 right-0 p-4 z-10">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 max-w-xl mx-auto overflow-hidden group hover:shadow-3xl transition-all duration-700">
            <div className="p-5 flex items-center justify-between bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-cyan-500/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/10 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                  <span className="text-white text-xl">🌤️</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    Control de Capas
                  </h3>
                  <p className="text-blue-600 text-sm font-medium">
                    Visualización meteorológica
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                className="group/toggle relative p-3 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-110 hover:rotate-3 shadow-lg hover:shadow-xl"
                aria-label={
                  isPanelExpanded ? "Contraer panel" : "Expandir panel"
                }
              >
                <svg
                  className={`w-6 h-6 text-gray-700 transition-all duration-500 ${
                    isPanelExpanded ? "rotate-180" : ""
                  } group-hover/toggle:text-blue-600`}
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
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover/toggle:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            <div
              className={`transition-all duration-700 ease-out ${
                isPanelExpanded
                  ? "max-h-64 opacity-100 transform translate-y-0"
                  : "max-h-0 opacity-0 transform -translate-y-4"
              } overflow-hidden`}
            >
              <div className="p-6 bg-gradient-to-b from-white/5 to-blue-50/20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    className={`group/btn relative p-4 rounded-2xl font-semibold transition-all duration-500 hover:scale-105 transform-gpu overflow-hidden ${
                      layersState.precipitation
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl shadow-blue-500/40 scale-105 border-2 border-blue-300/50"
                        : "bg-white/95 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl border border-white/40 hover:border-blue-300/50"
                    }`}
                    onClick={togglePrecipitationLayer}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>

                    <div className="flex flex-col items-center gap-3 relative z-10">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          layersState.precipitation
                            ? "bg-white/20 shadow-lg"
                            : "bg-blue-100 group-hover/btn:bg-blue-200"
                        }`}
                      >
                        <span className="text-2xl">🌧️</span>
                      </div>
                      <span className="text-sm font-bold">Precipitación</span>
                      {layersState.precipitation && (
                        <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full bg-white animate-shimmer bg-[length:200%_100%] rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    className={`group/btn relative p-4 rounded-2xl font-semibold transition-all duration-500 hover:scale-105 transform-gpu overflow-hidden ${
                      layersState.wind
                        ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-2xl shadow-emerald-500/40 scale-105 border-2 border-emerald-300/50"
                        : "bg-white/95 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl border border-white/40 hover:border-emerald-300/50"
                    }`}
                    onClick={toggleWindLayer}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>

                    <div className="flex flex-col items-center gap-3 relative z-10">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          layersState.wind
                            ? "bg-white/20 shadow-lg"
                            : "bg-emerald-100 group-hover/btn:bg-emerald-200"
                        }`}
                      >
                        <span className="text-2xl">💨</span>
                      </div>
                      <span className="text-sm font-bold">Viento</span>
                      {layersState.wind && (
                        <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full bg-white animate-shimmer bg-[length:200%_100%] rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                  <button
                    className={`group/btn relative p-4 rounded-2xl font-semibold transition-all duration-500 hover:scale-105 transform-gpu overflow-hidden ${
                      layersState.temperature
                        ? "bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-2xl shadow-red-500/40 scale-105 border-2 border-red-300/50"
                        : "bg-white/95 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl border border-white/40 hover:border-red-300/50"
                    }`}
                    onClick={toggleTemperatureLayer}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>

                    <div className="flex flex-col items-center gap-3 relative z-10">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          layersState.temperature
                            ? "bg-white/20 shadow-lg"
                            : "bg-red-100 group-hover/btn:bg-red-200"
                        }`}
                      >
                        <span className="text-2xl">🌡️</span>
                      </div>
                      <span className="text-sm font-bold">Temperatura</span>
                      {layersState.temperature && (
                        <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full bg-white animate-shimmer bg-[length:200%_100%] rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    className={`group/btn relative p-4 rounded-2xl font-semibold transition-all duration-500 hover:scale-105 transform-gpu overflow-hidden ${
                      layersState.radar
                        ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-2xl shadow-purple-500/40 scale-105 border-2 border-purple-300/50"
                        : "bg-white/95 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl border border-white/40 hover:border-purple-300/50"
                    }`}
                    onClick={toggleRadarLayer}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>

                    <div className="flex flex-col items-center gap-3 relative z-10">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          layersState.radar
                            ? "bg-white/20 shadow-lg"
                            : "bg-purple-100 group-hover/btn:bg-purple-200"
                        }`}
                      >
                        <span className="text-2xl">📡</span>
                      </div>
                      <span className="text-sm font-bold">Radar</span>
                      {layersState.radar && (
                        <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full bg-white animate-shimmer bg-[length:200%_100%] rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2 bg-blue-50 rounded-full px-3 py-1.5">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-medium">
                        Haz clic para activar/desactivar capas
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-center gap-2">
                    {Object.entries(layersState).map(([key, isActive]) => (
                      <div
                        key={key}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          isActive
                            ? "bg-green-400 shadow-lg shadow-green-400/50 animate-pulse"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    ))}
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
