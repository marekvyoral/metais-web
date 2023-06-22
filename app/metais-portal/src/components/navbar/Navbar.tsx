import React, { useState } from 'react'

import { NavMenu } from './navmenu/NavMenu'
import { NavBarHeader } from './navbar-header/NavBarHeader'
import { NavBarMain } from './navbar-main/NavBarMain'

export const Navbar: React.FC = () => {
    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false)
    const [showDropDown, setShowDropDown] = useState<boolean>(false)

    const [loggedIn, setLoggedIn] = useState<boolean>(false)

    const handleLogout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault()
        setLoggedIn(false)
    }

    return (
        <>
            <header className="idsk-header-web " data-module="idsk-header-web">
                <div className="idsk-header-web__scrolling-wrapper">
                    <div className="idsk-header-web__tricolor" />

                    <NavBarHeader setShowDropDown={setShowDropDown} showDropDown={showDropDown} />

                    <NavBarMain
                        handleLogout={handleLogout}
                        setLoggedIn={setLoggedIn}
                        loggedIn={loggedIn}
                        isMenuExpanded={isMenuExpanded}
                        setIsMenuExpanded={setIsMenuExpanded}
                    />

                    <div className="idsk-header-web__nav--divider" />

                    <NavMenu
                        isMenuExpanded={isMenuExpanded}
                        loggedIn={loggedIn}
                        setLoggedIn={setLoggedIn}
                        setIsMenuExpanded={setIsMenuExpanded}
                        handleLogout={handleLogout}
                    />
                </div>
            </header>
        </>
    )
}
