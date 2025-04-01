import {useState, createContext, ReactNode} from "react";
import { Settings } from "../types/types";

type AuthContextType = { settings?: Settings | undefined, setSettings?: React.Dispatch<React.SetStateAction<Settings | undefined>> };


export const AuthContext = createContext<AuthContextType>({});

export const AuthContextProvider = ({children}: {children: ReactNode}) => {
    
    const [settings, setSettings] = useState<Settings>();
    
    const Provider = AuthContext.Provider;

    return (
        <Provider value={{settings: settings, setSettings: setSettings }}>
            {children}
        </ Provider>
    )
}