/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    useGetCodelistRequestDetail,
    useGetCodelistRequestItems,
    useProcessRequestActionHook,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { useNavigate, useParams } from 'react-router-dom'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, RequestListState } from '@isdd/metais-common/constants'
import { AttributeProfile, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { HierarchyPOFilterUi, HierarchyRightsUi, useReadCiList } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'

import { RequestListPermissionsWrapper } from '@/components/permissions/RequestListPermissionsWrapper'
import { IRequestForm, _entityName, mapToForm } from '@/componentHelpers/requests'

export enum RequestActions {
    ACCEPT = 'requestToAccepted',
    ACCEPTSZZC = 'requestToAcceptedSZZC',
    ACCEPTKSISVS = 'requestToIsvsProcessing',
    CANCEL = 'requestCancel',
    REJECT = 'requestToRejected',
    SEND = 'requestToSended',
}
export enum RequestState {
    DRAFT,
    ACCEPT,
    CANCEL,
    REJECT,
    ACCEPTKSISVS,
    ACCEPTSZZC,
    SEND,
}

export interface IActionDetailRequest {
    canEdit: boolean
    moveToKSISVS: boolean
    reject: boolean
    accept: boolean
    accept_SZZC: boolean
    cancelRequest: boolean
    send: boolean
}

export interface DetailRequestViewProps {
    data?: IRequestForm
    actions: IActionDetailRequest
    isLoading: boolean
    isError: boolean
    attributeProfile: AttributeProfile
    entityName: string
    requestId?: string
    loadOptions: (
        searchQuery: string,
        additional: { page: number } | undefined,
    ) => Promise<{
        options: HierarchyRightsUi[]
        hasMore: boolean
        additional: {
            page: number
        }
    }>
    onAccept: (action: RequestActions, note?: string) => void
}

interface DetailRequestContainerProps {
    View: React.FC<DetailRequestViewProps>
}

export const DetailRequestContainer: React.FC<DetailRequestContainerProps> = ({ View }) => {
    const {
        state: { user },
    } = useAuth()
    const { i18n } = useTranslation()
    const { requestId } = useParams()
    const navigate = useNavigate()

    const [isLoadingCheck, setLoadingCheck] = useState<boolean>()
    const [isErrorCheck, setErrorCheck] = useState<boolean>()
    const userDataGroups = useMemo(() => user?.groupData ?? [], [user])
    const implicitHierarchy = useReadCiList()
    const { setIsActionSuccess } = useActionSuccess()

    const { data, isLoading: isLoadingDetail, isError: isErrorDetail } = useGetCodelistRequestDetail(Number.parseInt(requestId || ''))
    const { data: attributeProfile, isLoading: isLoadingAttributeProfile, isError: isErrorAttributeProfile } = useGetAttributeProfile('Gui_Profil_ZC')
    const acceptRequest = useProcessRequestActionHook()

    const {
        data: itemList,
        isLoading: isLoadingItemList,
        isError: isErrorItemList,
    } = useGetCodelistRequestItems(Number.parseInt(requestId || '0'), {
        language: i18n.language,
        pageNumber: BASE_PAGE_NUMBER,
        perPage: BASE_PAGE_SIZE,
    })

    const defaultData = mapToForm(i18n.language, itemList, data)

    const isLoading = [isLoadingCheck, isLoadingDetail, isLoadingAttributeProfile, isLoadingItemList].some((item) => item)
    const isError = [isErrorCheck, isErrorDetail, isErrorAttributeProfile, isErrorItemList].some((item) => item)

    const defaultFilter: HierarchyPOFilterUi = {
        perpage: 20,
        sortBy: SortBy.HIERARCHY_FROM_ROOT,
        sortType: SortType.ASC,
        rights: userDataGroups.map((group) => ({ poUUID: group.orgId, roles: group.roles.map((role) => role.roleUuid) })),
    }

    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1
        const options = await implicitHierarchy.mutateAsync({ data: { ...defaultFilter, page, fullTextSearch: searchQuery } })
        return {
            options: options.rights || [],
            hasMore: options.rights?.length ? true : false,
            additional: {
                page: page,
            },
        }
    }

    const actions: IActionDetailRequest = {
        canEdit:
            (data &&
                (data.lockedBy === null || data.lockedBy === user?.login) &&
                (data.codelistState === RequestListState.DRAFT ||
                    data.codelistState === RequestListState.REJECTED ||
                    data.codelistState === RequestListState.KS_ISVS_ACCEPTED ||
                    data.codelistState === RequestListState.ACCEPTED_SZZC)) ??
            false,
        moveToKSISVS: (data?.base && data.codelistState === RequestListState.NEW_REQUEST) ?? false,
        reject:
            (!data?.base && (data?.codelistState === RequestListState.NEW_REQUEST || data?.codelistState === RequestListState.KS_ISVS_REJECTED)) ??
            false,
        accept:
            ((!data?.base && data?.codelistState === RequestListState.ACCEPTED_SZZC) || data?.codelistState === RequestListState.KS_ISVS_ACCEPTED) ??
            false,
        accept_SZZC: (data && !data.base && data.codelistState === RequestListState.NEW_REQUEST) ?? false,
        cancelRequest:
            (data?.lockedBy === null || data?.lockedBy === user?.login) &&
            (data?.codelistState === RequestListState.DRAFT ||
                data?.codelistState === RequestListState.REJECTED ||
                data?.codelistState === RequestListState.KS_ISVS_ACCEPTED ||
                data?.codelistState === RequestListState.ACCEPTED_SZZC),
        send: data?.lockedBy === user?.login && (data?.codelistState === RequestListState.DRAFT || data?.codelistState === RequestListState.REJECTED),
    }

    const handleAcceptRequest = async (action: RequestActions, note?: string) => {
        acceptRequest(
            defaultData.codeListId ?? '',
            {
                comment: note,
                commentDate: new Date().toISOString(),
            },
            { action: action },
        )
            .then(() => {
                setIsActionSuccess({ value: true, path: NavigationSubRoutes.REQUESTLIST })
                navigate(`${NavigationSubRoutes.REQUESTLIST}`)
            })
            .catch(() => {
                setErrorCheck(true)
            })
    }

    return !isLoading && defaultData ? (
        <RequestListPermissionsWrapper entityName={_entityName}>
            <View
                requestId={requestId}
                actions={actions}
                data={defaultData}
                entityName={_entityName}
                isLoading={isLoading}
                isError={isError}
                attributeProfile={attributeProfile ?? {}}
                loadOptions={loadOptions}
                onAccept={handleAcceptRequest}
            />
        </RequestListPermissionsWrapper>
    ) : (
        <></>
    )
}
