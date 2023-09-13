import { GreenCheckOutlineIcon } from '@isdd/idsk-ui-kit/assets/images'
import { BreadCrumbs, HomeIcon, IconWithText, PaginatorWrapper, Table, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { SortType } from '@isdd/idsk-ui-kit/types'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { Row } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'

import GroupMembersFilter from './components/GroupMembersFilter'
import GroupMembersTableActions from './components/GroupMembersTableActions'
import AddGroupMemberModal from './modals/AddGroupMemberModal'
import DeleteGroupMemberModal from './modals/DeleteGroupMemberModal'
import styles from './styles.module.scss'

import { GroupDetailViewProps, identitiesFilter, TableData } from '@/components/containers/standardization/groups/GroupDetailContainer'
import GroupDetailBaseInfo from '@/components/views/standartization/groups/components/BaseGroupInfo'

const GroupDetailView: React.FC<GroupDetailViewProps> = ({
    id,
    group,
    isAddModalOpen,
    setAddModalOpen,
    successfulUpdatedData,
    setSuccessfulUpdatedData,
    listParams,
    setListParams,
    rowSelection,
    sorting,
    setSorting,
    isIdentitiesLoading,
    selectableColumnsSpec,
    tableData,
    identitiesData,
    identityToDelete,
    setIdentityToDelete,
    setMembersUpdated,
}) => {
    const { t } = useTranslation()
    const isRowSelected = (row: Row<TableData>) => (row.original.uuid ? !!rowSelection[row.original.uuid] : false)

    return (
        <>
            <DeleteGroupMemberModal
                isOpen={!!identityToDelete}
                onClose={() => {
                    setIdentityToDelete(undefined)
                    setMembersUpdated(true)
                }}
                uuid={identityToDelete}
                groupUuid={id ?? ''}
            />
            <AddGroupMemberModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setAddModalOpen(false)
                    setMembersUpdated(true)
                }}
                setAddedLabel={setSuccessfulUpdatedData}
                group={group}
            />
            <BreadCrumbs
                links={[
                    { href: RouteNames.HOME, label: t('notifications.home'), icon: HomeIcon },
                    { href: NavigationSubRoutes.PRACOVNE_SKUPINY_KOMISIE, label: t('navMenu.standardization') },
                    { href: NavigationSubRoutes.PRACOVNA_SKUPINA_DETAIL, label: group?.name ?? '' },
                ]}
            />
            <GroupDetailBaseInfo infoData={group} />
            <TextHeading size="L">{t('groups.listOfMembers')}</TextHeading>
            <GroupMembersFilter defaultFilterValues={identitiesFilter} isKsisvs={group?.shortName === 'KSISCS'} />
            <GroupMembersTableActions
                setAddModalOpen={setAddModalOpen}
                listParams={listParams}
                setListParams={setListParams}
                selectedRows={rowSelection}
            />
            {successfulUpdatedData && (
                <IconWithText icon={GreenCheckOutlineIcon}>
                    <TextBody className={styles.greenBoldText}>{t('groups.memberSuccessfullyAdded')}</TextBody>
                </IconWithText>
            )}
            <Table<TableData>
                onSortingChange={(newSort) => {
                    if (newSort.length > 0) {
                        setListParams({ ...listParams, orderBy: newSort[0].orderBy, desc: newSort[0].sortDirection == SortType.DESC })
                    }
                    setSorting(newSort)
                }}
                isLoading={isIdentitiesLoading}
                sort={sorting}
                columns={selectableColumnsSpec}
                data={tableData}
                isRowSelected={isRowSelected}
            />
            <PaginatorWrapper
                pageNumber={Number(listParams.page)}
                pageSize={Number(listParams.perPage)}
                dataLength={identitiesData?.count ?? 0}
                handlePageChange={(pagination) => {
                    setListParams({ ...listParams, page: pagination.pageNumber })
                }}
            />
        </>
    )
}

export default GroupDetailView
