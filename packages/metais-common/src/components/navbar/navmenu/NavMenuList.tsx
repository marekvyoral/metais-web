import React from 'react'
import { useTranslation } from 'react-i18next'

import { NavMenuItem } from './NavMenuItem'

interface INavMenuList {
    activeTab: string | undefined
    setActiveTab: React.Dispatch<React.SetStateAction<string | undefined>>
    menuItems: {
        title: string
        path: string
        subItems?: {
            title: string
            path: string
        }[]
    }[]
}

export const NavMenuList: React.FC<INavMenuList> = ({ activeTab, setActiveTab, menuItems }) => {
    const { t } = useTranslation()

    return (
        <ul className="idsk-header-web__nav-list " aria-label={t('navMenu.mainNav')}>
            {menuItems?.map((menuItem) => {
                return (
                    <NavMenuItem
                        key={menuItem?.path}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        path={menuItem?.path}
                        title={menuItem?.title}
                        list={menuItem?.subItems ?? []}
                        navItems={menuItems}
                    />
                )
            })}
        </ul>
    )
}
