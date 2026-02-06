"use client";

import { useLocalStorage } from "./useLocalStorage";
import { useState, useEffect } from "react";

export interface Trip {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    themeColor: string; // hex code
    destinations: string[];
}

// Wrapper for useLocalStorage that namespaces keys based on currentTripId
export function useTripStorage<T>(key: string, initialValue: T) {
    const [currentTripId] = useLocalStorage<string | null>("current-trip-id", null);

    // If no trip is selected, we technically shouldn't be reading data, 
    // but to be safe we can fallback to a "global" or "default" namespace or just wait.
    // However, hooks can't easily wait. 
    // We will use a key that changes when currentTripId changes.

    const namespacedKey = currentTripId ? `trip_${currentTripId}_${key}` : `global_${key}`;

    return useLocalStorage<T>(namespacedKey, initialValue);
}

// Hook to manage the trips list itself
export function useTrips() {
    const [trips, setTrips] = useLocalStorage<Trip[]>("all-trips", []);
    const [currentTripId, setCurrentTripId] = useLocalStorage<string | null>("current-trip-id", null);

    const addTrip = (trip: Omit<Trip, "id">) => {
        const newTrip = { ...trip, id: Date.now().toString() };
        setTrips([...trips, newTrip]);
        return newTrip.id;
    };

    const updateTrip = (id: string, updates: Partial<Trip>) => {
        setTrips(trips.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const deleteTrip = (id: string) => {
        setTrips(trips.filter(t => t.id !== id));
        if (currentTripId === id) {
            setCurrentTripId(null);
        }
        // distinct from deleting the data keys, but for localStorage checking this is fine for now.
    };

    const selectTrip = (id: string) => {
        setCurrentTripId(id);
    };

    const getCurrentTrip = () => trips.find(t => t.id === currentTripId);

    return {
        trips,
        currentTripId,
        addTrip,
        updateTrip,
        deleteTrip,
        selectTrip,
        getCurrentTrip
    };
}
