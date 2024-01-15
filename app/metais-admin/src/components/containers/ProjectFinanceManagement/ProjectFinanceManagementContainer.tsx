import { IFilter } from '@isdd/idsk-ui-kit/types'
import {
    ApiApprovalProcess,
    ApiError,
    ApiProgram,
    GetProgramWithPartsParams,
    UpdateProgramPartsFinance200,
    useGetAllApprovalProcess,
    useGetAllPrograms,
    useGetProgramWithParts,
    useUpdateProgramPartsFinance,
} from '@isdd/metais-common/api/generated/kris-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, UseMutateAsyncFunction } from '@tanstack/react-query'
import React, { useState } from 'react'

export interface IProjectFinanceFilter extends GetProgramWithPartsParams, IFilter, IFilterParams {}

export interface IView {
    isLoading: boolean
    allPrograms?: ApiProgram[]
    program?: ApiProgram
    approvalProcesses?: ApiApprovalProcess[]
    updateProgramHook: UseMutateAsyncFunction<
        UpdateProgramPartsFinance200,
        ApiError,
        {
            id: number
            data: ApiProgram
        },
        unknown
    >
    filter: IProjectFinanceFilter
    handleFilterChange: (changedFilter: IFilter) => void
    refetchProgram: <TPageData>(options?: RefetchOptions & RefetchQueryFilters<TPageData>) => Promise<QueryObserverResult<ApiProgram, ApiError>>
    setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>
    isError: boolean
    isSuccess: boolean
}

export interface IProjectFinanceManagementContainerProps {
    View: React.FC<IView>
}

export const defaultFilter: IProjectFinanceFilter = {
    programUuid: '',
    projectType: '',
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
}

export const ProjectFinanceManagementContainer: React.FC<IProjectFinanceManagementContainerProps> = ({ View }) => {
    const { data: allPrograms, isLoading: isAllProgramsLoadings } = useGetAllPrograms()
    const { data: approvalProcesses, isLoading: isApprovalProcessesLoading } = useGetAllApprovalProcess()
    const [isUpdating, setIsUpdating] = useState(false)
    const { filter, handleFilterChange } = useFilterParams<GetProgramWithPartsParams>(defaultFilter)
    const loadProgram = !!filter.programUuid && filter.programUuid != '' && !!filter.projectType && filter.projectType != ''
    const {
        data: program,
        isLoading: isProgramLoading,
        refetch: refetchProgram,
    } = useGetProgramWithParts(
        { programUuid: filter.programUuid, projectType: filter.projectType },
        {
            query: { enabled: loadProgram, queryKey: [filter] },
        },
    )
    const {
        mutateAsync: updateProgramHook,
        isError,
        isSuccess,
    } = useUpdateProgramPartsFinance({
        mutation: {
            onSuccess() {
                setIsUpdating(false)
                refetchProgram()
            },
            onError() {
                setIsUpdating(false)
            },
        },
    })

    return (
        <View
            isLoading={isAllProgramsLoadings || isApprovalProcessesLoading || (loadProgram && isProgramLoading) || isUpdating}
            allPrograms={allPrograms}
            approvalProcesses={approvalProcesses}
            program={program}
            updateProgramHook={updateProgramHook}
            filter={filter}
            handleFilterChange={handleFilterChange}
            refetchProgram={refetchProgram}
            setIsUpdating={setIsUpdating}
            isError={isError}
            isSuccess={isSuccess}
        />
    )
}
