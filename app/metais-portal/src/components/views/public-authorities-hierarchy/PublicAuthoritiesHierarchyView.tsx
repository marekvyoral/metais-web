import React, { useState } from 'react'
import {
    BreadCrumbs,
    CircleLoadingArrowIcon,
    HomeIcon,
    PaginatorRightArrowIcon,
    PaginatorWrapper,
    Table,
    TextHeading,
    TransparentButtonWrapper,
} from '@isdd/idsk-ui-kit/index'
import { ColumnDef, ExpandedState, Row } from '@tanstack/react-table'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { HierarchyRightsUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

import styles from './styles.module.scss'
import { PublicAuthoritySelect } from './PublicAuthoritySelect'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { PublicAuthoritiesHierarchyItem } from '@/components/containers/public-authorities-hierarchy/PublicAuthoritiesHierarchyContainer'
interface IPublicAuthoritiesHierarchyView {
    hierarchy: PublicAuthoritiesHierarchyItem[]
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    onChangeAuthority: (e: HierarchyRightsUi | null) => void
    selectedOrg: HierarchyRightsUi | null
    handleExpandClick: (row: Row<PublicAuthoritiesHierarchyItem>) => void
    isLoading: boolean
    expandableRowIdLoading: string | null
}

export const PublicAuthoritiesHierarchyView: React.FC<IPublicAuthoritiesHierarchyView> = ({
    hierarchy,
    pagination,
    handleFilterChange,
    onChangeAuthority,
    selectedOrg,
    handleExpandClick,
    isLoading,
    expandableRowIdLoading,
}) => {
    const { t } = useTranslation()
    const [expanded, setExpanded] = useState<ExpandedState>({})

    const columns: ColumnDef<PublicAuthoritiesHierarchyItem>[] = [
        {
            id: 'name',
            accessorKey: 'name',
            enableSorting: true,
            cell: ({ row }) => {
                const isExpanded = row.getIsExpanded()

                return (
                    <div className={styles.rowWrapper} style={{ paddingLeft: `${row.depth * 2}rem` }}>
                        <div className={styles.toggleWrapper}>
                            {(row.getCanExpand() || row.original.canExpand) &&
                                (expandableRowIdLoading === row.original.uuid ? (
                                    <img className={styles.spinner} src={CircleLoadingArrowIcon} alt={t('loading.subitems')} />
                                ) : (
                                    <TransparentButtonWrapper
                                        onClick={() => handleExpandClick(row)}
                                        aria-label={
                                            isExpanded
                                                ? t('publicAuthorities.collapse', { rowName: row.original.name })
                                                : t('publicAuthorities.expand', { rowName: row.original.name })
                                        }
                                    >
                                        <img
                                            src={PaginatorRightArrowIcon}
                                            className={classNames([styles.expandIcon, isExpanded ? styles.rotate90 : styles.rotate0])}
                                            alt=""
                                        />
                                    </TransparentButtonWrapper>
                                ))}
                        </div>

                        <div className={styles.rowDataWrapper}>
                            <span>{row.original.name}</span>
                            <small className={styles.address}>{row.original.address}</small>
                        </div>
                    </div>
                )
            },
        },
    ]

    const expandableContent = (items: PublicAuthoritiesHierarchyItem[]): JSX.Element => {
        return (
            <Table<PublicAuthoritiesHierarchyItem>
                columns={columns}
                hideHeaders
                data={items}
                getSubRows={(row) => row.children}
                expandedRowsState={expanded}
                onExpandedChange={setExpanded}
            />
        )
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('notifications.home'), href: '/', icon: HomeIcon },
                    { label: t('publicAuthorities.hierarchy'), href: NavigationSubRoutes.PUBLIC_AUTHORITY_HIERARCHY },
                ]}
            />
            <MainContentWrapper>
                <FlexColumnReverseWrapper>
                    <TextHeading size="L">{t('publicAuthorities.hierarchy')}</TextHeading>
                </FlexColumnReverseWrapper>
                <PublicAuthoritySelect onChangeAuthority={onChangeAuthority} selectedOrg={selectedOrg} isClearable />

                <QueryFeedback loading={isLoading && !expandableRowIdLoading} withChildren>
                    {expandableContent(hierarchy)}
                    <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
