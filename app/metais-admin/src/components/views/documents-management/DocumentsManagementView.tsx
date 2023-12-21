import { Filter } from '@isdd/idsk-ui-kit/filter'
import { Button, ISelectColumnType, LoadingIndicator, SimpleSelect, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { EnumItem } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { DocumentGroup } from '@isdd/metais-common/api/generated/kris-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, documentsManagementDefaultSelectedColumns } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { ActionsOverTable, MutationFeedback } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import classNames from 'classnames'

import styles from './styles.module.scss'

import { DocumentFilterData, IView, defaultFilter } from '@/components/containers/documents-management/DocumentsManagementContaiter'

export const DocumentsManagementView: React.FC<IView> = ({
    filterMap,
    filter,
    data,
    statuses,
    setData,
    saveOrder,
    resetOrder,
    handleFilterChange,
    refetchDocs,
    isFetching,
}) => {
    const { t } = useTranslation()
    const [selectedColumns, setSelectedColumns] = useState<ISelectColumnType[]>(documentsManagementDefaultSelectedColumns(t))
    const resetSelectedColumns = () => setSelectedColumns(documentsManagementDefaultSelectedColumns(t))
    const navigate = useNavigate()
    const location = useLocation()
    const [editingRowsPositions, setEditingRowsPositions] = useState(false)
    const { isActionSuccess } = useActionSuccess()
    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (isActionSuccess.value) {
            scrollToMutationFeedback()
            refetchDocs()
        }
    }, [isActionSuccess, refetchDocs, scrollToMutationFeedback])

    const columns: Array<ColumnDef<DocumentGroup>> = [
        {
            header: 'Id',
            accessorFn: (row) => row?.id,
            enableSorting: true,
            id: 'id',
        },
        {
            header: t('documentsManagement.status'),
            accessorFn: (row) => row?.state,
            enableSorting: true,
            id: 'state',
            cell: (ctx) => (
                <Link to={'./' + ctx?.row?.original?.id} state={{ from: location }}>
                    {statuses.find((s) => s.code == (ctx.getValue() as string))?.value}
                </Link>
            ),
        },
        {
            header: t('documentsManagement.name'),
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: 'name',
            cell: (ctx) => ctx?.getValue?.() as string,
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
        },
        {
            header: t('egov.engName'),
            accessorFn: (row) => row?.nameEng,
            enableSorting: true,
            id: 'nameEng',
            cell: (ctx) => ctx?.getValue?.() as string,
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
        },
        {
            header: t('documentsManagement.description'),
            accessorFn: (row) => row?.description,
            enableSorting: true,
            id: 'description',
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
        },
        {
            header: t('egov.engDescription'),
            accessorFn: (row) => row?.descriptionEng,
            enableSorting: true,
            id: 'descriptionEng',
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
        },
    ]

    const reorderRow = (draggedRowIndex: number, targetRowIndex: number) => {
        const tmpData = [...data]
        const removedItem = tmpData?.splice(draggedRowIndex, 1)[0] as EnumItem //removing dragged item form list
        tmpData?.splice(targetRowIndex, 0, removedItem) //insertion item in new position
        const newDataRows = [...tmpData.map((item, index) => ({ ...item, orderList: index + 1 }))] //setting new positions
        setData(newDataRows)
    }

    return (
        <>
            <TextHeading size="L">{t('documentsManagement.heading')}</TextHeading>
            <Filter<DocumentFilterData>
                defaultFilterValues={defaultFilter}
                onlyForm
                form={({ setValue, watch }) => {
                    const filterPhase = watch('phase')
                    const filterState = watch('status')

                    return (
                        <div>
                            <SimpleSelect
                                name="phase"
                                value={filterPhase}
                                setValue={setValue}
                                label={t('documentsManagement.phase') + ':'}
                                options={filterMap.map((f) => ({
                                    value: f.phase.code ?? '',
                                    label: f.phase.value ?? '',
                                    disabled: !f.phase.valid ?? false,
                                }))}
                                placeholder={t('documentsManagement.projectPhase')}
                                onChange={(value) => {
                                    handleFilterChange({ ...filter, status: '', phase: value })
                                }}
                            />
                            <SimpleSelect
                                disabled={filterPhase == undefined}
                                name="status"
                                value={filterState}
                                setValue={setValue}
                                label={t('documentsManagement.status') + ':'}
                                options={
                                    filterMap
                                        .find((f) => f.phase?.code == filterPhase ?? {})
                                        ?.statuses.map((f) => ({
                                            value: f.code ?? '',
                                            label: f.value ?? '',
                                            disabled: !f.valid ?? false,
                                        })) ?? []
                                }
                                placeholder={t('documentsManagement.projectStatus')}
                            />
                        </div>
                    )
                }}
            />
            <ActionsOverTable
                pagination={{ pageNumber: BASE_PAGE_NUMBER, pageSize: BASE_PAGE_SIZE, dataLength: 0 }}
                entityName={''}
                simpleTableColumnsSelect={{ selectedColumns, resetSelectedColumns, saveSelectedColumns: setSelectedColumns }}
            >
                {!editingRowsPositions ? (
                    <Button
                        variant="secondary"
                        bottomMargin={false}
                        label={t('documentsManagement.editPosition')}
                        onClick={() => setEditingRowsPositions(true)}
                    />
                ) : (
                    <>
                        <Button
                            variant="secondary"
                            bottomMargin={false}
                            label={t('documentsManagement.savePosition')}
                            onClick={() => {
                                setEditingRowsPositions(false)
                                saveOrder(
                                    data.map((d) => {
                                        return { ...d, position: data.indexOf(d) }
                                    }),
                                )
                            }}
                        />
                        <Button
                            variant="secondary"
                            bottomMargin={false}
                            label={t('documentsManagement.resetPosition')}
                            onClick={() => {
                                resetOrder()
                                setEditingRowsPositions(false)
                            }}
                        />
                    </>
                )}
                <Button
                    bottomMargin={false}
                    label={t('documentsManagement.addNewGroup')}
                    onClick={() => navigate(`./create`, { state: { from: location } })}
                />
            </ActionsOverTable>
            <MutationFeedback error={false} success={isActionSuccess.value} successMessage={t('mutationFeedback.successfulCreated')} />
            <div ref={wrapperRef} />
            <div className={classNames({ [styles.positionRelative]: isFetching })}>
                {isFetching && <LoadingIndicator />}
                <Table
                    isLoading={isFetching}
                    columns={columns.filter((c) =>
                        selectedColumns
                            .filter((s) => s.selected == true)
                            .map((s) => s.technicalName)
                            .includes(c.id ?? ''),
                    )}
                    data={data}
                    reorderRow={reorderRow}
                    canDragRow={editingRowsPositions}
                    sort={filter.sort}
                    onSortingChange={(columnSort) => {
                        handleFilterChange({ sort: columnSort })
                    }}
                />
            </div>
        </>
    )
}
