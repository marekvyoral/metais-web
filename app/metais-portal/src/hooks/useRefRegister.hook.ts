import { useGetReferenceRegisterByUuid } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { Gui_Profil_RR } from '@isdd/metais-common/index'

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

    const isLoading = [refRegisterLoading && isEnabled, isGuiProfileLoading].some((item) => item)
    const isError = [refRegisterError && isEnabled, isGuiProfileError].some((item) => item)

    return {
        referenceRegisterData,
        guiAttributes: guiData?.attributes ?? [],
        isError,
        isLoading,
    }
}
