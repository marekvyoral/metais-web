import React from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { VotesListContainer } from '@/components/containers/standardization/votes/VotesListContainer/VotesListContainer'
import { VotesListView } from '@/components/views/standardization/votes/votesList/VoteListView'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { VotesListPermissionsWrapper } from '@/components/permissions/VotesListPermissionsWrapper'

const VotesListPage: React.FC = () => {
    const { t } = useTranslation()
    return (
        <VotesListPermissionsWrapper>
            <>
                <BreadCrumbs
                    withWidthContainer
                    links={[
                        { label: t('votes.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                        { label: t('votes.breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                        { label: t('votes.breadcrumbs.VotesLists'), href: NavigationSubRoutes.ZOZNAM_HLASOV },
                    ]}
                />
                <MainContentWrapper>
                    <VotesListContainer
                        View={(props) => (
                            <VotesListView
                                votesListData={props.votesListData}
                                defaultFilterValues={props.defaultFilterValues}
                                filter={props.filter}
                                handleFilterChange={props.handleFilterChange}
                                isUserLogged={props.isUserLogged}
                                isLoadingNextPage={props.isLoadingNextPage}
                                getVotesRefetch={props.getVotesRefetch}
                            />
                        )}
                    />
                </MainContentWrapper>
            </>
        </VotesListPermissionsWrapper>
    )
}

export default VotesListPage
