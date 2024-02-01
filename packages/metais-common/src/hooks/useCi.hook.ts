import {
    ConfigurationItemUi,
    RoleParticipantUI,
    useGetRoleParticipantBulk,
    useReadConfigurationItem,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { CI_ITEM_QUERY_KEY } from '@isdd/metais-common/constants'

type CiHookReturnType = {
    ciItemData: ConfigurationItemUi | undefined
    gestorData: RoleParticipantUI[] | undefined
    isLoading: boolean
    isError: boolean
}

export const useCiHook = (configurationItemId?: string): CiHookReturnType => {
    const {
        data: ciItemData,
        isLoading: isCiItemLoading,
        isError: isCiItemError,
        fetchStatus: ciItemFetchStatus,
    } = useReadConfigurationItem(configurationItemId ?? '', {
        query: {
            queryKey: [CI_ITEM_QUERY_KEY, configurationItemId],
            enabled: !!configurationItemId,
        },
    })

    const {
        data: gestorData,
        isLoading: isGestorLoading,
        isError: isGestorError,
        fetchStatus: gestorFetchStatus,
    } = useGetRoleParticipantBulk(
        { gids: [ciItemData?.metaAttributes?.owner ?? ''] },
        { query: { enabled: !!ciItemData, queryKey: ['roleParticipant', ciItemData?.metaAttributes?.owner ?? ''] } },
    )

    const isLoading = [isCiItemLoading && ciItemFetchStatus != 'idle', isGestorLoading && gestorFetchStatus != 'idle'].some((item) => item)
    const isError = [isCiItemError, isGestorError].some((item) => item)
    return {
        ciItemData,
        gestorData,
        isLoading,
        isError,
    }
}
