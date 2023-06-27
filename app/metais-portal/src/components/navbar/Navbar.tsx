import React, { useState } from 'react'

import { NavBarHeader } from './navbar-header/NavBarHeader'
import { NavBarMain } from './navbar-main/NavBarMain'
import { NavMenu } from './navmenu/NavMenu'

import { AuthActions, useAuth } from '@/contexts/auth/authContext'

export const Navbar: React.FC = () => {
    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false)
    const [showDropDown, setShowDropDown] = useState<boolean>(false)
    const {
        state: { accessToken },
        dispatch,
    } = useAuth()

    const handleLogout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault()
        dispatch({ type: AuthActions.LOGOUT })
    }

    return (
        <>
            <header className="idsk-header-web " data-module="idsk-header-web">
                <div className="idsk-header-web__scrolling-wrapper">
                    <div className="idsk-header-web__tricolor" />

                    <NavBarHeader setShowDropDown={setShowDropDown} showDropDown={showDropDown} />

                    <NavBarMain
                        handleLogout={handleLogout}
                        loggedIn={!!accessToken}
                        isMenuExpanded={isMenuExpanded}
                        setIsMenuExpanded={setIsMenuExpanded}
                    />

                    <div className="idsk-header-web__nav--divider" />

                    <NavMenu
                        isMenuExpanded={isMenuExpanded}
                        loggedIn={!!accessToken}
                        setIsMenuExpanded={setIsMenuExpanded}
                        handleLogout={handleLogout}
                    />
                </div>
            </header>
        </>
    )
}
