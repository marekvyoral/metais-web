import { BaseModal, BreadCrumbs, Button, HomeIcon, PaginatorWrapper, Table, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { KSIVS_SHORT_NAME } from '@isdd/metais-common/constants'
import { Can, useAbilityContextWithFeedback } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { ActionsOverTable, ModalButtons, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { Row } from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { GroupPermissionSubject } from '@isdd/metais-common/hooks/permissions/useGroupsPermissions'
import { useDelete2 } from '@isdd/metais-common/api/generated/iam-swagger'
import { useNavigate } from 'react-router-dom'
import { useInvalidateGroupsListCache } from '@isdd/metais-common/hooks/invalidate-cache'

import GroupMembersFilter from './components/GroupMembersFilter'
import { sendBatchEmail } from './groupMembersTableUtils'
import AddGroupMemberModal from './modals/AddGroupMemberModal'
import DeleteGroupMemberModal from './modals/DeleteGroupMemberModal'
import styles from './styles.module.scss'

import { defaultSort, GroupDetailViewProps, identitiesFilter, TableData } from '@/components/containers/standardization/groups/GroupDetailContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import GroupDetailBaseInfo from '@/components/views/standardization/groups/components/BaseGroupInfo'

export const useDeleteGroup = () => {
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()
    const invalidateGroupsCache = useInvalidateGroupsListCache()

    const {
        mutateAsync: deleteGroupAsync,
        isError: isError,
        isLoading: isLoading,
    } = useDelete2({
        mutation: {
            onSuccess() {
                invalidateGroupsCache.invalidate()
                setIsActionSuccess({
                    value: true,
                    path: `${RouterRoutes.STANDARDIZATION_GROUPS_LIST}`,
                    additionalInfo: { entity: 'group', type: 'delete' },
                })
                navigate(`${RouterRoutes.STANDARDIZATION_GROUPS_LIST}`)
            },
        },
    })
    const deleteGroup = (uuid: string) => {
        deleteGroupAsync({ uuid })
    }
    return {
        deleteGroup,
        isError,
        isLoading,
    }
}

const GroupDetailView: React.FC<GroupDetailViewProps> = ({
    id,
    group,
    isAddModalOpen,
    setAddModalOpen,
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
    const { isError: isAbilityError, isLoading: isAbilityLoading } = useAbilityContextWithFeedback()
    const { isActionSuccess } = useActionSuccess()
    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    const { deleteGroup, isError: isDeleteGroupError, isLoading: isDeleteGroupLoading } = useDeleteGroup()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

    useMemo(() => {
        if (isActionSuccess.value || isDeleteGroupError) {
            scrollToMutationFeedback()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActionSuccess.value, isDeleteGroupError])

    const isRowSelected = (row: Row<TableData>) => (row.original.uuid ? !!rowSelection[row.original.uuid] : false)
    const breadCrumbsLinks = [
        { href: RouteNames.HOME, label: t('notifications.home'), icon: HomeIcon },
        { label: t('navMenu.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },

        { href: `${NavigationSubRoutes.PRACOVNA_SKUPINA_DETAIL}/${id}`, label: group?.name ?? '' },
    ]
    if (group?.shortName !== KSIVS_SHORT_NAME) {
        breadCrumbsLinks.splice(2, 0, { label: t('navMenu.lists.groups'), href: NavigationSubRoutes.PRACOVNE_SKUPINY_KOMISIE })
    }

    const getSuccessMsg = (): string => {
        switch (isActionSuccess.additionalInfo?.type) {
            case 'update':
                return t('groups.successfulMemberUpdated')
            case 'add':
                return t('groups.successfulMemberAdded')
            case 'delete':
                return t('groups.successfulMemberDeleted')
            case 'edit':
                return t('mutationFeedback.successfulUpdated')
            default:
                return t('mutationFeedback.successfulCreated')
        }
    }

    return (
        <>
            <BaseModal isOpen={isDeleteModalOpen} close={() => setIsDeleteModalOpen(false)}>
                <TextHeading size="L">{t('groups.removeGroup')}</TextHeading>
                <TextBody>{t('groups.sureRemoveGroup')}</TextBody>
                <ModalButtons
                    submitButtonLabel={t('radioButton.yes')}
                    submitButtonVariant="warning"
                    onSubmit={() => deleteGroup(id ?? '')}
                    closeButtonLabel={t('form.cancel')}
                    onClose={() => setIsDeleteModalOpen(false)}
                />
            </BaseModal>
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
                <QueryFeedback loading={isDeleteGroupLoading} withChildren>
                    <div ref={wrapperRef}>
                        <MutationFeedback
                            successMessage={getSuccessMsg()}
                            success={isActionSuccess.value && isActionSuccess.additionalInfo?.entity === 'group'}
                            error={isDeleteGroupError}
                        />
                    </div>
                    <GroupDetailBaseInfo infoData={group} openDeleteModal={() => setIsDeleteModalOpen(true)} />
                    <TextHeading size="L">{t('groups.listOfMembers')}</TextHeading>
                    <GroupMembersFilter defaultFilterValues={identitiesFilter} isKsisvs={group?.shortName === KSIVS_SHORT_NAME} filter={filter} />
                    <ActionsOverTable
                        pagination={{
                            dataLength: identitiesData?.count ?? 0,
                            pageNumber: Number(filter.pageNumber),
                            pageSize: Number(filter.pageSize),
                        }}
                        handleFilterChange={handleFilterChange}
                        entityName="groups"
                        hiddenButtons={{ SELECT_COLUMNS: true }}
                    >
                        <Can I={Actions.CREATE} a={GroupPermissionSubject.GROUPS}>
                            <Button className={styles.marginBottom0} label={'+ ' + t('groups.addMember')} onClick={() => setAddModalOpen(true)} />
                        </Can>

                        <Can I={Actions.CREATE} a={GroupPermissionSubject.SEND_EMAIL}>
                            <Tooltip
                                on={['click']}
                                defaultOpen={false}
                                descriptionElement={t('groups.sendEmailChooseRows')}
                                triggerElement={
                                    <Button
                                        className={styles.marginBottom0}
                                        label={t('groups.sendEmail')}
                                        variant="secondary"
                                        onClick={() => sendBatchEmail(rowSelection)}
                                    />
                                }
                                altText={`Tooltip ${t('groups.sendEmail')}`}
                            />
                        </Can>
                    </ActionsOverTable>
                    <div ref={wrapperRef}>
                        <MutationFeedback
                            successMessage={getSuccessMsg()}
                            success={isActionSuccess.value && isActionSuccess.additionalInfo?.entity === 'member'}
                        />
                    </div>
                    <QueryFeedback
                        loading={isLoading || isIdentitiesLoading || !!isAbilityLoading}
                        error={isIdentitiesError || isAbilityError}
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
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}

export default GroupDetailView
