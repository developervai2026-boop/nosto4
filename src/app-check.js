import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { app } from "./firebase-init.js";

export function setupAppCheck() {
  const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  
  if (!recaptchaKey) {
    console.warn("⚠️ reCAPTCHA site key not found. App Check disabled.");
    return;
  }
  
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(recaptchaKey),
    isTokenAutoRefreshEnabled: true
  });
  
  console.log("✅ App Check initialized with reCAPTCHA v3");
}
