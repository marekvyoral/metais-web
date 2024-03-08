import { IOption } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ConfigurationItemUi, useReadCiList1, useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ConsentType, useRegisterTrainee } from '@isdd/metais-common/api/generated/trainings-swagger'
import { CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CI_ITEM_QUERY_KEY } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { User, useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useInvalidateTrainingsCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useNavigate } from 'react-router-dom'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useGetCiTypeWrapper } from '@isdd/metais-common/hooks/useCiType.hook'

import { getErrorTranslateKeys } from '@/componentHelpers'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { TrainingInviteView } from '@/components/views/trainings/TrainingInviteView'

export interface ITrainingInviteForm {
    firstName: string
    lastName: string
    organization: string
    email: string
    phone: string
    consent?: boolean
}

export interface TrainingInviteContainerViewProps {
    user?: User | null
    entityName: string
    entityId: string
    ciTypeData?: CiType | null
    ciItemData: ConfigurationItemUi | undefined
    organizationOptions: IOption<string>[]
    isLoggedIn: boolean
    isLoading: boolean
    isLoadingMutation: boolean
    isError: boolean
    errorMessages: string[]
    handleInvite: (data: ITrainingInviteForm) => void
    isUserAlreadyEnrolled: boolean
}
const baseURL = import.meta.env.VITE_REST_CLIENT_TRAININGS_TARGET_URL
export const TrainingInviteContainer: React.FC = () => {
    const {
        state: { user },
    } = useAuth()

    const { entityId, entityName } = useGetEntityParamsFromUrl()
    const { setIsActionSuccess } = useActionSuccess()
    const { executeRecaptcha } = useGoogleReCaptcha()

    const [isInviteLoading, setInviteLoading] = useState<boolean>(false)
    const [isInviteError, setInviteError] = useState<boolean>(false)
    const [isUserAlreadyEnrolled, setIsUserAlreadyEnrolled] = useState<boolean>(false)

    const { getRequestStatus, isLoading: isRequestLoading } = useGetStatus('PROCESSED')

    const navigate = useNavigate()
    const { invalidate } = useInvalidateTrainingsCache(entityId ?? '')
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiTypeWrapper(entityName ?? '')

    const groupDataUuids = user?.groupData.map((item) => item.orgId) || []

    const isLoggedIn = !!user

    const {
        data: ciDataByUuids,
        isFetching: isReadCiListFetching,
        isError: isReadCiListError,
    } = useReadCiList1(
        {
            filter: {
                metaAttributes: {
                    state: ['DRAFT'],
                },
                uuid: groupDataUuids,
            },
        },
        { query: { enabled: groupDataUuids?.length > 0 } },
    )

    const {
        data: ciItemData,
        isLoading: isCiItemDataLoading,
        isError: isCiItemDataError,
    } = useReadConfigurationItem(entityId ?? '', {
        query: {
            queryKey: [CI_ITEM_QUERY_KEY, entityId],
        },
    })
    const redirectPath = `/${RouterRoutes.CI_TRAINING}/${entityId}`

    const handleRedirect = () => {
        invalidate()
        setIsActionSuccess({ value: true, path: redirectPath, additionalInfo: { type: 'register' } })
        navigate(redirectPath)
    }

    const registerTrainee = useRegisterTrainee({
        mutation: {
            onSuccess: async (res) => {
                await getRequestStatus(res?.requestId ?? '', () => handleRedirect())
            },
        },
    })

    const handleInvite = async (data: ITrainingInviteForm) => {
        if (!entityId) return
        if (!isLoggedIn) {
            if (!executeRecaptcha) {
                return
            }

            const capthcaToken = await executeRecaptcha()
            setInviteError(false)
            setIsUserAlreadyEnrolled(false)
            setInviteLoading(true)

            const consents = [
                {
                    type: ConsentType.PERSONAL_DATA_PROCESSING,
                    accepted: data.consent,
                },
            ]

            delete data.consent

            const response = await fetch(`${baseURL}/${entityId}/trainee`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'recaptcha-response': capthcaToken },
                body: JSON.stringify({
                    ...data,
                    consents,
                }),
            })
            const responseBodyText = await response.text()
            let responseBody: { [key: string]: string } = {}
            if (responseBodyText?.length > 0) {
                try {
                    responseBody = JSON.parse(responseBodyText)
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error('Response not json', e)
                }
            }

            if (!response.ok) {
                if (responseBody['type'] === 'training04') {
                    setIsUserAlreadyEnrolled(true)
                }
                setInviteError(true)
            } else {
                if (responseBodyText?.length > 0) {
                    if (responseBody['requestId']) {
                        await getRequestStatus(responseBody['requestId'], () => handleRedirect())
                    }
                }
            }
            setInviteLoading(false)
        } else {
            registerTrainee.mutateAsync({ trainingId: entityId, data: { ...data, userId: user?.uuid } })
        }
    }

    const organizationOptions: IOption<string>[] =
        ciDataByUuids?.configurationItemSet?.map((item) => ({
            value: item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
            label: item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
        })) ?? []

    const isLoading = [isCiItemDataLoading, isCiTypeDataLoading, isInviteLoading, isReadCiListFetching, isRequestLoading].some((item) => item)
    const isError = [isCiItemDataError, isCiTypeDataError, isInviteError, isReadCiListError].some((item) => item)
    const errorMessages = getErrorTranslateKeys([registerTrainee.error].map((item) => item as { message: string }))
    return (
        <TrainingInviteView
            user={user}
            entityName={entityName ?? ''}
            entityId={entityId ?? ''}
            ciItemData={ciItemData}
            ciTypeData={ciTypeData}
            organizationOptions={organizationOptions}
            isLoggedIn={isLoggedIn}
            isLoading={isLoading}
            isLoadingMutation={registerTrainee.isLoading}
            isError={isError}
            errorMessages={errorMessages}
            handleInvite={handleInvite}
            isUserAlreadyEnrolled={isUserAlreadyEnrolled}
        />
    )
}
