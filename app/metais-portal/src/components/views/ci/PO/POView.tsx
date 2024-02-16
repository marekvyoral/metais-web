import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { getCiDefaultMetaAttributes } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { ExportButton, ImportButton } from '@isdd/metais-common/components/actions-over-table'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { QueryFeedback } from '@isdd/metais-common/index'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { getRowSelectionUuids } from '@/componentHelpers/ci/ciTableHelpers'
import { CiTable } from '@/components/ci-table/CiTable'
import { ICiListContainerView } from '@/components/containers/CiListContainer'
import { FilterPO, POFilterData } from '@/components/entities/projekt/Filters/FilterPO'

export const POView: React.FC<ICiListContainerView<POFilterData>> = memo(
    ({
        attributeProfiles,
        constraintsData,
        unitsData,
        ciTypeData,
        attributes,
        entityName,
        gestorsData,
        columnListData,
        tableData,
        defaultFilterValues,
        handleFilterChange,
        storeUserSelectedColumns,
        resetUserSelectedColumns,
        pagination,
        sort,
        isLoading,
        isError,
        POType,
        rowSelection,
        setRowSelection,
    }) => {
        const { t } = useTranslation()

        return (
            <QueryFeedback loading={isLoading} error={false} withChildren>
                <FlexColumnReverseWrapper>
                    <TextHeading size="XL">{t(`ciType.${POType}_Heading`)}</TextHeading>
                    {isError && <QueryFeedback error={isError} loading={false} />}
                </FlexColumnReverseWrapper>
                <FilterPO
                    entityName={entityName}
                    defaultFilterValues={defaultFilterValues}
                    attributeProfiles={attributeProfiles}
                    attributes={attributes}
                    constraintsData={constraintsData}
                    codePrefix={ciTypeData?.codePrefix}
                />
                <ActionsOverTable
                    pagination={pagination}
                    metaAttributesColumnSection={getCiDefaultMetaAttributes({ t })}
                    handleFilterChange={handleFilterChange}
                    storeUserSelectedColumns={storeUserSelectedColumns}
                    resetUserSelectedColumns={resetUserSelectedColumns}
                    pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                    entityName={ciTypeData?.name ?? ''}
                    attributeProfiles={attributeProfiles ?? []}
                    attributes={attributes ?? []}
                    columnListData={columnListData}
                    selectedRowsCount={Object.keys(rowSelection).length}
                    exportButton={
                        <ExportButton
                            defaultFilterValues={defaultFilterValues}
                            checkedItemsUuids={getRowSelectionUuids(rowSelection)}
                            pagination={pagination}
                        />
                    }
                    importButton={<ImportButton ciType={entityName} />}
                />
                <CiTable
                    data={{ columnListData, tableData, constraintsData, unitsData, entityStructure: ciTypeData, gestorsData }}
                    rowSelectionState={{ rowSelection, setRowSelection }}
                    handleFilterChange={handleFilterChange}
                    pagination={pagination}
                    sort={sort}
                    isLoading={isLoading}
                    isError={isError}
                />
            </QueryFeedback>
        )
    },
)
