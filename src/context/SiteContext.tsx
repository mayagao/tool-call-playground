"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { GlobalDisplaySettings } from "@/types/tool-calls";

// Default global settings
const defaultGlobalSettings: GlobalDisplaySettings = {
  maxContentHeight: 200,
};

interface SiteContextType {
  globalSettings: GlobalDisplaySettings;
  updateGlobalSettings: (settings: GlobalDisplaySettings) => void;
}

// Create the context with default values
const SiteContext = createContext<SiteContextType>({
  globalSettings: defaultGlobalSettings,
  updateGlobalSettings: () => {},
});

// Provider component
export function SiteContextProvider({ children }: { children: ReactNode }) {
  const [globalSettings, setGlobalSettings] = useState<GlobalDisplaySettings>(
    defaultGlobalSettings
  );

  // Update settings
  const updateGlobalSettings = (settings: GlobalDisplaySettings) => {
    setGlobalSettings(settings);
  };

  // Context value
  const contextValue = {
    globalSettings,
    updateGlobalSettings,
  };

  return (
    <SiteContext.Provider value={contextValue}>{children}</SiteContext.Provider>
  );
}

// Custom hook to use the context
export function useSiteContext() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error("useSiteContext must be used within a SiteContextProvider");
  }
  return context;
}
