import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { useGetRequestStatus } from '@isdd/metais-common/api'

enum RequestIdStatus {
    PROCESSED = 'PROCESSED',
    FAILED = 'FAILED',
}

export const useRedirectAfterSuccess = (requestId: string, configurationItemId: string, ciType: string) => {
    const navigate = useNavigate()
    const requestStatusQuery = useGetRequestStatus(requestId, { query: { enabled: !!requestId } })

    const [isProcessedError, setIsProcessedError] = useState(false)

    const { isError, refetch, data, isFetched } = requestStatusQuery

    useEffect(() => {
        if (requestId) {
            const intervalId = setInterval(() => {
                if (data?.processed) {
                    clearInterval(intervalId)
                } else {
                    refetch()
                }
            }, 1000)

            return () => {
                clearInterval(intervalId)
            }
        }
    }, [data?.processed, data?.status, refetch, requestId])

    const performRedirection = () => {
        if (data?.processed) {
            setIsProcessedError(false)
            switch (true) {
                case data.status === RequestIdStatus.PROCESSED: {
                    navigate(`/ci/${ciType}/${configurationItemId}`, { state: { from: location } })
                    return
                }
                case data.status === RequestIdStatus.FAILED: {
                    setIsProcessedError(true)
                    return
                }
            }
        }
    }

    const isLoading = !isError && !data?.processed

    return { isLoading, isError, performRedirection, isFetched, isProcessedError }
}
