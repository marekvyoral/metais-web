import React, { SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { NavProfile } from './NavProfile'

import { useLogin } from '@/hooks/useLogin'
import { AuthActions, useAuth } from '@/contexts/auth/authContext'

interface INavLogin {
    loggedIn: boolean
    setLoggedIn: React.Dispatch<SetStateAction<boolean>>
    handleLogout: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

export const NavLogin: React.FC<INavLogin> = ({ loggedIn, setLoggedIn, handleLogout }) => {
    const { t } = useTranslation()
    const { mutateAuthorize } = useLogin()
    const {
        state: { accessToken, user },
        dispatch,
    } = useAuth()
    console.log(accessToken, user)

    return (
        <div className="idsk-header-web__main--login">
            {!accessToken && (
                <button
                    onClick={() => mutateAuthorize()}
                    type="button"
                    className="idsk-button idsk-header-web__main--login-loginbtn"
                    data-module="idsk-button"
                >
                    {t('navbar.login')}
                </button>
            )}

            <NavProfile loggedIn={!!accessToken} handleLogout={() => dispatch({ type: AuthActions.LOGOUT })} />
        </div>
    )
}
