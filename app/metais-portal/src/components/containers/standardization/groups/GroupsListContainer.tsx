import { ConfigurationItemUi } from '@isdd/metais-common/api'
import { Find2111Params, Group, Identity, useFind2111 } from '@isdd/metais-common/api/generated/iam-swagger'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { KSIVS_SHORT_NAME } from '@isdd/metais-common/constants'
import { ColumnSort } from '@isdd/idsk-ui-kit/types'
import { useGroupsWithMeetings } from '@isdd/metais-common/api/generated/standards-swagger'

import { GroupsListView } from '@/components/views/standardization/groups/GroupsListView'

export interface GroupWithMeetings extends Group {
    nextMeetingDate?: string
    lastMeetingDate?: string
}

export const GroupsListContainer: React.FC = () => {
    const { t } = useTranslation()

    const groupsColumns: ColumnDef<GroupWithMeetings>[] = [
        {
            id: 'name',
            header: t('groups.groupName'),
            accessorKey: 'name',
            enableSorting: true,
            size: 500,
            cell: (ctx: CellContext<GroupWithMeetings, unknown>) => {
                return <Link to={`${ctx.row.original.uuid}`}>{ctx.row.original.name as string}</Link>
            },
            meta: {
                getCellContext: (ctx: CellContext<GroupWithMeetings, unknown>) => ctx.row.original.name,
            },
        },
        {
            id: 'shortName',
            header: t('groups.shortGroupName'),
            accessorKey: 'shortName',
            enableSorting: true,
            size: 200,
            cell: (row) => row.row.original.shortName,
        },
        {
            id: 'nextMeetingDate',
            header: t('groups.nextMeetingDate'),
            accessorKey: 'nextMeetingDate',
            enableSorting: true,
            size: 200,
            cell: (row) => <span>{row.row.original.nextMeetingDate ? t('dateTime', { date: row.row.original.nextMeetingDate }) : ''}</span>,
        },
        {
            id: 'lastMeetingDate',
            header: t('groups.lastMeetingDate'),
            accessorKey: 'lastMeetingDate',
            enableSorting: true,
            size: 200,
            cell: (row) => <span>{row.row.original.lastMeetingDate ? t('dateTime', { date: row.row.original.lastMeetingDate }) : ''}</span>,
        },
    ]

    const [selectedIdentity, setSelectedIdentity] = useState<Identity | undefined>(undefined)
    const [selectedOrg, setSelectedOrg] = useState<ConfigurationItemUi | undefined>(undefined)
    const [groups, setGroups] = useState<GroupWithMeetings[]>()
    const [sort, setSort] = useState<ColumnSort[]>([])
    const [groupsRequest, setGroupsRequest] = useState<Find2111Params>({ sortBy: 'name', ascending: false })

    const { data, isError, isLoading } = useFind2111(groupsRequest)

    const { data: groupMeetings, isError: isMeetingsError, isLoading: isMeetingsLoading } = useGroupsWithMeetings()

    useEffect(() => {
        data &&
            setGroups(
                (Array.isArray(data) ? data : [data])
                    .map((g) => {
                        const meetings = groupMeetings?.find((gm) => g.uuid === gm.group?.uuid)
                        return { ...g, nextMeetingDate: meetings?.nextMeetingDate, lastMeetingDate: meetings?.lastMeetingDate }
                    })
                    .filter((group) => group.shortName !== KSIVS_SHORT_NAME),
            )
    }, [data, groupMeetings])

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
            isLoading={isLoading || isMeetingsLoading}
            isError={isError || isMeetingsError}
            sort={sort}
            setSort={setSort}
        />
    )
}
