import React, { useState } from 'react'
import { EnumType, useGetEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import {
    useStorePoWithHierarchyRel,
    useStorePo,
    useGetRequestStatusHook,
    PoWithHierarchyUi,
    ConfigurationItemUi,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { MutationFeedback } from '@isdd/metais-common/components/mutation-feedback/MutationFeedback'
import { useTranslation } from 'react-i18next'
import { useInvalidateCiListFilteredCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { GET_ENUM } from '@isdd/metais-common/api/constants'

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
    const { data: personTypes, isLoading: personTypesLoading, isError: personTypesError } = useGetEnum(GET_ENUM.TYP_OSOBY)
    const { data: personCategories, isLoading: personCategoriesLoading, isError: personCategoriesError } = useGetEnum(GET_ENUM.KATEGORIA_OSOBA)
    const { data: sources, isLoading: sourcesLoading, isError: sourcesError } = useGetEnum(GET_ENUM.ZDROJ)
    const { data: replications, isLoading: replicationsLoading, isError: replicationsError } = useGetEnum(GET_ENUM.TYP_REPLIKACIE)
    const checkProcessHook = useGetRequestStatusHook()

    const { mutateAsync } = useStorePoWithHierarchyRel()
    const { mutateAsync: updatePOMutation } = useStorePo()

    const [isLoadingUpdatePO, setLoadingUpdatePO] = useState<boolean>(false)
    const [isLoadingStorePO, setLoadingStorePO] = useState<boolean>(false)
    const [errorUpdatePO, setErrorUpdatePO] = useState<string>()
    const [errorStorePO, setErrorStorePO] = useState<string>()
    const [isSuccess, setSuccess] = useState<boolean | undefined>(undefined)

    const invalidatePOList = useInvalidateCiListFilteredCache()

    const storePO = async (formData: PoWithHierarchyUi, poId: string, relId: string) => {
        setLoadingStorePO(true)
        setErrorStorePO(undefined)
        await mutateAsync({
            poId,
            relId,
            data: {
                ...formData,
            },
        })
            .then(async (res) => {
                await checkProcessHook(res?.requestId ?? '')
                    .then((resB) => {
                        setSuccess(resB?.processed)
                        invalidatePOList.invalidate({})
                    })
                    .catch(() => {
                        setSuccess(false)
                    })
            })
            .catch((err) => {
                setErrorStorePO(err)
            })
            .finally(() => {
                setLoadingStorePO(false)
            })
    }

    const updatePO = async (poId: string, formData: ConfigurationItemUi) => {
        setErrorUpdatePO(undefined)
        setLoadingUpdatePO(true)
        await updatePOMutation({
            poId,
            data: {
                ...formData,
            },
        })
            .then(async (res) => {
                await checkProcessHook(res?.requestId ?? '')
                    .then((resB) => {
                        setSuccess(resB?.processed)
                        invalidatePOList.invalidate({ ciUuid: poId })
                    })
                    .catch(() => {
                        setSuccess(false)
                    })
            })
            .catch((err) => {
                setErrorUpdatePO(err)
            })
            .finally(() => {
                setLoadingUpdatePO(false)
            })
    }
    const isLoading = personTypesLoading || personCategoriesLoading || sourcesLoading || replicationsLoading || isLoadingUpdatePO || isLoadingStorePO
    const isError = personTypesError || personCategoriesError || sourcesError || replicationsError || !!errorUpdatePO || !!errorStorePO

    return (
        <>
            {isSuccess !== undefined && <MutationFeedback success={isSuccess} error={isSuccess ? undefined : t('feedback.mutationErrorMessage')} />}
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
