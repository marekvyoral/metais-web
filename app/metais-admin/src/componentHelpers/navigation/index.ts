import { NavigationItem } from '@isdd/metais-common/navigation/routeNames'

export const getPermittedRoutesForUser = (routes: NavigationItem[], userRoles: string[]): NavigationItem[] => {
    return routes.reduce((filteredRoutes: NavigationItem[], route) => {
        if (route.role?.some((role) => userRoles.includes(role))) {
            const filteredRoute: NavigationItem = { ...route }

            if (filteredRoute.subItems) {
                filteredRoute.subItems = getPermittedRoutesForUser(filteredRoute.subItems, userRoles)
            }

            filteredRoutes.push(filteredRoute)
        }

        return filteredRoutes
    }, [])
}
