import { IFilter } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { Trainee, useGetTrainees } from '@isdd/metais-common/api/generated/trainings-swagger'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React, { useMemo } from 'react'

import { TrainingView } from '@/components/entities/TrainingView'

export interface TrainingContainerView {
    data: Trainee[]
    filteredData: Trainee[]
    filter: IFilter
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
    trainingName: string
}

interface ITrainingContainer {
    entityId: string
    trainingName: string
}

const defaultFilterValues = { fullTextSearch: '', pageNumber: BASE_PAGE_NUMBER, pageSize: BASE_PAGE_SIZE }

export const TrainingContainer: React.FC<ITrainingContainer> = ({ entityId, trainingName }) => {
    const { data, isLoading, isError } = useGetTrainees(entityId)

    const { filter, handleFilterChange } = useFilterParams<IFilterParams & IFilter>(defaultFilterValues)

    const filteredTableData = useMemo(() => {
        const searchQuery = filter?.fullTextSearch?.trim() ?? ''
        const filteredData = data?.traineeList?.filter(
            (item) =>
                item?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.lastName?.toLowerCase().includes(searchQuery.toLowerCase()),
        )

        return filteredData
    }, [filter?.fullTextSearch, data?.traineeList])

    return (
        <TrainingView
            data={data?.traineeList ?? []}
            filteredData={filteredTableData ?? []}
            isLoading={isLoading}
            isError={isError}
            filter={filter}
            handleFilterChange={handleFilterChange}
            trainingName={trainingName}
        />
    )
}
