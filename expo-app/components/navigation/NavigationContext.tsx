import React, { createContext, useState, ReactNode } from 'react';

interface Route {
  duration: string;
  distance: string;
  summary: string;
  polyline: string;
}

interface NavigationContextProps {
  destination: string;
  setDestination: React.Dispatch<React.SetStateAction<string>>;
  routes: Route[];
  setRoutes: React.Dispatch<React.SetStateAction<Route[]>>;
}

export const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [destination, setDestination] = useState<string>('');
  const [routes, setRoutes] = useState<Route[]>([]);

  return (
    <NavigationContext.Provider value={{ destination, setDestination, routes, setRoutes }}>
      {children}
    </NavigationContext.Provider>
  );
};
