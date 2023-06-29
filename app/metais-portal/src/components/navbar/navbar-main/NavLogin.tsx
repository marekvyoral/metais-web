import React from 'react'
import { useTranslation } from 'react-i18next'

import { NavProfile } from './NavProfile'

import { useLogin } from '@/hooks/useLogin'
import { useAuth } from '@/contexts/auth/authContext'

export const NavLogin: React.FC = () => {
    const { t } = useTranslation()
    const { mutateAuthorize } = useLogin()
    const {
        state: { user },
    } = useAuth()

    return (
        <div className="idsk-header-web__main--login">
            {!user && (
                <button
                    onClick={mutateAuthorize}
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
