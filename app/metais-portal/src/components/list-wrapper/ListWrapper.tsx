import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { Filter } from '@isdd/idsk-ui-kit/filter'
import { IColumn, Input } from '@isdd/idsk-ui-kit/index'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { Attribute, AttributeProfile, CiType, ConfigurationItemSetUi, EnumType, RoleParticipantUI } from '@isdd/metais-common/api'
import { ChangeIcon, CheckInACircleIcon, CrossInACircleIcon } from '@isdd/metais-common/assets/images'
import { BulkPopup, CreateEntityButton } from '@isdd/metais-common/components/actions-over-table'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { ExportButton } from '@isdd/metais-common/components/actions-over-table/actions-default/ExportButton'
import { ImportButton } from '@isdd/metais-common/components/actions-over-table/actions-default/ImportButton'
import { DynamicFilterAttributes } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useNewRelationData } from '@isdd/metais-common/contexts/new-relation/newRelationContext'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { AddItemsButtonGroup } from '@/components/add-items-button-group/AddItemsButtonGroup'
import { CiTable, IRowSelectionState } from '@/components/ci-table/CiTable'
import { ColumnsOutputDefinition } from '@/components/ci-table/ciTableHelpers'
import { KSFilterData } from '@/pages/ci/[entityName]'

interface IListWrapper {
    isNewRelationModal?: boolean
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
    gestorsData: RoleParticipantUI[] | undefined
    rowSelectionState: IRowSelectionState
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
    gestorsData,
    isLoading,
    isError,
    isNewRelationModal,
    rowSelectionState,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { setRowSelection, rowSelection } = rowSelectionState
    const { setSelectedItems, setIsListPageOpen, selectedItems } = useNewRelationData()
    const checkedRowItems = Object.keys(rowSelectionState.rowSelection).length

    useEffect(() => {
        if (isNewRelationModal && selectedItems) {
            if (Array.isArray(selectedItems))
                setRowSelection(
                    selectedItems.reduce(
                        (acc: Record<string, ColumnsOutputDefinition>, item: ColumnsOutputDefinition) => ({
                            ...acc,
                            [item.uuid ?? '']: item,
                        }),
                        {},
                    ),
                )
        }
    }, [isNewRelationModal, selectedItems, setRowSelection])

    const handleRelationItemsChange = () => {
        const selectedItemsKeys = Object.keys(rowSelection)
        setSelectedItems(selectedItemsKeys.map((key) => rowSelection[key]))
        setIsListPageOpen(false)
    }

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
                            attributes={attributes}
                            attributeProfiles={attributeProfiles}
                            constraintsData={constraintsData}
                        />
                    </div>
                )}
            />
            {isNewRelationModal && (
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
                    bulkPopup={<AddItemsButtonGroup handleItemsChange={handleRelationItemsChange} />}
                />
            )}
            {!isNewRelationModal && (
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
                            items={() => [
                                <ButtonLink key={'testItem1'} icon={CrossInACircleIcon} label={t('actionOverTable.invalidateItems')} />,
                                <ButtonLink key={'testItem2'} icon={CheckInACircleIcon} label={t('actionOverTable.validateItems')} />,
                                <ButtonLink key={'testItem3'} icon={ChangeIcon} label={t('actionOverTable.changeOwner')} />,
                            ]}
                        />
                    }
                />
            )}

            <CiTable
                data={{ columnListData, tableData, constraintsData, unitsData, entityStructure: ciTypeData, gestorsData }}
                handleFilterChange={handleFilterChange}
                pagination={pagination}
                sort={sort}
                rowSelectionState={rowSelectionState}
                isLoading={isLoading}
                isError={isError}
            />
            {isNewRelationModal && <AddItemsButtonGroup handleItemsChange={handleRelationItemsChange} isUnderTable />}
        </>
    )
}
