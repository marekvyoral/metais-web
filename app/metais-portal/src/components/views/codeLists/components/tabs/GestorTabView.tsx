import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useTranslation } from 'react-i18next'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions as CodeListActions, Subjects as CodeListSubjects } from '@isdd/metais-common/hooks/permissions/useCodeListPermissions'
import { Actions as RequestActions, Subjects as RequestSubjects } from '@isdd/metais-common/hooks/permissions/useRequestPermissions'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { ApiCodelistPreview } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'

import { getDescription, getName } from '@/components/views/codeLists/CodeListDetailUtils'

export interface GestorTabViewProps {
    codeList: ApiCodelistPreview
    attributeProfile: AttributeProfile
}

export const GestorTabView: React.FC<GestorTabViewProps> = ({ codeList, attributeProfile }) => {
    const {
        i18n: { language },
    } = useTranslation()
    const ability = useAbilityContext()

    return (
        <DefinitionList>
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
            {(ability.can(CodeListActions.READ, CodeListSubjects.DETAIL, 'gestor.contact') ||
                ability.can(RequestActions.SHOW, RequestSubjects.DETAIL, 'gestor.contact')) && (
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
        </DefinitionList>
    )
}
