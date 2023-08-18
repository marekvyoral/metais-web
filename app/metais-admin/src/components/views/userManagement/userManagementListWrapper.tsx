import React, { useState, useCallback } from 'react'
import { IdentityState } from '@isdd/metais-common/api/generated/iam-swagger'
import { useTranslation } from 'react-i18next'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { PaginatorWrapper, SimpleSelect, Filter, TextHeading, Button } from '@isdd/idsk-ui-kit/index'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { BulkPopup, CreateEntityButton, IconLabel } from '@isdd/metais-common/components/actions-over-table'
import { CrossInACircleIcon, CheckInACircleIcon, ExportIcon } from '@isdd/metais-common/assets/images'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { SelectFilterRole } from '@/components/views/userManagement/components/SelectFilterRole/SelectFilterRole'
import { SelectFilterOrganization } from '@/components/views/userManagement/components/SelectFilterOrganization/SelectFilterOrganization'
import { UserManagementListTable } from '@/components/views/userManagement/components/UserManagementTable/UserManagementListTable'
import {
    UserManagementFilterData,
    UserManagementActionsOverRowEnum,
    UserManagementListItem,
    defaultFilterValues,
    UserManagementListData,
} from '@/components/containers/ManagementList/UserManagementListUtils'

export interface UserManagementListPageViewProps {
    data: UserManagementListData
    filter: UserManagementFilterData
    handleFilterChange: (filter: IFilter) => void
    handleRowAction: (identity: { uuid: string; login: string }, action: UserManagementActionsOverRowEnum, isCurrentlyBlocked?: boolean) => void
    handleBlockRowsAction: (identity: { uuid: string; login: string }[], activate: boolean) => void
    handleExport: () => void
}

export const UserManagementListPageView: React.FC<UserManagementListPageViewProps> = ({
    data,
    filter: userManagementFilter,
    handleFilterChange,
    handleRowAction,
    handleBlockRowsAction,
    handleExport,
}) => {
    const { t } = useTranslation()
    const [rowSelection, setRowSelection] = useState<Record<string, UserManagementListItem>>({})
    const handleUpdateIdentitiesState = useCallback(
        (activate: boolean) =>
            handleBlockRowsAction(
                Object.values(rowSelection).map((row) => ({ uuid: row.identity.uuid || '', login: row.identity.login || '' })),
                activate,
            ),
        [handleBlockRowsAction, rowSelection],
    )

    return (
        <>
            <TextHeading size="XL">{t('userManagement.title')}</TextHeading>
            <Filter<UserManagementFilterData>
                defaultFilterValues={defaultFilterValues}
                form={({ register, filter, setValue }) => (
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
                            {...register('state')}
                        />
                        <SelectFilterRole filter={filter} register={register} setValue={setValue} />
                        <SelectFilterOrganization filter={filter} register={register} setValue={setValue} />
                    </>
                )}
            />
            <ActionsOverTable
                handleFilterChange={handleFilterChange}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                createButton={<CreateEntityButton label={t('userManagement.addNewUser')} path={`${AdminRouteNames.USER_MANAGEMENT}/create`} />}
                exportButton={
                    <Button
                        className="marginBottom0"
                        onClick={handleExport}
                        label={<IconLabel label={t('actionOverTable.export')} icon={ExportIcon} />}
                        variant="secondary"
                    />
                }
                hiddenButtons={{ SELECT_COLUMNS: true }}
                bulkPopup={
                    <BulkPopup
                        checkedRowItems={0}
                        items={[
                            <ButtonLink
                                key={'buttonBlock'}
                                icon={CrossInACircleIcon}
                                label={t('userManagement.block')}
                                onClick={() => handleUpdateIdentitiesState(false)}
                            />,
                            <ButtonLink
                                key={'buttonUnblock'}
                                icon={CheckInACircleIcon}
                                label={t('userManagement.unblock')}
                                onClick={() => handleUpdateIdentitiesState(true)}
                            />,
                        ]}
                    />
                }
                entityName={''}
            />
            <UserManagementListTable
                data={data}
                filter={userManagementFilter}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                handleRowAction={handleRowAction}
                handleFilterChange={handleFilterChange}
            />
            <PaginatorWrapper
                dataLength={data.dataLength}
                pageNumber={userManagementFilter.pageNumber ?? BASE_PAGE_NUMBER}
                pageSize={userManagementFilter.pageSize ?? BASE_PAGE_SIZE}
                handlePageChange={handleFilterChange}
            />
        </>
    )
}
export { UserManagementActionsOverRowEnum }
