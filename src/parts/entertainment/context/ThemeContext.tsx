import { useState, useEffect, createContext, ReactNode } from "react";

type Theme = 'light' | 'dark'

interface ContextType {
    theme?: Theme,
    handleSetTheme?: (theme: Theme) => void,
}

export const ThemeContext = createContext<ContextType>({});

export const ThemeContextProvider = ({children}: {children: ReactNode}) => {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const theme = localStorage.getItem('theme');

        if (theme) {
            setTheme(theme as Theme);
        }

    }, []);


    function handleSetTheme(theme: Theme) {
        localStorage.setItem('theme', theme);
        setTheme(theme);
    }

    const Provider = ThemeContext.Provider;

    return (
        <Provider value={{theme: theme, handleSetTheme: handleSetTheme}}>
            {children}
        </ Provider>
    )
}