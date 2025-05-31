import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import "./i18n";  // <-- add this import

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
console.log("Google Client ID:", googleClientId);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <HashRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HashRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
