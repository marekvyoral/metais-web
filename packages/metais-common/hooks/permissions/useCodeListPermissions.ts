import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { useEffect } from 'react'

import { useAbilityContext } from './useAbilityContext'

import { ApiCodelistManager, useGetCodelistHeader, useGetOriginalCodelistHeader } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { useGetRoleIdsForRole } from '@isdd/metais-common/hooks/useGetRoleIdsForRole'
import { useGetTopLevelPoUuid } from '@isdd/metais-common/hooks/useGetTopLevelPoUuid'
import { Group, User, useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { Roles } from '@isdd/metais-common/api/constants'

export enum CodeListState {
    UPDATING = 'UPDATING',
    READY_TO_PUBLISH = 'READY_TO_PUBLISH',
    ISVS_PROCESSING = 'ISVS_PROCESSING',
    PUBLISHED = 'PUBLISHED',
    KS_ISVS_REJECTED = 'KS_ISVS_REJECTED',
    KS_ISVS_ACCEPTED = 'KS_ISVS_ACCEPTED',
}

export enum Actions {
    CREATE = 'create',
    EDIT = 'edit',
    READ = 'read',
    EXPORT = 'export',
    IMPORT = 'import',
    SEND_TO = 'sendTo',
    PUBLISH = 'publish',
    BULK_ACTIONS = 'bulk_actions',
}

export enum Subjects {
    DETAIL = 'detail',
    ITEM = 'item',
}

const getRoleIdsForRole = (roleName: string, user: User | null): string[] => {
    return user?.groupData.map((group) => group.roles.filter((role) => role.roleName === roleName).map((role) => role.gid)).flat() ?? []
}

const getCurrentGestorsIds = (gestors: ApiCodelistManager[]): string[] => {
    const now = new Date()
    return gestors
        .filter((gestor) => {
            const from = new Date(gestor.effectiveFrom || 0)
            const to = gestor.effectiveTo ? new Date(gestor.effectiveTo) : null
            return from < now && (to === null || to > now) && !!gestor.value
        })
        .map((item) => item.value || '')
}

export const useCodeListPermissions = (id: string) => {
    const abilityContext = useAbilityContext()

    const {
        state: { user },
    } = useAuth()

    const { data: codeListData, isSuccess: isSuccessCodeListData } = useGetCodelistHeader(Number(id))
    const { data: codeListOriginalData } = useGetOriginalCodelistHeader(codeListData?.code ?? '', {
        query: { enabled: isSuccessCodeListData },
    })
    const { data: mainGestorIds } = useGetRoleIdsForRole({
        identityGids: getRoleIdsForRole(Roles.SZC_HLGES, user),
        gids: getCurrentGestorsIds(codeListData?.mainCodelistManagers ?? []),
        enabled: !!user,
    })
    const { data: secondaryGestorIds } = useGetRoleIdsForRole({
        identityGids: getRoleIdsForRole(Roles.SZC_VEDGES, user),
        gids: getCurrentGestorsIds(codeListData?.codelistManagers ?? []),
        enabled: !!user,
    })
    const { uuid: topLevelPoUuid } = useGetTopLevelPoUuid()

    useEffect(() => {
        const { can, rules } = new AbilityBuilder(createMongoAbility)
        const isLoggedIn = !!user
        const isGarant = user?.groupData.some((group: Group) => group.orgId === topLevelPoUuid)
        const isMainGestor = mainGestorIds?.gids?.some((gid) => gid.assigned) ?? false
        const isGestor = secondaryGestorIds?.gids?.some((gid) => gid.assigned) ?? false
        const isManager = user?.roles.some((role: string) => role === 'SZC_SZZC') ?? false
        const state = codeListData?.codelistState ?? ''
        const baseOnTempAndOrigin = !codeListOriginalData?.base && !codeListData?.base
        const isTemporal = codeListData?.temporal

        if (isMainGestor || isManager) can(Actions.IMPORT, Subjects.DETAIL)
        if (
            (isMainGestor || isManager) &&
            state !== CodeListState.KS_ISVS_REJECTED &&
            state !== CodeListState.KS_ISVS_ACCEPTED &&
            state !== CodeListState.ISVS_PROCESSING &&
            state !== CodeListState.READY_TO_PUBLISH
        )
            can(Actions.EDIT, Subjects.DETAIL)
        if ((isMainGestor && baseOnTempAndOrigin && state === CodeListState.UPDATING) || (isMainGestor && state === CodeListState.KS_ISVS_ACCEPTED))
            can(Actions.PUBLISH, Subjects.DETAIL)
        if (isMainGestor || isManager) can(Actions.PUBLISH, Subjects.ITEM, 'all')
        if (isMainGestor && state === CodeListState.READY_TO_PUBLISH && !baseOnTempAndOrigin) can(Actions.SEND_TO, Subjects.DETAIL, 'isvs')
        if (isMainGestor && state === CodeListState.UPDATING && !baseOnTempAndOrigin) can(Actions.SEND_TO, Subjects.DETAIL, 'szzc')
        if (isManager && state === CodeListState.KS_ISVS_REJECTED) can(Actions.SEND_TO, Subjects.DETAIL, 'mainGestor')
        if (!isTemporal && isMainGestor) can(Actions.CREATE, Subjects.DETAIL, 'languageVersion')
        if ((isManager && isGarant) || isMainGestor || isGestor) can(Actions.EDIT, Subjects.ITEM)
        if (isMainGestor || isGestor) can(Actions.EDIT, Subjects.ITEM, 'readyToPublish')
        if (isLoggedIn) {
            can(Actions.READ, Subjects.DETAIL, 'history')
            can(Actions.READ, Subjects.DETAIL, 'gestor.contact')
            can(Actions.CREATE, Subjects.ITEM)
            can(Actions.BULK_ACTIONS, Subjects.ITEM)
            if (isMainGestor || isGestor) can(Actions.CREATE, Subjects.ITEM)
        }
        can(Actions.EXPORT, Subjects.DETAIL)

        abilityContext.update(rules)
    }, [
        abilityContext,
        codeListData?.base,
        codeListData?.codelistState,
        codeListData?.temporal,
        codeListOriginalData?.base,
        mainGestorIds?.gids,
        secondaryGestorIds?.gids,
        topLevelPoUuid,
        user,
    ])

    return {}
}
