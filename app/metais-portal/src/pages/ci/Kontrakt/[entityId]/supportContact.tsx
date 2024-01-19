import { useSlaContractDetail } from '@isdd/metais-common/src/hooks/useSlaContractDetail.hook'
import { ApiSlaContractRead } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { ATTRIBUTE_NAME, QueryFeedback } from '@isdd/metais-common/index'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { Profil_Kontrakt } from '@isdd/metais-common/constants'

import { SlaConstraintTypes } from './information'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { findEnumByCode, findEnumValueByCode } from '@/componentHelpers/sla-contract'

export const SlaContractSupportContact = () => {
    const { entityId, entityName } = useGetEntityParamsFromUrl()
    const { constraintsData, ciTypeData, isError: isAttributesError, isLoading: isAttributesLoading } = useAttributesHook(entityName)
    const { isError, isLoading, slaContractData } = useSlaContractDetail(entityId ?? '') as {
        slaContractData: ApiSlaContractRead | undefined
        isLoading: boolean
        isError: boolean
    }

    const contractProfileAttributesObject = ciTypeData?.attributeProfiles
        ?.find((prof) => prof.technicalName == Profil_Kontrakt)
        ?.attributes?.reduce<Record<string, Attribute>>((acc, att) => ({ ...acc, [att.technicalName ?? '']: att }), {})

    const contractFormEnum = findEnumByCode(constraintsData, SlaConstraintTypes.PODPORA_FORMA_KONTAKTU)
    const operatingTimeEnum = findEnumByCode(constraintsData, SlaConstraintTypes.PODPORA_PREVADZKOVA_DOBA)
    const responseTimeEnum = findEnumByCode(constraintsData, SlaConstraintTypes.PODPORA_DLZKA_ODOZVY)

    return (
        <QueryFeedback loading={isLoading || isAttributesLoading} error={isError || isAttributesError}>
            <DefinitionList>
                <InformationGridRow
                    label={contractProfileAttributesObject?.[ATTRIBUTE_NAME.Profil_Kontrakt_podpora_forma_kontaktu].name}
                    value={findEnumValueByCode(contractFormEnum, slaContractData?.supportForm)}
                />
                <InformationGridRow
                    label={contractProfileAttributesObject?.[ATTRIBUTE_NAME.Profil_Kontrakt_podpora_instrukcie_kontaktovania].name}
                    value={slaContractData?.supportInstructions}
                />
                <InformationGridRow
                    label={contractProfileAttributesObject?.[ATTRIBUTE_NAME.Profil_Kontrakt_podpora_prevadzkova_doba].name}
                    value={findEnumValueByCode(operatingTimeEnum, slaContractData?.supportWorkingHours)}
                />
                <InformationGridRow
                    label={contractProfileAttributesObject?.[ATTRIBUTE_NAME.Profil_Kontrakt_podpora_forma_kontaktu_mimo_prevadzky].name}
                    value={findEnumValueByCode(contractFormEnum, slaContractData?.supportFormOfContactOutsideWorkingHours)}
                />
                <InformationGridRow
                    label={contractProfileAttributesObject?.[ATTRIBUTE_NAME.Profil_Kontrakt_podpora_max_odozva_pocas_prevadzky].name}
                    value={findEnumValueByCode(responseTimeEnum, slaContractData?.supportMaximalResponseTime)}
                />
                <InformationGridRow
                    label={contractProfileAttributesObject?.[ATTRIBUTE_NAME.Profil_Kontrakt_podpora_max_odozva_mimo_prevadzky].name}
                    value={findEnumValueByCode(responseTimeEnum, slaContractData?.supportMaximalResponseTimeOutsideWorkingHours)}
                />
            </DefinitionList>
        </QueryFeedback>
    )
}
