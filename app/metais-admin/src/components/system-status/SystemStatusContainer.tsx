import { ApiError, EnumItem, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import {
    CurrentSystemState,
    CurrentSystemStateIn,
    useClearCurrentSystemState,
    useGetCurrentSystemState,
    useSetCurrentSystemState,
} from '@isdd/metais-common/api/generated/monitoring-swagger'
import { MutationFeedback, QueryFeedback, SYSTEM_STATE, SYSTEM_STATE_COLOR } from '@isdd/metais-common/index'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface IView {
    currentSystemState?: CurrentSystemState
    systemStates?: EnumItem[]
    systemStatesColors?: EnumItem[]
    deleteInfoBar: UseMutateAsyncFunction<CurrentSystemState, ApiError, void, unknown>
    saveInfoBar: UseMutateAsyncFunction<
        CurrentSystemState,
        ApiError,
        {
            data: CurrentSystemStateIn
        },
        unknown
    >
    setCurrentData: React.Dispatch<React.SetStateAction<CurrentSystemState | undefined>>
}
interface ISystemStatusContainer {
    View: React.FC<IView>
}

export const SystemStatusContainer: React.FC<ISystemStatusContainer> = ({ View }) => {
    const { t } = useTranslation()
    const [currentData, setCurrentData] = useState<CurrentSystemState>()

    const {
        data: systemStates,
        isLoading: isSystemStatesLoading,
        isError: isSystemStatesError,
    } = useGetValidEnum(SYSTEM_STATE, {
        query: {
            select: (data) => data.enumItems?.sort((a, b) => (a.orderList ?? 0) - (b.orderList ?? 0)),
        },
    })
    const {
        data: systemStatesColors,
        isLoading: isSystemStatesColorsLoading,
        isError: isSystemStatesColorsError,
    } = useGetValidEnum(SYSTEM_STATE_COLOR, {
        query: {
            select: (data) => data.enumItems?.sort((a, b) => (a.orderList ?? 0) - (b.orderList ?? 0)),
        },
    })
    const { isLoading, isError } = useGetCurrentSystemState({
        query: {
            select: (data) => {
                if (!currentData || currentData?.id != data.id) {
                    if (data.createdAt != null) {
                        setCurrentData(data)
                    } else {
                        setCurrentData({ text: '', systemState: systemStates?.at(0), systemStateColor: systemStatesColors?.at(0) })
                    }
                }

                return data
            },
            enabled: !!systemStates && !!systemStatesColors,
        },
    })

    const {
        mutateAsync: deleteInfoBar,
        isLoading: isDeleting,
        isError: isDeletingError,
        isSuccess: isSuccessfullyDeleted,
        reset: resetDeleteAsync,
    } = useClearCurrentSystemState()
    const {
        mutateAsync: saveInfoBar,
        isLoading: isSaving,
        isError: isSavingError,
        isSuccess: isSuccessfullySaved,
    } = useSetCurrentSystemState({ mutation: { onMutate: () => resetDeleteAsync() } })

    return (
        <QueryFeedback
            loading={isLoading || isSystemStatesLoading || isSystemStatesColorsLoading || isSaving || isDeleting}
            error={isError || isSystemStatesError || isSystemStatesColorsError || isDeletingError || isSavingError}
        >
            <MutationFeedback
                success={isSuccessfullySaved || isSuccessfullyDeleted}
                error={false}
                successMessage={isSuccessfullyDeleted ? t('mutationFeedback.successfulDeleted') : t('mutationFeedback.successfulUpdated')}
            />
            <View
                currentSystemState={currentData}
                systemStates={systemStates}
                systemStatesColors={systemStatesColors}
                deleteInfoBar={deleteInfoBar}
                saveInfoBar={saveInfoBar}
                setCurrentData={setCurrentData}
            />
        </QueryFeedback>
    )
}
