import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { RouteNames, AdminRouteRoles, NavigationItem } from '@isdd/metais-common/navigation/routeNames'
import { useLocation, useNavigate } from 'react-router-dom'

const getCurrentRouteRoles = (locationPathname: string, adminRoutes: NavigationItem[]): AdminRouteRoles[] | undefined => {
    for (const item of adminRoutes) {
        if (item.path === locationPathname) {
            return item.role
        }
        if (item.subItems) {
            const role = getCurrentRouteRoles(locationPathname, item.subItems)
            if (role) {
                return role
            }
        }
    }
    return undefined
}

export const useAdminProtectedRoutes = (adminRoutes: NavigationItem[]) => {
    const location = useLocation()
    const navigate = useNavigate()
    const {
        state: { user },
    } = useAuth()

    const currentRoles = getCurrentRouteRoles(location.pathname, adminRoutes) ?? []
    const hasUserPermissionsToEnter = currentRoles?.some((role) => user?.roles.includes(role))
    if (location.pathname != RouteNames.HOME && currentRoles?.length > 0 && !hasUserPermissionsToEnter) {
        navigate(RouteNames.HOME)
        return
    }
    return
}
