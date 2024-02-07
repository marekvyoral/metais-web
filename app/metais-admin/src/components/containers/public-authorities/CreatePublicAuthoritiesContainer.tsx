import React from 'react'
import { EnumType, useGetEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { useStorePoWithHierarchyRel, useStorePo, PoWithHierarchyUi, ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { MutationFeedback } from '@isdd/metais-common/components/mutation-feedback/MutationFeedback'
import { useTranslation } from 'react-i18next'
import { useInvalidateCiListFilteredCache, useInvalidateCiReadCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { GET_ENUM } from '@isdd/metais-common/api/constants'
import { useNavigate } from 'react-router-dom'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'

export interface ICreatePublicAuthoritiesView {
    data: {
        personCategories: EnumType | undefined
        personTypes: EnumType | undefined
        sources: EnumType | undefined
        replications: EnumType | undefined
        organizationData?: ConfigurationItemUi | undefined
    }
    storePO: (formData: PoWithHierarchyUi, poId: string, relId: string) => Promise<void>
    updatePO: (poId: string, formData: ConfigurationItemUi) => Promise<void>
    isError: boolean
    isLoading: boolean
}

interface ICreatePublicAuthorities {
    View: React.FC<ICreatePublicAuthoritiesView>
    organizationId?: string
}

export const CreatePublicAuthoritiesContainer: React.FC<ICreatePublicAuthorities> = ({ View }: ICreatePublicAuthorities) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { data: personTypes, isLoading: personTypesLoading, isError: personTypesError } = useGetEnum(GET_ENUM.TYP_OSOBY)
    const { data: personCategories, isLoading: personCategoriesLoading, isError: personCategoriesError } = useGetEnum(GET_ENUM.KATEGORIA_OSOBA)
    const { data: sources, isLoading: sourcesLoading, isError: sourcesError } = useGetEnum(GET_ENUM.ZDROJ)
    const { data: replications, isLoading: replicationsLoading, isError: replicationsError } = useGetEnum(GET_ENUM.TYP_REPLIKACIE)

    const { mutateAsync, isError: isStoreError, isLoading: isStoreLoading } = useStorePoWithHierarchyRel()
    const { mutateAsync: updatePOMutation, isError: isUpdateError, isLoading: isUpdateLoading } = useStorePo()

    const invalidatePOList = useInvalidateCiListFilteredCache()
    const invalidatePO = useInvalidateCiReadCache()

    const { setIsActionSuccess } = useActionSuccess()
    const { getRequestStatus, isProcessedError, isError: isRedirectError, isLoading: isRedirectLoading, isTooManyFetchesError } = useGetStatus()

    const storePO = async (formData: PoWithHierarchyUi, poId: string, relId: string) => {
        await mutateAsync({
            poId,
            relId,
            data: {
                ...formData,
            },
        }).then(async (res) => {
            await getRequestStatus(res?.requestId ?? '', () => {
                setIsActionSuccess({ value: true, path: `${AdminRouteNames.PUBLIC_AUTHORITIES}/${poId}`, additionalInfo: { type: 'create' } })
                invalidatePOList.invalidate({})
                invalidatePO.invalidate(poId)
                navigate(`${AdminRouteNames.PUBLIC_AUTHORITIES}/${poId}`)
            })
        })
    }

    const updatePO = async (poId: string, formData: ConfigurationItemUi) => {
        await updatePOMutation({
            poId,
            data: {
                ...formData,
            },
        }).then(async (res) => {
            await getRequestStatus(res?.requestId ?? '', () => {
                setIsActionSuccess({ value: true, path: `${AdminRouteNames.PUBLIC_AUTHORITIES}/${poId}`, additionalInfo: { type: 'edit' } })
                invalidatePOList.invalidate({})
                invalidatePO.invalidate(poId)
                navigate(`${AdminRouteNames.PUBLIC_AUTHORITIES}/${poId}`)
            })
        })
    }
    const isLoading = [
        personTypesLoading,
        personCategoriesLoading,
        sourcesLoading,
        replicationsLoading,
        isUpdateLoading,
        isStoreLoading,
        isRedirectLoading,
    ].some((item) => item)
    const isError = [
        personTypesError,
        personCategoriesError,
        sourcesError,
        replicationsError,
        isUpdateError,
        isStoreError,
        isProcessedError,
        isRedirectError,
        isTooManyFetchesError,
    ].some((item) => item)

    return (
        <>
            {isError && <MutationFeedback success={false} error={t('feedback.mutationErrorMessage')} />}
            <View
                data={{
                    personCategories,
                    personTypes,
                    sources,
                    replications,
                }}
                storePO={storePO}
                updatePO={updatePO}
                isLoading={isLoading}
                isError={isError}
            />
        </>
    )
}
