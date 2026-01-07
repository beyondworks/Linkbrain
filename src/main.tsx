import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { initializeNativePlugins, isNative } from "./lib/capacitor";
import "./index.css";

initializeNativePlugins();

const Router = isNative ? HashRouter : BrowserRouter;

const loadApp = async () => {
  try {
    const { default: App } = await import("./App.tsx");
    const { PublicClipView } = await import("./components/public/PublicClipView");
    const { PaymentSuccess } = await import("./components/payment/PaymentSuccess");
    const { PaymentFail } = await import("./components/payment/PaymentFail");

    createRoot(document.getElementById("root")!).render(
      <HelmetProvider>
        <Router>
          <Routes>
            <Route path="/clip/:clipId" element={<PublicClipView />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/fail" element={<PaymentFail />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </Router>
      </HelmetProvider>
    );
  } catch (error) {
    console.error('[App] Load error:', error);
    const el = document.getElementById('app-error');
    const msgEl = document.getElementById('error-message');
    if (el && msgEl) {
      el.style.display = 'block';
      msgEl.textContent = 'App Load Error:\n\n' + (error instanceof Error ? error.stack || error.message : String(error));
    }
  }
};

loadApp();
