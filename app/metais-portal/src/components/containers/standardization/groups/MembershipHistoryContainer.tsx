import { Group, Person, StdHistory, useGetStdHistoryHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { ColumnDef } from '@tanstack/react-table'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAbilityContextWithFeedback } from '@isdd/metais-common/hooks/permissions/useAbilityContext'

import { MembershipHistoryView } from '@/components/views/standardization/groups/MembershipHistoryView'

export const MembershipHistoryContainer: React.FC = () => {
    const { t } = useTranslation()
    const { isLoading: isAbilityLoading } = useAbilityContextWithFeedback()

    const historyColumns: ColumnDef<StdHistory>[] = [
        {
            id: 'identity',
            header: t('groups.userName'),
            accessorKey: 'identity',
            meta: {
                getCellContext: (ctx) => `${(ctx.getValue() as Person).firstName} ${(ctx.getValue() as Person).lastName}`,
            },
            cell: (row) => {
                return (
                    <span>
                        {(row.getValue() as Person).firstName} {(row.getValue() as Person).lastName}
                    </span>
                )
            },
            size: 200,
        },
        {
            id: 'orgName',
            header: t('groups.organization'),
            accessorKey: 'orgName',
            size: 310,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
        },
        {
            id: 'roleDesc',
            header: t('groups.role'),
            accessorKey: 'roleDesc',
            size: 140,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
        },
    ]

    const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(undefined)
    const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined)
    const [membershipHistory, setMembershipHistory] = useState<StdHistory[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const historyHook = useGetStdHistoryHook()

    const loadMembershipHistory = async (event: React.FormEvent<HTMLFormElement>) => {
        setIsLoading(true)
        event.preventDefault()
        const date = new Date(selectedDate ?? '')

        await historyHook({ groupShortName: selectedGroup?.shortName ?? '', createdAt: date.getTime() }).then((res) => {
            setMembershipHistory(res)
            setIsLoading(false)
        })
    }

    return (
        <MembershipHistoryView
            membershipHistory={membershipHistory}
            columns={historyColumns}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            handleSubmit={loadMembershipHistory}
            isLoading={isLoading || !!isAbilityLoading}
        />
    )
}
