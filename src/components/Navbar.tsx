import React from 'react'

export const Navbar: React.FC = () => {
  return (
    <>
      <a href="#main-content" className="govuk-skip-link idsk-skip-link--sticky">
        Preskočiť na hlavný obsah
      </a>
      <header className="idsk-header-web " data-module="idsk-header-web">
        <div className="idsk-header-web__scrolling-wrapper">
          <div className="idsk-header-web__tricolor" />

          <div className="idsk-header-web__brand ">
            <div className="govuk-width-container">
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-full">
                  <div className="idsk-header-web__brand-gestor">
                    <span className="govuk-body-s idsk-header-web__brand-gestor-text">
                      Oficiálna stránka
                      <button
                        className="idsk-header-web__brand-gestor-button"
                        aria-label="Zobraziť informácie o stránke"
                        aria-expanded="false"
                        data-text-for-hide="Skryť informácie o stránke"
                        data-text-for-show="Zobraziť informácie o stránke"
                      >
                        verejnej správy SR
                        <span className="idsk-header-web__link-arrow" />
                      </button>
                    </span>
                    <span className="govuk-body-s idsk-header-web__brand-gestor-text--mobile">
                      SK
                      <button
                        className="idsk-header-web__brand-gestor-button"
                        aria-label="Zobraziť informácie o stránke"
                        aria-expanded="false"
                        data-text-for-hide="Skryť informácie o stránke"
                        data-text-for-show="Zobraziť informácie o stránke"
                      >
                        e-gov
                        <span className="idsk-header-web__link-arrow" />
                      </button>
                    </span>

                    <div className="idsk-header-web__brand-dropdown">
                      <div className="govuk-width-container">
                        <div className="govuk-grid-row">
                          <div className="govuk-grid-column-one-half">
                            <h3 className="govuk-body-s">Doména gov.sk je oficálna</h3>
                            <p className="govuk-body-s">
                              Toto je oficiálna webová stránka orgánu verejnej moci Slovenskej republiky. Oficiálne stránky využívajú najmä doménu
                              gov.sk.{' '}
                              <a
                                className="govuk-link"
                                href="https://www.slovensko.sk/sk/agendy/agenda/_organy-verejnej-moci"
                                target="_blank"
                                title="odkazy na webové sídla orgánov verejnej moci"
                                rel="noreferrer"
                              >
                                Odkazy na jednotlivé webové sídla orgánov verejnej moci nájdete na tomto odkaze
                              </a>
                              .
                            </p>
                          </div>
                          <div className="govuk-grid-column-one-half">
                            <h3 className="govuk-body-s">Táto stránka je zabezpečená</h3>
                            <p className="govuk-body-s">
                              Buďte pozorní a vždy sa uistite, že zdieľate informácie iba cez zabezpečenú webovú stránku verejnej správy SR.
                              Zabezpečená stránka vždy začína https:// pred názvom domény webového sídla.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="idsk-header-web__brand-spacer" />
                  <div className="idsk-header-web__brand-language">
                    <button
                      className="idsk-header-web__brand-language-button"
                      aria-label="Rozbaliť jazykové menu"
                      aria-expanded="false"
                      data-text-for-hide="Skryť jazykové menu"
                      data-text-for-show="Rozbaliť jazykové menu"
                    >
                      Slovenčina
                      <span className="idsk-header-web__link-arrow" />
                    </button>
                    <ul className="idsk-header-web__brand-language-list">
                      <li className="idsk-header-web__brand-language-list-item">
                        <a className="govuk-link idsk-header-web__brand-language-list-item-link " title="English" href="#2">
                          English
                        </a>
                      </li>
                      <li className="idsk-header-web__brand-language-list-item">
                        <a className="govuk-link idsk-header-web__brand-language-list-item-link " title="German" href="#3">
                          German
                        </a>
                      </li>
                      <li className="idsk-header-web__brand-language-list-item">
                        <a
                          className="govuk-link idsk-header-web__brand-language-list-item-link idsk-header-web__brand-language-list-item-link--selected"
                          title="Slovenčina"
                          href="#1"
                        >
                          Slovenčina
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="idsk-header-web__main">
            <div className="govuk-width-container">
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-full govuk-grid-column-one-third-from-desktop">
                  <div className="idsk-header-web__main-headline">
                    <a href="/" title="Odkaz na úvodnú stránku">
                      <img
                        src="/assets/images/header-web/logo-mirri-farebne.svg"
                        alt="ID-SK Frontend"
                        className="idsk-header-web__main-headline-logo"
                      />
                    </a>

                    <button
                      className="idsk-button idsk-header-web__main-headline-menu-button"
                      aria-label="Rozbaliť menu"
                      aria-expanded="false"
                      data-text-for-show="Rozbaliť menu"
                      data-text-for-hide="Zavrieť menu"
                    >
                      Menu
                      <span className="idsk-header-web__menu-open" />
                      <span className="idsk-header-web__menu-close" />
                    </button>
                  </div>
                </div>

                <div className="govuk-grid-column-two-thirds">
                  <div className="idsk-header-web__main-action">
                    <form className="idsk-header-web__main-action-search">
                      <input
                        className="govuk-input govuk-!-display-inline-block"
                        id="idsk-header-web__main-action-search-input"
                        name="search"
                        placeholder="Zadajte hľadaný výraz"
                        title="Zadajte hľadaný výraz"
                        type="search"
                        aria-label="Zadajte hľadaný výraz"
                      />
                      <button type="submit" className="govuk-button" data-module="govuk-button">
                        <span className="govuk-visually-hidden">Vyhľadať</span>
                        <i aria-hidden="true" className="fas fa-search" />
                      </button>
                    </form>

                    <div className="idsk-header-web__main--buttons" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="idsk-header-web__nav--divider" />
          <div className="idsk-header-web__nav idsk-header-web__nav--mobile ">
            <div className="govuk-width-container">
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-full" />
                <div className="govuk-grid-column-full">
                  <nav className="">
                    <ul className="idsk-header-web__nav-list " aria-label="Hlavná navigácia">
                      <li className="idsk-header-web__nav-list-item">
                        <a className="govuk-link idsk-header-web__nav-list-item-link" href="#1" title="Eurofondy">
                          Eurofondy
                        </a>
                      </li>
                      <li className="idsk-header-web__nav-list-item">
                        <a className="govuk-link idsk-header-web__nav-list-item-link" href="#2" title="Regionálny rozvoj">
                          Regionálny rozvoj
                        </a>
                      </li>
                      <li className="idsk-header-web__nav-list-item">
                        <a className="govuk-link idsk-header-web__nav-list-item-link" href="#3" title="Informatizácia">
                          Informatizácia
                        </a>
                      </li>
                      <li className="idsk-header-web__nav-list-item">
                        <a className="govuk-link idsk-header-web__nav-list-item-link" href="#4" title="Investície">
                          Investície
                        </a>
                      </li>
                      <li className="idsk-header-web__nav-list-item">
                        <a className="govuk-link idsk-header-web__nav-list-item-link" href="#5" title="Inovácie">
                          Inovácie
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
