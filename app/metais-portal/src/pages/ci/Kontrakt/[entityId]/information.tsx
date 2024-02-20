import { useSlaContractDetail } from '@isdd/metais-common/src/hooks/useSlaContractDetail.hook'
import { ApiSlaContractRead } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useTranslation } from 'react-i18next'
import { ATTRIBUTE_NAME, QueryFeedback } from '@isdd/metais-common/index'
import { ConfigurationItemUi, RoleParticipantUI } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { getSlaKeys } from '@/componentHelpers/sla-contract'
import { CiInformationAccordion } from '@/components/entities/accordion/CiInformationAccordion'

export enum SlaConstraintTypes {
    FAZA_KONTRAKTU = 'FAZA_KONTRAKTU',
    PODPORA_FORMA_KONTAKTU = 'PODPORA_FORMA_KONTAKTU',
    PODPORA_DLZKA_ODOZVY = 'PODPORA_DLZKA_ODOZVY',
    PODPORA_PREVADZKOVA_DOBA = 'PODPORA_PREVADZKOVA_DOBA',
    TYP_PARAMETROV_JEDNOTKA = 'TYP_PARAMETROV_JEDNOTKA',
}

export const SlaContractInformation = () => {
    const { t } = useTranslation()
    const { entityId, entityName } = useGetEntityParamsFromUrl()
    const { ciTypeData, constraintsData, isError: isCiTypeDataError, isLoading: isCiTypeDataLoading, unitsData } = useAttributesHook(entityName)
    const { isError, isLoading, slaContractData, gestorData, ciItemData } = useSlaContractDetail(entityId ?? '') as {
        slaContractData: ApiSlaContractRead | undefined
        ciItemData: ConfigurationItemUi | undefined
        gestorData: RoleParticipantUI[] | undefined
        isLoading: boolean
        isError: boolean
    }

    const slaKeys = getSlaKeys(slaContractData ?? {})

    return (
        <QueryFeedback loading={isLoading || isCiTypeDataLoading} error={isError || isCiTypeDataError}>
            <CiInformationAccordion
                data={{ ciItemData, gestorData, constraintsData, ciTypeData, unitsData }}
                isError={false}
                isLoading={false}
                withoutDescription
                additionalBasicInformation={{
                    top: (
                        <>
                            <InformationGridRow
                                label={t(`slaContracts.detail.${slaKeys?.providerIsvs}`)}
                                value={slaContractData?.providerIsvs?.name}
                            />
                            <InformationGridRow
                                label={t(`slaContracts.detail.${slaKeys?.providerIsvsMainPerson}`)}
                                value={slaContractData?.providerIsvsMainPerson?.name}
                            />
                            <InformationGridRow
                                label={t(`slaContracts.detail.${slaKeys?.consumerIsvs}`)}
                                value={slaContractData?.consumerIsvs?.name}
                            />
                            <InformationGridRow
                                label={t(`slaContracts.detail.${slaKeys?.consumerIsvsMainPerson}`)}
                                value={slaContractData?.consumerIsvsMainPerson?.name}
                            />
                        </>
                    ),
                    bottom: (
                        <>
                            <InformationGridRow
                                label={t(`slaContracts.detail.owner`)}
                                value={gestorData?.[0].configurationItemUi?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}
                            />
                            <InformationGridRow label={t(`slaContracts.detail.docForSignAndApproval`)} value={'doc for sing and approval'} />
                        </>
                    ),
                }}
            />
        </QueryFeedback>
    )
}
