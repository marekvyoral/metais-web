import React from 'react'
import { BreadCrumbs, HomeIcon, PaginatorWrapper, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { useLocation, useSearchParams } from 'react-router-dom'
import { GlobalSearchParams } from '@isdd/metais-common/components/navbar/navbar-main/NavSearchBar'
import { ActionsOverTable, QueryFeedback } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'

import styles from './globalSearchView.module.scss'

import { GlobalSearchViewProps } from '@/components/containers/GlobalSearchContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { GlobalSearchCard } from '@/components/global-search-card/GlobalSearchCard'

//fix wrong type from orval
type GlobalSearchViewPagination = {
    page?: number
    perPage?: number
    totalPages?: number
    //this is named as totaltems in orval
    totalItems?: number
}

export const GlobalSearchView: React.FC<GlobalSearchViewProps> = ({ data, isError, isLoading }) => {
    const { t } = useTranslation()
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const pagination = data?.pagination as GlobalSearchViewPagination

    const handleUpdateSearchParams = (value: string, searchKeyName: GlobalSearchParams) => {
        setSearchParams((prevSearchParams) => {
            const newSearchParams = new URLSearchParams(prevSearchParams)

            if (newSearchParams.has(searchKeyName)) {
                newSearchParams.set(searchKeyName, value)
                if (newSearchParams.has(GlobalSearchParams.TOTAL_ITEMS) && pagination.totalItems) {
                    newSearchParams.set(GlobalSearchParams.TOTAL_ITEMS, pagination.totalItems.toString())
                } else if (pagination.totalItems) {
                    newSearchParams.append(GlobalSearchParams.TOTAL_ITEMS, pagination.totalItems.toString())
                }
            } else {
                newSearchParams.append(searchKeyName, value)
            }

            return newSearchParams
        })
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    {
                        label: t('globalSearch.header', { item: `"${searchParams.get(GlobalSearchParams.SEARCH)}"` }),
                        href: `${location.pathname}${location.search}`,
                    },
                ]}
            />

            <MainContentWrapper globalSearch>
                <QueryFeedback loading={isLoading} error={false} withChildren>
                    <FlexColumnReverseWrapper>
                        <TextHeading size="XL">{t('globalSearch.header', { item: `"${searchParams.get(GlobalSearchParams.SEARCH)}"` })}</TextHeading>
                        {isError && <QueryFeedback loading={false} error />}
                    </FlexColumnReverseWrapper>
                    <ActionsOverTable
                        pagination={{
                            pageNumber: pagination.page ?? BASE_PAGE_NUMBER,
                            pageSize: pagination.perPage ?? BASE_PAGE_SIZE,
                            dataLength: pagination.totalItems ?? 0,
                        }}
                        entityName=""
                        handlePagingSelect={(pageSize) => handleUpdateSearchParams(pageSize, GlobalSearchParams.PER_PAGE)}
                        hiddenButtons={{ SELECT_COLUMNS: true, BULK_ACTIONS: true }}
                    >
                        <TextBody>
                            <b>{t('globalSearch.numberOfResults', { count: pagination?.totalItems })}</b>
                        </TextBody>
                    </ActionsOverTable>
                    <ul className={styles.ul}>
                        {data?.generalElasticItemSet?.map((item) => (
                            <li key={item.uuid}>
                                <GlobalSearchCard cardData={item} />
                            </li>
                        ))}
                    </ul>
                    <PaginatorWrapper
                        pageNumber={pagination?.page ?? BASE_PAGE_NUMBER}
                        pageSize={pagination?.perPage ?? BASE_PAGE_SIZE}
                        dataLength={pagination?.totalItems ?? data?.generalElasticItemSet?.length ?? 1}
                        handlePageChange={(page) =>
                            handleUpdateSearchParams(page.pageNumber?.toString() ?? BASE_PAGE_NUMBER.toString(), GlobalSearchParams.PAGE)
                        }
                    />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
