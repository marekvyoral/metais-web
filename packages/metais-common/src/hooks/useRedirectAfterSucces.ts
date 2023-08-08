import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import { useGetRequestStatus } from '@isdd/metais-common/api'

export const useRedirectAfterSuccess = (requestId: string, configurationItemId: string, ciType: string) => {
    const navigate = useNavigate()
    const requestStatusQuery = useGetRequestStatus(requestId, { query: { enabled: !!requestId } })

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
    }, [data?.processed, refetch, requestId])

    const performRedirection = () => {
        if (data?.processed) {
            navigate(`/detail/${ciType}/${configurationItemId}`)
        }
    }

    const isLoading = !isError && !data?.processed

    return { isLoading, isError, performRedirection, isFetched }
}
