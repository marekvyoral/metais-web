import { UseMutateAsyncFunction } from '@tanstack/react-query'

export type MutationType = UseMutateAsyncFunction<
    void,
    unknown,
    {
        technicalName: string
    },
    unknown
>

export const setValidity = async (
    technicalName?: string,
    validityOfData?: boolean,
    setValidMutation?: MutationType,
    setInvalidMutation?: MutationType,
    refetch?: () => void,
) => {
    if (validityOfData) {
        await setInvalidMutation?.({
            technicalName: technicalName ?? '',
        })
            .then(() => {
                refetch?.()
            })
            .catch(() => {
                refetch?.()
            })
    } else {
        await setValidMutation?.({
            technicalName: technicalName ?? '',
        })
            .then(() => {
                refetch?.()
            })
            .catch(() => {
                refetch?.()
            })
    }
}
