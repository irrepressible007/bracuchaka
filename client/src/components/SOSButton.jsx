import React from 'react';
import axios from 'axios';

import { API_URL } from '../config';

const SOSButton = () => {
    const handleSOS = async () => {
        if (!window.confirm("ARE YOU SURE YOU WANT TO TRIGGER AN SOS ALERT?")) return;

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const locationString = `${latitude}, ${longitude}`;
                sendSOS(locationString);
            }, (error) => {
                console.error("Geolocation error:", error);
                sendSOS("Unknown Location (GPS Error)");
            });
        } else {
            sendSOS("Unknown Location (No GPS Support)");
        }
    };

    const sendSOS = async (location) => {
        try {
            await axios.post(`${API_URL}/emergency/sos`, { location });
            alert("SOS ALERT SENT! Campus Security has been notified.");
        } catch (err) {
            console.error(err);
            alert("FAILED TO SEND SOS! Please call security directly.");
        }
    };

    return (
        <button
            onClick={handleSOS}
            className="fixed bottom-8 right-8 bg-red-600 text-white font-bold py-4 px-6 rounded-full shadow-lg hover:bg-red-700 animate-pulse border-4 border-red-400 z-50 flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            SOS EMERGENCY
        </button>
    );
};

export default SOSButton;
