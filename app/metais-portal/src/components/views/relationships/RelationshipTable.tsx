import { Filter } from '@isdd/idsk-ui-kit/filter'
import { ButtonLink, IOption, MultiSelect } from '@isdd/idsk-ui-kit/index'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { NeighbourPairUi, NeighboursFilterUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ChangeIcon, CheckInACircleIcon, CrossInACircleIcon } from '@isdd/metais-common/assets/images'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { IBulkActionResult, useBulkAction } from '@isdd/metais-common/hooks/useBulkAction'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import {
    ActionsOverTable,
    BASE_PAGE_NUMBER,
    BulkPopup,
    ChangeOwnerBulkModal,
    InvalidateBulkModal,
    MutationFeedback,
    QueryFeedback,
    ReInvalidateBulkModal,
} from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ICiNeighboursListContainerView } from '@/components/containers/CiNeighboursListContainer'

type RelationFilterData = IFilterParams & NeighboursFilterUi

export const RelationshipsTable: React.FC<ICiNeighboursListContainerView> = ({
    data,
    ciTypeData,
    isLoading,
    isError,
    columns,
    selectedColumns,
    saveSelectedColumns,
    resetSelectedColumns,
    rowSelections,
    resetRowSelection,
    sectionsConfig,
    pagination,
    filter,
    apiFilterData,
    handleFilterChange,
    callReadCiNeighbours,
    uiFilterState,
}) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const { currentPreferences } = useUserPreferences()
    const { errorMessage, handleInvalidate, handleReInvalidate, handleChangeOwner } = useBulkAction(true)

    const [showInvalidate, setShowInvalidate] = useState<boolean>(false)
    const [showReInvalidate, setShowReInvalidate] = useState<boolean>(false)
    const [showChangeOwner, setShowChangeOwner] = useState<boolean>(false)
    const [bulkActionResult, setBulkActionResult] = useState<IBulkActionResult>()

    const relationshipItemList = Object.values(rowSelections)?.map((item: NeighbourPairUi) => item.relationship ?? {}) ?? []

    const canSelectInvalidated = !!user?.uuid && currentPreferences.showInvalidatedItems

    const ciTypeOption = apiFilterData?.neighboursFilter.ciType || []
    const relTypeOption = apiFilterData?.neighboursFilter.relType || []
    const stateOption: IOption<string>[] = [
        { value: 'DRAFT', label: t('metaAttributes.state.DRAFT') },
        { value: 'INVALIDATED', label: t('metaAttributes.state.INVALIDATED'), disabled: !canSelectInvalidated },
    ]

    const handleCloseBulkModal = (actionResult: IBulkActionResult, closeFunction: (value: React.SetStateAction<boolean>) => void) => {
        closeFunction(false)
        setBulkActionResult(actionResult)
        resetRowSelection()
    }

    return (
        <>
            <MutationFeedback
                success={bulkActionResult?.isSuccess}
                successMessage={bulkActionResult?.successMessage}
                error={bulkActionResult?.isError}
                errorMessage={bulkActionResult?.errorMessage}
                onMessageClose={() => setBulkActionResult(undefined)}
            />
            <Filter<RelationFilterData>
                defaultFilterValues={{ fullTextSearch: '' }}
                handleOnSubmit={({ fullTextSearch }) => {
                    callReadCiNeighbours({ fullTextSearch, pageNumber: BASE_PAGE_NUMBER })
                }}
                customReset={(resetFilters) => {
                    callReadCiNeighbours({ reset: true })
                    resetFilters()
                }}
                form={() => (
                    <div>
                        <MultiSelect
                            name="ciType"
                            label={t('relationshipsTab.table.ciType')}
                            placeholder={t('relationshipsTab.select.ciType')}
                            options={ciTypeOption}
                            value={uiFilterState.neighboursFilter?.ciType}
                            onChange={(val) =>
                                handleFilterChange({
                                    ...uiFilterState,
                                    neighboursFilter: {
                                        ...uiFilterState.neighboursFilter,
                                        ciType: val,
                                    },
                                })
                            }
                            disabled={ciTypeOption.length === 0}
                        />
                        <MultiSelect
                            name="relType"
                            label={t('relationshipsTab.table.relationshipType')}
                            placeholder={t('relationshipsTab.select.relationshipType')}
                            options={relTypeOption}
                            value={uiFilterState.neighboursFilter?.relType}
                            onChange={(val) =>
                                handleFilterChange({
                                    ...uiFilterState,
                                    neighboursFilter: {
                                        ...uiFilterState.neighboursFilter,
                                        relType: val,
                                    },
                                })
                            }
                            disabled={relTypeOption.length === 0}
                        />
                        <MultiSelect
                            name="metaAttributes.state"
                            label={t('relationshipsTab.table.evidenceStatus')}
                            placeholder={t('relationshipsTab.select.evidenceStatus')}
                            options={stateOption}
                            value={uiFilterState.neighboursFilter?.metaAttributes?.state}
                            onChange={(val) =>
                                handleFilterChange({
                                    ...uiFilterState,
                                    neighboursFilter: {
                                        ...uiFilterState.neighboursFilter,
                                        metaAttributes: {
                                            ...uiFilterState.neighboursFilter?.metaAttributes,
                                            state: val,
                                        },
                                    },
                                })
                            }
                        />
                    </div>
                )}
            />
            <QueryFeedback loading={isLoading} error={isError} withChildren>
                <ActionsOverTable
                    pagination={pagination}
                    entityName=""
                    simpleTableColumnsSelect={{ sections: sectionsConfig, selectedColumns, resetSelectedColumns, saveSelectedColumns }}
                    handleFilterChange={handleFilterChange}
                    selectedRowsCount={Object.keys(rowSelections).length}
                    bulkPopup={({ selectedRowsCount }) => (
                        <Tooltip
                            descriptionElement={errorMessage}
                            position={'center center'}
                            tooltipContent={(open) => (
                                <BulkPopup
                                    checkedRowItems={selectedRowsCount}
                                    items={(closePopup) => [
                                        <ButtonLink
                                            key={'invalidate'}
                                            onClick={() => {
                                                open()
                                                handleInvalidate(relationshipItemList, () => setShowInvalidate(true), open)
                                                closePopup()
                                            }}
                                            icon={CrossInACircleIcon}
                                            label={t('actionOverTable.invalidateItems')}
                                        />,
                                        <ButtonLink
                                            key={'reInvalidate'}
                                            onClick={() => {
                                                handleReInvalidate(relationshipItemList, () => setShowReInvalidate(true), open)
                                                closePopup()
                                            }}
                                            icon={CheckInACircleIcon}
                                            label={t('actionOverTable.validateItems')}
                                        />,
                                        <ButtonLink
                                            key={'changeOwner'}
                                            onClick={() => {
                                                handleChangeOwner(relationshipItemList, () => setShowChangeOwner(true), open)
                                                closePopup()
                                            }}
                                            icon={ChangeIcon}
                                            label={t('actionOverTable.changeOwner')}
                                        />,
                                    ]}
                                />
                            )}
                        />
                    )}
                />
                <ReInvalidateBulkModal
                    items={relationshipItemList}
                    open={showReInvalidate}
                    multiple
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowReInvalidate)}
                    onClose={() => setShowReInvalidate(false)}
                    isRelation
                />
                <InvalidateBulkModal
                    items={relationshipItemList}
                    open={showInvalidate}
                    multiple
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowInvalidate)}
                    onClose={() => setShowInvalidate(false)}
                    isRelationList
                />

                <ChangeOwnerBulkModal
                    items={relationshipItemList}
                    open={showChangeOwner}
                    multiple
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowChangeOwner)}
                    onClose={() => setShowChangeOwner(false)}
                    ciRoles={ciTypeData?.roleList ?? []}
                    isRelation
                />

                <Table
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                    error={isError}
                    sort={filter?.sort}
                    onSortingChange={(sort) => callReadCiNeighbours({ sort: sort })}
                />
            </QueryFeedback>
            <PaginatorWrapper {...pagination} handlePageChange={({ pageNumber }) => callReadCiNeighbours({ pageNumber })} />
        </>
    )
}
