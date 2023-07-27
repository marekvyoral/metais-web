import { useEffect } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'

export const useCurrentTab = <T extends NavigationSubRoutes | RouteNames>(
    navItems: T[] | T[],
    setActiveTab: (value: React.SetStateAction<T | undefined>) => void,
) => {
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
