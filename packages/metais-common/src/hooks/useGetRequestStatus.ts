import { useState } from 'react'

import { useGetRequestStatusHook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { API_CALL_RETRY_COUNT } from '@isdd/metais-common/constants'

export const useGetStatus = () => {
    const requestStatus = useGetRequestStatusHook()
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const callStatusInCycles = async (requestId: string) => {
        let done = false
        for (let index = 0; index < API_CALL_RETRY_COUNT; index++) {
            const status = await requestStatus(requestId)
            if (status.processed) {
                done = true
                break
            }

            if (index < API_CALL_RETRY_COUNT - 1) {
                const delay = 500
                await new Promise((resolve) => setTimeout(resolve, delay))
            }
        }
        return done
    }

    const getRequestStatus = async (requestId: string, onSuccess: () => void) => {
        setIsSuccess(false)
        setIsError(false)
        setIsLoading(true)
        try {
            const status = await callStatusInCycles(requestId)
            if (status) {
                setIsSuccess(true)
                setIsLoading(false)
                onSuccess()
                return
            }
        } catch (error) {
            setIsError(true)
            setIsLoading(false)
            return
        }
    }

    return { getRequestStatus, callStatusInCycles, isError, isLoading, isSuccess }
}
