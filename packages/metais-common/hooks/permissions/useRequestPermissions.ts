import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'

import { useGetCodelistRequestDetail } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { RequestListState } from '@isdd/metais-common/constants'

export enum Actions {
    SHOW = 'show',
    CREATE = 'create',
    EDIT = 'edit',
    MOVE_TO_KSISVS = 'moveToKsisvs',
    REJECT = 'reject',
    ACCEPT = 'accept',
    ACCEPT_SZZC = 'acceptSzzc',
    CANCEL_REQUEST = 'cancelRequest',
    SEND = 'send',
}

export enum Subjects {
    LIST = 'list',
    DETAIL = 'detail',
}

export enum Roles {
    SZCHLGES = 'SZC_HLGES',
    SZCVEDGES = 'SZC_VEDGES',
}
export const useRequestPermissions = (id?: string) => {
    const abilityContext = useAbilityContext()
    const {
        state: { user },
    } = useAuth()

    const { data: detailData } = useGetCodelistRequestDetail(Number.parseInt(id ?? ''), { query: { enabled: !!id } })

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        const hasRole = user?.roles?.some((role) => role === Roles.SZCHLGES || role === Roles.SZCVEDGES)

        if (hasRole) {
            can(Actions.SHOW, Subjects.LIST)
            can(Actions.SHOW, Subjects.DETAIL)
            can(Actions.CREATE, Subjects.DETAIL)
        }

        if (detailData) {
            if (
                (detailData.lockedBy === null || detailData.lockedBy === user?.login) &&
                (detailData.codelistState === RequestListState.DRAFT ||
                    detailData.codelistState === RequestListState.REJECTED ||
                    detailData.codelistState === RequestListState.KS_ISVS_ACCEPTED ||
                    detailData.codelistState === RequestListState.ACCEPTED_SZZC)
            ) {
                can(Actions.EDIT, Subjects.DETAIL)
            }
            if (detailData?.base && detailData.codelistState === RequestListState.NEW_REQUEST) {
                can(Actions.MOVE_TO_KSISVS, Subjects.DETAIL)
            }
            if (
                !detailData?.base &&
                (detailData?.codelistState === RequestListState.NEW_REQUEST || detailData?.codelistState === RequestListState.KS_ISVS_REJECTED)
            ) {
                can(Actions.REJECT, Subjects.DETAIL)
            }
            if (
                (!detailData?.base && detailData?.codelistState === RequestListState.ACCEPTED_SZZC) ||
                detailData?.codelistState === RequestListState.KS_ISVS_ACCEPTED
            ) {
                can(Actions.ACCEPT, Subjects.DETAIL)
            }
            if (detailData && !detailData.base && detailData.codelistState === RequestListState.NEW_REQUEST) {
                can(Actions.ACCEPT_SZZC, Subjects.DETAIL)
            }
            if (
                (detailData?.lockedBy === null || detailData?.lockedBy === user?.login) &&
                (detailData?.codelistState === RequestListState.DRAFT ||
                    detailData?.codelistState === RequestListState.REJECTED ||
                    detailData?.codelistState === RequestListState.KS_ISVS_ACCEPTED ||
                    detailData?.codelistState === RequestListState.ACCEPTED_SZZC)
            ) {
                can(Actions.CANCEL_REQUEST, Subjects.DETAIL)
            }
            if (
                detailData?.lockedBy === user?.login &&
                (detailData?.codelistState === RequestListState.DRAFT || detailData?.codelistState === RequestListState.REJECTED)
            ) {
                can(Actions.SEND, Subjects.DETAIL)
            }
        }

        abilityContext.update(rules)
    }, [abilityContext, detailData, user?.login, user?.roles])
    return {}
}
