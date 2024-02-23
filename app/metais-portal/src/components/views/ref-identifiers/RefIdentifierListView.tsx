import { ButtonLink, Filter, Input, MultiSelect, PaginatorWrapper, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { FollowedItemItemType } from '@isdd/metais-common/api/generated/user-config-swagger'
import { NotificationBlackIcon } from '@isdd/metais-common/assets/images'
import actionsOverTableStyles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useAddFavorite } from '@isdd/metais-common/hooks/useAddFavorite'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { ActionsOverTable, BulkPopup, CreateEntityButton, MutationFeedback, QueryFeedback, RefIdentifierTypeEnum } from '@isdd/metais-common/index'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { Row } from '@tanstack/react-table'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { refIdentifierColumns, refIdentifierStateOptions, refIdentifierTypeOptions, refIdentifierViewOptions } from './refIdentifierListProps'

import { ColumnsOutputDefinition, reduceTableDataToObject } from '@/componentHelpers/ci/ciTableHelpers'
import { RefIdentifierListFilterData, RefIdentifiersContainerViewProps } from '@/components/containers/ref-identifiers/RefIdentifiersContainer'

export const RefIdentifierListView: React.FC<RefIdentifiersContainerViewProps> = ({
    data,
    registrationState,
    defaultFilter,
    pagination,
    filter,
    isLoggedIn,
    isError,
    isLoading,
    handleFilterChange,
    rowSelection,
    setRowSelection,
}) => {
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const {
        isActionSuccess: { value: isExternalSuccess },
    } = useActionSuccess()
    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    const {
        addFavorite,
        error: errorAddToFavorite,
        isLoading: isLoadingAddToFavorite,
        isSuccess: isSuccessAddToFavorite,
        resetState,
        successMessage,
    } = useAddFavorite()

    const selectedUuids = useMemo(() => {
        return Object.values(rowSelection).map((i) => i.uuid)
    }, [rowSelection])

    const handleCheckboxChange = useCallback(
        (row: Row<ColumnsOutputDefinition>) => {
            if (row.original.uuid) {
                const newRowSelection = { ...rowSelection }
                if (rowSelection[row.original.uuid]) {
                    delete newRowSelection[row.original.uuid]
                } else {
                    newRowSelection[row.original.uuid] = row.original
                }
                setRowSelection(newRowSelection)
            }
        },
        [rowSelection, setRowSelection],
    )

    const clearSelectedRows = useCallback(() => setRowSelection({}), [setRowSelection])

    const handleAllCheckboxChange = useCallback(() => {
        const rows = (data?.configurationItemSet as ColumnsOutputDefinition[]) ?? []
        const checked = rows.every(({ uuid }) => (uuid ? !!rowSelection[uuid] : false))
        const newRowSelection = { ...rowSelection }
        if (checked) {
            rows.forEach(({ uuid }) => uuid && delete newRowSelection[uuid])
            setRowSelection(newRowSelection)
        } else {
            setRowSelection((prevRowSelection) => ({ ...prevRowSelection, ...reduceTableDataToObject(rows) }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.configurationItemSet, rowSelection])

    const isRowSelected = useCallback(
        (row: Row<ColumnsOutputDefinition>) => {
            return row.original.uuid ? !!rowSelection[row.original.uuid] : false
        },
        [rowSelection],
    )

    const handleAddToFavorite = () => {
        addFavorite(
            selectedUuids.map((item) => String(item)),
            FollowedItemItemType.CODELIST,
        )
    }

    useEffect(() => {
        scrollToMutationFeedback()
    }, [isError, isExternalSuccess, isSuccessAddToFavorite, errorAddToFavorite, scrollToMutationFeedback])

    return (
        <QueryFeedback loading={isLoading || isLoadingAddToFavorite} error={false} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t('refIdentifiers.title')}</TextHeading>
                <div ref={wrapperRef}>
                    <MutationFeedback
                        success={isSuccessAddToFavorite}
                        successMessage={successMessage}
                        error={errorAddToFavorite ? t('userProfile.notifications.feedback.error') : undefined}
                        onMessageClose={() => resetState()}
                    />
                    {isError && <QueryFeedback error loading={false} />}
                    {isExternalSuccess && <MutationFeedback success error={false} />}
                </div>
            </FlexColumnReverseWrapper>

            <Filter<RefIdentifierListFilterData>
                heading={t('codeList.filter.title')}
                defaultFilterValues={defaultFilter}
                form={({ filter: formFilter, register, setValue }) => (
                    <div>
                        <MultiSelect
                            name="type"
                            label={t('refIdentifiers.filter.type')}
                            options={refIdentifierTypeOptions(t)}
                            onChange={(values) => setValue('type', values as RefIdentifierTypeEnum[])}
                            defaultValue={formFilter.type || defaultFilter.type}
                        />
                        <SimpleSelect
                            label={t('refIdentifiers.filter.state')}
                            options={refIdentifierStateOptions(registrationState, i18n.language)}
                            setValue={setValue}
                            defaultValue={formFilter?.state || defaultFilter.state}
                            name="state"
                        />

                        <Input label={t('refIdentifiers.filter.createdAtFrom')} id={'createdAtFrom'} {...register('createdAtFrom')} type="date" />
                        <Input label={t('refIdentifiers.filter.createdAtTo')} id={'createdAtTo'} {...register('createdAtTo')} type="date" />

                        {isLoggedIn && (
                            <SimpleSelect
                                label={t('refIdentifiers.filter.view')}
                                options={refIdentifierViewOptions(t)}
                                setValue={setValue}
                                isClearable={false}
                                defaultValue={formFilter?.view}
                                name="view"
                            />
                        )}
                    </div>
                )}
            />
            <ActionsOverTable
                pagination={{
                    pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
                    pageSize: filter.pageSize ?? BASE_PAGE_SIZE,
                    dataLength: data?.configurationItemSet?.length ?? 0,
                }}
                bulkPopup={
                    <BulkPopup
                        checkedRowItems={selectedUuids.length}
                        disabled={!selectedUuids.length}
                        items={(closePopup) => [
                            <ButtonLink
                                key={'favorite'}
                                label={t('codeListList.buttons.addToFavorites')}
                                className={actionsOverTableStyles.buttonLinkWithIcon}
                                icon={NotificationBlackIcon}
                                onClick={() => {
                                    handleAddToFavorite()
                                    setRowSelection({})
                                    closePopup()
                                }}
                            />,
                        ]}
                    />
                }
                entityName=""
                createButton={
                    <CreateEntityButton
                        // ciTypeName={i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName}
                        onClick={() => navigate(RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS_CREATE, { state: { from: location } })}
                    />
                }
                handleFilterChange={handleFilterChange}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                hiddenButtons={{ SELECT_COLUMNS: true }}
            />
            <Table
                rowHref={(row) => `./${row?.original?.uuid}`}
                data={data?.configurationItemSet as ColumnsOutputDefinition[]}
                columns={refIdentifierColumns(t, i18n.language, registrationState, rowSelection, handleCheckboxChange, handleAllCheckboxChange)}
                sort={filter.sort ?? []}
                onSortingChange={(columnSort) => {
                    handleFilterChange({ sort: columnSort })
                    clearSelectedRows()
                }}
                isRowSelected={isRowSelected}
            />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </QueryFeedback>
    )
}

export default RefIdentifierListView
