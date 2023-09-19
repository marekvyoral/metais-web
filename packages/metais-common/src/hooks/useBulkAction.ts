import uniq from 'lodash/uniq'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useBulkActionHelpers } from './useBulkActionHelpers'

import { useIsOwnerByGidHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { ConfigurationItemUi } from '@isdd/metais-common/index'

export interface IBulkActionResult {
    isSuccess: boolean
    isError: boolean
    successMessage: string
}

export const useBulkAction = () => {
    const {
        state: { user },
    } = useAuth()
    const { t } = useTranslation()

    const { bulkCheck, checkChangeOfOwner, ciInvalidFilter } = useBulkActionHelpers()

    const [errorMessage, setErrorMessage] = useState<string | undefined>()
    const [isBulkLoading, setBulkLoading] = useState<boolean>(false)

    const checkIsOwnerByGid = useIsOwnerByGidHook()

    const handleInvalidate = async (items: ConfigurationItemUi[], onSuccess: (value: boolean) => void, onError: () => void) => {
        setBulkLoading(true)
        const isValid = items.every((item) => !ciInvalidFilter(item))

        if (!isValid) {
            setErrorMessage(t('tooltip.rights.invalidSelectedList'))
            return onError()
        }

        try {
            const gids = uniq(items.filter((item) => !!item.attributes).map((item) => item.metaAttributes?.owner || ''))
            const response = await checkIsOwnerByGid({
                login: user?.login,
                gids,
            })

            const hasRights = response.isOwner?.every((item) => {
                return item.owner
            })

            if (hasRights) {
                setErrorMessage(undefined)
                return onSuccess(true)
            } else {
                setErrorMessage(t('tooltip.rights.missingPermission'))
                return onError()
            }
        } catch (e) {
            setErrorMessage(t('tooltip.rights.notFondPO'))
            return onError()
        } finally {
            setBulkLoading(false)
        }
    }

    const handleReInvalidate = async (items: ConfigurationItemUi[], onSuccess: (value: boolean) => void, onError: () => void) => {
        setBulkLoading(true)
        const isValid = items.every((item) => ciInvalidFilter(item))

        if (!isValid) {
            setErrorMessage(t('tooltip.rights.validSelectedList'))
            setBulkLoading(false)
            return onError()
        }

        const canReInvalidate = await bulkCheck(items)
        setBulkLoading(false)
        if (canReInvalidate) {
            setErrorMessage(undefined)
            return onSuccess(true)
        } else return setErrorMessage(t('tooltip.rights.missingPermission'))
    }

    const handleChangeOwner = async (items: ConfigurationItemUi[], onSuccess: (value: boolean) => void, onError: () => void) => {
        setBulkLoading(true)
        const isValid = !items.every((item) => ciInvalidFilter(item))

        if (!isValid) {
            setErrorMessage(t('tooltip.rights.invalidSelectedList'))
            setBulkLoading(false)
            return onError()
        }

        const ownerGids = await checkChangeOfOwner(items)

        const hasRights = items.every(function (item) {
            return ownerGids[item.metaAttributes?.owner ?? '']
        })
        setBulkLoading(false)
        if (hasRights) {
            setErrorMessage(undefined)
            return onSuccess(true)
        } else {
            setErrorMessage(t('tooltip.rights.missingPermission'))
            return onError()
        }
    }

    return { errorMessage, isBulkLoading, handleInvalidate, handleReInvalidate, handleChangeOwner }
}
