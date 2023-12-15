import { useGetReferenceRegisterByUuid } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { transformColumnsMap } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { Gui_Profil_RR } from '@isdd/metais-common/index'
import { Attribute, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'

export const useRefRegisterHook = (entityId?: string) => {
    const isEnabled = !!entityId

    const {
        data: referenceRegisterData,
        isLoading: refRegisterLoading,
        isError: refRegisterError,
    } = useGetReferenceRegisterByUuid(entityId ?? '', {
        query: {
            enabled: isEnabled,
            queryKey: ['referenceRegisterData', entityId],
        },
    })

    const { data: guiData, isLoading: isGuiProfileLoading, isError: isGuiProfileError } = useGetAttributeProfile(Gui_Profil_RR)

    const guiAttributes: Attribute[] = [
        ...(guiData?.attributes?.map((attr) => ({
            ...attr,
            technicalName: transformColumnsMap?.get(attr?.technicalName ?? '') ?? attr?.technicalName,
        })) ?? []),
    ]

    const isLoading = [refRegisterLoading && isEnabled, isGuiProfileLoading].some((item) => item)
    const isError = [refRegisterError && isEnabled, isGuiProfileError].some((item) => item)

    return {
        referenceRegisterData,
        guiAttributes,
        isError,
        isLoading,
    }
}
