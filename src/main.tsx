import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import WeatherPage from "./features/weather/pages/weather-page";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MapDeliveryPage from "./features/weather/pages/map-delivery-page";
import Layout from "./features/layout/page";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <WeatherPage />
            </Layout>
          }
        />
        <Route
          path="/map-delivery"
          element={
            <Layout>
              <MapDeliveryPage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
