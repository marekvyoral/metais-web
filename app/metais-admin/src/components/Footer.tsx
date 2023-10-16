import React from 'react'
import { useTranslation } from 'react-i18next'

export const Footer: React.FC = () => {
    const { t } = useTranslation()
    return (
        <footer className="govuk-footer ">
            <div className="govuk-width-container ">
                <div className="govuk-footer__navigation">
                    <div className="govuk-footer__section">
                        <h2 className="govuk-footer__heading govuk-heading-m">Služby a informácie</h2>
                        <ul className="govuk-footer__list govuk-footer__list--columns-2">
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/browse/benefits">
                                    Dávky
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/browse/births-deaths-marriages">
                                    Narodenia, úmrtia, sobáše a starostlivosť
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/browse/business">
                                    Podnikanie a samostatne zárobkovej činnosti
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/browse/childcare-parenting">
                                    Starostlivosť o deti a rodičovstvo
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/browse/citizenship">
                                    Obyvateľstvo a život v Spojenom kráľovstve
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/browse/justice">
                                    Kriminalita, spravodlivosť a zákon
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/browse/disabilities">
                                    Zdravotne postihnutí ľudia
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/browse/driving">
                                    Vodičský preukaz a doprava
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/browse/education">
                                    Vzdelávanie a učenie sa
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/browse/employing-people">
                                    Zamestnávanie ľudí
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/browse/environment-countryside">
                                    Životné prostredie a vidiek
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/browse/housing-local-services">
                                    Bývanie a miestne služby
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/browse/tax">
                                    Finančné záležitosti a dane
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/browse/abroad">
                                    Cestovanie a život v zahraničí
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/browse/visas-immigration">
                                    Víza a imigrácia
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/browse/working">
                                    Práca, zamestnanie a dôchodky
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="govuk-footer__section">
                        <h2 className="govuk-footer__heading govuk-heading-m">Oddelenia a politika</h2>
                        <ul className="govuk-footer__list ">
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/government/how-government-works">
                                    Ako funguje vláda
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/government/organisations">
                                    Oddelenia
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/world">
                                    Celosvetovo
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/government/policies">
                                    Politiky
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/government/publications">
                                    Publikácie
                                </a>
                            </li>
                            <li className="govuk-footer__list-item">
                                <a className="govuk-footer__link" href="/government/announcements">
                                    Oznamy
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <hr className="govuk-footer__section-break" />
                <div className="govuk-footer__meta">
                    <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
                        <h2 className="govuk-visually-hidden">Odkazy na podporu</h2>
                        <ul className="govuk-footer__inline-list">
                            <li className="govuk-footer__inline-list-item">
                                <a className="govuk-footer__link" href="/help">
                                    Pomoc
                                </a>
                            </li>
                            <li className="govuk-footer__inline-list-item">
                                <a className="govuk-footer__link" href="/help/cookies">
                                    Súbory cookies
                                </a>
                            </li>
                            <li className="govuk-footer__inline-list-item">
                                <a className="govuk-footer__link" href="/contact">
                                    Kontakt
                                </a>
                            </li>
                            <li className="govuk-footer__inline-list-item">
                                <a className="govuk-footer__link" href="/help/terms-conditions">
                                    Obchodné podmienky
                                </a>
                            </li>
                            <li className="govuk-footer__inline-list-item">
                                <a className="govuk-footer__link" href="/cymraeg">
                                    Zoznam služieb v cestine
                                </a>
                            </li>
                        </ul>
                        <div className="govuk-footer__meta-custom">
                            Vytvorené{' '}
                            <a className="govuk-footer__link" href="/#">
                                Úradom pre digitálne služby vlády
                            </a>
                        </div>

                        <svg
                            role="presentation"
                            focusable="false"
                            className="govuk-footer__licence-logo"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 483.2 195.7"
                            height="17"
                            width="41"
                        >
                            <path
                                fill="currentColor"
                                d="M421.5 142.8V.1l-50.7 32.3v161.1h112.4v-50.7zm-122.3-9.6A47.12 47.12 0 0 1 221 97.8c0-26 21.1-47.1 47.1-47.1 16.7 0 31.4 8.7 39.7 21.8l42.7-27.2A97.63 97.63 0 0 0 268.1 0c-36.5 0-68.3 20.1-85.1 49.7A98 98 0 0 0 97.8 0C43.9 0 0 43.9 0 97.8s43.9 97.8 97.8 97.8c36.5 0 68.3-20.1 85.1-49.7a97.76 97.76 0 0 0 149.6 25.4l19.4 22.2h3v-87.8h-80l24.3 27.5zM97.8 145c-26 0-47.1-21.1-47.1-47.1s21.1-47.1 47.1-47.1 47.2 21 47.2 47S123.8 145 97.8 145"
                            />
                        </svg>
                        <span className="govuk-footer__licence-description">
                            {' Všetok obsah je dostupný pod '}
                            <a
                                className="govuk-footer__link"
                                href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                                rel="license"
                            >
                                Open Government Licence v3.0
                            </a>
                            , pokiaľ nie je uvedené inak
                        </span>
                    </div>
                    <div className="govuk-footer__meta-item">
                        <a
                            className="govuk-footer__link govuk-footer__copyright-logo"
                            href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/"
                        >
                            © Autorské práva
                        </a>
                    </div>
                </div>
                <div>
                    {t('footer.appVersion')}: {import.meta.env.VITE_APP_VERSION}
                </div>
            </div>
        </footer>
    )
}
