import { Button, Input, PaginatorWrapper, SimpleSelect, Table } from '@isdd/idsk-ui-kit/index'
import { ColumnSort, IFilter } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Identity } from '@isdd/metais-common/api/generated/iam-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import React, { SetStateAction, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CiLazySelect } from '@isdd/metais-common/components/ci-lazy-select/CiLazySelect'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import classNames from 'classnames'
import { GroupPermissionSubject } from '@isdd/metais-common/hooks/permissions/useGroupsPermissions'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'

import styles from '@/components/views/standardization/groups/groupslist.module.scss'
import { IdentitySelect } from '@/components/identity-lazy-select/IdentitySelect'
import { GroupWithMeetings } from '@/components/containers/standardization/groups/GroupsListContainer'

interface IGroupsListView {
    groups: GroupWithMeetings[] | undefined
    columns: ColumnDef<GroupWithMeetings>[]
    setSelectedIdentity: React.Dispatch<SetStateAction<Identity | undefined>>
    selectedOrg: ConfigurationItemUi | undefined
    setSelectedOrg: React.Dispatch<SetStateAction<ConfigurationItemUi | undefined>>
    groupName: string
    setGroupName: React.Dispatch<SetStateAction<string>>
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    isLoading: boolean
    isError: boolean
    sort: ColumnSort[]
    setSort: React.Dispatch<SetStateAction<ColumnSort[]>>
}

export const GroupsListView: React.FC<IGroupsListView> = ({
    groups,
    columns,
    setSelectedIdentity,
    selectedOrg,
    setSelectedOrg,
    groupName,
    setGroupName,
    handleSubmit,
    isLoading,
    isError,
    sort,
    setSort,
}) => {
    const { t } = useTranslation()
    const { currentPreferences } = useUserPreferences()
    const navigate = useNavigate()
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user

    const label = <span>+ {t('groups.addNewGroup')}</span>
    const tableRef = useRef<HTMLTableElement>(null)
    const [pageSize, setPageSize] = useState<number>(Number(currentPreferences.defaultPerPage) || BASE_PAGE_SIZE)
    const [pageNumber, setPageNumber] = useState<number>(BASE_PAGE_NUMBER)

    const handlePageChange = (filter: IFilter) => {
        setPageNumber(filter?.pageNumber ?? 0)
    }

    const handlePerPageChange = (newValue: string | undefined) => {
        if (pageNumber * pageSize > (groups?.length ?? 0)) {
            setPageNumber(1)
        }
        const newPageSize = Number(newValue)
        setPageSize(newPageSize)
    }

    return (
        <>
            {isUserLogged && (
                <div className="idsk-table-filter idsk-table-filter__panel">
                    <form onSubmit={handleSubmit} noValidate>
                        <Can I={Actions.READ} a={GroupPermissionSubject.SEE_MEMBERS}>
                            <IdentitySelect
                                placeholder={t('groups.select')}
                                name="memberSelect"
                                onChange={(val) => {
                                    setSelectedIdentity(Array.isArray(val) ? val[0] : val)
                                }}
                                label={t('groups.member')}
                            />
                        </Can>
                        <CiLazySelect
                            ciType="PO"
                            selectedCi={selectedOrg}
                            setSelectedCi={setSelectedOrg}
                            placeholder={t('groups.select')}
                            label={t('groups.organization')}
                        />
                        <Input label={t('groups.groupName')} name="groupName" value={groupName} onChange={(val) => setGroupName(val.target.value)} />
                        <Button label={t('groups.show')} className={'idsk-button'} type="submit" />
                    </form>
                </div>
            )}
            <QueryFeedback loading={isLoading} error={isError}>
                <div className={classNames([styles.actionsWrapper, isUserLogged ? styles.justifySpaceBetween : styles.justifyFlexEnd])}>
                    <Can I={Actions.CREATE} a={GroupPermissionSubject.GROUPS}>
                        <Button
                            label={label}
                            className={'idsk-button'}
                            onClick={() => {
                                navigate(NavigationSubRoutes.PRACOVNA_SKUPINA_CREATE)
                            }}
                        />
                    </Can>
                    <SimpleSelect
                        name="groupsPerPageSelect"
                        label={t('actionOverTable.view')}
                        value={pageSize.toString()}
                        id="groupsPerPageSelect"
                        options={DEFAULT_PAGESIZE_OPTIONS}
                        onChange={handlePerPageChange}
                        isClearable={false}
                    />
                </div>
                <Table<GroupWithMeetings>
                    tableRef={tableRef}
                    columns={columns}
                    data={groups}
                    sort={sort}
                    onSortingChange={setSort}
                    manualSorting={false}
                    manualPagination={false}
                    pagination={{ pageIndex: pageNumber - 1, pageSize: pageSize }}
                />
            </QueryFeedback>
            <PaginatorWrapper
                pageNumber={pageNumber}
                pageSize={pageSize}
                dataLength={groups?.length ?? 0}
                handlePageChange={(filter) => {
                    handlePageChange(filter)
                    tableRef.current?.scrollIntoView({ behavior: 'smooth' })
                }}
            />
        </>
    )
}
