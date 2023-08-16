import { Button, CheckBox, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Identity } from '@isdd/metais-common/api/generated/iam-swagger'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface IAuthItemTable {
    uuid: number
    type: string
    checkbox: boolean
    settings: string
}

interface Props {
    userData: Identity | undefined
}

export const UserAuthetificationItems: React.FC<Props> = ({ userData }) => {
    const { t } = useTranslation()

    const handleCancelClick = (value: string) => {
        // eslint-disable-next-line no-console
        console.log(value)
    }

    const authTableConfig = [
        { label: t('managementList.namePassword'), value: userData?.authResourceLP },
        { label: t('managementList.eID'), value: userData?.authResourceEid },
        { label: t('managementList.windows'), value: userData?.authResourceKrb },
        { label: t('managementList.clarity'), value: userData?.authResourceClar },
    ]

    const authTableColumns: ColumnDef<IAuthItemTable>[] = [
        {
            id: 'type',
            accessorKey: 'type',
            header: t('managementList.authTableType'),
        },
        {
            id: 'checkbox',
            accessorFn: (row) => row.checkbox,
            cell: ({ row }) => (
                <CheckBox disabled id={row.getValue('uuid')} label="" name={row.getValue('uuid')} checked={row.getValue('checkbox')} />
            ),
            header: t('managementList.authTableCheckbox'),
        },
        {
            id: 'settings',
            accessorFn: (row) => row.settings,
            cell: ({ row }) => (
                <Button
                    disabled
                    variant="warning"
                    label={t('managementList.cancelAuthButton')}
                    onClick={() => handleCancelClick(row.getValue('settings'))}
                />
            ),
            header: t('managementList.authTableSettings'),
        },
    ]

    const authTableData = authTableConfig.map((item, index) => ({
        uuid: index,
        type: item.label ?? '',
        checkbox: !!item.value,
        settings: item.value ?? '',
    }))

    return (
        <>
            <TextHeading size="L">{t('managementList.authetificationItemsHeading')}</TextHeading>
            <Table<IAuthItemTable> columns={authTableColumns} data={authTableData} />
        </>
    )
}
