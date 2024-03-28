import { useState } from 'react'

import { useGetRequestStatusHook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { API_CALL_RETRY_COUNT } from '@isdd/metais-common/constants'

export const useGetStatus = (awaitForStatus?: string) => {
    const requestStatus = useGetRequestStatusHook()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const [isError, setIsError] = useState(false)
    const [isProcessedError, setIsProcessedError] = useState(false)
    const [isTooManyFetchesError, setIsTooManyFetchesError] = useState(false)

    const callStatusInCycles = async (requestId: string) => {
        let done = false
        for (let index = 0; index < 5; index++) {
            const result = await requestStatus(requestId)
            if (
                (result.processed && result.status === 'READY') ||
                (result.status === 'PARTIALLY_READY' && result.indexReady === 'READY') ||
                (awaitForStatus && result.status == awaitForStatus)
            ) {
                done = true
                break
            } else if (
                (result.processed && (result.status === 'FAILED' || result.status === 'ERROR')) ||
                (result.status === 'PARTIALLY_READY' && result.indexReady === 'FAILED')
            ) {
                setIsProcessedError(true)
                setIsLoading(false)
                break
            }

            if (index < API_CALL_RETRY_COUNT - 1) {
                const delay = 500
                await new Promise((resolve) => setTimeout(resolve, delay))
            }
        }
        return done
    }

    const getRequestStatus = async (requestId: string, onSuccess?: () => void, onError?: () => void) => {
        setIsSuccess(false)
        setIsError(false)
        setIsLoading(true)
        setIsTooManyFetchesError(false)
        setIsProcessedError(false)

        try {
            const status = await callStatusInCycles(requestId)
            if (status) {
                setIsSuccess(true)
                setIsLoading(false)
                onSuccess?.()
                return
            } else {
                onError?.()
                setIsTooManyFetchesError(true)
                setIsLoading(false)
            }
        } catch (error) {
            onError?.()
            setIsError(true)
            setIsLoading(false)
            return
        }
    }

    const resetSuccess = () => {
        setIsSuccess(false)
    }

    const resetError = () => {
        setIsError(false)
    }

    return { getRequestStatus, callStatusInCycles, isError, isLoading, isSuccess, isProcessedError, isTooManyFetchesError, resetSuccess, resetError }
}
