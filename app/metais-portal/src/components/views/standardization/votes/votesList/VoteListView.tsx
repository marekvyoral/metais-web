import { Button, Filter, Input, PaginatorWrapper, SimpleSelect, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { ApiError, ApiVotePreviewList } from '@isdd/metais-common/api/generated/standards-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ActionsOverTable, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { useEffect } from 'react'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'

import styles from './voteList.module.scss'

import { getVoteStateExplanation } from '@/components/views/standardization/votes/voteProps'
import { voteListColumns, voteStateOptions, votesTypeToShowOptions } from '@/components/views/standardization/votes/votesList/voteListProps'

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
    isLoadingNextPage: boolean
    handleFilterChange: (filter: IFilter) => void
    getVotesRefetch: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
    ) => Promise<QueryObserverResult<ApiVotePreviewList, ApiError>>
}

export const VotesListView: React.FC<IVotesListView> = ({
    isUserLogged,
    votesListData,
    filter,
    defaultFilterValues,
    isLoadingNextPage,
    handleFilterChange,
    getVotesRefetch,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const {
        isActionSuccess: { value: isSuccess, additionalInfo: additionalInfo },
    } = useActionSuccess()

    const newVoteHandler = () => {
        navigate(`${NavigationSubRoutes.ZOZNAM_HLASOV_CREATE}`, { state: { from: location } })
    }

    const votesList = votesListData?.votes?.map((vote) => {
        const newVoteState = getVoteStateExplanation(vote.voteState, vote.effectiveFrom ?? '', vote.effectiveTo ?? '', t)
        const newHasCast = t('votes.type.' + vote.hasCast)
        return { ...vote, voteState: newVoteState, hasCast: newHasCast }
    })

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (isSuccess) {
            scrollToMutationFeedback()
            getVotesRefetch()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess])

    return (
        <>
            <TextHeading size="XL">{t('votes.votesList.title')}</TextHeading>
            {isSuccess && (
                <div ref={wrapperRef}>
                    <MutationFeedback
                        success
                        error={false}
                        successMessage={additionalInfo?.type == 'create' ? t('votes.voteDetail.created') : t('mutationFeedback.successfulUpdated')}
                    />
                </div>
            )}
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
                            <Input {...register('effectiveTo')} type="date" label={t('votes.votesList.filter.toDate')} className={styles.stretch} />
                        </div>
                    </div>
                )}
            />
            <div className={styles.inline}>
                {isUserLogged ? <Button type="submit" label={t('votes.voteDetail.newVote')} onClick={() => newVoteHandler()} /> : <div />}
                <ActionsOverTable
                    pagination={{
                        pageNumber: filter.pageNumber || BASE_PAGE_NUMBER,
                        pageSize: filter.pageSize || BASE_PAGE_SIZE,
                        dataLength: votesListData?.votesCount || 0,
                    }}
                    pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                    entityName=""
                    handleFilterChange={handleFilterChange}
                    hiddenButtons={{ SELECT_COLUMNS: true }}
                />
            </div>
            <QueryFeedback loading={isLoadingNextPage} withChildren>
                <Table
                    data={votesList}
                    columns={voteListColumns(t, isUserLogged)}
                    sort={filter.sort ?? []}
                    onSortingChange={(columnSort) => {
                        handleFilterChange({ sort: columnSort })
                    }}
                />
            </QueryFeedback>
            <PaginatorWrapper
                pageNumber={filter.pageNumber || BASE_PAGE_NUMBER}
                pageSize={filter.pageSize || BASE_PAGE_SIZE}
                dataLength={votesListData?.votesCount || 0}
                handlePageChange={handleFilterChange}
            />
        </>
    )
}
