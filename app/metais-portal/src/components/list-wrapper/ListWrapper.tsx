import { Filter } from '@isdd/idsk-ui-kit/filter'
import { IColumn, Input } from '@isdd/idsk-ui-kit/index'
import { DynamicFilterAttributes } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import React, { useState } from 'react'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { useTranslation } from 'react-i18next'
import { Attribute, AttributeProfile, CiType, ConfigurationItemSetUi, EnumType } from '@isdd/metais-common/api'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { ImportButton } from '@isdd/metais-common/components/actions-over-table/actions-default/ImportButton'
import { ExportButton } from '@isdd/metais-common/components/actions-over-table/actions-default/ExportButton'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { BulkPopup, CreateEntityButton } from '@isdd/metais-common/components/actions-over-table'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { CrossInACircleIcon, CheckInACircleIcon, ChangeIcon } from '@isdd/metais-common/assets/images'
import { useLocation, useNavigate } from 'react-router-dom'

import { CiTable } from '@/components/ci-table/CiTable'
import { ColumnsOutputDefinition } from '@/components/ci-table/ciTableHelpers'
import { KSFilterData } from '@/pages/ci/[entityName]'

interface IListWrapper {
    defaultFilterValues: KSFilterData
    ciType: string | undefined
    columnListData: IColumn | undefined
    handleFilterChange: (filter: IFilter) => void
    storeUserSelectedColumns: (columnSelection: {
        attributes: {
            name: string
            order: number
        }[]
        metaAttributes: {
            name: string
            order: number
        }[]
    }) => void
    resetUserSelectedColumns: () => Promise<void>
    ciTypeData: CiType | undefined
    attributeProfiles: AttributeProfile[] | undefined
    attributes: Attribute[] | undefined
    tableData: void | ConfigurationItemSetUi | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData: EnumType | undefined
    pagination: Pagination
    sort: ColumnSort[]
    isLoading: boolean
    isError: boolean
}

export const ListWrapper: React.FC<IListWrapper> = ({
    defaultFilterValues,
    ciType,
    columnListData,
    handleFilterChange,
    storeUserSelectedColumns,
    resetUserSelectedColumns,
    ciTypeData,
    attributeProfiles,
    attributes,
    tableData,
    constraintsData,
    unitsData,
    pagination,
    sort,
    isLoading,
    isError,
}) => {
    const { t } = useTranslation()
    const [rowSelection, setRowSelection] = useState<Record<string, ColumnsOutputDefinition>>({})
    const navigate = useNavigate()
    const location = useLocation()
    const checkedRowItems = Object.keys(rowSelection).length

    return (
        <>
            <Filter<KSFilterData>
                defaultFilterValues={defaultFilterValues}
                form={({ register, filter, setValue }) => (
                    <div>
                        <Input
                            id="name"
                            label={t(`filter.${ciType}.name`)}
                            placeholder={t(`filter.namePlaceholder`)}
                            {...register('Gen_Profil_nazov')}
                        />
                        <Input
                            id="metais-code"
                            label={t('filter.metaisCode.label')}
                            placeholder={t('filter.metaisCode.placeholder')}
                            {...register('Gen_Profil_kod_metais')}
                        />
                        <DynamicFilterAttributes
                            setValue={setValue}
                            defaults={defaultFilterValues}
                            data={filter.attributeFilters}
                            availableAttributes={columnListData?.attributes?.map((att) => ({ ...att, name: att.name ? att.name : '' }))}
                            attributes={attributes}
                            attributeProfiles={attributeProfiles}
                            constraintsData={constraintsData}
                        />
                    </div>
                )}
            />
            <ActionsOverTable
                handleFilterChange={handleFilterChange}
                storeUserSelectedColumns={storeUserSelectedColumns}
                resetUserSelectedColumns={resetUserSelectedColumns}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName={ciTypeData?.name ?? ''}
                attributeProfiles={attributeProfiles ?? []}
                attributes={attributes ?? []}
                columnListData={columnListData}
                ciTypeData={ciTypeData}
                createButton={<CreateEntityButton onClick={() => navigate(`/ci/${ciType}/create`, { state: { from: location } })} />}
                importButton={<ImportButton ciType={ciType ?? ''} />}
                exportButton={<ExportButton />}
                bulkPopup={
                    <BulkPopup
                        checkedRowItems={checkedRowItems}
                        items={[
                            <ButtonLink key={'testItem1'} icon={CrossInACircleIcon} label={t('actionOverTable.invalidateItems')} />,
                            <ButtonLink key={'testItem2'} icon={CheckInACircleIcon} label={t('actionOverTable.validateItems')} />,
                            <ButtonLink key={'testItem3'} icon={ChangeIcon} label={t('actionOverTable.changeOwner')} />,
                        ]}
                    />
                }
            />
            <CiTable
                data={{ columnListData, tableData, constraintsData, unitsData, entityStructure: ciTypeData }}
                handleFilterChange={handleFilterChange}
                pagination={pagination}
                sort={sort}
                rowSelectionState={{ rowSelection, setRowSelection }}
                isLoading={isLoading}
                isError={isError}
            />
        </>
    )
}
