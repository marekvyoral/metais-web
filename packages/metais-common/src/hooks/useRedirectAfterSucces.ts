import { useCallback, useEffect, useState } from 'react'

import { useGetRequestStatus } from '@isdd/metais-common/api/generated/cmdb-swagger'

enum RequestIdStatus {
    PROCESSED = 'PROCESSED',
    FAILED = 'FAILED',
}

type RedirectAfterSuccessProps = {
    requestId: string
    onSuccess: () => void
}

export const useRedirectAfterSuccess = ({ requestId, onSuccess }: RedirectAfterSuccessProps) => {
    const requestStatusQuery = useGetRequestStatus(requestId, { query: { enabled: !!requestId } })

    const [isProcessedError, setIsProcessedError] = useState(false)
    const [isTooManyFetchesError, setIsTooManyFetchesError] = useState(false)
    //if BE is not responding in 30 seconds => give error
    const [fetchStatusCount, setFetchStatusCount] = useState<number>(0)
    const MAX_REFETCH_NUMBER = 30
    const { isError, refetch, data, isFetched } = requestStatusQuery

    useEffect(() => {
        if (requestId) {
            const intervalId = setInterval(() => {
                if (data?.processed) {
                    clearInterval(intervalId)
                } else {
                    setFetchStatusCount((prev) => prev + 1)
                    refetch()
                }
            }, 1000)

            if (isTooManyFetchesError) {
                clearInterval(intervalId)
            }

            return () => {
                clearInterval(intervalId)
            }
        }
    }, [data?.processed, data?.status, isTooManyFetchesError, refetch, requestId])

    const reset = useCallback(() => {
        setFetchStatusCount(0)
        setIsTooManyFetchesError(false)
    }, [])

    const performRedirection = useCallback(() => {
        if (fetchStatusCount > MAX_REFETCH_NUMBER) {
            setIsTooManyFetchesError(true)
            return
        }
        if (data?.processed) {
            setIsProcessedError(false)
            setIsTooManyFetchesError(false)
            switch (true) {
                case fetchStatusCount === MAX_REFETCH_NUMBER: {
                    setIsTooManyFetchesError(true)
                    return
                }
                case data.status === RequestIdStatus.PROCESSED: {
                    onSuccess()
                    return
                }
                case data.status === RequestIdStatus.FAILED: {
                    setIsProcessedError(true)
                    return
                }
            }
        }
    }, [data?.processed, data?.status, fetchStatusCount, onSuccess])

    const isLoading = !isError && !data?.processed && !isTooManyFetchesError

    return { isLoading, isError, performRedirection, isFetched, isProcessedError, isTooManyFetchesError, reset }
}
