import { EnumType, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import {
    ApiIntegrationHarmonogram,
    ApiIntegrationHarmonogramList,
    getListIntegrationHarmonogramsQueryKey,
    useListIntegrationHarmonograms,
    useUpdateIntegrationHarmonograms,
} from '@isdd/metais-common/api/generated/provisioning-swagger'
import { FAZA_INTEGRACNEHO_MILNIKA } from '@isdd/metais-common/constants'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export type HarmonogramView = {
    isLoading: boolean
    isError: boolean
    isUpdateLoading: boolean
    isUpdateError: boolean
    isUpdateSuccess: boolean
    data: {
        harmonogramData: ApiIntegrationHarmonogramList | undefined
        integrationPhase: EnumType | undefined
    }
    updateHarmonogram: (formValues: ApiIntegrationHarmonogram[]) => void
    entityId: string
}

type Props = {
    View: React.FC<HarmonogramView>
    entityId: string
}

export const IntegrationHarmonogramContainer: React.FC<Props> = ({ View, entityId }) => {
    const navigate = useNavigate()
    const {
        data: harmonogramData,
        isError,
        isLoading,
        isFetching,
    } = useListIntegrationHarmonograms({
        perPageSize: 10000,
        integrationUuid: entityId,
    })

    const harmonogramDataQK = getListIntegrationHarmonogramsQueryKey({
        perPageSize: 10000,
        integrationUuid: entityId,
    })
    const queryClient = useQueryClient()

    const { data: integrationPhase, isLoading: isPhaseLoading, isError: isPhaseError } = useGetValidEnum(FAZA_INTEGRACNEHO_MILNIKA)
    const {
        mutateAsync,
        isLoading: isUpdateLoading,
        isError: isUpdateError,
        isSuccess: isUpdateSuccess,
    } = useUpdateIntegrationHarmonograms({
        mutation: {
            onSuccess(_, variables) {
                queryClient.setQueryData(harmonogramDataQK, (oldData: ApiIntegrationHarmonogramList | undefined) => {
                    return {
                        ...oldData,
                        results: variables.data,
                    }
                })
                navigate('?')
            },
        },
    })

    const updateHarmonogram = async (formValues: ApiIntegrationHarmonogram[]) => {
        mutateAsync({ integrationUuid: entityId, data: formValues })
    }

    const sortedHarmonogramResults = harmonogramData?.results?.slice().sort((a, b) => {
        if (!a.harmonogramPhase && !b.harmonogramPhase) return 0
        if (!a.harmonogramPhase) return -1
        if (!b.harmonogramPhase) return 1
        return a.harmonogramPhase.localeCompare(b.harmonogramPhase)
    })

    const sortedHarmonogramData = {
        ...harmonogramData,
        results: sortedHarmonogramResults,
    }

    return (
        <View
            data={{ harmonogramData: sortedHarmonogramData, integrationPhase }}
            isError={isError || isPhaseError}
            isLoading={isLoading || isPhaseLoading || isFetching}
            isUpdateSuccess={isUpdateSuccess}
            isUpdateLoading={isUpdateLoading}
            isUpdateError={isUpdateError}
            updateHarmonogram={updateHarmonogram}
            entityId={entityId}
        />
    )
}
