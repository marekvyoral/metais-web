import { BreadCrumbs, Button, Filter, HomeIcon, Input, PaginatorWrapper, SimpleSelect, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiVotePreviewList, BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { ActionsOverTable } from '@isdd/metais-common/index'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useLocation, useNavigate } from 'react-router-dom'

import styles from './votelist.module.scss'

import { voteListColumns, voteStateOptions, votesTypeToShowOptions } from '@/components/views/standartization/votes/votesList/voteListProps'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export interface IVotesListFilterData extends IFilterParams, IFilter {
    votesTypeToShow: string
    voteState: string
    effectiveFrom: string
    effectiveTo: string
}

export interface IVotesListView {
    isUserLogged: boolean
    votesListData: ApiVotePreviewList | undefined
    defaultFilterValues: IVotesListFilterData
    filter: IFilter
    handleFilterChange: (filter: IFilter) => void
}

export const VotesListView: React.FC<IVotesListView> = ({ isUserLogged, votesListData, filter, defaultFilterValues, handleFilterChange }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const newVoteHandler = () => {
        navigate(`${NavigationSubRoutes.VOTE_EDIT}/0`, { state: { from: location } })
    }

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('votes.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('votes.breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                    { label: t('votes.breadcrumbs.VotesLists'), href: NavigationSubRoutes.ZOZNAM_HLASOV },
                ]}
            />
            <MainContentWrapper>
                <TextHeading size="XL">{t('votes.votesList.title')}</TextHeading>
                <TextHeading size="L">{t('votes.votesList.votesListSubtitle')}</TextHeading>
                <Filter<IVotesListFilterData>
                    heading={t('votes.votesList.filter.title')}
                    defaultFilterValues={defaultFilterValues}
                    form={({ filter: listFilter, register, setValue }) => (
                        <div>
                            {isUserLogged && (
                                <SimpleSelect
                                    id="votesTypeToShow"
                                    label={t('votes.votesList.filter.votesTypeToShow')}
                                    options={votesTypeToShowOptions(t)}
                                    setValue={setValue}
                                    defaultValue={listFilter?.votesTypeToShow}
                                    name="votesTypeToShow"
                                />
                            )}
                            <SimpleSelect
                                id="voteState"
                                label={t('votes.votesList.filter.voteState')}
                                options={voteStateOptions(t)}
                                setValue={setValue}
                                defaultValue={listFilter?.voteState}
                                name="voteState"
                            />

                            <div className={styles.inline}>
                                <Input
                                    {...register('effectiveFrom')}
                                    type="date"
                                    label={t('votes.votesList.filter.fromDate')}
                                    className={styles.stretch}
                                />
                                <div className={styles.space} />
                                <Input
                                    {...register('effectiveTo')}
                                    type="date"
                                    label={t('votes.votesList.filter.toDate')}
                                    className={styles.stretch}
                                />
                            </div>
                        </div>
                    )}
                />
                <div className={styles.inline}>
                    <Button type="submit" label={t('votes.voteDetail.newVote')} onClick={() => newVoteHandler()} />
                    <ActionsOverTable entityName="" handleFilterChange={handleFilterChange} hiddenButtons={{ SELECT_COLUMNS: true }} />
                </div>
                <Table
                    data={votesListData?.votes}
                    columns={voteListColumns(t, isUserLogged)}
                    sort={filter.sort ?? []}
                    onSortingChange={(columnSort) => {
                        handleFilterChange({ sort: columnSort })
                    }}
                    isLoading={false}
                    error={undefined}
                />
                <PaginatorWrapper
                    pageNumber={filter.pageNumber || BASE_PAGE_NUMBER}
                    pageSize={filter.pageSize || BASE_PAGE_SIZE}
                    dataLength={votesListData?.votesCount || 0}
                    handlePageChange={handleFilterChange}
                />
            </MainContentWrapper>
        </>
    )
}
