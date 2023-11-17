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

    return (
        <InformationGridRowWrapper>
            <InformationGridRow
                key={'name'}
                label={getDescription('Gui_Profil_ZC_meno', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_meno', language, attributeProfile)}
                value={codeList?.contactFirstName}
            />
            <InformationGridRow
                key={'surname'}
                label={getDescription('Gui_Profil_ZC_priezvisko', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_priezvisko', language, attributeProfile)}
                value={codeList?.contactSurname}
            />
            {ability.can(Actions.READ, Subjects.DETAIL, 'gestor.contact') && (
                <>
                    <InformationGridRow
                        key={'tel'}
                        label={getDescription('Gui_Profil_ZC_tel_cislo', language, attributeProfile)}
                        tooltip={getName('Gui_Profil_ZC_tel_cislo', language, attributeProfile)}
                        value={codeList?.contactPhone}
                    />
                    <InformationGridRow
                        key={'email'}
                        label={getDescription('Gui_Profil_ZC_email', language, attributeProfile)}
                        tooltip={getName('Gui_Profil_ZC_email', language, attributeProfile)}
                        value={codeList?.contactMail}
                    />
                </>
            )}
        </InformationGridRowWrapper>
    )
}
