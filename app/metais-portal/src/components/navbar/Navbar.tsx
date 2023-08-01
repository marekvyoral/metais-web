import React, { useState } from 'react'
import { NavBarHeader } from '@isdd/metais-common/components/navbar/navbar-header/NavBarHeader'
import { NavBarMain } from '@isdd/metais-common/components/navbar/navbar-main/NavBarMain'
import { NavMenu } from '@isdd/metais-common/components/navbar/navmenu/NavMenu'
import { useTranslation } from 'react-i18next'

import { getPortalNavitagionItems } from './navigationItems'

export const Navbar: React.FC = () => {
    const { t } = useTranslation()
    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false)
    const [showDropDown, setShowDropDown] = useState<boolean>(false)

    return (
        <>
            <header className="idsk-header-web " data-module="idsk-header-web">
                <div className="idsk-header-web__scrolling-wrapper">
                    <div className="idsk-header-web__tricolor" />

                    <NavBarHeader setShowDropDown={setShowDropDown} showDropDown={showDropDown} />

                    <NavBarMain isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded} />

                    <div className="idsk-header-web__nav--divider" />

                    <NavMenu isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded} navItems={getPortalNavitagionItems(t)} />
                </div>
            </header>
        </>
    )
}
