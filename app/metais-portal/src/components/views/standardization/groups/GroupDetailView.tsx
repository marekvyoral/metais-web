import { GreenCheckOutlineIcon } from '@isdd/idsk-ui-kit/assets/images'
import { BreadCrumbs, Button, HomeIcon, IconWithText, PaginatorWrapper, Table, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { KSIVS_SHORT_NAME } from '@isdd/metais-common/constants'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { ActionsOverTable, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { Row } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'

import GroupMembersFilter from './components/GroupMembersFilter'
import { sendBatchEmail } from './groupMembersTableUtils'
import AddGroupMemberModal from './modals/AddGroupMemberModal'
import DeleteGroupMemberModal from './modals/DeleteGroupMemberModal'
import styles from './styles.module.scss'

import { defaultSort, GroupDetailViewProps, identitiesFilter, TableData } from '@/components/containers/standardization/groups/GroupDetailContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import GroupDetailBaseInfo from '@/components/views/standardization/groups/components/BaseGroupInfo'

const GroupDetailView: React.FC<GroupDetailViewProps> = ({
    id,
    group,
    isAddModalOpen,
    setAddModalOpen,
    successfulUpdatedData,
    setSuccessfulUpdatedData,
    rowSelection,
    isIdentitiesLoading,
    selectableColumnsSpec,
    tableData,
    identitiesData,
    identityToDelete,
    setIdentityToDelete,
    setMembersUpdated,
    handleFilterChange,
    filter,
    isIdentitiesError,
    error,
    isLoading,
}) => {
    const { t } = useTranslation()

    const { isActionSuccess } = useActionSuccess()
    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useMemo(() => {
        if (isActionSuccess.value) {
            scrollToMutationFeedback()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActionSuccess.value])

    const isRowSelected = (row: Row<TableData>) => (row.original.uuid ? !!rowSelection[row.original.uuid] : false)
    const breadCrumbsLinks = [
        { href: RouteNames.HOME, label: t('notifications.home'), icon: HomeIcon },
        { label: t('navMenu.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },

        { href: `${NavigationSubRoutes.PRACOVNA_SKUPINA_DETAIL}/${id}`, label: group?.name ?? '' },
    ]
    if (group?.shortName !== KSIVS_SHORT_NAME) {
        breadCrumbsLinks.splice(2, 0, { label: t('navMenu.lists.groups'), href: NavigationSubRoutes.PRACOVNE_SKUPINY_KOMISIE })
    }
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
            <BreadCrumbs withWidthContainer links={breadCrumbsLinks} />
            <MainContentWrapper>
                <div ref={wrapperRef}>
                    {isActionSuccess.value && (
                        <MutationFeedback
                            successMessage={
                                isActionSuccess.additionalInfo?.type === 'memberUpdate'
                                    ? t('mutationFeedback.successfulMemberUpdated')
                                    : isActionSuccess.additionalInfo?.type === 'edit'
                                    ? t('mutationFeedback.successfulUpdated')
                                    : t('mutationFeedback.successfulCreated')
                            }
                            success={isActionSuccess.value}
                            error={false}
                        />
                    )}
                </div>
                <GroupDetailBaseInfo infoData={group} />
                <TextHeading size="L">{t('groups.listOfMembers')}</TextHeading>
                <GroupMembersFilter defaultFilterValues={identitiesFilter} isKsisvs={group?.shortName === KSIVS_SHORT_NAME} filter={filter} />

                <ActionsOverTable
                    pagination={{ dataLength: identitiesData?.count ?? 0, pageNumber: Number(filter.pageNumber), pageSize: Number(filter.pageSize) }}
                    handleFilterChange={handleFilterChange}
                    entityName="group"
                    hiddenButtons={{ SELECT_COLUMNS: true }}
                    createButton={
                        <Button className={styles.marginBottom0} label={'+ ' + t('groups.addMember')} onClick={() => setAddModalOpen(true)} />
                    }
                    exportButton={<Button className={styles.marginBottom0} label={t('groups.export')} variant="secondary" disabled />}
                >
                    <Can I={Actions.CREATE} a={'sendEmail'}>
                        <Button
                            className={styles.marginBottom0}
                            label={t('groups.sendEmail')}
                            variant="secondary"
                            disabled={Object.keys(rowSelection).length <= 0}
                            onClick={() => sendBatchEmail(rowSelection)}
                        />
                    </Can>
                </ActionsOverTable>
                {successfulUpdatedData && (
                    <IconWithText icon={GreenCheckOutlineIcon}>
                        <TextBody className={styles.greenBoldText}>{t('groups.memberSuccessfullyAdded')}</TextBody>
                    </IconWithText>
                )}
                <QueryFeedback
                    loading={isLoading || isIdentitiesLoading}
                    error={isIdentitiesError}
                    errorProps={{ errorMessage: error?.message, errorTitle: error?.type }}
                    withChildren
                >
                    <Table<TableData>
                        onSortingChange={(columnSort) => {
                            handleFilterChange({ sort: columnSort })
                        }}
                        isLoading={isIdentitiesLoading || isIdentitiesLoading}
                        sort={filter.sort ?? defaultSort}
                        columns={selectableColumnsSpec.map((item) => ({ ...item, size: 200 }))}
                        data={tableData}
                        isRowSelected={isRowSelected}
                    />
                </QueryFeedback>
                <PaginatorWrapper
                    pageNumber={Number(filter.pageNumber)}
                    pageSize={Number(filter.pageSize)}
                    dataLength={identitiesData?.count ?? 0}
                    handlePageChange={handleFilterChange}
                />
            </MainContentWrapper>
        </>
    )
}

export default GroupDetailView
