import { ButtonLink, ButtonPopup } from '@isdd/idsk-ui-kit'
import { CellContext } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { IdentityState } from '@isdd/metais-common/api/generated/iam-swagger'
import { UseMutateFunction, UseMutationResult } from '@tanstack/react-query'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import styles from './userManagementListTable.module.scss'

import { UserManagementListItem } from '@/components/containers/ManagementList/UserManagementListUtils'

interface IUserTableRowActions {
    ctx: CellContext<UserManagementListItem, unknown>
    updateIdentityStateBatchMutation: UseMutationResult<
        void[],
        unknown,
        {
            uuids: string[]
            activate: boolean
        },
        unknown
    >
    revokeUserBatchMutation: UseMutateFunction<
        Response[],
        unknown,
        {
            login: string
            token: string | null
        }[],
        unknown
    >
}

export const UserTableRowActions = ({ ctx, updateIdentityStateBatchMutation, revokeUserBatchMutation }: IUserTableRowActions) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const {
        state: { token },
    } = useAuth()
    return (
        <>
            <ButtonPopup
                popupPosition="right"
                buttonLabel={t('actionsInTable.moreActions')}
                popupContent={(closePopup) => {
                    return (
                        <div className={styles.actions}>
                            <ButtonLink
                                type="button"
                                onClick={() => {
                                    updateIdentityStateBatchMutation.mutate({
                                        uuids: [ctx.row.original.identity.uuid ?? ''],
                                        activate: ctx.row.original.identity.state === IdentityState.BLOCKED,
                                    })
                                    if (ctx.row.original.identity.state !== IdentityState.BLOCKED && ctx.row.original.identity.login) {
                                        revokeUserBatchMutation([{ login: ctx.row.original.identity.login, token: token }])
                                    }
                                    closePopup()
                                }}
                                label={
                                    ctx.row.original.identity.state === IdentityState.BLOCKED
                                        ? t('userManagement.unblock')
                                        : t('userManagement.block')
                                }
                            />
                            <ButtonLink
                                type="button"
                                onClick={() => {
                                    navigate(`${AdminRouteNames.USER_MANAGEMENT}/edit/${ctx.row.original.identity.uuid}`)
                                    closePopup()
                                }}
                                label={t('userManagement.edit')}
                            />
                            <ButtonLink
                                type="button"
                                onClick={() => {
                                    navigate(`${AdminRouteNames.USER_MANAGEMENT}/password/${ctx.row.original.identity.uuid}`)
                                    closePopup()
                                }}
                                label={t('userManagement.changePassword')}
                            />
                        </div>
                    )
                }}
            />
        </>
    )
}
