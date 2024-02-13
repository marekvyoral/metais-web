import { Button, CheckBox, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Identity, useRemoveAuthResource } from '@isdd/metais-common/api/generated/iam-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { MutationFeedback } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface IAuthItemTable {
    uuid: number
    type: string
    checkbox: boolean
    settings: string
    name: string
}

interface Props {
    userData: Identity | undefined
}

enum AuthConfigTypeEnum {
    NAME_PASSWORD = 'name/password',
    E_ID = 'eID',
}

export const UserAuthetificationItems: React.FC<Props> = ({ userData }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()

    const {
        mutateAsync: removeAuthResource,
        isLoading: isRemoveAuthLoading,
        isSuccess: isRemoveAuthSuccess,
        isError: isRemoveAuthError,
    } = useRemoveAuthResource()

    const loggedInUserId = user?.uuid
    const isOwnerOfUser = loggedInUserId === userData?.uuid

    const handleCancelClick = (value: string) => {
        if (!loggedInUserId) return
        removeAuthResource({ identityUuid: loggedInUserId, authResourceUuid: value })
    }

    const authTableConfig = [
        { label: t('managementList.namePassword'), value: userData?.authResourceLP, type: AuthConfigTypeEnum.NAME_PASSWORD },
        { label: t('managementList.eID'), value: userData?.authResourceEid, type: AuthConfigTypeEnum.E_ID },
    ]

    const authTableColumns: ColumnDef<IAuthItemTable>[] = [
        {
            id: 'type',
            accessorKey: 'name',
            header: t('managementList.authTableType'),
        },
        {
            id: 'checkbox',
            accessorFn: (row) => row.checkbox,
            cell: ({ row }) => (
                <CheckBox
                    disabled
                    id={row.original.uuid.toString()}
                    label=""
                    name={row.original.uuid.toString()}
                    checked={row.getValue('checkbox')}
                />
            ),
            header: t('managementList.authTableCheckbox'),
        },
        {
            id: 'settings',
            accessorFn: (row) => row.settings,
            cell: ({ row }) => {
                const isNameAndPassword = row.original.type === AuthConfigTypeEnum.NAME_PASSWORD
                const isDisabled = !row.original.checkbox || !isOwnerOfUser

                return (
                    <>
                        {!isNameAndPassword && (
                            <Button
                                disabled={isDisabled}
                                variant="warning"
                                label={t('managementList.cancelAuthButton')}
                                onClick={() => handleCancelClick(row.getValue('settings'))}
                            />
                        )}
                    </>
                )
            },
            header: t('managementList.authTableSettings'),
        },
    ]

    const authTableData = authTableConfig.map((item, index) => ({
        uuid: index,
        type: item.type,
        name: item.label,
        checkbox: !!item.value,
        settings: item.value ?? '',
    }))

    return (
        <>
            <TextHeading size="L">{t('managementList.authetificationItemsHeading')}</TextHeading>
            <MutationFeedback success={isRemoveAuthSuccess} showSupportEmail error={isRemoveAuthError ? t('feedback.mutationErrorMessage') : ''} />
            <Table<IAuthItemTable> columns={authTableColumns} data={authTableData} isLoading={isRemoveAuthLoading} />
        </>
    )
}
