import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME, ATTRIBUTE_PROFILE_NAME } from '@isdd/metais-common/api/constants'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useTranslation } from 'react-i18next'
import { useSlaContractDetail } from '@isdd/metais-common/hooks/useSlaContractDetail.hook'
import { ApiSlaContractRead, ApiSlaContractWrite, useUpdateSlaContract } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { SubHeading } from '@isdd/metais-common/components/sub-heading/SubHeading'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { FieldValues } from 'react-hook-form'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useLocation, useNavigate } from 'react-router-dom'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import {
    useInvalidateCiListFilteredCache,
    useInvalidateCiItemCache,
    useInvalidateCiHistoryListCache,
    useSlaContractCache,
} from '@isdd/metais-common/hooks/invalidate-cache'
import { protectDateFromDecrement } from '@isdd/metais-common/utils/utils'

import { CreateCiEntityForm } from '@/components/create-entity/CreateCiEntityForm'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

export const EditSlaContractPage = () => {
    const { t, i18n } = useTranslation()
    const { entityId, entityName } = useGetEntityParamsFromUrl()
    const navigate = useNavigate()
    const location = useLocation()
    const { setIsActionSuccess } = useActionSuccess()
    document.title = `${t('titles.ciEdit', { ci: entityName })} | MetaIS`

    const {
        isError: isSlaContractError,
        isLoading: isSlaContractLoading,
        slaContractData,
        ciItemData,
    } = useSlaContractDetail(entityId ?? '') as {
        slaContractData: ApiSlaContractRead | undefined
        ciItemData: ConfigurationItemUi | undefined
        isLoading: boolean
        isError: boolean
    }
    const { constraintsData, ciTypeData, unitsData, isLoading: isAttLoading, isError: isAttError } = useAttributesHook(entityName)
    const currentName =
        i18n.language == Languages.SLOVAK
            ? ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
            : ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]

    const invalidateCilistFilteredCache = useInvalidateCiListFilteredCache()
    const invalidateCiByUuidCache = useInvalidateCiItemCache()
    const invalidateCiHistoryList = useInvalidateCiHistoryListCache()
    const { setItemCache } = useSlaContractCache()

    const onMutationSuccess = () => {
        invalidateCiHistoryList.invalidate(entityId ?? '')
        invalidateCilistFilteredCache.invalidate({ ciType: entityName })
        invalidateCiByUuidCache.invalidate(entityId ?? '')

        const toPath = `/ci/${entityName}/${entityId}`
        setIsActionSuccess({ value: true, path: toPath, additionalInfo: { type: 'edit' } })
        navigate(toPath, { state: { from: location } })
    }

    const {
        mutateAsync: updateSlaContract,
        isError: isUpdateSlaError,
        isLoading: isUpdateSlaLoading,
    } = useUpdateSlaContract({
        mutation: {
            onSuccess(_, variables) {
                onMutationSuccess()
                setItemCache(entityId ?? '', variables.data)
            },
        },
    })

    const entityIdToUpdate = {
        cicode: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais],
        ciurl: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_ref_id],
    }

    const onSubmit = (formData: FieldValues) => {
        const dataToSend: ApiSlaContractWrite = {
            ...slaContractData,
            name: formData[ATTRIBUTE_NAME.Gen_Profil_nazov],
            nameEnglish: formData[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov],
            description: formData[ATTRIBUTE_NAME.Gen_Profil_popis],
            descriptionEnglish: formData[ATTRIBUTE_NAME.Gen_Profil_anglicky_popis],
            note: formData[ATTRIBUTE_NAME.Gen_Profil_poznamka],
            type: formData[ATTRIBUTE_NAME.Profil_Kontrakt_typ_kontraktu],
            validityEndDate: protectDateFromDecrement(formData[ATTRIBUTE_NAME.Profil_Kontrakt_platnost_do]) ?? '',
            validityStartDate: protectDateFromDecrement(formData[ATTRIBUTE_NAME.Profil_Kontrakt_platnost_od]) ?? '',
            subject: formData[ATTRIBUTE_NAME.Profil_Kontrakt_predmet],
            indentificator: formData[ATTRIBUTE_NAME.Profil_Kontrakt_identifikator],
            supportForm: formData[ATTRIBUTE_NAME.Profil_Kontrakt_podpora_forma_kontaktu],
            supportInstructions: formData[ATTRIBUTE_NAME.Profil_Kontrakt_podpora_instrukcie_kontaktovania],
            supportWorkingHours: formData[ATTRIBUTE_NAME.Profil_Kontrakt_podpora_prevadzkova_doba],
            supportMaximalResponseTime: formData[ATTRIBUTE_NAME.Profil_Kontrakt_podpora_max_odozva_pocas_prevadzky],
            supportFormOfContactOutsideWorkingHours: formData[ATTRIBUTE_NAME.Profil_Kontrakt_podpora_forma_kontaktu_mimo_prevadzky],
            supportMaximalResponseTimeOutsideWorkingHours: formData[ATTRIBUTE_NAME.Profil_Kontrakt_podpora_max_odozva_mimo_prevadzky],
            supportType: formData[ATTRIBUTE_NAME.Profil_Kontrakt_typ_podpory],
            supportEscalationDescription: formData[ATTRIBUTE_NAME.Profil_Kontrakt_popis_eskalacie],
            supportInfo: formData[ATTRIBUTE_NAME.Profil_Kontrakt_udaje_o_podpore],
        }

        updateSlaContract({ data: dataToSend })
    }

    //upravene lebo faza kontraktu a profil pre manazment by nemali byt editovatelne cez edit
    const profilKontrakt = ciTypeData?.attributeProfiles?.find((prof) => prof.technicalName == ATTRIBUTE_PROFILE_NAME.Profil_Kontrakt)
    const filteredCiTypeData: CiType = {
        ...ciTypeData,
        attributeProfiles: [
            { ...profilKontrakt, attributes: profilKontrakt?.attributes?.filter((att) => att.technicalName != ATTRIBUTE_NAME.Profil_Kontrakt_faza) },
        ],
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('slaContracts.heading'), href: RouterRoutes.SLA_CONTRACT_LIST },
                    { label: currentName ? currentName : t('breadcrumbs.noName'), href: `/ci/${entityName}/${entityId}` },
                    { label: t('breadcrumbs.ciEdit', { itemName: currentName }), href: `/ci/${entityName}/${entityId}/edit` },
                ]}
            />
            <MainContentWrapper>
                <FlexColumnReverseWrapper>
                    <TextHeading size="XL">{t('ciType.editEntity', { entityName: t('slaContracts.heading') })}</TextHeading>
                    {/*TODO element to scroll to */}
                    <QueryFeedback
                        loading={false}
                        error={isSlaContractError || isAttError}
                        errorProps={{
                            errorMessage: t('createEntity.redirectErrorEdit'),
                        }}
                    />
                    <MutationFeedback success={false} error={isUpdateSlaError ? t('createEntity.mutationError') : ''} />
                </FlexColumnReverseWrapper>
                <SubHeading entityName={entityName ?? ''} entityId={entityId ?? ''} currentName={currentName} />
                <CiPermissionsWrapper entityName={entityName ?? ''} entityId={entityId ?? ''}>
                    <QueryFeedback
                        loading={isAttLoading || isSlaContractLoading || isUpdateSlaLoading}
                        indicatorProps={{ label: isUpdateSlaLoading ? t('createEntity.redirectLoadingEdit') : '' }}
                        withChildren
                    >
                        <CreateCiEntityForm
                            ciTypeData={filteredCiTypeData}
                            generatedEntityId={entityIdToUpdate}
                            constraintsData={constraintsData}
                            unitsData={unitsData}
                            onSubmit={onSubmit}
                            defaultItemAttributeValues={ciItemData?.attributes}
                            updateCiItemId={entityId}
                            uploadError={isUpdateSlaError}
                            isProcessing={isUpdateSlaLoading}
                        />
                    </QueryFeedback>
                </CiPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}
