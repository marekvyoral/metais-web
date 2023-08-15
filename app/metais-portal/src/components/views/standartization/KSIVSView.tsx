import { GreenCheckOutlineIcon } from '@isdd/idsk-ui-kit/assets/images'
import { BreadCrumbs, HomeIcon, IconWithText, Paginator, Table, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { SortType } from '@isdd/idsk-ui-kit/types'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { Row } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'

import KSIVSFilter from './identitiesFilter'
import KSIVSAddMemberPopUp from './modals/addMemberModal'
import KSIVSDeleteMemberPopUp from './modals/deleteMemberModal'
import styles from './styles.module.scss'
import KSIVSTableActions from './tableActions'

import { KSIVSViewProps, TableData, identitiesFilter } from '@/components/containers/KSIVSVContainer'
import KSIVSBaseInfo from '@/components/views/standartization/components/BaseInfo'

const KSIVSView: React.FC<KSIVSViewProps> = ({
    id,
    isAdmin,
    identityToDelete,
    setIdentityToDelete,
    isAddModalOpen,
    setAddModalOpen,
    successfulUpdatedData,
    setSuccessfulUpdatedData,
    listParams,
    setListParams,
    user,
    rowSelection,
    sorting,
    setSorting,
    isIdentitiesLoading,
    selectableColumnsSpec,
    tableData,
    identitiesData,
}) => {
    const { t } = useTranslation()
    const isRowSelected = (row: Row<TableData>) => (row.original.uuid ? !!rowSelection[row.original.uuid] : false)

    return (
        <>
            <KSIVSDeleteMemberPopUp
                isOpen={!!identityToDelete}
                onClose={() => setIdentityToDelete(undefined)}
                uuid={identityToDelete}
                groupUuid={id ?? ''}
            />
            <KSIVSAddMemberPopUp
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                setAddedLabel={setSuccessfulUpdatedData}
                groupId={id ?? ''}
            />
            <BreadCrumbs
                links={[
                    { href: RouteNames.HOME, label: t('notifications.home'), icon: HomeIcon },
                    { href: RouteNames.HOW_TO_STANDARDIZATION, label: t('navMenu.standardization') },
                    { href: NavigationSubRoutes.KOMISIA_NA_STANDARDIZACIU, label: t('KSIVSPage.title') },
                ]}
            />
            <KSIVSBaseInfo isAdmin={isAdmin} />
            <TextHeading size="L">{t('KSIVSPage.listOfPersons')}</TextHeading>
            {isAdmin && <KSIVSFilter defaultFilterValues={identitiesFilter} />}
            <KSIVSTableActions
                setAddModalOpen={setAddModalOpen}
                listParams={listParams}
                setListParams={setListParams}
                userRoles={user?.roles}
                selectedRows={rowSelection}
                groupUuid={id}
            />
            {successfulUpdatedData && (
                <IconWithText icon={GreenCheckOutlineIcon}>
                    <TextBody className={styles.greenBoldText}>{t('KSIVSPage.memberSuccessfullyAdded')}</TextBody>
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
            <Paginator
                pageNumber={Number(listParams.page)}
                pageSize={Number(listParams.perPage)}
                dataLength={identitiesData?.count ?? 0}
                onPageChanged={(pageNumber: number) => setListParams({ ...listParams, page: pageNumber.toString() })}
            />
        </>
    )
}

export default KSIVSView
