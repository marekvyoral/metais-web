import {
    ConfigurationItemUi,
    RoleParticipantUI,
    useGetRoleParticipantBulk,
    useReadConfigurationItem,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { CI_ITEM_QUERY_KEY } from '@isdd/metais-common/constants'

type CiContainerReturnType = {
    ciItemData: ConfigurationItemUi | undefined
    gestorData: RoleParticipantUI[] | undefined
    isLoading: boolean
    isError: boolean
}

export const useCiContainer = (configurationItemId: string): CiContainerReturnType => {
    const {
        data: ciItemData,
        isLoading: isCiItemLoading,
        isError: isCiItemError,
    } = useReadConfigurationItem(configurationItemId ?? '', {
        query: {
            queryKey: [CI_ITEM_QUERY_KEY, configurationItemId],
        },
    })

    const {
        data: gestorData,
        isLoading: isGestorLoading,
        isError: isGestorError,
    } = useGetRoleParticipantBulk(
        { gids: [ciItemData?.metaAttributes?.owner ?? ''] },
        { query: { enabled: !!ciItemData, queryKey: ['roleParticipant', ciItemData?.metaAttributes?.owner ?? ''] } },
    )

    const isLoading = [isCiItemLoading, isGestorLoading].some((item) => item)
    const isError = [isCiItemError, isGestorError].some((item) => item)

    return {
        ciItemData,
        gestorData,
        isLoading,
        isError,
    }
}
