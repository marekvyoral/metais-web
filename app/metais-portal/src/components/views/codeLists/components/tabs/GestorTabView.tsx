import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useTranslation } from 'react-i18next'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, Subjects } from '@isdd/metais-common/hooks/permissions/useCodeListPermissions'

import { getDescription, getName } from '@/components/views/codeLists/CodeListDetailUtils'
import { InformationGridRowWrapper } from '@/components/views/codeLists/components/InformationGridRowWrapper/InformationGridRowWrapper'
import { CodeListDetailData } from '@/components/containers/CodeListDetailContainer'

export interface GestorTabViewProps {
    data?: CodeListDetailData
}

export const GestorTabView: React.FC<GestorTabViewProps> = ({ data }) => {
    const {
        i18n: { language },
    } = useTranslation()
    const { codeList, attributeProfile } = data || {}
    const ability = useAbilityContext()
    if (!codeList || !attributeProfile) return <></>

    return (
        <InformationGridRowWrapper>
            <InformationGridRow
                key={'name'}
                label={getDescription(attributeProfile, 'Gui_Profil_ZC_meno', language)}
                tooltip={getName(attributeProfile, 'Gui_Profil_ZC_meno', language)}
                value={codeList?.contactFirstName}
            />
            <InformationGridRow
                key={'surname'}
                label={getDescription(attributeProfile, 'Gui_Profil_ZC_priezvisko', language)}
                tooltip={getName(attributeProfile, 'Gui_Profil_ZC_priezvisko', language)}
                value={codeList?.contactSurname}
            />
            {ability.can(Actions.READ, Subjects.DETAIL, 'gestor.contact') && (
                <>
                    <InformationGridRow
                        key={'tel'}
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_tel_cislo', language)}
                        tooltip={getName(attributeProfile, 'Gui_Profil_ZC_tel_cislo', language)}
                        value={codeList?.contactPhone}
                    />
                    <InformationGridRow
                        key={'email'}
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_email', language)}
                        tooltip={getName(attributeProfile, 'Gui_Profil_ZC_email', language)}
                        value={codeList?.contactMail}
                    />
                </>
            )}
        </InformationGridRowWrapper>
    )
}
