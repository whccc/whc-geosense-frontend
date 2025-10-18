import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import WeatherPage from "./features/weather/pages/weather-page";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WeatherPage />
  </StrictMode>
);
