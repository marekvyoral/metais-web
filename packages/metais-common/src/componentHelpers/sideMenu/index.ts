import { NavigationItem, RouteNames } from '@isdd/metais-common/navigation/routeNames'

export const decideIfPartOfUrlEqualsNavItemPath = (locationPathname: string, navItemPath: string) => {
    const slash = '/'
    const splitLocationPath = locationPathname.split(slash)
    const splitNavItemPath = navItemPath.split(slash)

    const arr = []
    for (let i = 0; i < splitLocationPath.length; i++) {
        if (splitNavItemPath[i] === splitLocationPath[i]) {
            arr.push(splitLocationPath[i])
        }
    }

    if (arr.join(slash) === navItemPath) {
        return true
    }

    return false
}

export type FoundNavItem = {
    path: string
    index: number
}

export const findDefaultOpenedNavItems = (
    menuItems: NavigationItem[],
    targetPath: string,
    currentItem: FoundNavItem[] = [],
): FoundNavItem[] | null => {
    if (location.pathname == RouteNames.HOME) return null
    for (let i = 0; i < menuItems.length; i++) {
        const currentPath = [...currentItem, { path: menuItems[i].path, index: i }]

        if (decideIfPartOfUrlEqualsNavItemPath(targetPath, menuItems[i].path)) {
            return currentPath
        }
        if (menuItems[i].subItems && menuItems[i].subItems?.length != 0) {
            const subIndex = findDefaultOpenedNavItems(menuItems[i].subItems ?? [], targetPath, currentPath)
            if (subIndex) {
                return subIndex
            }
        }
    }
    return null
}
