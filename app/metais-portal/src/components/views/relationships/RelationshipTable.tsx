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
    BulkPopup,
    ChangeOwnerBulkModal,
    InvalidateBulkModal,
    MutationFeedback,
    ReInvalidateBulkModal,
} from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ICiNeighboursListContainerView } from '@/components/containers/CiNeighboursListContainer'

type RelationFilterData = IFilterParams & NeighboursFilterUi

export const RelationshipsTable: React.FC<ICiNeighboursListContainerView> = ({
    data,
    ciTypeData,
    refetch,
    isLoading,
    isError,
    columns,
    selectedColumns,
    saveSelectedColumns,
    resetSelectedColumns,
    rowSelections,
    sectionsConfig,
    pagination,
    filter,
    apiFilterData,
    handleFilterChange,
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

    const configurationItemList = Object.values(rowSelections)?.map((item: NeighbourPairUi) => item.configurationItem ?? {}) ?? []

    const canSelectInvalidated = !!user?.uuid && currentPreferences.showInvalidatedItems

    const ciTypeOption = apiFilterData?.ciType?.map((type) => ({ label: type, value: type })) || []
    const relTypeOption = apiFilterData?.relType?.map((type) => ({ label: type, value: type })) || []
    const stateOption: IOption<string>[] = [
        { value: 'DRAFT', label: t('metaAttributes.state.DRAFT') },
        { value: 'INVALIDATED', label: t('metaAttributes.state.INVALIDATED'), disabled: !canSelectInvalidated },
    ]

    const defaultValues: RelationFilterData = {
        relType: filter?.neighboursFilter?.relType,
        ciType: filter?.neighboursFilter?.ciType,
        metaAttributes: filter?.neighboursFilter?.metaAttributes,
        fullTextSearch: filter?.neighboursFilter?.fullTextSearch,
    }

    const checkedRowItems = Object.keys(rowSelections).length
    const isDisabledBulkButton = checkedRowItems === 0

    const handleCloseBulkModal = (actionResult: IBulkActionResult, closeFunction: (value: React.SetStateAction<boolean>) => void) => {
        closeFunction(false)
        refetch()
        setBulkActionResult(actionResult)
    }

    return (
        <>
            {(bulkActionResult?.isError || bulkActionResult?.isSuccess) && (
                <MutationFeedback
                    success={bulkActionResult?.isSuccess}
                    successMessage={bulkActionResult?.successMessage}
                    error={bulkActionResult?.isError ? bulkActionResult?.errorMessage || t('feedback.mutationErrorMessage') : ''}
                />
            )}
            <Filter<RelationFilterData>
                defaultFilterValues={defaultValues}
                handleOnSubmit={({ ciType, metaAttributes, relType, fullTextSearch }) => {
                    handleFilterChange({
                        neighboursFilter: {
                            ciType,
                            metaAttributes,
                            relType,
                            fullTextSearch,
                        },
                    })
                }}
                form={({ setValue }) => (
                    <div>
                        <MultiSelect
                            name="ciType"
                            label={t('relationshipsTab.table.ciType')}
                            placeholder={t('relationshipsTab.select.ciType')}
                            options={ciTypeOption}
                            defaultValue={filter?.neighboursFilter?.ciType}
                            setValue={setValue}
                            disabled={ciTypeOption.length === 0}
                        />
                        <MultiSelect
                            name="relType"
                            label={t('relationshipsTab.table.relationshipType')}
                            placeholder={t('relationshipsTab.select.relationshipType')}
                            options={relTypeOption}
                            defaultValue={filter?.neighboursFilter?.relType}
                            setValue={setValue}
                            disabled={relTypeOption.length === 0}
                        />
                        <MultiSelect
                            name="metaAttributes.state"
                            label={t('relationshipsTab.table.evidenceStatus')}
                            placeholder={t('relationshipsTab.select.evidenceStatus')}
                            options={stateOption}
                            defaultValue={filter?.neighboursFilter?.metaAttributes?.state}
                            setValue={setValue}
                        />
                    </div>
                )}
            />
            <ActionsOverTable
                pagination={pagination}
                entityName=""
                simpleTableColumnsSelect={{ sections: sectionsConfig, selectedColumns, resetSelectedColumns, saveSelectedColumns }}
                handleFilterChange={handleFilterChange}
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
                                            onClick={() => {
                                                open()
                                                handleInvalidate(configurationItemList, () => setShowInvalidate(true), open)
                                            }}
                                            icon={CrossInACircleIcon}
                                            label={t('actionOverTable.invalidateItems')}
                                        />,
                                        <ButtonLink
                                            key={'reInvalidate'}
                                            onClick={() => {
                                                handleReInvalidate(configurationItemList, () => setShowReInvalidate(true), open)
                                            }}
                                            icon={CheckInACircleIcon}
                                            label={t('actionOverTable.validateItems')}
                                        />,
                                        <ButtonLink
                                            key={'changeOwner'}
                                            onClick={() => {
                                                handleChangeOwner(configurationItemList, () => setShowChangeOwner(true), open)
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
            <ReInvalidateBulkModal
                items={configurationItemList}
                open={showReInvalidate}
                multiple
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowReInvalidate)}
                onClose={() => setShowReInvalidate(false)}
            />
            <InvalidateBulkModal
                items={configurationItemList}
                open={showInvalidate}
                multiple
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowInvalidate)}
                onClose={() => setShowInvalidate(false)}
            />

            <ChangeOwnerBulkModal
                items={configurationItemList}
                open={showChangeOwner}
                multiple
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowChangeOwner)}
                onClose={() => setShowChangeOwner(false)}
                ciRoles={ciTypeData?.roleList ?? []}
            />

            <Table columns={columns} data={data} isLoading={isLoading} error={isError} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </>
    )
}
