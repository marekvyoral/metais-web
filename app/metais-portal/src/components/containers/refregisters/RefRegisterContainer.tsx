import { useGetReferenceRegisterByUuid } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { transformColumnsMap } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { Gui_Profil_RR } from '@isdd/metais-common/index'
import { Attribute, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { IRefRegisterView } from '@/types/views'

interface IRefRegisterContainer {
    entityId?: string
    View: React.FC<IRefRegisterView>
}
export const RefRegisterContainer = ({ entityId, View }: IRefRegisterContainer) => {
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

    const { data: guiData, isLoading: guiProfilIsLoading, isError: guiProfilIsError } = useGetAttributeProfile(Gui_Profil_RR)

    const guiAttributes: Attribute[] = [
        ...(guiData?.attributes?.map((attr) => ({
            ...attr,
            technicalName: transformColumnsMap?.get(attr?.technicalName ?? '') ?? attr?.technicalName,
        })) ?? []),
    ]

    const isLoading = refRegisterLoading && isEnabled
    const isError = refRegisterError && isEnabled

    return (
        <View
            data={{
                referenceRegisterData,
                guiAttributes,
            }}
            isLoading={isLoading || guiProfilIsLoading}
            isError={isError || guiProfilIsError}
        />
    )
}
