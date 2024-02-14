import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FollowedItemItemType, getGetFollowedItemsQueryKey, useAddFollowedItemHook } from '@isdd/metais-common/api/generated/user-config-swagger'
import { ReponseErrorCodeEnum } from '@isdd/metais-common/constants'

export const useAddFavorite = () => {
    const { t } = useTranslation()
    const addFollowerItemHook = useAddFollowedItemHook()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string>()
    const [error, setError] = useState<string>('')

    const queryClient = useQueryClient()

    const resetState = () => {
        setIsSuccess(false)
        setError('')
    }

    const createPromises = (ids: string[], type: FollowedItemItemType) => {
        return ids.map((id) => {
            return new Promise<void>((resolve, reject): void => {
                addFollowerItemHook({ name: `${type}.${id}`, itemId: id, itemType: type, email: true, portal: true })
                    .then(() => {
                        resolve()
                    })
                    .catch((response) => {
                        const parsedResponse = JSON.parse(response.message)
                        if (parsedResponse.type === ReponseErrorCodeEnum.GNR412) {
                            // error GNR412 is filtered out, returned if item is already followed.
                            resolve()
                        }
                        reject(response)
                    })
            })
        })
    }

    const addFavorite = (ids: string[], type: FollowedItemItemType) => {
        setIsSuccess(false)
        setIsLoading(true)
        setError('')

        Promise.allSettled(createPromises(ids, type))
            .then(() => {
                setSuccessMessage(t('userProfile.notifications.feedback.addSuccess', { count: ids.length }))
                setIsSuccess(true)
            })
            .catch(() => {
                setError(t('userProfile.notifications.feedback.error'))
            })
            .finally(() => {
                queryClient.invalidateQueries([getGetFollowedItemsQueryKey({})[0]])
                setIsLoading(false)
            })
    }

    const addFavoriteAsync = async (ids: string[], type: FollowedItemItemType) => {
        return await Promise.allSettled(createPromises(ids, type)).finally(() => {
            queryClient.invalidateQueries([getGetFollowedItemsQueryKey({})[0]])
        })
    }

    return { addFavorite, addFavoriteAsync, resetState, isLoading, isSuccess, error, successMessage }
}
