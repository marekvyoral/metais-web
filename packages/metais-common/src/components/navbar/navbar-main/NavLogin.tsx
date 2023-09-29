import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { NavProfile } from './NavProfile'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useLogin } from '@isdd/metais-common/hooks/useLogin'

type NavLoginProps = {
    isLoginApp?: boolean
}

export const NavLogin: React.FC<NavLoginProps> = ({ isLoginApp }) => {
    const { t } = useTranslation()
    const { mutateAuthorize } = useLogin()
    const navigate = useNavigate()
    const {
        state: { user },
    } = useAuth()

    return (
        <div className="idsk-header-web__main--login">
            {!user && (
                <button
                    onClick={() => (isLoginApp ? navigate('/prelogin') : mutateAuthorize())}
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
