import {useState, createContext, ReactNode, useEffect} from "react";
import { Settings } from "../types/types";
import { handleGetSettings } from "../api";

export type AuthContextType = { settings?: Settings | undefined, setSettings?: React.Dispatch<React.SetStateAction<Settings | undefined>> };


export const AuthContext = createContext<AuthContextType>({});

export const AuthContextProvider = ({children}: {children: ReactNode}) => {
    
    const [settings, setSettings] = useState<Settings>();
    
    const Provider = AuthContext.Provider;

    useEffect(() => {
        const fetchSettings = async () => {
            const data = await handleGetSettings();
            if (data) {
                setSettings(data);
            }
        }
        fetchSettings();
    }, [])


    return (
        <Provider value={{settings: settings, setSettings: setSettings }}>
            {children}
        </ Provider>
    )
}