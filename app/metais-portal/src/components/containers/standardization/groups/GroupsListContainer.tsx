import { ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Find2111Params, Group, Identity, useFind2111 } from '@isdd/metais-common/api/generated/iam-swagger'
import { useGroupsWithMeetings } from '@isdd/metais-common/api/generated/standards-swagger'
import { latiniseString } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { KSIVS_SHORT_NAME } from '@isdd/metais-common/constants'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

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
            size: 200,
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
    const [groupName, setGroupName] = useState<string>('')
    const [groupNameRequest, setGroupNameRequest] = useState<string>('')
    const [groups, setGroups] = useState<GroupWithMeetings[]>()
    const [sort, setSort] = useState<ColumnSort[]>([{ orderBy: 'name', sortDirection: SortType.ASC }])
    const [groupsRequest, setGroupsRequest] = useState<Find2111Params>()

    const { data, isError, isLoading } = useFind2111(groupsRequest)

    const filteredData = useMemo(() => {
        if (!groupNameRequest) return data
        return (Array.isArray(data) ? data : [data]).filter((item) => {
            return latiniseString(item?.name ?? '').includes(latiniseString(groupNameRequest).toLowerCase())
        })
    }, [data, groupNameRequest])

    const { data: groupMeetings, isError: isMeetingsError, isLoading: isMeetingsLoading } = useGroupsWithMeetings()
    useEffect(() => {
        filteredData &&
            setGroups(
                (Array.isArray(filteredData) ? filteredData : [filteredData])
                    .map((g) => {
                        const meetings = groupMeetings?.find((gm) => g?.uuid === gm.group?.uuid)
                        return { ...g, nextMeetingDate: meetings?.nextMeetingDate, lastMeetingDate: meetings?.lastMeetingDate }
                    })
                    .filter((group) => group.shortName !== KSIVS_SHORT_NAME),
            )
    }, [filteredData, groupMeetings])

    const loadGroups = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const request: Find2111Params = { sortBy: 'name', ascending: true }
        if (selectedIdentity) request.identity = selectedIdentity.uuid
        if (selectedOrg) request.organization = selectedOrg.uuid
        setGroupNameRequest(groupName)
        setGroupsRequest(request)
    }

    return (
        <GroupsListView
            groups={Array.isArray(groups) ? groups : undefined}
            columns={groupsColumns}
            setSelectedIdentity={setSelectedIdentity}
            selectedOrg={selectedOrg}
            setSelectedOrg={setSelectedOrg}
            groupName={groupName}
            setGroupName={setGroupName}
            handleSubmit={loadGroups}
            isLoading={isLoading || isMeetingsLoading}
            isError={isError || isMeetingsError}
            sort={sort}
            setSort={setSort}
        />
    )
}
