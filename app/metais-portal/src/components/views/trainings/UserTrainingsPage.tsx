import { TextHeading } from '@isdd/idsk-ui-kit'
import { useGetRoleParticipantBulk } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetTrainingsForUser } from '@isdd/metais-common/api/generated/trainings-swagger'
import { useGetColumnData, usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useTranslation } from 'react-i18next'
import { ciItemArrayToObject } from '@isdd/metais-common/src/utils/ciAttributeMapper'

import { CiTable } from '@/components/ci-table/CiTable'

export const UserTrainingsPage = () => {
    const { t } = useTranslation()

    const entityName = 'Training'

    const { columnListData, saveColumnSelection, isLoading: isColumnsLoading, isError: isColumnsError } = useGetColumnData(entityName)

    const { data: tableData, isLoading: isTrainingLoading, isError: isTrainingError } = useGetTrainingsForUser()

    const mappedTableData = ciItemArrayToObject(tableData)

    const { constraintsData, unitsData, ciTypeData, isError: isAttributesError, isLoading: isAttributesLoading } = useAttributesHook(entityName)

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
