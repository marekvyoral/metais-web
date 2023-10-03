import { Attribute, Gui_Profil_Standardy, useGetAttributeProfile } from '@isdd/metais-common/api'
import { useCreateStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { guiProfilStandardRequestMap } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import React from 'react'
import { FieldValues } from 'react-hook-form'

interface IViewProps {
    onSubmit: (values: FieldValues) => Promise<void>
    isSuccess: boolean
    isError: boolean
    guiAttributes: Attribute[]
    isGuiDataLoading: boolean
    isGuiDataError: boolean
}
interface DraftsListFormContainerProps {
    View: React.FC<IViewProps>
}
const DraftsListCreateContainer: React.FC<DraftsListFormContainerProps> = ({ View }) => {
    const { mutateAsync, isSuccess, isError } = useCreateStandardRequest()
    const { data: guiData, isLoading: isGuiDataLoading, isError: isGuiDataError } = useGetAttributeProfile(Gui_Profil_Standardy)

    const guiAttributes: Attribute[] = [
        ...(guiData?.attributes?.map((attr) => ({
            ...attr,
            technicalName: guiProfilStandardRequestMap?.get(attr?.technicalName ?? '') ?? attr?.technicalName,
        })) ?? []),
    ]

    const handleSubmit = async (values: FieldValues) => {
        await mutateAsync({
            data: {
                ...values,
            },
        })
    }

    return (
        <View
            onSubmit={handleSubmit}
            isSuccess={isSuccess}
            isError={isError}
            guiAttributes={guiAttributes}
            isGuiDataLoading={isGuiDataLoading}
            isGuiDataError={isGuiDataError}
        />
    )
}
export default DraftsListCreateContainer
