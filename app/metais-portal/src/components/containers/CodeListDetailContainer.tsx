import {
    ApiCodelistPreview,
    useGetCodelistHeader,
    useGetOriginalCodelistHeader,
    useProcessAllItemsAction,
    useProcessHeaderAction,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { RoleParticipantUI, useGetRoleParticipantBulk } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { AttributeProfile, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useInvalidateCodeListCache } from '@isdd/metais-common/hooks/invalidate-cache'

import { ApiCodeListActions, ApiCodeListItemsActions, getErrorTranslateKeys } from '@/componentHelpers/codeList'

export interface CodeListDetailData {
    codeList?: ApiCodelistPreview
    codeListOriginal?: ApiCodelistPreview
    attributeProfile?: AttributeProfile
    gestors?: RoleParticipantUI[]
}

export interface CodeListDetailWrapperProps {
    data: CodeListDetailData
    isLoading: boolean
    isLoadingMutation: boolean
    isError: boolean
    actionsErrorMessages: string[]
    isSuccessMutation: boolean
    successMessage?: string
    workingLanguage: string
    setWorkingLanguage: (language: string) => void
    invalidateCodeListDetailCache: () => void
    handleAllItemsReadyToPublish: (close: () => void) => void
    handleSendToIsvs: (close: () => void) => void
    handlePublishCodeList: (close: () => void) => void
    handleSendToSzzc: (close: () => void) => void
    handleReturnToMainGestor: (close: () => void) => void
}

interface CodeListDetailContainerProps {
    id?: string
    View: React.FC<CodeListDetailWrapperProps>
}

export const CodeListDetailContainer: React.FC<CodeListDetailContainerProps> = ({ id, View }) => {
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()

    const [workingLanguage, setWorkingLanguage] = useState<string>('')
    const [successMessage, setSuccessMessage] = useState<string>('')

    const { invalidate } = useInvalidateCodeListCache()

    useEffect(() => {
        setWorkingLanguage(i18n.language)
    }, [i18n.language])

    const {
        isFetching: isLoadingAttributeProfile,
        isError: isErrorAttributeProfile,
        data: attributeProfile,
    } = useGetAttributeProfile('Gui_Profil_ZC')
    const { isFetching: isLoadingData, isError: isErrorData, data: codeListData } = useGetCodelistHeader(Number(id))
    const {
        isFetching: isLoadingOriginal,
        isError: isErrorOriginal,
        data: codeListOriginalData,
    } = useGetOriginalCodelistHeader(codeListData?.code ?? '', { query: { enabled: !!codeListData } })

    const requestGestorGids = [
        ...(codeListData?.mainCodelistManagers?.map((gestor) => gestor.value || '') || []),
        ...(codeListData?.codelistManagers?.map((gestor) => gestor.value || '') || []),
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

    const data = {
        codeList: codeListData,
        codeListOriginal: codeListOriginalData,
        attributeProfile: attributeProfile,
        gestors: roleParticipantsData,
    }

    const itemsActionMutation = useProcessAllItemsAction()
    const codelistActionMutation = useProcessHeaderAction()

    const invalidateCodeListDetailCache = () => {
        invalidate(data.codeList?.code ?? '', Number(id))
    }

    const handleAllItemsReadyToPublish = (close: () => void) => {
        close()
        const code = data.codeList?.code
        if (!code) return
        itemsActionMutation.mutate(
            { code, params: { action: ApiCodeListItemsActions.CODELIST_ITEMS_TO_PUBLISH } },
            {
                onSuccess: () => {
                    invalidateCodeListDetailCache()
                    setSuccessMessage(t('codeListDetail.feedback.publishCodeListItems'))
                },
            },
        )
    }

    const handleSendToIsvs = (close: () => void) => {
        close()
        data.codeList?.code &&
            codelistActionMutation.mutate(
                { code: data.codeList?.code, params: { action: ApiCodeListActions.TEMPORAL_CODELIST_TO_ISVS_PROCESSING } },
                {
                    onSuccess: () => {
                        invalidateCodeListDetailCache()
                        const path = NavigationSubRoutes.CODELIST
                        setIsActionSuccess({ value: true, path })
                        navigate(path, { state: { from: location } })
                    },
                },
            )
    }

    const handlePublishCodeList = (close: () => void) => {
        close()
        data.codeList?.code &&
            codelistActionMutation.mutate(
                { code: data.codeList?.code, params: { action: ApiCodeListActions.TEMPORAL_CODELIST_TO_PUBLISHED } },
                {
                    onSuccess: () => {
                        invalidateCodeListDetailCache()
                        const path = NavigationSubRoutes.CODELIST
                        setIsActionSuccess({ value: true, path })
                        navigate(path, { state: { from: location } })
                    },
                },
            )
    }

    const handleSendToSzzc = (close: () => void) => {
        close()
        data.codeList?.code &&
            codelistActionMutation.mutate(
                { code: data.codeList?.code, params: { action: ApiCodeListActions.TEMPORAL_CODELIST_TO_READY_TO_PUBLISH } },
                {
                    onSuccess: () => {
                        invalidateCodeListDetailCache()
                        setSuccessMessage(t('codeListDetail.feedback.sendToSzzc'))
                    },
                },
            )
    }

    const handleReturnToMainGestor = (close: () => void) => {
        close()
        data.codeList?.code &&
            codelistActionMutation.mutate(
                { code: data.codeList?.code, params: { action: ApiCodeListActions.TEMPORAL_CODELIST_TO_UPDATING } },
                {
                    onSuccess: () => {
                        invalidateCodeListDetailCache()
                        setSuccessMessage(t('codeListDetail.feedback.returnToMainGestor'))
                    },
                },
            )
    }

    const isLoading = [isLoadingRoleParticipants, isLoadingAttributeProfile, isLoadingData, isLoadingOriginal].some((item) => item)
    const isError = [isErrorRoleParticipants, isErrorAttributeProfile, isErrorData, isErrorOriginal].some((item) => item)
    const isLoadingMutation = [codelistActionMutation, itemsActionMutation].some((item) => item.isLoading)
    const isSuccessMutation = [codelistActionMutation, itemsActionMutation].some((item) => item.isSuccess)
    const actionsErrorMessages = getErrorTranslateKeys([codelistActionMutation, itemsActionMutation].map((item) => item.error as { message: string }))

    return (
        <View
            data={data}
            isLoading={isLoading}
            isLoadingMutation={isLoadingMutation}
            isError={isError}
            actionsErrorMessages={actionsErrorMessages}
            isSuccessMutation={isSuccessMutation}
            successMessage={successMessage}
            workingLanguage={workingLanguage}
            setWorkingLanguage={setWorkingLanguage}
            invalidateCodeListDetailCache={invalidateCodeListDetailCache}
            handleAllItemsReadyToPublish={handleAllItemsReadyToPublish}
            handleSendToIsvs={handleSendToIsvs}
            handlePublishCodeList={handlePublishCodeList}
            handleSendToSzzc={handleSendToSzzc}
            handleReturnToMainGestor={handleReturnToMainGestor}
        />
    )
}
