import { BreadCrumbs, Filter, HomeIcon, IOption, Input, SimpleSelect, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiVotePreviewList } from '@isdd/metais-common/api'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { ActionsOverTable } from '@isdd/metais-common/index'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'

import { columns } from '@/components/views/votes/voteListColumns'

export interface IVotesListView {
    votesListData: ApiVotePreviewList | undefined
    defaultFilterValues: IVotesListFilterData
}

export interface IVotesListFilterData extends IFilterParams, IFilter {
    votesTypeToShow: IOption
    voteState: IOption
    effectiveFrom: string
    effectiveTo: string
}

export const VotesListView: React.FC<IVotesListView> = ({ votesListData, defaultFilterValues }) => {
    const { t } = useTranslation()
    // const [pageSize, setPageSize] = useState<number>(BASE_PAGE_SIZE)
    // const [currentPage, setCurrentPage] = useState(1)

    function handleFilterChange(filter: IFilter): void {
        throw new Error('Function not implemented.')
    }

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('votesList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('votesList.breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                    { label: t('votesList.breadcrumbs.VotesLists'), href: NavigationSubRoutes.ZOZNAM_HLASOV },
                ]}
            />
            <TextHeading size="XL">{t('votesList.title')}</TextHeading>
            <TextHeading size="L">{t('votesList.votesListSubtitle')}</TextHeading>
            <Filter<IVotesListFilterData>
                heading={t('votesList.filter.title')}
                defaultFilterValues={defaultFilterValues}
                form={({ filter, register, setValue }) => (
                    <div>
                        <SimpleSelect
                            id="votesTypeToShow"
                            label={t('votesList.filter.votesTypeToShow')}
                            options={[
                                { value: 'onlyMy', label: t('votesList.type.onlyMyVotes') },
                                { value: 'everyone', label: t('votesList.type.allVotes') },
                            ]}
                            setValue={setValue}
                            defaultValue={defaultFilterValues.votesTypeToShow.label}
                            name="votesTypeToShow"
                        />
                        <SimpleSelect
                            id="voteState"
                            label={t('votesList.filter.voteState')}
                            options={[
                                { value: 'planned', label: t('votesList.type.planned') },
                                { value: 'ended', label: t('votesList.type.ended') },
                            ]}
                            setValue={setValue}
                            defaultValue={defaultFilterValues.votesTypeToShow.label}
                            name="voteState"
                        />
                        {/*TODO: zmenit inline style na nieco normalne*/}
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Input {...register('fromDate')} type="date" label={t('votesList.filter.fromDate')} />
                            <Input {...register('toDate')} type="date" label={t('votesList.filter.toDate')} />
                        </div>
                    </div>
                )}
            />
            <ActionsOverTable entityName="" handleFilterChange={handleFilterChange} hiddenButtons={{ SELECT_COLUMNS: true }} />
            <Table data={votesListData?.votes} columns={columns(t)} sort={undefined} isLoading={false} error={undefined} />
        </>
    )
}
