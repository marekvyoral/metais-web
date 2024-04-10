import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { Button, Filter, PaginatorWrapper, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { FindAll11200, IdentityState, UpdateRoleBulkRequestOperation } from '@isdd/metais-common/api/generated/iam-swagger'
import { CheckInACircleIcon, CrossInACircleIcon, ExportIcon, ChangeIcon } from '@isdd/metais-common/assets/images'
import { BulkPopup, CreateEntityButton, IconLabel } from '@isdd/metais-common/components/actions-over-table'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { UseMutateFunction, UseMutationResult } from '@tanstack/react-query'
import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import styles from './userManagementListWrapper.module.scss'

import { ChangeRoleModal, IChangeRoleItem } from '@/components/views/userManagement/modal/ChangeRoleModal'
import {
    UserManagementActionsOverRowEnum,
    UserManagementFilterData,
    UserManagementListData,
    UserManagementListItem,
    defaultFilterValues,
} from '@/components/containers/ManagementList/UserManagementListUtils'
import { SelectFilterOrganizationHierarchy } from '@/components/views/userManagement/components/SelectFilterOrganizationHierarchy/SelectFilterOrganizationHierarchy'
import { SelectFilterRole } from '@/components/views/userManagement/components/SelectFilterRole/SelectFilterRole'
import { UserManagementListTable } from '@/components/views/userManagement/components/UserManagementTable/UserManagementListTable'

export interface UserStateBatchMutation {
    updateIdentityStateBatchMutation: UseMutationResult<
        void[],
        unknown,
        {
            uuids: string[]
            activate: boolean
        },
        unknown
    >
    revokeUserBatchMutation: UseMutateFunction<
        Response[],
        unknown,
        {
            login: string
            token: string | null
        }[],
        unknown
    >
}

export interface UserManagementListPageViewProps {
    data: UserManagementListData
    filter: UserManagementFilterData
    handleFilterChange: (filter: IFilter) => void
    handleBlockRowsAction: (identity: { uuid: string; login: string }[], activate: boolean) => void
    handleExport: () => void
    handleUpdateRolesBulk: (
        result: IChangeRoleItem,
        action: UpdateRoleBulkRequestOperation,
        identities: UserManagementListItem[],
        allRolesData: FindAll11200,
    ) => void
    isLoading: boolean
    isError: boolean
    isLoadingExport: boolean
    isErrorExport: boolean
    isMutationError: boolean
    isMutationSuccess: boolean
    successRolesUpdate: string | undefined
    rowSelection: Record<string, UserManagementListItem>
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, UserManagementListItem>>>
    mutations: UserStateBatchMutation
}

export const UserManagementListPageView: React.FC<UserManagementListPageViewProps> = ({
    data,
    filter: userManagementFilter,
    handleFilterChange,
    handleBlockRowsAction,
    handleExport,
    isError,
    isErrorExport,
    isLoading,
    isLoadingExport,
    isMutationError,
    isMutationSuccess,
    successRolesUpdate,
    rowSelection,
    setRowSelection,
    handleUpdateRolesBulk,
    mutations,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const {
        isActionSuccess: { value: isSuccess },
    } = useActionSuccess()
    const tableRef = useRef<HTMLTableElement>(null)

    const [isChangeRolesModalOpen, setChangeRolesModalOpen] = useState<boolean>(false)

    const handleUpdateIdentitiesState = useCallback(
        (activate: boolean) =>
            handleBlockRowsAction(
                Object.values(rowSelection).map((row) => ({ uuid: row.identity.uuid || '', login: row.identity.login || '' })),
                activate,
            ),
        [handleBlockRowsAction, rowSelection],
    )

    const handleModalResult = useCallback(
        (result: IChangeRoleItem, action: UpdateRoleBulkRequestOperation, allRolesData: FindAll11200) => {
            setChangeRolesModalOpen(false)
            handleUpdateRolesBulk(result, action, Object.values(rowSelection), allRolesData)
        },
        [handleUpdateRolesBulk, rowSelection],
    )
    return (
        <QueryFeedback
            loading={isLoading || isLoadingExport}
            error={false}
            indicatorProps={{ label: isLoadingExport ? t('loading.export') : undefined }}
            withChildren
        >
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t('userManagement.title')}</TextHeading>
                <QueryFeedback loading={false} error={isError} errorProps={{ errorMessage: t('userManagement.error.query') }} />
                <QueryFeedback loading={false} error={isErrorExport} errorProps={{ errorMessage: t('userManagement.error.export') }} />
                <MutationFeedback success={isMutationSuccess} error={isMutationError} errorMessage={t('userManagement.error.mutation')} />
                <MutationFeedback success={isSuccess} />
                <MutationFeedback
                    success={!!successRolesUpdate}
                    successMessage={successRolesUpdate}
                    successMessageClassName={styles.successMessage}
                />
            </FlexColumnReverseWrapper>
            <Filter<UserManagementFilterData>
                defaultFilterValues={defaultFilterValues}
                form={({ filter, setValue }) => (
                    <>
                        <SimpleSelect
                            label={t(`userManagement.filter.state`)}
                            options={[
                                {
                                    value: '',
                                    label: t('userManagement.filter.stateLabel.all'),
                                },
                                {
                                    value: IdentityState.BLOCKED,
                                    label: t('userManagement.filter.stateLabel.blocked'),
                                },
                                {
                                    value: IdentityState.ACTIVATED,
                                    label: t('userManagement.filter.stateLabel.activated'),
                                },
                            ]}
                            defaultValue={filter.state}
                            name="state"
                            setValue={setValue}
                        />
                        <SelectFilterRole filter={filter} setValue={setValue} />
                        <SelectFilterOrganizationHierarchy filter={filter} setValue={setValue} />
                    </>
                )}
            />
            <ActionsOverTable
                pagination={{
                    pageNumber: userManagementFilter.pageNumber ?? BASE_PAGE_NUMBER,
                    pageSize: userManagementFilter.pageSize ?? BASE_PAGE_SIZE,
                    dataLength: data.dataLength,
                }}
                handleFilterChange={handleFilterChange}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                createButton={
                    <CreateEntityButton
                        label={t('userManagement.addNewUser')}
                        onClick={() => navigate(`${AdminRouteNames.USER_MANAGEMENT}/create`, { state: { from: location } })}
                    />
                }
                exportButton={
                    <Button
                        className="marginBottom0"
                        onClick={handleExport}
                        label={<IconLabel label={t('actionOverTable.export')} icon={ExportIcon} />}
                        variant="secondary"
                    />
                }
                selectedRowsCount={Object.keys(rowSelection).length}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                bulkPopup={({ selectedRowsCount }) => (
                    <BulkPopup
                        checkedRowItems={selectedRowsCount}
                        items={(closePopup) => [
                            <ButtonLink
                                key={'buttonBlock'}
                                icon={CrossInACircleIcon}
                                label={t('userManagement.block')}
                                onClick={() => {
                                    closePopup()
                                    handleUpdateIdentitiesState(false)
                                }}
                            />,
                            <ButtonLink
                                key={'buttonUnblock'}
                                icon={CheckInACircleIcon}
                                label={t('userManagement.unblock')}
                                onClick={() => {
                                    closePopup()
                                    handleUpdateIdentitiesState(true)
                                }}
                            />,
                            <ButtonLink
                                key={'buttonChangeRoles'}
                                icon={ChangeIcon}
                                label={t('userManagement.changeRoles')}
                                disabled={Object.values(rowSelection).length === 0}
                                onClick={() => {
                                    closePopup()
                                    setChangeRolesModalOpen(true)
                                }}
                            />,
                        ]}
                    />
                )}
                entityName={''}
            />
            <UserManagementListTable
                tableRef={tableRef}
                data={data}
                filter={userManagementFilter}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                mutations={mutations}
                handleFilterChange={handleFilterChange}
            />
            <PaginatorWrapper
                dataLength={data.dataLength}
                pageNumber={userManagementFilter.pageNumber ?? BASE_PAGE_NUMBER}
                pageSize={userManagementFilter.pageSize ?? BASE_PAGE_SIZE}
                handlePageChange={(filter) => {
                    handleFilterChange(filter)
                    tableRef.current?.scrollIntoView({ behavior: 'smooth' })
                }}
            />
            <ChangeRoleModal
                isOpen={isChangeRolesModalOpen}
                close={() => setChangeRolesModalOpen(false)}
                addRoles={(result, allRolesData) => {
                    handleModalResult(result, UpdateRoleBulkRequestOperation.ADD, allRolesData)
                }}
                removeRoles={(result, allRolesData) => {
                    handleModalResult(result, UpdateRoleBulkRequestOperation.DELETE, allRolesData)
                }}
            />
        </QueryFeedback>
    )
}
export { UserManagementActionsOverRowEnum }
