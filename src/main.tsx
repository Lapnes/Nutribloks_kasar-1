import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { NutriProvider } from "@/context/NutriContext"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <NutriProvider>
        <App />
      </NutriProvider>
    </ThemeProvider>
  </StrictMode>
)
