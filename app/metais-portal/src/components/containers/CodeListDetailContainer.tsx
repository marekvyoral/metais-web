import {
    ApiCodelistPreview,
    getGetCodelistHeadersQueryKey,
    useGetCodelistHeader,
    useGetOriginalCodelistHeader,
    useProcessAllItemsAction,
    useProcessHeaderAction,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { RoleParticipantUI, useGetRoleParticipantBulk } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { AttributeProfile, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
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
    const codeListListQueryKey = getGetCodelistHeadersQueryKey({ language: '', pageNumber: 0, perPage: 0 })[0]

    const [workingLanguage, setWorkingLanguage] = useState<string>(i18n.language)
    const [successMessage, setSuccessMessage] = useState<string>('')

    const { isLoading: isLoadingAttributeProfile, isError: isErrorAttributeProfile, data: attributeProfile } = useGetAttributeProfile('Gui_Profil_ZC')
    const { isLoading: isLoadingData, isError: isErrorData, data: codeListData } = useGetCodelistHeader(Number(id))
    const {
        isInitialLoading: isLoadingOriginal,
        isError: isErrorOriginal,
        data: codeListOriginalData,
    } = useGetOriginalCodelistHeader(codeListData?.code ?? '', { query: { enabled: !!codeListData } })

    const requestGestorGids = [
        ...(codeListData?.mainCodelistManagers?.map((gestor) => gestor.value) || []),
        ...(codeListData?.codelistManagers?.map((gestor) => gestor.value) || []),
    ].filter((item): item is string => !!item)

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

    const codelistItemsActionMutation = useProcessAllItemsAction()
    const codelistActionMutation = useProcessHeaderAction()

    const handleAllItemsReadyToPublish = () => {
        const code = data.codeList?.code
        if (!code) return
        codelistItemsActionMutation.mutate(
            { code, params: { action: ApiCodeListItemsActions.CODELIST_ITEMS_TO_PUBLISH } },
            {
                onSuccess: () => {
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
                        setSuccessMessage(t('codeListDetail.feedback.sendToIsvs'))
                        queryClient.invalidateQueries([codeListListQueryKey])
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
                        setSuccessMessage(t('codeListDetail.feedback.publishCodeList'))
                        queryClient.invalidateQueries([codeListListQueryKey])
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
        codelistItemsActionMutation.isLoading,
        codelistActionMutation.isLoading,
    ].some((item) => item)
    const isError = [isErrorRoleParticipants, isErrorAttributeProfile, isErrorData, isErrorOriginal].some((item) => item)
    const isErrorMutation = [codelistActionMutation, codelistItemsActionMutation].some((item) => item.isError)
    const isSuccessMutation = [codelistActionMutation, codelistItemsActionMutation].some((item) => item.isSuccess)

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
            handleAllItemsReadyToPublish={handleAllItemsReadyToPublish}
            handleSendToIsvs={handleSendToIsvs}
            handlePublishCodeList={handlePublishCodeList}
            handleSendToSzzc={handleSendToSzzc}
            handleReturnToMainGestor={handleReturnToMainGestor}
        />
    )
}
