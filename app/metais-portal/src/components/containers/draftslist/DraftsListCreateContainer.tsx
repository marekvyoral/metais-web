import { Gui_Profil_Standardy } from '@isdd/metais-common/api'
import { useCreateStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { Attribute, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { guiProfilStandardRequestMap } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useMemo } from 'react'
import { FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

interface IViewProps {
    onSubmit: (values: FieldValues) => Promise<void>
    isError: boolean
    isLoading: boolean
    guiAttributes: Attribute[]
    isGuiDataLoading: boolean
    isGuiDataError: boolean
}
interface DraftsListFormContainerProps {
    View: React.FC<IViewProps>
}
export const DraftsListCreateContainer: React.FC<DraftsListFormContainerProps> = ({ View }) => {
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()
    const { mutateAsync, isError, isLoading } = useCreateStandardRequest({
        mutation: {
            onSuccess() {
                setIsActionSuccess({ value: true, path: NavigationSubRoutes.ZOZNAM_NAVRHOV })
                navigate(NavigationSubRoutes.ZOZNAM_NAVRHOV)
            },
        },
    })

    const { data: guiData, isLoading: isGuiDataLoading, isError: isGuiDataError } = useGetAttributeProfile(Gui_Profil_Standardy)

    const guiAttributes: Attribute[] = useMemo(() => {
        return [
            ...(guiData?.attributes?.map((attr) => ({
                ...attr,
                technicalName: guiProfilStandardRequestMap?.get(attr?.technicalName ?? '') ?? attr?.technicalName,
            })) ?? []),
        ]
    }, [guiData])

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
            isError={isError}
            isLoading={isLoading}
            guiAttributes={guiAttributes}
            isGuiDataLoading={isGuiDataLoading}
            isGuiDataError={isGuiDataError}
        />
    )
}
