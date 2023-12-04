import { Button, PaginatorWrapper, SimpleSelect, Table } from '@isdd/idsk-ui-kit/index'
import { ColumnSort, IFilter } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Identity } from '@isdd/metais-common/api/generated/iam-swagger'
import { BASE_PAGE_NUMBER, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import React, { SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CiLazySelect } from '@isdd/metais-common/components/ci-lazy-select/CiLazySelect'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import classNames from 'classnames'

import styles from '@/components/views/standardization/groups/groupslist.module.scss'
import { IdentitySelect } from '@/components/identity-lazy-select/IdentitySelect'
import { GroupWithMeetings } from '@/components/containers/standardization/groups/GroupsListContainer'

interface IGroupsListView {
    groups: GroupWithMeetings[] | undefined
    columns: ColumnDef<GroupWithMeetings>[]
    setSelectedIdentity: React.Dispatch<SetStateAction<Identity | undefined>>
    selectedOrg: ConfigurationItemUi | undefined
    setSelectedOrg: React.Dispatch<SetStateAction<ConfigurationItemUi | undefined>>
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
    handleSubmit,
    isLoading,
    isError,
    sort,
    setSort,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user

    const label = <span>+ {t('groups.addNewGroup')}</span>

    const [pageSize, setPageSize] = useState<number>(10)
    const [start, setStart] = useState<number>(0)
    const [end, setEnd] = useState<number>(pageSize)
    const [pageNumber, setPageNumber] = useState<number>(1)

    const handlePageChange = (filter: IFilter) => {
        setPageNumber(filter?.pageNumber ?? 0)
        setStart((filter?.pageNumber ?? 0) * pageSize - pageSize)
        setEnd((filter?.pageNumber ?? 0) * pageSize)
    }

    const handlePerPageChange = (newValue: string | undefined) => {
        const newPageSize = Number(newValue)
        if (newPageSize > (groups?.slice(start, groups.length).length ?? 0)) {
            setPageNumber(BASE_PAGE_NUMBER)
            setPageSize(newPageSize)
            setStart(BASE_PAGE_NUMBER * newPageSize - newPageSize)
            setEnd(groups?.length ?? 0)
        } else {
            setPageSize(newPageSize)
            setStart((pageNumber ?? 0) * newPageSize - newPageSize)
            setEnd((pageNumber ?? 0) * newPageSize)
        }
    }

    return (
        <>
            {isUserLogged && (
                <div className="idsk-table-filter idsk-table-filter__panel">
                    <form onSubmit={handleSubmit}>
                        <IdentitySelect
                            placeholder={t('groups.select')}
                            name="memberSelect"
                            onChange={(val) => {
                                setSelectedIdentity(Array.isArray(val) ? val[0] : val)
                            }}
                            label={t('groups.member')}
                        />
                        <CiLazySelect
                            ciType="PO"
                            selectedCi={selectedOrg}
                            setSelectedCi={setSelectedOrg}
                            placeholder={t('groups.select')}
                            label={t('groups.organization')}
                        />
                        <Button label={t('groups.show')} className={'idsk-button'} type="submit" />
                    </form>
                </div>
            )}
            <QueryFeedback loading={isLoading} error={isError}>
                <div className={classNames([styles.actionsWrapper, isUserLogged ? styles.justifySpaceBetween : styles.justifyFlexEnd])}>
                    <Can I={Actions.CREATE} a={'groups'}>
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

                <Table<GroupWithMeetings> columns={columns} data={groups?.slice(start, end)} sort={sort} onSortingChange={setSort} />
            </QueryFeedback>
            <PaginatorWrapper pageNumber={pageNumber} pageSize={pageSize} dataLength={groups?.length ?? 0} handlePageChange={handlePageChange} />
        </>
    )
}
