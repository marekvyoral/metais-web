import React, { SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import styles from './../navbar.module.scss'
import { NavIconGroup } from './NavIconGroup'
import { NavSearchBar } from './NavSearchBar'
import { NavLogin } from './NavLogin'

import { LogoMirri } from '@/assets/images'

interface INavBarMain {
    loggedIn: boolean
    isMenuExpanded: boolean
    setIsMenuExpanded: React.Dispatch<SetStateAction<boolean>>
    handleLogout: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
    setLoggedIn: React.Dispatch<SetStateAction<boolean>>
}

export const NavBarMain: React.FC<INavBarMain> = ({ loggedIn, setIsMenuExpanded, isMenuExpanded, handleLogout, setLoggedIn }) => {
    const { t } = useTranslation()

    return (
        <div className="idsk-header-web__main">
            <div className="govuk-width-container">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column govuk-grid-column-one-quarter-from-desktop">
                        <div className="idsk-header-web__main-headline">
                            <Link to="/" title={t('navbar.linkToHomePage')}>
                                <img src={LogoMirri} alt={t('navbar.ministryName')} className="idsk-header-web__main-headline-logo" />
                            </Link>

                            <NavIconGroup loggedIn={loggedIn} isMobile />

                            <button
                                onClick={() => setIsMenuExpanded((prev) => !prev)}
                                className="idsk-button idsk-header-web__main-headline-menu-button"
                                aria-label={isMenuExpanded ? t('navbar.closeMenu') : t('navbar.openMenu')}
                                aria-expanded={isMenuExpanded}
                                data-text-for-show={t('navbar.openMenu')}
                                data-text-for-hide={t('navbar.closeMenu')}
                            >
                                {t('navbar.menu')}
                                <span className="idsk-header-web__menu-open" />
                                <span className="idsk-header-web__menu-close" />
                            </button>
                        </div>
                    </div>

                    <div className="govuk-grid-column-full">
                        <div className="idsk-header-web__main-action">
                            <NavSearchBar />
                            <NavIconGroup loggedIn={loggedIn} isMobile={false} />

                            <div className="idsk-header-web__main--buttons">
                                {loggedIn ? (
                                    <button className={classnames('idsk-button idsk-button--secondary', styles.noWrap)}>{t('navbar.newItem')}</button>
                                ) : (
                                    <Link className="govuk-link" to="#" onClick={(e) => e.preventDefault()} style={{ marginLeft: 10 }}>
                                        {t('navbar.registration')}
                                    </Link>
                                )}
                            </div>
                            <div className="idsk-header-web__main--buttons">
                                <NavLogin loggedIn={loggedIn} setLoggedIn={setLoggedIn} handleLogout={handleLogout} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
