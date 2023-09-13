import { ConfigurationItemUi } from '@isdd/metais-common/api'
import { Find2111Params, Group, Identity, useFind2111 } from '@isdd/metais-common/api/generated/iam-swagger'
import { ColumnDef } from '@tanstack/react-table'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { GroupsListView } from '@/components/views/standartization/groups/GroupsListView'

export const GroupsListContainer: React.FC = () => {
    const { t } = useTranslation()

    const groupsColumns: ColumnDef<Group>[] = [
        {
            id: 'name',
            header: t('groups.groupName'),
            accessorKey: 'name',
            enableSorting: true,
            size: 500,
            cell: (row) => {
                return <Link to={`${row.row.original.uuid}`}>{row.getValue() as string}</Link>
            },
        },
        { id: 'shortName', header: t('groups.shortGroupName'), accessorKey: 'shortName', enableSorting: true, size: 200 },
    ]

    const [selectedIdentity, setSelectedIdentity] = useState<Identity | undefined>(undefined)
    const [selectedOrg, setSelectedOrg] = useState<ConfigurationItemUi | undefined>(undefined)
    const [groupsRequest, setGroupsRequest] = useState<Find2111Params>({ sortBy: 'name', ascending: false })

    const { data: groups, isError, isLoading } = useFind2111(groupsRequest)

    const loadGroups = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const request: Find2111Params = { sortBy: 'name', ascending: false }
        if (selectedIdentity) request.identity = selectedIdentity.uuid
        if (selectedOrg) request.organization = selectedOrg.uuid
        setGroupsRequest(request)
    }

    return (
        <GroupsListView
            groups={Array.isArray(groups) ? groups : undefined}
            columns={groupsColumns}
            setSelectedIdentity={setSelectedIdentity}
            selectedOrg={selectedOrg}
            setSelectedOrg={setSelectedOrg}
            handleSubmit={loadGroups}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
