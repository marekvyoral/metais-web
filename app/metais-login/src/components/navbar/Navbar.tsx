import { NavBarHeader } from '@isdd/metais-common/components/navbar/navbar-header/NavBarHeader'
import { NavBarMain } from '@isdd/metais-common/components/navbar/navbar-main/NavBarMain'
import { NavMenu } from '@isdd/metais-common/components/navbar/navmenu/NavMenu'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getLoginNavigationItems } from './navigationItems'

export const Navbar: React.FC = () => {
    const { t } = useTranslation()

    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false)
    const [showDropDown, setShowDropDown] = useState<boolean>(false)
    const ksisvsId = 'c552bc9b-3375-4040-b5a0-2da3cd832764'

    return (
        <>
            <header className="idsk-header-web " data-module="idsk-header-web">
                <div className="idsk-header-web__scrolling-wrapper">
                    <div className="idsk-header-web__tricolor" />

                    <NavBarHeader setShowDropDown={setShowDropDown} showDropDown={showDropDown} />

                    <NavBarMain isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded} isLoginApp />

                    <div className="idsk-header-web__nav--divider" />

                    <NavMenu isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded} navItems={getLoginNavigationItems(t, ksisvsId)} />
                </div>
            </header>
        </>
    )
}
