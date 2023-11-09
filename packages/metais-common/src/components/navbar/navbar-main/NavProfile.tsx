import classnames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { ProfileIcon } from '@isdd/metais-common/assets/images'
import styles from '@isdd/metais-common/components/navbar/navbar.module.scss'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useHandleLogout } from '@isdd/metais-common/hooks/useHandleLogout'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'

export const NavProfile: React.FC = () => {
    const { t } = useTranslation()

    const {
        state: { user },
    } = useAuth()

    const { logoutUser } = useHandleLogout()

    const handleLogout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault()
        logoutUser()
    }
    const location = useLocation()

    return (
        <div
            className={classnames(styles.loginProfile, user ? styles.displayFlex : styles.displayNone, {
                'idsk-header-web__main--login-action--active': user,
                'idsk-header-web__main--login-action': !user,
            })}
        >
            <img className="idsk-header-web__main--login-action-profile-img" src={ProfileIcon} alt="User profile icon" />
            <div className="idsk-header-web__main--login-action-text">
                {user && <span className="govuk-body-s idsk-header-web__main--login-action-text-user-name">{user.displayName}</span>}
                <div className="govuk-!-margin-bottom-1">
                    <Link
                        onClick={handleLogout}
                        state={{ from: location }}
                        className={classnames(
                            'govuk-link',
                            'idsk-header-web__main--login-action-text-logout',
                            user ? 'idsk-header-web__main--login-logoutbtn--active' : 'idsk-header-web__main--login-logoutbtn',
                        )}
                        to="#"
                        title={t('navbar.logout') ?? ''}
                    >
                        {t('navbar.logout')}
                    </Link>
                    <span> | </span>
                    <Link
                        state={{ from: location }}
                        className={classnames(
                            'govuk-link',
                            'idsk-header-web__main--login-action-text-profile',
                            user ? 'idsk-header-web__main--login-profilebtn--active' : 'idsk-header-web__main--login-profilebtn',
                        )}
                        to={RouteNames.USER_PROFILE}
                        title={t('navbar.profile') ?? ''}
                    >
                        {t('navbar.profile')}
                    </Link>
                </div>
            </div>
        </div>
    )
}
