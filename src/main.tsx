
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";
import { PublicClipView } from "./components/public/PublicClipView";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/clip/:clipId" element={<PublicClipView />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </HelmetProvider>
);
