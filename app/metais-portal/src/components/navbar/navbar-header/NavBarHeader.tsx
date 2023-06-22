import { LanguageSelector } from '@isdd/metais-common/language-selector/LanguageSelector'
import classnames from 'classnames'
import React, { SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { InfoDropDown } from './InfoDropDown'
import { HeaderDropDown } from './HeaderDropDown'

interface INavBarHeader {
    setShowDropDown: React.Dispatch<SetStateAction<boolean>>
    showDropDown: boolean
}

export const NavBarHeader: React.FC<INavBarHeader> = ({ setShowDropDown, showDropDown }) => {
    const { t } = useTranslation()

    return (
        <div className="idsk-header-web__brand ">
            <div className="govuk-width-container">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <div className="idsk-header-web__brand-gestor">
                            <InfoDropDown
                                title={t('navbar.official')}
                                label={t('navbar.publicAdministration')}
                                setShowDropDown={setShowDropDown}
                                showDropDown={showDropDown}
                                isMobile={false}
                            />
                            <InfoDropDown
                                title={t('navbar.sk')}
                                label={t('navbar.e-gov')}
                                setShowDropDown={setShowDropDown}
                                showDropDown={showDropDown}
                                isMobile
                            />

                            <HeaderDropDown showDropDown={showDropDown} />
                        </div>
                        <div
                            className={classnames({
                                'idsk-header-web__brand-spacer': true,
                                'idsk-header-web__brand-spacer--active': showDropDown,
                            })}
                        />
                        <LanguageSelector />
                    </div>
                </div>
            </div>
        </div>
    )
}
