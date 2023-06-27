import React, { useEffect, useState } from 'react'

import { NavMenu } from './navmenu/NavMenu'
import { NavBarHeader } from './navbar-header/NavBarHeader'
import { NavBarMain } from './navbar-main/NavBarMain'

import { AuthActions, useAuth } from '@/contexts/auth/authContext'

export const Navbar: React.FC = () => {
    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false)
    const [showDropDown, setShowDropDown] = useState<boolean>(false)
    const {
        state: { accessToken },
        dispatch,
    } = useAuth()
    const [loggedIn, setLoggedIn] = useState<boolean>(!!accessToken)

    const handleLogout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault()
        setLoggedIn(false)
        dispatch({ type: AuthActions.LOGOUT })
    }
    useEffect(() => {
        setLoggedIn(!!accessToken)
    }, [accessToken])

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
