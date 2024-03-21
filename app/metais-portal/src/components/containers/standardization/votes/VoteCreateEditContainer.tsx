import { BreadCrumbs, BreadCrumbsItemProps, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { FindAllWithIdentities1Params, useFindAllWithIdentities1 } from '@isdd/metais-common/api/generated/iam-swagger'
import {
    ApiAttachment,
    ApiVote,
    useCreateVote,
    useGetAllStandardRequests,
    useGetVoteDetail,
    useUpdateVote,
} from '@isdd/metais-common/api/generated/standards-swagger'
import { FileUploadData, IFileUploadRef } from '@isdd/metais-common/components/FileUpload/FileUpload'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { getErrorTranslateKey } from '@isdd/metais-common/utils/errorMapper'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useInvalidateVoteCache } from '@isdd/metais-common/hooks/invalidate-cache'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { IVoteEditView } from '@/components/views/standardization/votes/VoteComposeForm/VoteComposeFormView'
import { IExistingFilesHandlerRef } from '@/components/views/standardization/votes/VoteComposeForm/components/ExistingFilesHandler/ExistingFilesHandler'
import {
    getPageDocumentTitle,
    mapProcessedExistingFilesToApiAttachment,
    mapUploadedFilesToApiAttachment,
} from '@/components/views/standardization/votes/VoteComposeForm/functions/voteEditFunc'

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
        error: createVoteError,
        mutateAsync: createVoteAsyncMutation,
    } = useCreateVote({
        mutation: {
            onSuccess: (data: ApiVote) => {
                setVoteId(data.id ?? 0)
                setTimeout(() => {
                    if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
                        setCreatingFilesLoading(true)
                        handleUploadData()
                    }
                }, 100)
                setIsActionSuccess({
                    value: true,
                    path: NavigationSubRoutes.ZOZNAM_HLASOV,
                    additionalInfo: { type: isNewVote ? 'create' : 'edit' },
                })
                navigate(`${NavigationSubRoutes.ZOZNAM_HLASOV}`, { state: { from: location } })
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
        error: updateVoteError,
        mutateAsync: updateVoteAsyncMutation,
    } = useUpdateVote({
        mutation: {
            onSuccess: () => {
                invalidateVoteDetailCache.invalidate(voteId)
                if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
                    setCreatingFilesLoading(true)
                    handleUploadData()
                } else {
                    setIsActionSuccess({
                        value: true,
                        path: NavigationSubRoutes.ZOZNAM_HLASOV,
                        additionalInfo: { type: isNewVote ? 'create' : 'edit' },
                    })
                    navigate(`${NavigationSubRoutes.ZOZNAM_HLASOV}`, { state: { from: location } })
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

    const isError = voteDataError || allStandardRequestsError || groupWithIdentitiesError

    const isMutationError = isCreateVoteError || isUpdateVoteError

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

    const mutationErrorKey = getErrorTranslateKey(createVoteError || updateVoteError)

    return (
        <>
            {isUserLogged && (
                <>
                    <BreadCrumbs links={getBreadCrumbLinks(!!isNewVote)} withWidthContainer />
                    <MainContentWrapper>
                        <div ref={queryFeedbackRef} />
                        <MutationFeedback error={isMutationError} errorMessage={mutationErrorKey && t(mutationErrorKey)} />
                        <QueryFeedback
                            loading={isLoading}
                            error={isError}
                            indicatorProps={{ layer: 'parent', transparentMask: false, label: getLoaderLabel() }}
                            withChildren
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
