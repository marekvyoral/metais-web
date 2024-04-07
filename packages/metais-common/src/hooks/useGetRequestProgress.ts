import { useState } from 'react'

import { ErrorMessageUiExtended, useReadProgressHook } from '@/api/generated/impexp-cmdb-swagger'
import { API_CALL_RETRY_COUNT } from '@isdd/metais-common/constants'

export const useGetProgress = (awaitForStatus?: string) => {
    const requestStatus = useReadProgressHook()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMessages, setErrorMessages] = useState<ErrorMessageUiExtended[]>()

    const [isError, setIsError] = useState(false)
    const [isProcessedError, setIsProcessedError] = useState(false)
    const [isTooManyFetchesError, setIsTooManyFetchesError] = useState(false)

    const callStatusInCycles = async (requestId: string) => {
        let done = false
        for (let index = 0; index < API_CALL_RETRY_COUNT; index++) {
            const result = await requestStatus(requestId)
            if (result.importState == 'DONE' || (awaitForStatus && result.importState == awaitForStatus)) {
                done = true
                break
            } else if (result.importState === 'DONE_WITH_ERRORS' || (result.errorMessage?.length ?? 0) > 0) {
                setIsProcessedError(true)
                setIsLoading(false)
                setErrorMessages(result.errorMessage)
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

    return {
        getRequestStatus,
        callStatusInCycles,
        isError,
        isLoading,
        isSuccess,
        isProcessedError,
        isTooManyFetchesError,
        resetSuccess,
        resetError,
        errorMessages,
    }
}
