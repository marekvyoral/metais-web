import {
    BaseModal,
    BreadCrumbs,
    Button,
    CheckBox,
    Filter,
    HomeIcon,
    PaginatorWrapper,
    SimpleSelect,
    Table,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import { Notification } from '@isdd/metais-common/api/generated/notifications-swagger'
import { ALL_EVENT_TYPES, BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { ActionsOverTable, ModalButtons, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { Row } from '@tanstack/react-table'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'

import { SelectableColumnsSpec } from './notificationUtils'
import styles from './notifications.module.scss'

import { FilterData, NotificationsListViewParams } from '@/components/containers/NotificationsListContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
const NotificationsListView: React.FC<NotificationsListViewParams> = ({
    data,
    isLoading,
    isError,
    defaultFilterValues,
    columns,
    selectedColumns,
    setSelectedColumns,
    resetSelectedColumns,
    mutateAllDelete,
    mutateAllRead,
    mutateDelete,
    handleFilterChange,
    isMutateError,
    isMutateLoading,
    isMutateDeleteSuccess,
    isSetAllAsReadSuccess,
    filterParams,
}) => {
    const { t } = useTranslation()

    const [rowSelection, setRowSelection] = useState<Record<string, Notification>>({})
    const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false)
    const isRowSelected = (row: Row<Notification>) => (row.original.id ? !!rowSelection[row.original.id] : false)
    const isRowBold = (row: Row<Notification>) => !row.original.readedAt

    const clearSelectedRows = useCallback(() => setRowSelection({}), [])
    const idArray = Object.entries(rowSelection).map((e) => e[1].id ?? 0)

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('notifications.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('notifications.notifications'), href: NavigationSubRoutes.NOTIFICATIONS },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading || isMutateLoading} error={false} withChildren>
                    <FlexColumnReverseWrapper>
                        <TextHeading size="XL">{t('notifications.notifications')}</TextHeading>
                        <QueryFeedback loading={false} error={isError} />
                        <MutationFeedback
                            success={isMutateDeleteSuccess || isSetAllAsReadSuccess}
                            error={isMutateError}
                            successMessage={isMutateDeleteSuccess ? t('mutationFeedback.successfulRemoved') : t('mutationFeedback.successfulUpdated')}
                        />
                    </FlexColumnReverseWrapper>
                    <Filter<FilterData>
                        defaultFilterValues={defaultFilterValues}
                        form={({ register, setValue, filter }) => (
                            <div>
                                <SimpleSelect
                                    id="eventType"
                                    label={t('notifications.eventType')}
                                    options={[
                                        { value: ALL_EVENT_TYPES, label: t('notifications.all') },
                                        { value: 'INFO', label: t('notifications.INFO') },
                                        { value: 'ERROR', label: t('notifications.ERROR') },
                                    ]}
                                    setValue={setValue}
                                    defaultValue={filter.eventType || defaultFilterValues.eventType}
                                    name="eventType"
                                />
                                <CheckBox id="1" label={t('notifications.onlyUnread')} value="" {...register('onlyUnread')} />
                            </div>
                        )}
                    />

                    <ActionsOverTable
                        pagination={{
                            pageNumber: filterParams.pageNumber ?? BASE_PAGE_NUMBER,
                            pageSize: filterParams.pageSize ?? BASE_PAGE_SIZE,
                            dataLength: data?.pagination?.totalItems ?? 0,
                        }}
                        entityName="notification"
                        simpleTableColumnsSelect={{ selectedColumns, saveSelectedColumns: setSelectedColumns, resetSelectedColumns }}
                        handleFilterChange={handleFilterChange}
                    >
                        <div className={styles.buttonGroup}>
                            <Button
                                className={styles.marginBottom0}
                                label={t('notifications.deleteSelected') + '(' + idArray.length + ')'}
                                disabled={idArray.length == 0}
                                variant="warning"
                                onClick={() => {
                                    mutateDelete({ params: { idList: idArray } })
                                    clearSelectedRows()
                                }}
                            />
                            <Button
                                className={styles.marginBottom0}
                                label={t('notifications.setAllAsRead')}
                                variant="secondary"
                                onClick={mutateAllRead}
                            />
                            <Button
                                className={styles.marginBottom0}
                                label={t('notifications.deleteAll')}
                                variant="warning"
                                onClick={() => setDeleteAllModalOpen(true)}
                            />
                        </div>
                    </ActionsOverTable>
                    <Table<Notification>
                        onSortingChange={(newSort) => {
                            handleFilterChange({ sort: newSort })
                            clearSelectedRows()
                        }}
                        sort={filterParams.sort}
                        columns={SelectableColumnsSpec(data?.notifications ?? [], columns, rowSelection, setRowSelection)}
                        isLoading={isLoading}
                        error={isError}
                        data={data?.notifications}
                        isRowSelected={isRowSelected}
                        isRowBold={isRowBold}
                    />
                    <PaginatorWrapper
                        pageNumber={filterParams.pageNumber ?? BASE_PAGE_NUMBER}
                        pageSize={filterParams.pageSize ?? BASE_PAGE_SIZE}
                        dataLength={data?.pagination?.totalItems ?? 0}
                        handlePageChange={(filterChange) => handleFilterChange({ pageNumber: filterChange.pageNumber })}
                    />
                </QueryFeedback>
                <BaseModal isOpen={deleteAllModalOpen} close={() => setDeleteAllModalOpen(false)}>
                    <TextHeading size="L">{t('notifications.deleteAllModal')}</TextHeading>
                    <ModalButtons
                        submitButtonLabel={t('notifications.deleteAll')}
                        onSubmit={() => {
                            mutateAllDelete({ params: { onlyUnread: false } })
                            setDeleteAllModalOpen(false)
                        }}
                        closeButtonLabel={t('notifications.cancel')}
                        onClose={() => setDeleteAllModalOpen(false)}
                    />
                </BaseModal>
            </MainContentWrapper>
        </>
    )
}

export default NotificationsListView
