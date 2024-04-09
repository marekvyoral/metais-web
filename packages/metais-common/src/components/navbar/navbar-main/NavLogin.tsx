import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce'

import { NavProfile } from './NavProfile'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

type NavLoginProps = {
    isLoginApp?: boolean
}

export const NavLogin: React.FC<NavLoginProps> = () => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const { login } = useContext<IAuthContext>(AuthContext)
    return (
        <div className="idsk-header-web__main--login">
            {!user && (
                <button onClick={() => login()} type="button" className="idsk-button idsk-header-web__main--login-loginbtn" data-module="idsk-button">
                    {t('navbar.login')}
                </button>
            )}

            <NavProfile />
        </div>
    )
}
