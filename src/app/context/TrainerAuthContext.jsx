"use client";

import { createContext, useContext, useEffect, useState } from "react";

const TrainerAuthContext = createContext();

export function TrainerAuthProvider({ children }) {

    const [trainer, setTrainer] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const storedTrainer = localStorage.getItem("trainer");
        const storedToken = localStorage.getItem("token");

        if (storedTrainer && storedToken) {
            setTrainer(JSON.parse(storedTrainer));
            setAccessToken(storedToken);
        }

        setLoading(false);

    }, []);

    const login = (trainerData, token) => {

        localStorage.setItem("trainer", JSON.stringify(trainerData));
        localStorage.setItem("token", token);

        setTrainer(trainerData);
        setAccessToken(token);

    };

    const logout = () => {

        localStorage.removeItem("trainer");
        localStorage.removeItem("token");

        setTrainer(null);
        setAccessToken(null);

    };

    return (
        <TrainerAuthContext.Provider
            value={{
                trainer,
                accessToken,
                loading,
                login,
                logout,
                setTrainer,
                setAccessToken,
                isAuthenticated: !!trainer,
            }}
        >
            {children}
        </TrainerAuthContext.Provider>
    );
}

export const useTrainerAuth = () => useContext(TrainerAuthContext);