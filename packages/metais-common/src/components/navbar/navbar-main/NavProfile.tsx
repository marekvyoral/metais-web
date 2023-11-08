import classnames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { ProfileIcon } from '@isdd/metais-common/assets/images'
import styles from '@isdd/metais-common/components/navbar/navbar.module.scss'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export const NavProfile: React.FC = () => {
    const { t } = useTranslation()
    const {
        state: {
            userContext: { tokenData, logOut },
        },
    } = useAuth()

    const logoutURL =
        import.meta.env.VITE_REST_CLIENT_IAM_OIDC_BASE_URL +
        (import.meta.env.VITE_IAM_OIDC_PATH ? `/${import.meta.env.VITE_IAM_OIDC_PATH}/logout` : '/logout')

    const handleLogout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault()
        fetch(logoutURL, { method: 'POST' }).finally(() => logOut())
    }
    const location = useLocation()

    return (
        <div
            className={classnames(styles.loginProfile, tokenData ? styles.displayFlex : styles.displayNone, {
                'idsk-header-web__main--login-action--active': tokenData?.user_id,
                'idsk-header-web__main--login-action': !tokenData?.user_id,
            })}
        >
            <img className="idsk-header-web__main--login-action-profile-img" src={ProfileIcon} alt="User profile icon" />
            <div className="idsk-header-web__main--login-action-text">
                {tokenData?.user_id && <span className="govuk-body-s idsk-header-web__main--login-action-text-user-name">{tokenData?.user_id}</span>}
                <div className="govuk-!-margin-bottom-1">
                    <Link
                        onClick={handleLogout}
                        state={{ from: location }}
                        className={classnames(
                            'govuk-link',
                            'idsk-header-web__main--login-action-text-logout',
                            tokenData ? 'idsk-header-web__main--login-logoutbtn--active' : 'idsk-header-web__main--login-logoutbtn',
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
                            tokenData ? 'idsk-header-web__main--login-profilebtn--active' : 'idsk-header-web__main--login-profilebtn',
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
