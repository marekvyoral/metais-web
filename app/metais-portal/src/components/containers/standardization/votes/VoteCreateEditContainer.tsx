import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { FindAllWithIdentities1Params, useFindAllWithIdentities1 } from '@isdd/metais-common/api/generated/iam-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useTranslation } from 'react-i18next'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { BreadCrumbs, BreadCrumbsItemProps, HomeIcon } from '@isdd/idsk-ui-kit/index'
import {
    ApiAttachment,
    ApiVote,
    useCreateVote,
    useGetAllStandardRequests,
    useGetVoteDetail,
    useUpdateVote,
} from '@isdd/metais-common/api/generated/standards-swagger'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { FileUploadData, IFileUploadRef } from '@isdd/metais-common/components/FileUpload/FileUpload'
import { useInvalidateVoteCache } from '@isdd/metais-common/hooks/invalidate-cache'

import { IVoteEditView } from '@/components/views/standardization/votes/VoteComposeForm/VoteComposeFormView'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import {
    getPageDocumentTitle,
    mapProcessedExistingFilesToApiAttachment,
    mapUploadedFilesToApiAttachment,
} from '@/components/views/standardization/votes/VoteComposeForm/functions/voteEditFunc'
import { IExistingFilesHandlerRef } from '@/components/views/standardization/votes/VoteComposeForm/components/ExistingFilesHandler/ExistingFilesHandler'

interface IVoteEditContainer {
    View: React.FC<IVoteEditView>
    isNewVote?: boolean
}

export const VoteCreateEditContainer: React.FC<IVoteEditContainer> = ({ View, isNewVote }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()
    const location = useLocation()
    const { wrapperRef: queryFeedbackRef, scrollToMutationFeedback } = useScroll()
    const { state: user } = useAuth()
    const isUserLogged = !!user

    const fileUploadRef = useRef<IFileUploadRef>(null)
    const attachmentsDataRef = useRef<ApiAttachment[]>([])
    const existingFilesProcessRef = useRef<IExistingFilesHandlerRef>(null)

    const { voteId: voteIdParam } = useParams()

    const [voteId, setVoteId] = useState(isNewVote ? 0 : Number(voteIdParam))
    const [creatingFilesLoading, setCreatingFilesLoading] = useState(false)
    const [deletingFilesLoading, setDeletingFilesLoading] = useState(false)

    const invalidateVoteDetailCache = useInvalidateVoteCache()

    const { data: voteData, isLoading: voteDataLoading, isError: voteDataError } = useGetVoteDetail(voteId, { query: { enabled: !isNewVote } })
    const { data: allStandardRequestsData, isLoading: allStandardRequestsLoading, isError: allStandardRequestsError } = useGetAllStandardRequests()
    const groupsWithIdentitiesRequestParams: FindAllWithIdentities1Params = {
        expression: '',
    }

    const {
        data: groupWithIdentitiesData,
        isLoading: groupWithIIdentitiesLoading,
        isError: groupWithIdentitiesError,
    } = useFindAllWithIdentities1(groupsWithIdentitiesRequestParams)

    const handleUploadData = useCallback(() => {
        fileUploadRef.current?.startUploading()
    }, [])

    const handleDeleteFiles = () => {
        existingFilesProcessRef?.current?.startFilesProcessing()
    }

    const {
        isLoading: isCreateVoteLoading,
        isError: isCreateVoteError,
        mutateAsync: createVoteAsyncMutation,
    } = useCreateVote({
        mutation: {
            onSuccess: (data: ApiVote) => {
                setVoteId(data.id ?? 0)
                setCreatingFilesLoading(true)
                setTimeout(() => {
                    if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
                        handleUploadData()
                    }
                }, 100)
            },
        },
    })
    const createVote = (newVoteData: ApiVote) => {
        const files = fileUploadRef.current?.getFilesToUpload()
        const fileIds = Object.values(fileUploadRef.current?.fileUuidsMapping().current ?? {})
        setVoteId(Math.random())
        createVoteAsyncMutation({
            data: {
                ...newVoteData,
                attachments: mapUploadedFilesToApiAttachment(
                    files?.map((file, index) => {
                        return { ...file, fileId: fileIds[index] }
                    }) ?? [],
                ),
            },
        })
    }

    const {
        isLoading: isUpdateVoteLoading,
        isError: isUpdateVoteError,
        mutateAsync: updateVoteAsyncMutation,
    } = useUpdateVote({
        mutation: {
            onSuccess: () => {
                invalidateVoteDetailCache.invalidate(voteId)
                setCreatingFilesLoading(true)
                if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
                    handleUploadData()
                }
            },
        },
    })
    const updateVote = (updatedVoteData: ApiVote) => {
        const files = fileUploadRef.current?.getFilesToUpload()
        const fileIds = Object.values(fileUploadRef.current?.fileUuidsMapping().current ?? {})
        const newFiles = mapUploadedFilesToApiAttachment(
            files?.map((file, index) => {
                return { ...file, fileId: fileIds[index] }
            }) ?? [],
        )
        const existingFiles = mapProcessedExistingFilesToApiAttachment(existingFilesProcessRef.current?.getRemainingFileList() ?? [])
        updateVoteAsyncMutation({
            voteId,
            data: { ...updatedVoteData, attachments: newFiles.concat(existingFiles) },
        })
    }

    const isLoading =
        (voteDataLoading && !isNewVote) ||
        allStandardRequestsLoading ||
        isCreateVoteLoading ||
        isUpdateVoteLoading ||
        creatingFilesLoading ||
        deletingFilesLoading
    const isError = voteDataError || allStandardRequestsError || groupWithIdentitiesError || isCreateVoteError || isUpdateVoteError
    const getLoaderLabel = (): string | undefined => {
        return isCreateVoteLoading || isUpdateVoteLoading ? t('votes.type.callingVote') : undefined
    }

    const handleCancel = () => {
        setIsActionSuccess({ value: false, path: NavigationSubRoutes.ZOZNAM_HLASOV })
        navigate(`${NavigationSubRoutes.ZOZNAM_HLASOV}`, { state: { from: location } })
    }

    const handleDeleteSuccess = () => {
        setDeletingFilesLoading(false)
        setIsActionSuccess({
            value: true,
            path: NavigationSubRoutes.ZOZNAM_HLASOV,
            additionalInfo: { type: isNewVote ? 'create' : 'edit' },
        })
        navigate(`${NavigationSubRoutes.ZOZNAM_HLASOV}`, { state: { from: location } })
    }

    const handleUploadSuccess = (data: FileUploadData[]) => {
        setCreatingFilesLoading(false)
        const attachmentsData = mapUploadedFilesToApiAttachment(data)
        if (existingFilesProcessRef.current?.hasDataToProcess()) {
            setDeletingFilesLoading(true)
            attachmentsDataRef.current = attachmentsData
            handleDeleteFiles()
        } else {
            setIsActionSuccess({
                value: true,
                path: NavigationSubRoutes.ZOZNAM_HLASOV,
                additionalInfo: { type: isNewVote ? 'create' : 'edit' },
            })
            navigate(`${NavigationSubRoutes.ZOZNAM_HLASOV}`, { state: { from: location } })
        }
    }

    const getBreadCrumbLinks = (newVote: boolean) => {
        const links: BreadCrumbsItemProps[] = [
            { label: t('votes.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
            { label: t('votes.breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
            { label: t('votes.breadcrumbs.VotesLists'), href: NavigationSubRoutes.ZOZNAM_HLASOV },
        ]

        if (newVote) {
            links.push({ label: t('votes.breadcrumbs.NewVote'), href: NavigationSubRoutes.ZOZNAM_HLASOV_CREATE })
        } else {
            links.push({
                label: voteData?.name ?? t('votes.breadcrumbs.VoteDetail'),
                href: `${NavigationSubRoutes.ZOZNAM_HLASOV_DETAIL}/${voteIdParam}`,
            })
            links.push({ label: t('votes.breadcrumbs.VoteEdit'), href: `${NavigationSubRoutes.ZOZNAM_HLASOV_EDIT}/${voteIdParam}` })
        }

        return links
    }

    document.title = getPageDocumentTitle(!!isNewVote, t, voteData?.name ?? t('votes.breadcrumbs.VoteDetail'))

    useEffect(() => {
        if (isError) {
            scrollToMutationFeedback()
        }
    }, [isError, scrollToMutationFeedback])

    return (
        <>
            {isUserLogged && (
                <>
                    <BreadCrumbs links={getBreadCrumbLinks(!!isNewVote)} withWidthContainer />
                    <MainContentWrapper>
                        <div ref={queryFeedbackRef} />
                        <QueryFeedback
                            loading={isLoading}
                            error={isError}
                            indicatorProps={{ layer: 'parent', transparentMask: false, label: getLoaderLabel() }}
                        >
                            <View
                                user={user.user}
                                existingVoteDataToEdit={voteData}
                                createVote={createVote}
                                updateVote={updateVote}
                                onCancel={handleCancel}
                                allStandardRequestData={allStandardRequestsData}
                                groupWithIdentitiesData={groupWithIdentitiesData}
                                isIdentifiersLoading={groupWithIIdentitiesLoading}
                                isSubmitLoading={isCreateVoteLoading || isUpdateVoteLoading}
                                isSubmitError={isCreateVoteError || isUpdateVoteError}
                                existingFilesProcessRef={existingFilesProcessRef}
                                fileUploadRef={fileUploadRef}
                                handleDeleteSuccess={handleDeleteSuccess}
                                handleUploadSuccess={handleUploadSuccess}
                                voteId={voteId}
                            />
                        </QueryFeedback>
                    </MainContentWrapper>
                </>
            )}
        </>
    )
}
