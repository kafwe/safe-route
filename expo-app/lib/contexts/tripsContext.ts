// created a trips context to store the trips data
import { createContext, Dispatch, SetStateAction } from 'react';

export interface TripSummary {
    distance: number;
    power_outage_in_route: number;
    risk_score: number;
    total_crimes: number;
}

export interface TripData {
    destination: [number, number];
    distance: number;
    google_deeplink: string;
    polyline: string;
    source: [number, number];
    travelType: 'walk' | 'drive' | 'bike'; // Adjust the travel modes as necessary
    trip_summary: TripSummary;
    waypoints: [number, number][];
}

export interface TripsContextProps {
    trips: TripData[];
    setTrips: (trips: TripData[]) => void;
}

export const TripsContext = createContext<TripsContextProps>({
    trips: [] as TripData[],
    setTrips: (trips: TripData[]) => {},
});


