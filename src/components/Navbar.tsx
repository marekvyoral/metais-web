import React from 'react';

type Props = {
    noInternetConnection?: boolean;
};

const Navbar: React.FC<Props> = () => {
return (
  <header className="idsk-header-web " data-module="idsk-header-web">
    <div className="idsk-header-web__scrolling-wrapper">
      <div className="idsk-header-web__tricolor"></div>

      <div className="idsk-header-web__brand ">
        <div className="govuk-width-container">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">
              <div className="idsk-header-web__brand-gestor">
                <span className="govuk-body-s idsk-header-web__brand-gestor-text">
                  {" Oficiálna stránka "}
                  <button
                    className="idsk-header-web__brand-gestor-button"
                    aria-label="Zobraziť informácie o stránke"
                    aria-expanded="false"
                    data-text-for-hide="Skryť informácie o stránke"
                    data-text-for-show="Zobraziť informácie o stránke"
                  >
                    {" verejnej správy SR "}
                    <span className="idsk-header-web__link-arrow"></span>
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
                    <span className="idsk-header-web__link-arrow"></span>
                  </button>
                </span>

                <div className="idsk-header-web__brand-dropdown">
                  <div className="govuk-width-container">
                    <div className="govuk-grid-row">
                      <div className="govuk-grid-column-one-half">
                        <h3 className="govuk-body-s">
                          Doména gov.sk je oficálna
                        </h3>
                        <p className="govuk-body-s">
                          Toto je oficiálna webová stránka orgánu verejnej moci
                          Slovenskej republiky. Oficiálne stránky využívajú
                          najmä doménu gov.sk.{" "}
                          <a
                            className="govuk-link"
                            href="https://www.slovensko.sk/sk/agendy/agenda/_organy-verejnej-moci"
                            target="_blank"
                            title="odkazy na webové sídla orgánov verejnej moci"
                            rel="noreferrer"
                          >
                            Odkazy na jednotlivé webové sídla orgánov verejnej
                            moci nájdete na tomto odkaze
                          </a>
                          .
                        </p>
                      </div>
                      <div className="govuk-grid-column-one-half">
                        <h3 className="govuk-body-s">
                          Táto stránka je zabezpečená
                        </h3>
                        <p className="govuk-body-s">
                          Buďte pozorní a vždy sa uistite, že zdieľate
                          informácie iba cez zabezpečenú webovú stránku verejnej
                          správy SR. Zabezpečená stránka vždy začína https://
                          pred názvom domény webového sídla.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="idsk-header-web__brand-spacer"></div>
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
                    src="/assets/images/idsk-logo.svg"
                    alt="ID-SK Frontend"
                    className="idsk-header-web__main-headline-logo"
                  />
                </a>
              </div>
            </div>

            <div className="govuk-grid-column-two-thirds">
              <div className="idsk-header-web__main-action">
                <div className="idsk-header-web__main--buttons"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="idsk-header-web__nav idsk-header-web__nav--mobile ">
        <div className="govuk-width-container">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-full"></div>
          </div>
        </div>
      </div>
    </div>
  </header>
);
}

export default Navbar;