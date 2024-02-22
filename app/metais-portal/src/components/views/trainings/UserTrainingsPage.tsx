import { TextHeading } from '@isdd/idsk-ui-kit'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { useGetRoleParticipantBulk } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetTrainingsForUser } from '@isdd/metais-common/api/generated/trainings-swagger'
import { useGetColumnData, usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { getCiDefaultMetaAttributes } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ActionsOverTable, BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/index'
import { ciItemArrayToObject } from '@isdd/metais-common/src/utils/ciAttributeMapper'
import { useTranslation } from 'react-i18next'

import { CiTable } from '@/components/ci-table/CiTable'
export interface UserTrainingFilter extends IFilterParams, IFilter {}
export const UserTrainingsPage = () => {
    const { t } = useTranslation()

    const entityName = 'Training'

    const { columnListData, saveColumnSelection, resetColumns, isLoading: isColumnsLoading, isError: isColumnsError } = useGetColumnData(entityName)
    const { filter, handleFilterChange } = useFilterParams<UserTrainingFilter>({
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
    })

    const {
        data: tableData,
        isLoading: isTrainingLoading,
        isError: isTrainingError,
    } = useGetTrainingsForUser({ page: filter.pageNumber, perPage: filter.pageSize })

    const mappedTableData = ciItemArrayToObject(tableData)

    const {
        constraintsData,
        unitsData,
        attributeProfiles,
        attributes,
        ciTypeData,
        isError: isAttributesError,
        isLoading: isAttributesLoading,
    } = useAttributesHook(entityName)

    const ownerGids = new Set(tableData?.configurationItemSet?.map((item) => item.metaAttributes?.owner ?? ''))
    const {
        data: gestorsData,
        isLoading: isGestorsLoading,
        isError: isGestorsError,
        fetchStatus,
    } = useGetRoleParticipantBulk({ gids: [...ownerGids] }, { query: { enabled: !!mappedTableData && ownerGids && [...ownerGids]?.length > 0 } })
    const isGestorsLoadingCombined = isGestorsLoading && fetchStatus != 'idle'
    const pagination = usePagination(mappedTableData, {})

    const isLoading = [isGestorsLoadingCombined, isAttributesLoading, isTrainingLoading, isColumnsLoading].some((item) => item)
    const isError = [isGestorsError, isAttributesError, isTrainingError, isColumnsError].some((item) => item)
    return (
        <>
            <TextHeading size="L">{t('userProfile.trainingsHeading')}</TextHeading>
            <QueryFeedback loading={isLoading} error={isError} />

            <ActionsOverTable
                pagination={pagination}
                metaAttributesColumnSection={getCiDefaultMetaAttributes({ t })}
                handleFilterChange={handleFilterChange}
                storeUserSelectedColumns={saveColumnSelection}
                resetUserSelectedColumns={resetColumns}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName={ciTypeData?.name ?? ''}
                attributeProfiles={attributeProfiles ?? []}
                attributes={attributes ?? []}
                columnListData={columnListData}
                ciTypeData={ciTypeData}
            />
            <CiTable
                data={{ columnListData, tableData: mappedTableData, constraintsData, unitsData, entityStructure: ciTypeData, gestorsData }}
                handleFilterChange={() => undefined}
                sort={[]}
                enableSorting={false}
                pagination={pagination}
                storeUserSelectedColumns={saveColumnSelection}
                isLoading={isLoading}
                isError={isError}
                baseHref="/ci/Training"
            />
        </>
    )
}
