import { SimpleSelect } from '@isdd/idsk-ui-kit'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { HierarchyRightsUi } from '@isdd/metais-common/api'
import { GidRoleData, useGetRightsForPO } from '@isdd/metais-common/api/generated/iam-swagger'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

interface Props {
    onChangeRole: (val: string) => void
    selectedOrg: HierarchyRightsUi | null
    selectedRoleId: string
}

export const SelectRole: React.FC<Props> = ({ onChangeRole, selectedOrg, selectedRoleId }) => {
    const { t } = useTranslation()
    const user = useAuth()
    const [seed, setSeed] = useState(1)
    const [defaultValue, setDefaultValue] = useState<string>('')

    const {
        data: rightsForPOData,
        isLoading: isRightsForPOLoading,
        isError: isRightsForPOError,
    } = useGetRightsForPO(
        { identityUuid: user.state.user?.uuid ?? '', cmdbId: selectedOrg?.poUUID ?? '' },
        { query: { enabled: !!selectedOrg?.poUUID } },
    )

    const currentOrganizationsRoles = user.state.user?.groupData.find((org) => org.orgId === selectedOrg?.poUUID)?.roles
    const roleSelectOptions = useMemo(() => {
        return (
            rightsForPOData
                ?.filter((role) => currentOrganizationsRoles?.find((currentRole) => currentRole.roleUuid === role.roleUuid))
                .map((role: GidRoleData) => ({ value: role.roleUuid ?? '', label: role.roleDescription ?? '' })) ?? []
        )
    }, [rightsForPOData, currentOrganizationsRoles])

    useEffect(() => {
        if (roleSelectOptions && roleSelectOptions.length > 0 && selectedRoleId === '') {
            const firstValue = roleSelectOptions[0].value
            if (firstValue) {
                onChangeRole(firstValue)
                setDefaultValue(firstValue)
            }
        } else if (roleSelectOptions.length === 0 && selectedRoleId !== '') {
            onChangeRole('')
            setDefaultValue('')
        }
    }, [onChangeRole, roleSelectOptions, selectedRoleId])

    useEffect(() => {
        // SelectLazyLoading component does not rerender on defaultValue change.
        // Once default value is set, it cant be changed.
        // Change of key forces the component to render changed default value.
        setSeed(Math.random())
    }, [defaultValue])

    return (
        <>
            {isRightsForPOLoading && !rightsForPOData && selectedOrg?.poUUID && (
                <QueryFeedback loading={isRightsForPOLoading} error={false} indicatorProps={{ label: t('selectRole.loading') }} withChildren />
            )}
            <SimpleSelect
                key={seed}
                error={!selectedRoleId ? t('selectRole.required') : isRightsForPOError ? t('selectRole.error') : ''}
                onChange={(value) => {
                    onChangeRole(value || '')
                }}
                label={t('createEntity.role')}
                id="role"
                name="role"
                disabled={isRightsForPOLoading || isRightsForPOError}
                options={roleSelectOptions}
                defaultValue={defaultValue}
                isClearable={false}
                value={selectedRoleId}
            />
        </>
    )
}
