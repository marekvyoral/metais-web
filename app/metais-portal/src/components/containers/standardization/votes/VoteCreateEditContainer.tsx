import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { FindAllWithIdentities1Params, useFindAllWithIdentities1 } from '@isdd/metais-common/api/generated/iam-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useTranslation } from 'react-i18next'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { BreadCrumbs, BreadCrumbsItemProps, HomeIcon } from '@isdd/idsk-ui-kit/index'
import {
    ApiVote,
    useCreateVote,
    useGetAllStandardRequests,
    useGetVoteDetail,
    useUpdateVote,
} from '@isdd/metais-common/api/generated/standards-swagger'

import { IVoteEditView } from '@/components/views/standardization/votes/VoteComposeForm/VoteComposeFormView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

interface IVoteEditContainer {
    View: React.FC<IVoteEditView>
    isNewVote?: boolean
}

export const VoteCreateEditContainer: React.FC<IVoteEditContainer> = ({ View, isNewVote }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()
    const location = useLocation()

    const { state: user } = useAuth()
    const isUserLogged = !!user

    const { voteId: voteIdParam } = useParams()
    const voteId = isNewVote ? 0 : Number(voteIdParam)

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

    const { isSuccess: createSuccess, isLoading: createVoteLoading, isError: createVoteError, mutateAsync: createVoteAsyncMutation } = useCreateVote()
    const createVote = async (newVoteData: ApiVote) => {
        await createVoteAsyncMutation({
            data: newVoteData,
        })
    }

    const { isSuccess: updateSuccess, isLoading: updateVoteLoading, isError: updateVoteError, mutateAsync: updateVoteAsyncMutation } = useUpdateVote()
    const updateVote = async (updatedVoteData: ApiVote) => {
        await updateVoteAsyncMutation({
            voteId,
            data: updatedVoteData,
        })
    }

    const isLoading = (voteDataLoading && !isNewVote) || allStandardRequestsLoading || createVoteLoading || updateVoteLoading
    const isError = voteDataError || allStandardRequestsError || groupWithIdentitiesError || createVoteError || updateVoteError
    const getLoaderLabel = (): string | undefined => {
        return createVoteLoading || updateVoteLoading ? t('votes.type.callingVote') : undefined
    }

    useEffect(() => {
        if (createSuccess || updateSuccess) {
            setIsActionSuccess({
                value: true,
                path: NavigationSubRoutes.ZOZNAM_HLASOV,
                additionalInfo: { type: createSuccess ? 'create' : 'edit' },
            })
            navigate(`${NavigationSubRoutes.ZOZNAM_HLASOV}`, { state: { from: location } })
        }
    }, [createSuccess, location, navigate, setIsActionSuccess, updateSuccess])

    const handleCancel = () => {
        setIsActionSuccess({ value: false, path: NavigationSubRoutes.ZOZNAM_HLASOV })
        navigate(`${NavigationSubRoutes.ZOZNAM_HLASOV}`, { state: { from: location } })
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

    return (
        <>
            {isUserLogged && (
                <>
                    <BreadCrumbs links={getBreadCrumbLinks(!!isNewVote)} withWidthContainer />
                    <MainContentWrapper>
                        <QueryFeedback
                            loading={isLoading}
                            error={isError}
                            indicatorProps={{ layer: 'parent', transparentMask: false, label: getLoaderLabel() }}
                            withChildren={createVoteLoading || updateVoteLoading}
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
                                isSubmitLoading={createVoteLoading || updateVoteLoading}
                                isSubmitError={createVoteError || updateVoteError}
                            />
                        </QueryFeedback>
                    </MainContentWrapper>
                </>
            )}
        </>
    )
}
