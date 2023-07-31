import { Button, ButtonGroupRow, ButtonPopup, ISelectColumnType, SimpleSelect, TableColumnsSelect, TextBody } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
    useRemoveNotifications,
    useRemoveNotificationList,
    useSetAllNotificationsAsRead,
    Notification,
} from '@isdd/metais-common/api/generated/notifications-swagger'

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
}

export const ActionsGroup: React.FC<ActionsGroupParams> = ({ listParams, setListParams, selectedColumns, setSelectedColumns, rowSelection }) => {
    const { mutate: mutateAllRead } = useSetAllNotificationsAsRead()
    const { mutate: mutateAllDelete } = useRemoveNotifications()
    const { mutate: mutateDelete } = useRemoveNotificationList()

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
                onChange={(label) => {
                    setListParams({ ...listParams, perPage: Number(label.target.value) })
                }}
                id="select"
                label=""
                options={[
                    { label: '10', value: '10' },
                    { label: '20', value: '20' },
                    { label: '50', value: '50' },
                    { label: '100', value: '100' },
                ]}
            />
        </ButtonGroupRow>
    )
}
