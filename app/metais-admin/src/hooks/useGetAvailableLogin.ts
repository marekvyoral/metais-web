import { useStripAccents, useAvailableLogin } from '@isdd/metais-common/api/generated/iam-swagger'
import { Dispatch, SetStateAction, useEffect } from 'react'

import { useDebounce } from './useDebounce'

export const useGetAvailableLogin = (value: string, setValue: Dispatch<SetStateAction<string>>, debounceTime: number, enabled: boolean) => {
    const debouncedValue = useDebounce(value, debounceTime)

    useEffect(() => {
        if (!value && enabled) {
            setValue('')
        }
    }, [enabled, setValue, value])

    const {
        data: stripAccentQuery,
        isError: isStripAccentError,
        isFetching: isStripAccentFeisFetching,
    } = useStripAccents(debouncedValue, { query: { enabled: !!debouncedValue && enabled } })

    const { isError: isAvailableLoginError, isFetching: isAvailableLoginFeisFetching } = useAvailableLogin(
        { login: stripAccentQuery ?? '' },
        {
            query: {
                enabled: !!stripAccentQuery && enabled,
                onSuccess(data) {
                    setValue(data.toLocaleLowerCase())
                },
            },
        },
    )

    const isError = [isAvailableLoginError, isStripAccentError].some((item) => item)
    const isFetching = [isAvailableLoginFeisFetching, isStripAccentFeisFetching].some((item) => item)

    return { isError, isFetching }
}
