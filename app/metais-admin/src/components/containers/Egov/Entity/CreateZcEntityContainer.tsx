import { SortType } from '@isdd/idsk-ui-kit/types'
import { ApiCodelistPreview, useConnectCodelistWithEntity } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { useFindAll1 } from '@isdd/metais-common/api/generated/iam-swagger'
import { CiType, useStoreAdminEntity1 } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { ADMIN_EGOV_ENTITY_LIST_QKEY, ReponseErrorCodeEnum } from '@isdd/metais-common/constants'
import { MutationFeedbackError } from '@isdd/metais-common/index'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

import { CreateZcEntityView } from '@/components/views/egov/entity-detail-views/CreateZcEntityView'

const CreateZcEntityContainer = () => {
    const pageNumber = 1
    const pageSize = 200
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { setIsActionSuccess } = useActionSuccess()
    const { data, isLoading: isDataLoading, isError } = useFindAll1(pageNumber, pageSize, { direction: SortType.ASC, orderBy: 'name' })
    const queryClient = useQueryClient()
    const { mutateAsync: connectEntity, isLoading: isConnectLoading } = useConnectCodelistWithEntity()

    const [error, setError] = useState<MutationFeedbackError | undefined>(undefined)
    const [successMutation, setSuccessMutation] = useState<boolean>(false)
    const { mutateAsync: storeEntity, isLoading: isStoreLoading } = useStoreAdminEntity1({
        mutation: {
            onSuccess() {
                queryClient.invalidateQueries([ADMIN_EGOV_ENTITY_LIST_QKEY])
            },
        },
    })

    const handleSubmit = async (formData: CiType, codelist: ApiCodelistPreview) => {
        await storeEntity({
            data: {
                ...formData,
            },
        }).catch((mutationError) => {
            const errorResponse = JSON.parse(mutationError.message)
            const message = errorResponse?.type === ReponseErrorCodeEnum.NTM01 ? t('egov.entity.technicalNameAlreadyExists') : errorResponse.message
            setError({ errorTitle: mutationError?.message, errorMessage: message })
        })
        await connectEntity({ code: codelist.code ?? '', entity: formData.technicalName ?? '' }).catch((mutationError) => {
            setError({ errorTitle: mutationError?.message, errorMessage: undefined })
        })

        setSuccessMutation(true)
        setIsActionSuccess({
            value: true,
            path: `${AdminRouteNames.EGOV_ENTITY}/${formData?.technicalName}`,
            additionalInfo: { type: 'createZc' },
        })
        navigate(`${AdminRouteNames.EGOV_ENTITY}/${formData?.technicalName}`, { state: { from: location } })
    }

    const isLoading = [isConnectLoading, isDataLoading, isStoreLoading].some((item) => item)

    return (
        <CreateZcEntityView
            roles={data ?? []}
            isError={isError}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            successMutation={successMutation}
            error={error}
            clearError={() => {
                setError(undefined)
                setSuccessMutation(false)
            }}
        />
    )
}

export default CreateZcEntityContainer
