import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce'

import { NavProfile } from './NavProfile'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

type NavLoginProps = {
    isLoginApp?: boolean
}

export const NavLogin: React.FC<NavLoginProps> = ({ isLoginApp }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const { login } = useContext<IAuthContext>(AuthContext)
    const navigate = useNavigate()
    return (
        <div className="idsk-header-web__main--login">
            {!user && (
                <button
                    onClick={() => (isLoginApp ? navigate('/prelogin') : login())}
                    type="button"
                    className="idsk-button idsk-header-web__main--login-loginbtn"
                    data-module="idsk-button"
                >
                    {t('navbar.login')}
                </button>
            )}

            <NavProfile />
        </div>
    )
}
