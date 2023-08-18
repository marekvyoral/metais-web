import { Button, ButtonGroupRow, ButtonPopup, ISelectColumnType, SimpleSelect, TableColumnsSelect, TextBody } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
    Notification,
    RemoveNotificationList200,
    RemoveNotificationListParams,
    RemoveNotifications200,
    RemoveNotificationsParams,
    SetAllNotificationsAsRead200,
} from '@isdd/metais-common/api/generated/notifications-swagger'
import { UseMutateFunction } from '@tanstack/react-query'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'

import styles from './notifications.module.scss'
import { selectedDefaultColumns } from './defaults'

interface fetchParams {
    perPage: number
    pageNumber: number
}

interface ActionsGroupParams {
    listParams: fetchParams
    setListParams: React.Dispatch<React.SetStateAction<fetchParams>>
    selectedColumns: ISelectColumnType[]
    setSelectedColumns: React.Dispatch<React.SetStateAction<ISelectColumnType[]>>
    rowSelection: Record<number, Notification>
    mutateAllRead: UseMutateFunction<SetAllNotificationsAsRead200, unknown, void, unknown>
    mutateAllDelete: UseMutateFunction<
        RemoveNotifications200,
        unknown,
        {
            params?: RemoveNotificationsParams | undefined
        },
        unknown
    >
    mutateDelete: UseMutateFunction<
        RemoveNotificationList200,
        unknown,
        {
            params?: RemoveNotificationListParams | undefined
        },
        unknown
    >
}

export const ActionsGroupView: React.FC<ActionsGroupParams> = ({
    listParams,
    setListParams,
    selectedColumns,
    setSelectedColumns,
    rowSelection,
    mutateAllRead,
    mutateAllDelete,
    mutateDelete,
}) => {
    const { t } = useTranslation()

    const idArray = Object.entries(rowSelection).map((e) => e[1].id ?? 0)

    return (
        <ButtonGroupRow>
            <Button
                label={t('notifications.deleteSelected') + '(' + idArray.length + ')'}
                disabled={idArray.length == 0}
                variant="warning"
                onClick={() => mutateDelete({ params: { idList: idArray } })}
            />
            <Button label={t('notifications.setAllAsRead')} variant="secondary" onClick={mutateAllRead} />
            <Button label={t('notifications.deleteAll')} variant="warning" onClick={() => mutateAllDelete({ params: { onlyUnread: false } })} />
            <ButtonPopup
                buttonLabel={t('notifications.columns')}
                popupContent={(closePopup) => {
                    return (
                        <>
                            <TableColumnsSelect
                                onClose={closePopup}
                                resetDefaultOrder={() => setSelectedColumns(selectedDefaultColumns)}
                                showSelectedColumns={setSelectedColumns}
                                columns={selectedColumns}
                                header={t('notifications.column')}
                            />
                        </>
                    )
                }}
            />
            <TextBody className={styles.marginLeftAuto}>Zobrazit</TextBody>
            <SimpleSelect
                onChange={(val) => {
                    setListParams({ ...listParams, perPage: Number(val) })
                }}
                id="select"
                name="select"
                label=""
                isClearable={false}
                options={DEFAULT_PAGESIZE_OPTIONS}
                defaultValue={DEFAULT_PAGESIZE_OPTIONS[0].value}
            />
        </ButtonGroupRow>
    )
}
