import {
    GetAllLocale,
    GetAllUserInterface,
    getGetAllQueryKey,
    MapWrapper,
    UpdateBody,
    UpdateParams,
    useUpdate,
    useUpdateMultiple,
} from '@isdd/metais-common/api/generated/globalConfig-manager-swagger'
import { useQueryClient } from '@tanstack/react-query'

export type UpdateForm = { data: UpdateBody; params: UpdateParams }
export type UpdateMultiple = {
    data: MapWrapper[]
}

export const useTransUpdate = (lang: GetAllLocale, userInterface: GetAllUserInterface, onSuccess?: () => void) => {
    const queryClient = useQueryClient()
    const invalidateGetAllLocales = () => {
        //invalidates SK and EN - locale param does not matter here
        const getAllQK = getGetAllQueryKey({ locale: lang, userInterface })[0]
        queryClient.invalidateQueries([getAllQK])
    }
    const {
        mutateAsync: updateFormMutate,
        isLoading,
        isError,
        isSuccess,
    } = useUpdate({
        mutation: {
            onSuccess() {
                invalidateGetAllLocales()
                onSuccess?.()
            },
        },
    })

    const {
        mutateAsync: updateMultipleMutate,
        isLoading: isMultipleLoading,
        isSuccess: isMultipleSuccess,
        isError: isMultipleError,
    } = useUpdateMultiple({
        mutation: {
            onSuccess() {
                invalidateGetAllLocales()
                onSuccess?.()
            },
        },
    })

    const updateForm = ({ data, params }: UpdateForm) => {
        updateFormMutate({ data, params })
    }

    const updateMultiple = ({ data }: UpdateMultiple) => {
        updateMultipleMutate({ data })
    }

    return {
        updateForm,
        updateMultiple,
        isSuccess,
        isMultipleSuccess,
        isLoading: isLoading || isMultipleLoading,
        isError: isError || isMultipleError,
    }
}
