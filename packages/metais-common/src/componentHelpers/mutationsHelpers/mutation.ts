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
            .then((value) => {
                refetch?.()
                console.log('INVALID VALUE: ', value)
            })
            .catch((error) => {
                refetch?.()
                console.log('INVALID ERROR: ', error)
            })
    } else {
        await setValidMutation?.({
            technicalName: technicalName ?? '',
        })
            .then((value) => {
                refetch?.()
                console.log('VALID: ', value)
            })
            .catch((error) => {
                refetch?.()
                console.log('VALID ERROR: ', error)
            })
    }
}
