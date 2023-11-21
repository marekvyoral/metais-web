import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useAgendaCezPo, useZsCezPo } from '@isdd/metais-common/api/generated/kris-swagger'
import { UserPreferencesFormNamesEnum, useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { ENTITY_AGENDA, ENTITY_ZS } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export const useAgendaAndZsCezPo = (neighboursUuid?: string) => {
    const { currentPreferences } = useUserPreferences()
    const {
        state: { user },
    } = useAuth()
    const showInvalidated = currentPreferences?.[UserPreferencesFormNamesEnum.SHOW_INVALIDATED] ?? false

    const agendaCezPo = useAgendaCezPo()
    const zsCezPo = useZsCezPo()

    const filterForAgendaAndZs = useMemo(() => {
        return {
            includeSubPersons: true,
            mainPerson: neighboursUuid,
            showInvalidated,
        }
    }, [neighboursUuid, showInvalidated])

    const {
        data: agendaData,
        isLoading: isAgendaLoading,
        isError: isAgendaError,
        fetchStatus: agendaFetchStatus,
    } = useQuery({
        queryFn: () =>
            agendaCezPo.mutateAsync({
                data: filterForAgendaAndZs,
            }),
        queryKey: [ENTITY_AGENDA, neighboursUuid, filterForAgendaAndZs],
        enabled: !!neighboursUuid && !!user?.uuid,
    })

    const {
        data: zsData,
        isLoading: isZsLoading,
        isError: isZsError,
        fetchStatus: zsFetchStatus,
    } = useQuery({
        queryFn: () =>
            zsCezPo.mutateAsync({
                data: filterForAgendaAndZs,
            }),
        queryKey: [ENTITY_ZS, neighboursUuid, filterForAgendaAndZs],
        enabled: !!neighboursUuid && !!user?.uuid,
    })

    const isLoading = (isZsLoading && zsFetchStatus != 'idle') || (isAgendaLoading && agendaFetchStatus != 'idle')
    const isError = isZsError || isAgendaError
    return { zsData, agendaData, isLoading, isError }
}
