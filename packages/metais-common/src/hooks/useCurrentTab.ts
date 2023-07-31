import { useEffect } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

export const useCurrentTab = (navItems: string[], setActiveTab: (value: string | undefined) => void) => {
    const location = useLocation()
    useEffect(() => {
        const currentTab = navItems.find((tab) => {
            const match = matchPath(
                {
                    path: tab,
                    caseSensitive: false,
                    end: false,
                },
                location.pathname,
            )
            return match
        })

        setActiveTab(currentTab)
    }, [location.pathname, navItems, setActiveTab])
}
