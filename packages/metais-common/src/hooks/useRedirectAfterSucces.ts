import { useLocation, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'

import { useInvalidateCiItemCache, useInvalidateCiListFilteredCache } from './invalidate-cache'

import { useGetRequestStatus } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

enum RequestIdStatus {
    PROCESSED = 'PROCESSED',
    FAILED = 'FAILED',
}

export const useRedirectAfterSuccess = (requestId: string, configurationItemId: string, ciType: string) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { setIsActionSuccess } = useActionSuccess()
    const requestStatusQuery = useGetRequestStatus(requestId, { query: { enabled: !!requestId } })
    const invalidateCilistFilteredCache = useInvalidateCiListFilteredCache()
    const invalidateCiByUuidCache = useInvalidateCiItemCache()

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
                    const toPath = `/ci/${ciType}/${configurationItemId}`
                    setIsActionSuccess({ value: true, path: toPath })
                    navigate(toPath, { state: { from: location } })
                    invalidateCilistFilteredCache.invalidate({ ciType })
                    invalidateCiByUuidCache.invalidate(configurationItemId)
                    return
                }
                case data.status === RequestIdStatus.FAILED: {
                    setIsProcessedError(true)
                    return
                }
            }
        }
    }, [
        ciType,
        configurationItemId,
        data?.processed,
        data?.status,
        fetchStatusCount,
        invalidateCiByUuidCache,
        invalidateCilistFilteredCache,
        location,
        navigate,
        setIsActionSuccess,
    ])

    const isLoading = !isError && !data?.processed && !isTooManyFetchesError

    return { isLoading, isError, performRedirection, isFetched, isProcessedError, isTooManyFetchesError, reset }
}
