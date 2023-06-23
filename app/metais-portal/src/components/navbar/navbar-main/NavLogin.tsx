import React, { SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { NavProfile } from './NavProfile'

interface INavLogin {
    loggedIn: boolean
    setLoggedIn: React.Dispatch<SetStateAction<boolean>>
    handleLogout: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

export const NavLogin: React.FC<INavLogin> = ({ loggedIn, setLoggedIn, handleLogout }) => {
    const { t } = useTranslation()

    return (
        <div className="idsk-header-web__main--login">
            {!loggedIn && (
                <button
                    onClick={() => setLoggedIn(true)}
                    type="button"
                    className="idsk-button idsk-header-web__main--login-loginbtn"
                    data-module="idsk-button"
                >
                    {t('navbar.login')}
                </button>
            )}

            <NavProfile loggedIn={loggedIn} handleLogout={handleLogout} />
        </div>
    )
}
