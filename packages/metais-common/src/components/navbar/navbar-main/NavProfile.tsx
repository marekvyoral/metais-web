import classnames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { AuthActions, useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { ProfileIcon } from '@isdd/metais-common/assets/images'
import styles from '@isdd/metais-common/components/navbar/navbar.module.scss'

export const NavProfile: React.FC = () => {
    const { t } = useTranslation()
    const {
        state: { user },
        dispatch,
    } = useAuth()

    const handleLogout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault()
        dispatch({ type: AuthActions.LOGOUT })
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
                {user?.displayName && <span className="govuk-body-s idsk-header-web__main--login-action-text-user-name">{user.displayName}</span>}
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
                        title={t('navbar.logout')}
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
                        to="#"
                        title={t('navbar.profile')}
                    >
                        {t('navbar.profile')}
                    </Link>
                </div>
            </div>
        </div>
    )
}
