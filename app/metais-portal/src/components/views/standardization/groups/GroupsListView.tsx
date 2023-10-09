import { Button, PaginatorWrapper, SimpleSelect, Table } from '@isdd/idsk-ui-kit/index'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemUi } from '@isdd/metais-common/api'
import { Group, Identity } from '@isdd/metais-common/api/generated/iam-swagger'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import React, { SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import styles from '@/components/views/standardization/groups/groupslist.module.scss'
import { IdentitySelect } from '@/components/identity-lazy-select/IdentitySelect'
import { CiLazySelect } from '@/components/ci-lazy-select/CiLazySelect'

interface IGroupsListView {
    groups: Group[] | undefined
    columns: ColumnDef<Group>[]
    setSelectedIdentity: React.Dispatch<SetStateAction<Identity | undefined>>
    selectedOrg: ConfigurationItemUi | undefined
    setSelectedOrg: React.Dispatch<SetStateAction<ConfigurationItemUi | undefined>>
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    isLoading: boolean
    isError: boolean
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
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

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
        setPageSize(newPageSize)
        setStart((pageNumber ?? 0) * newPageSize - newPageSize)
        setEnd((pageNumber ?? 0) * newPageSize)
    }

    return (
        <>
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
            <div className={styles.actionsWrapper}>
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

            <QueryFeedback loading={isLoading} error={isError}>
                <Table<Group> columns={columns} data={groups?.slice(start, end)} />
            </QueryFeedback>
            <PaginatorWrapper pageNumber={pageNumber} pageSize={pageSize} dataLength={groups?.length ?? 0} handlePageChange={handlePageChange} />
        </>
    )
}
