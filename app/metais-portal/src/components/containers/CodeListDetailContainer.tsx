import {
    ApiCodelistPreview,
    getGetCodelistHeadersQueryKey,
    useGetCodelistHeader,
    useGetOriginalCodelistHeader,
    useProcessAllItemsAction,
    useProcessHeaderAction,
    getGetCodelistItemsQueryKey,
    getGetCodelistHeaderQueryKey,
    getGetOriginalCodelistHeaderQueryKey,
    getGetCodelistHistoryQueryKey,
    getGetCodelistActionsHistoryQueryKey,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { RoleParticipantUI, getGetRoleParticipantBulkQueryKey, useGetRoleParticipantBulk } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { AttributeProfile, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export interface CodeListDetailData {
    codeList?: ApiCodelistPreview
    codeListOriginal?: ApiCodelistPreview
    attributeProfile?: AttributeProfile
    gestors?: RoleParticipantUI[]
}

export interface CodeListDetailWrapperProps {
    data: CodeListDetailData
    isLoading: boolean
    isError: boolean
    isErrorMutation: boolean
    isSuccessMutation: boolean
    successMessage?: string
    workingLanguage: string
    setWorkingLanguage: (language: string) => void
    invalidateCodeListDetailCache: () => void
    handleAllItemsReadyToPublish: () => void
    handleSendToIsvs: () => void
    handlePublishCodeList: () => void
    handleSendToSzzc: () => void
    handleReturnToMainGestor: () => void
}

enum ApiCodeListItemsActions {
    CODELIST_ITEMS_TO_PUBLISH = 'codelistItemsToPublish',
}

enum ApiCodeListActions {
    TEMPORAL_CODELIST_TO_ISVS_PROCESSING = 'temporalCodelistToIsvsProcessing',
    TEMPORAL_CODELIST_TO_PUBLISHED = 'temporalCodelistToPublished',
    TEMPORAL_CODELIST_TO_READY_TO_PUBLISH = 'temporalCodelistToReadyToPublish',
    TEMPORAL_CODELIST_TO_UPDATING = 'temporalCodelistToUpdating',
}

interface CodeListDetailContainerProps {
    id?: string
    View: React.FC<CodeListDetailWrapperProps>
}

export const CodeListDetailContainer: React.FC<CodeListDetailContainerProps> = ({ id, View }) => {
    const { t, i18n } = useTranslation()
    const queryClient = useQueryClient()

    const [workingLanguage, setWorkingLanguage] = useState<string>('')
    const [successMessage, setSuccessMessage] = useState<string>('')

    useEffect(() => {
        setWorkingLanguage(i18n.language)
    }, [i18n.language])

    const { isLoading: isLoadingAttributeProfile, isError: isErrorAttributeProfile, data: attributeProfile } = useGetAttributeProfile('Gui_Profil_ZC')
    const { isLoading: isLoadingData, isError: isErrorData, data: codeListData } = useGetCodelistHeader(Number(id))
    const {
        isInitialLoading: isLoadingOriginal,
        isError: isErrorOriginal,
        data: codeListOriginalData,
    } = useGetOriginalCodelistHeader(codeListData?.code ?? '', { query: { enabled: !!codeListData } })

    const requestGestorGids = [
        ...(codeListData?.mainCodelistManagers?.map((gestor) => gestor.value || '') || []),
        ...(codeListData?.codelistManagers?.map((gestor) => gestor.value || '') || []),
    ]

    const {
        isInitialLoading: isLoadingRoleParticipants,
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
        const code = data.codeList?.code
        if (code) {
            queryClient.invalidateQueries([getGetCodelistHeaderQueryKey(Number(id))[0]])
            queryClient.invalidateQueries([getGetOriginalCodelistHeaderQueryKey(code)[0]])
            queryClient.invalidateQueries([getGetRoleParticipantBulkQueryKey({})[0]])
            queryClient.invalidateQueries([getGetCodelistHeadersQueryKey({ language: '', pageNumber: 0, perPage: 0 })[0]])
            queryClient.invalidateQueries([getGetCodelistItemsQueryKey(code, { language: '', pageNumber: 0, perPage: 0 })[0]])
            queryClient.invalidateQueries([getGetCodelistHistoryQueryKey(code)[0]])
            queryClient.invalidateQueries([getGetCodelistActionsHistoryQueryKey(code, '')[0]])
        }
    }

    const handleAllItemsReadyToPublish = () => {
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

    const handleSendToIsvs = () => {
        data.codeList?.code &&
            codelistActionMutation.mutate(
                { code: data.codeList?.code, params: { action: ApiCodeListActions.TEMPORAL_CODELIST_TO_ISVS_PROCESSING } },
                {
                    onSuccess: () => {
                        invalidateCodeListDetailCache()
                        setSuccessMessage(t('codeListDetail.feedback.sendToIsvs'))
                        // navigate to CodeListList in old version
                    },
                },
            )
    }

    const handlePublishCodeList = () => {
        data.codeList?.code &&
            codelistActionMutation.mutate(
                { code: data.codeList?.code, params: { action: ApiCodeListActions.TEMPORAL_CODELIST_TO_PUBLISHED } },
                {
                    onSuccess: () => {
                        invalidateCodeListDetailCache()
                        setSuccessMessage(t('codeListDetail.feedback.publishCodeList'))
                        // navigate to CodeListList in old version
                    },
                },
            )
    }

    const handleSendToSzzc = () => {
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

    const handleReturnToMainGestor = () => {
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

    const isLoading = [
        isLoadingRoleParticipants,
        isLoadingAttributeProfile,
        isLoadingData,
        isLoadingOriginal,
        itemsActionMutation.isLoading,
        codelistActionMutation.isLoading,
    ].some((item) => item)
    const isError = [isErrorRoleParticipants, isErrorAttributeProfile, isErrorData, isErrorOriginal].some((item) => item)
    const isErrorMutation = [codelistActionMutation, itemsActionMutation].some((item) => item.isError)
    const isSuccessMutation = [codelistActionMutation, itemsActionMutation].some((item) => item.isSuccess)

    return (
        <View
            data={data}
            isLoading={isLoading}
            isError={isError}
            isErrorMutation={isErrorMutation}
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
