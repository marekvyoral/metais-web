import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface IActionSuccess {
    value: boolean
    path: string
    scrolled?: boolean
    additionalInfo?: {
        [key: string]: string
    }
}

const DEFAULT_STATE: IActionSuccess = { value: false, path: '', scrolled: false }

const ActionSuccess = createContext<{
    isActionSuccess: IActionSuccess
    setIsActionSuccess: Dispatch<SetStateAction<IActionSuccess>>
    clearAction: () => void
    setScrolled: () => void
}>({
    isActionSuccess: DEFAULT_STATE,
    setIsActionSuccess: () => null,
    clearAction: () => null,
    setScrolled: () => null,
})

const ActionSuccessProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [isActionSuccess, setIsActionSuccess] = useState<IActionSuccess>(DEFAULT_STATE)

    const location = useLocation()

    useEffect(() => {
        if (location.pathname !== isActionSuccess.path && isActionSuccess.value) {
            setIsActionSuccess(DEFAULT_STATE)
        }
    }, [isActionSuccess.value, isActionSuccess.path, location.pathname])

    return (
        <ActionSuccess.Provider
            value={{
                isActionSuccess,
                setIsActionSuccess,
                setScrolled: () => setIsActionSuccess((prev) => ({ ...prev, scrolled: true })),
                clearAction: () => {
                    setIsActionSuccess(DEFAULT_STATE)
                },
            }}
        >
            {children}
        </ActionSuccess.Provider>
    )
}

const useActionSuccess = () => useContext(ActionSuccess)

export { useActionSuccess, ActionSuccessProvider }
