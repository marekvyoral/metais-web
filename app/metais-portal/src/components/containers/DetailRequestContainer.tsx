import {
    ApiCodelistItemList,
    ApiCodelistPreview,
    useGetCodelistRequestDetail,
    useGetCodelistRequestItems,
    useProcessRequestAction,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { AttributeProfile, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { RoleParticipantUI, useGetRoleParticipantBulk } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { formatDateForDefaultValue } from '@isdd/metais-common/componentHelpers/formatting/formatDateUtils'
import { useInvalidateCodeListRequestCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'

import { RequestListPermissionsWrapper } from '@/components/permissions/RequestListPermissionsWrapper'
import { API_DATE_FORMAT } from '@/componentHelpers/requests'
import { getErrorTranslateKeys } from '@/componentHelpers/codeList'

export enum ApiRequestAction {
    ACCEPT = 'requestToAccepted',
    ACCEPTSZZC = 'requestToAcceptedSZZC',
    ACCEPTKSISVS = 'requestToIsvsProcessing',
    CANCEL = 'requestCancel',
    REJECT = 'requestToRejected',
    SEND = 'requestToSended',
}

export interface RequestDetailData {
    detail: ApiCodelistPreview
    gestors: RoleParticipantUI[]
    attributeProfile: AttributeProfile
    items: ApiCodelistItemList
}

export interface DetailRequestViewProps {
    data: RequestDetailData
    isLoading: boolean
    isLoadingMutation: boolean
    isError: boolean
    actionsErrorMessages: string[]
    requestId?: string
    filter: IFilter
    onAccept: (action: ApiRequestAction, note?: string) => void
    handleFilterChange: (filter: IFilter) => void
}

interface DetailRequestContainerProps {
    View: React.FC<DetailRequestViewProps>
}

export const DetailRequestContainer: React.FC<DetailRequestContainerProps> = ({ View }) => {
    const { i18n } = useTranslation()
    const { requestId } = useParams()
    const navigate = useNavigate()

    const { setIsActionSuccess } = useActionSuccess()
    const { invalidate } = useInvalidateCodeListRequestCache()

    const { filter, handleFilterChange } = useFilterParams<IFilter>({
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
    })

    const { data: detailData, isLoading: isLoadingDetail, isError: isErrorDetail } = useGetCodelistRequestDetail(Number.parseInt(requestId || ''))
    const { data: attributeProfile, isLoading: isLoadingAttributeProfile, isError: isErrorAttributeProfile } = useGetAttributeProfile('Gui_Profil_ZC')
    const { mutate: requestActionMutation, isLoading: isLoadingRequestAction, error: errorRequestAction } = useProcessRequestAction()
    const {
        data: itemList,
        isFetching: isLoadingItemList,
        isError: isErrorItemList,
    } = useGetCodelistRequestItems(Number(requestId), {
        language: i18n.language,
        pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
        perPage: filter.pageSize ?? BASE_PAGE_SIZE,
    })
    const requestGestorGids = [
        ...(detailData?.mainCodelistManagers?.map((gestor) => gestor.value || '') || []),
        ...(detailData?.codelistManagers?.map((gestor) => gestor.value || '') || []),
    ]
    const {
        isFetching: isLoadingRoleParticipants,
        isError: isErrorRoleParticipants,
        data: roleParticipantsData,
    } = useGetRoleParticipantBulk(
        { gids: requestGestorGids },
        {
            query: { enabled: requestGestorGids.length > 0 },
        },
    )

    const isLoading = [isLoadingDetail, isLoadingAttributeProfile, isLoadingItemList, isLoadingRoleParticipants].some((item) => item)
    const isError = [isErrorDetail, isErrorAttributeProfile, isErrorItemList, isErrorRoleParticipants].some((item) => item)
    const actionsErrorMessages = getErrorTranslateKeys([errorRequestAction as { message: string }])

    const handleAcceptRequest = async (action: ApiRequestAction, note?: string) => {
        requestActionMutation(
            {
                code: detailData?.code ?? '',
                data: {
                    comment: note,
                    commentDate: formatDateForDefaultValue(new Date().toISOString(), API_DATE_FORMAT),
                },
                params: { action: action },
            },
            {
                onSuccess: () => {
                    invalidate(detailData?.id)
                    setIsActionSuccess({ value: true, path: NavigationSubRoutes.REQUESTLIST })
                    navigate(`${NavigationSubRoutes.REQUESTLIST}`)
                },
            },
        )
    }

    const data: RequestDetailData = {
        detail: detailData ?? {},
        gestors: roleParticipantsData ?? [],
        attributeProfile: attributeProfile ?? {},
        items: itemList ?? {},
    }

    return (
        <RequestListPermissionsWrapper id={requestId ?? ''}>
            <View
                requestId={requestId}
                data={data}
                isLoading={isLoading}
                isLoadingMutation={isLoadingRequestAction}
                actionsErrorMessages={actionsErrorMessages}
                isError={isError}
                filter={filter}
                onAccept={handleAcceptRequest}
                handleFilterChange={handleFilterChange}
            />
        </RequestListPermissionsWrapper>
    )
}
