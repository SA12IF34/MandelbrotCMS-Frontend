import {useState, createContext, ReactNode} from 'react';


type PopupContextType = {
    showPopup: boolean,
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>,
    popup: 'profile' | 'settings' | undefined,
    setPopup: React.Dispatch<React.SetStateAction<'profile' | 'settings' | undefined>>
}

export const PopupContext = createContext<PopupContextType | Record<string, never>>({});


export const ContextProvider = ({children}: {children: ReactNode}) => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popup, setPopup] = useState<'profile' | 'settings'>();

    const Provider = PopupContext.Provider;

    return (
        <Provider value={{showPopup, setShowPopup, popup, setPopup}}>
            {children}
        </Provider>
    )
}