import { BreadCrumbs, Filter, HomeIcon, Input, PaginatorWrapper, SimpleSelect, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiVotePreviewList, BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { ActionsOverTable } from '@isdd/metais-common/index'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'

import styles from './votelist.module.scss'

import { columns, voteStateOptions, votesTypeToShowOptions } from '@/components/views/votes/voteListProps'

export interface IVotesListFilterData extends IFilterParams, IFilter {
    votesTypeToShow: string[]
    voteState: string[]
    effectiveFrom: string
    effectiveTo: string
}

export interface IVotesListView {
    votesListData: ApiVotePreviewList | undefined
    defaultFilterValues: IVotesListFilterData
    filter: IFilter
    handleFilterChange: (filter: IFilter) => void
}

export const VotesListView: React.FC<IVotesListView> = ({ votesListData, filter, defaultFilterValues, handleFilterChange }) => {
    const { t } = useTranslation()
    // const [pageSize, setPageSize] = useState<number>(BASE_PAGE_SIZE)
    // const [currentPage, setCurrentPage] = useState(1)

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('votesList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('votesList.breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                    { label: t('votesList.breadcrumbs.VotesLists'), href: NavigationSubRoutes.ZOZNAM_HLASOV },
                ]}
            />
            <TextHeading size="XL">{t('votes.votesList.title')}</TextHeading>
            <TextHeading size="L">{t('votes.votesList.votesListSubtitle')}</TextHeading>
            <Filter<IVotesListFilterData>
                heading={t('votes.votesList.filter.title')}
                defaultFilterValues={defaultFilterValues}
                form={({ filter: listFilter, register, setValue }) => (
                    <div>
                        <SimpleSelect
                            id="votesTypeToShow"
                            label={t('votes.votesList.filter.votesTypeToShow')}
                            options={votesTypeToShowOptions(t)}
                            setValue={setValue}
                            defaultValue={listFilter?.votesTypeToShow?.[0]}
                            name="votesTypeToShow"
                        />
                        <SimpleSelect
                            id="voteState"
                            label={t('votes.votesList.filter.voteState')}
                            options={voteStateOptions(t)}
                            setValue={setValue}
                            defaultValue={listFilter?.voteState?.[0]}
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
                            <Input {...register('effectiveTo')} type="date" label={t('votes.votesList.filter.toDate')} className={styles.stretch} />
                        </div>
                    </div>
                )}
            />
            <ActionsOverTable entityName="" handleFilterChange={handleFilterChange} hiddenButtons={{ SELECT_COLUMNS: true }} />
            <Table
                data={votesListData?.votes}
                columns={columns(t)}
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
        </>
    )
}
