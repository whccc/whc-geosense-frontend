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
      style:
        "https://api.maptiler.com/maps/basic-v2/style.json?key=8n2Bj9Ce31tXtX8wPUnA",
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
    <div className="relative w-full h-[calc(100vh-150px)] rounded-lg overflow-hidden shadow-lg">
      <SpaceBackground />
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-4 left-0 right-0 p-3 z-10">
        <div className="bg-black p-3 rounded-lg shadow-lg max-w-md mx-auto">
          <h3 className="font-bold mb-2 text-center text-white">
            Capas Climáticas
          </h3>
          <div className="flex justify-center items-center">
            <button
              className={`mb-2 px-3 py-1 rounded-lg text-left bg-white text-black mr-2 cursor-pointer`}
              onClick={togglePrecipitationLayer}
            >
              Precipitación
            </button>
            <button
              className={`mb-2 px-3 py-1 rounded-lg text-left bg-white text-black mr-2 cursor-pointer`}
              onClick={toggleWindLayer}
            >
              Viento
            </button>
            <button
              className={`mb-2 px-3 py-1 rounded-lg text-left bg-white text-black mr-2 cursor-pointer`}
              onClick={toggleTemperatureLayer}
            >
              Temperatura
            </button>
            <button
              className={`mb-2 px-3 py-1 rounded-lg text-left bg-white text-black mr-2 cursor-pointer`}
              onClick={toggleRadarLayer}
            >
              Radar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherComponent;
