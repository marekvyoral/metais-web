import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getGetFollowedItemsQueryKey, useRemoveFollowedItemHook } from '@isdd/metais-common/api/generated/user-config-swagger'
import { ReponseErrorCodeEnum } from '@isdd/metais-common/constants'

export const useRemoveFavorite = () => {
    const { t } = useTranslation()
    const removeFollowerItem = useRemoveFollowedItemHook()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [removedCount, setRemovedCount] = useState<number>(0)

    const queryClient = useQueryClient()

    const resetState = () => {
        setIsSuccess(false)
        setError('')
        setRemovedCount(0)
    }

    const removeFavorite = (ids: number[]) => {
        setIsSuccess(false)
        setIsLoading(true)
        setError('')
        setRemovedCount(0)

        const promises = ids.map((id) => removeFollowerItem(id))

        Promise.all(promises)
            .then(
                () => {
                    setIsSuccess(true)
                    setRemovedCount(ids.length)
                },
                (errorResponse) => {
                    const parsedResponse = JSON.parse(errorResponse)
                    const message =
                        parsedResponse?.type === ReponseErrorCodeEnum.GNR500 ? errorResponse.message : t('userProfile.notifications.feedback.error')
                    setError(message)
                },
            )
            .catch(() => {
                setError(t('userProfile.notifications.feedback.error'))
            })
            .finally(() => {
                queryClient.invalidateQueries([getGetFollowedItemsQueryKey({})[0]])
                setIsLoading(false)
            })
    }

    return { removeFavorite, removedCount, isLoading, isSuccess, resetState, isError: !!error, error }
}
