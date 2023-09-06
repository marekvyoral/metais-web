import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { Filter } from '@isdd/idsk-ui-kit/filter'
import { IColumn, Input, LoadingIndicator } from '@isdd/idsk-ui-kit/index'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { Attribute, AttributeProfile, CiType, ConfigurationItemSetUi, EnumType, RoleParticipantUI } from '@isdd/metais-common/api'
import { ChangeIcon, CheckInACircleIcon, CrossInACircleIcon } from '@isdd/metais-common/assets/images'
import {
    BulkPopup,
    ChangeOwnerBulkModal,
    CreateEntityButton,
    InvalidateBulkModal,
    ReInvalidateBulkModal,
} from '@isdd/metais-common/components/actions-over-table'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { ExportButton } from '@isdd/metais-common/components/actions-over-table/actions-default/ExportButton'
import { ImportButton } from '@isdd/metais-common/components/actions-over-table/actions-default/ImportButton'
import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { DynamicFilterAttributes } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useNewRelationData } from '@isdd/metais-common/contexts/new-relation/newRelationContext'
import { IBulkActionResult, useBulkAction } from '@isdd/metais-common/hooks/useBulkAction'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { MutationFeedback } from '@isdd/metais-common/index'

import { AddItemsButtonGroup } from '@/components/add-items-button-group/AddItemsButtonGroup'
import { CiTable, IRowSelectionState } from '@/components/ci-table/CiTable'
import { ColumnsOutputDefinition } from '@/components/ci-table/ciTableHelpers'
import { KSFilterData } from '@/pages/ci/[entityName]/entity'

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
    refetch: () => void
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
    refetch,
    gestorsData,
    isLoading,
    isError,
    isNewRelationModal,
    rowSelectionState,
}) => {
    const { t } = useTranslation()

    const { errorMessage, isBulkLoading, handleInvalidate, handleReInvalidate, handleChangeOwner } = useBulkAction()

    const navigate = useNavigate()
    const location = useLocation()
    const { setRowSelection, rowSelection } = rowSelectionState
    const { setSelectedItems, setIsListPageOpen, selectedItems } = useNewRelationData()
    const checkedRowItems = Object.keys(rowSelectionState.rowSelection).length
    const isDisabledBulkButton = checkedRowItems === 0

    const [showInvalidate, setShowInvalidate] = useState<boolean>(false)
    const [showReInvalidate, setShowReInvalidate] = useState<boolean>(false)
    const [showChangeOwner, setShowChangeOwner] = useState<boolean>(false)

    const [bulkActionResult, setBulkActionResult] = useState<IBulkActionResult>()

    const checkedItemList = tableData?.configurationItemSet?.filter((i) => Object.keys(rowSelectionState.rowSelection).includes(i.uuid || '')) || []

    const handleCloseBulkModal = (actionResult: IBulkActionResult, closeFunction: (value: React.SetStateAction<boolean>) => void) => {
        closeFunction(false)
        refetch()
        setBulkActionResult(actionResult)
    }

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
            {(bulkActionResult?.isError || bulkActionResult?.isSuccess) && (
                <MutationFeedback
                    success={bulkActionResult?.isSuccess}
                    successMessage={bulkActionResult?.successMessage}
                    error={bulkActionResult?.isError ? t('feedback.mutationErrorMessage') : ''}
                />
            )}
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
                        <Tooltip
                            descriptionElement={errorMessage}
                            position={'center center'}
                            tooltipContent={(open) => (
                                <div>
                                    <BulkPopup
                                        disabled={isDisabledBulkButton}
                                        checkedRowItems={checkedRowItems}
                                        items={() => [
                                            <ButtonLink
                                                key={'invalidate'}
                                                className={styles.buttonLinkWithIcon}
                                                onClick={() => {
                                                    handleInvalidate(checkedItemList, setShowInvalidate, open)
                                                }}
                                                icon={CrossInACircleIcon}
                                                label={t('actionOverTable.invalidateItems')}
                                            />,
                                            <ButtonLink
                                                key={'reInvalidate'}
                                                className={styles.buttonLinkWithIcon}
                                                onClick={() => {
                                                    handleReInvalidate(checkedItemList, setShowReInvalidate, open)
                                                }}
                                                icon={CheckInACircleIcon}
                                                label={t('actionOverTable.validateItems')}
                                            />,
                                            <ButtonLink
                                                key={'changeOwner'}
                                                className={styles.buttonLinkWithIcon}
                                                onClick={() => {
                                                    handleChangeOwner(checkedItemList, setShowChangeOwner, open)
                                                }}
                                                icon={ChangeIcon}
                                                label={t('actionOverTable.changeOwner')}
                                            />,
                                        ]}
                                    />
                                </div>
                            )}
                        />
                    }
                />
            )}

            {isBulkLoading && <LoadingIndicator fullscreen />}

            <ReInvalidateBulkModal
                items={checkedItemList}
                open={showReInvalidate}
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowReInvalidate)}
                onClose={() => setShowReInvalidate(false)}
            />
            <InvalidateBulkModal
                items={checkedItemList}
                open={showInvalidate}
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowInvalidate)}
                onClose={() => setShowInvalidate(false)}
            />
            <ChangeOwnerBulkModal
                items={checkedItemList}
                open={showChangeOwner}
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowChangeOwner)}
                onClose={() => setShowChangeOwner(false)}
            />

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
