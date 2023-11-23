import React, { useState } from 'react'
import { getCiDefaultMetaAttributes } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { CreateEntityButton, ExportButton, ImportButton } from '@isdd/metais-common/components/actions-over-table'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { IListData } from '@isdd/metais-common/types/list'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { FavoriteCiType } from '@isdd/metais-common/api/generated/user-config-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'
import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { AttributesContainerViewData } from '@isdd/metais-common/components/containers/AttributesContainer'
import { Languages } from '@isdd/metais-common/localization/languages'

import { CiTable } from '@/components/ci-table/CiTable'
import { FilterPO, POFilterData } from '@/components/entities/projekt/Filters/FilterPO'
import { ColumnsOutputDefinition } from '@/componentHelpers/ci/ciTableHelpers'

interface Props {
    attributesData: AttributesContainerViewData
    ciListData: IListData
    entityName: string
    defaultFilterValues: POFilterData
    handleFilterChange: (filter: IFilter) => void
    storeUserSelectedColumns: (columnSelection: FavoriteCiType) => void
    resetUserSelectedColumns: () => Promise<void>
    pagination: Pagination
    sort: ColumnSort[]
    isError: boolean
    isLoading: boolean
    POType: string
}

export const POView: React.FC<Props> = ({
    attributesData,
    ciListData,
    entityName,
    defaultFilterValues,
    handleFilterChange,
    storeUserSelectedColumns,
    resetUserSelectedColumns,
    pagination,
    sort,
    isLoading,
    isError,
    POType,
}) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { attributeProfiles, constraintsData, unitsData, ciTypeData, attributes } = attributesData
    const { columnListData, tableData, gestorsData } = ciListData
    const [rowSelection, setRowSelection] = useState<Record<string, ColumnsOutputDefinition>>({})
    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t(`ciType.${POType}_Heading`)}</TextHeading>
                {isError && <QueryFeedback error={isError} loading={false} />}
            </FlexColumnReverseWrapper>
            <FilterPO
                entityName={entityName}
                availableAttributes={columnListData?.attributes}
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
                createButton={
                    <CreateEntityButton
                        ciTypeName={i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName}
                        onClick={() => navigate(`/ci/${entityName}/create`, { state: { from: location } })}
                    />
                }
                exportButton={<ExportButton />}
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
}
