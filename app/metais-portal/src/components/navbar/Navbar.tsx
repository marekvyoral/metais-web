import React, { useState } from 'react'

import { NavBarHeader } from './navbar-header/NavBarHeader'
import { NavBarMain } from './navbar-main/NavBarMain'
import { NavMenu } from './navmenu/NavMenu'

export const Navbar: React.FC = () => {
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

                    <NavMenu isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded} />
                </div>
            </header>
        </>
    )
}
