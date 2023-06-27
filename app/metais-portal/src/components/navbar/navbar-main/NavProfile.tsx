import classnames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import styles from './../navbar.module.scss'

import { userEntityMock } from '@/mock/userEntityMock'
import { ProfileIcon } from '@/assets/images'
import { AuthActions, useAuth } from '@/contexts/auth/authContext'

interface INavProfile {
    loggedIn: boolean
    handleLogout: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

export const NavProfile: React.FC<INavProfile> = ({ loggedIn, handleLogout }) => {
    const { t } = useTranslation()
    const {
        state: { accessToken, user },
        dispatch,
    } = useAuth()

    return (
        <div
            className={classnames(styles.loginProfile, loggedIn ? styles.displayFlex : styles.displayNone, {
                'idsk-header-web__main--login-action--active': loggedIn,
                'idsk-header-web__main--login-action': !loggedIn,
            })}
        >
            <img className="idsk-header-web__main--login-action-profile-img" src={ProfileIcon} alt="Profile image" />
            <div className="idsk-header-web__main--login-action-text">
                <span className="govuk-body-s idsk-header-web__main--login-action-text-user-name">{user?.displayName}</span>
                <div className="govuk-!-margin-bottom-1">
                    <Link
                        onClick={() => dispatch({ type: AuthActions.LOGOUT })}
                        className={classnames(
                            'govuk-link',
                            'idsk-header-web__main--login-action-text-logout',
                            loggedIn ? 'idsk-header-web__main--login-logoutbtn--active' : 'idsk-header-web__main--login-logoutbtn',
                        )}
                        to="#"
                        title={t('navbar.logout')}
                    >
                        {t('navbar.logout')}
                    </Link>
                    <span> | </span>
                    <Link
                        className={classnames(
                            'govuk-link',
                            'idsk-header-web__main--login-action-text-profile',
                            loggedIn ? 'idsk-header-web__main--login-profilebtn--active' : 'idsk-header-web__main--login-profilebtn',
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
