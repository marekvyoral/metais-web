import { SimpleSelect } from '@isdd/idsk-ui-kit'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { HierarchyRightsUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { GidRoleData, useGetRightsForPO } from '@isdd/metais-common/api/generated/iam-swagger'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

interface Props {
    onChangeRole: (val: GidRoleData | null) => void
    selectedOrg: HierarchyRightsUi | null
    selectedRole: GidRoleData
    ciRoles: string[]
    hideRoleSelect?: boolean
    disabled?: boolean
}

export const SelectRole: React.FC<Props> = ({ onChangeRole, selectedOrg, selectedRole, ciRoles, disabled, hideRoleSelect }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const [seed, setSeed] = useState(1)
    const [defaultValue, setDefaultValue] = useState<GidRoleData | null>(null)

    const {
        data: rightsForPOData,
        isLoading: isRightsForPOLoading,
        isError: isRightsForPOError,
    } = useGetRightsForPO({ identityUuid: user?.uuid ?? '', cmdbId: selectedOrg?.poUUID ?? '' }, { query: { enabled: !!selectedOrg?.poUUID } })

    const roleSelectOptions = useMemo(() => {
        const rolesForPO = rightsForPOData?.filter((role) => ciRoles?.find((currentRole) => currentRole === role.roleName))

        return rolesForPO?.map((role: GidRoleData) => ({ value: role, label: role.roleDescription ?? '' })) ?? []
    }, [ciRoles, rightsForPOData])

    useEffect(() => {
        if (roleSelectOptions && roleSelectOptions.length > 0 && selectedRole?.roleUuid == undefined) {
            const firstValue = roleSelectOptions[0].value
            if (firstValue) {
                onChangeRole(firstValue)
                setDefaultValue(firstValue)
            }
        } else if (roleSelectOptions.length === 0 && selectedRole?.roleUuid !== undefined) {
            onChangeRole(null)
            setDefaultValue(null)
        }
    }, [onChangeRole, roleSelectOptions, selectedRole?.roleUuid])

    useEffect(() => {
        // SelectLazyLoading component does not rerender on defaultValue change.
        // Once default value is set, it cant be changed.
        // Change of key forces the component to render changed default value.
        setSeed(Math.random())
    }, [defaultValue])

    if (hideRoleSelect) return <></>

    return (
        <>
            <QueryFeedback
                loading={isRightsForPOLoading && !rightsForPOData && !!selectedOrg?.poUUID}
                error={false}
                indicatorProps={{ label: t('selectRole.loading') }}
                withChildren
            />
            <SimpleSelect
                key={seed}
                error={!selectedRole ? t('selectRole.required') : isRightsForPOError ? t('selectRole.error') : ''}
                onChange={(value) => value && onChangeRole(value)}
                label={t('createEntity.role')}
                id="role"
                name="role"
                disabled={isRightsForPOLoading || isRightsForPOError || disabled}
                options={roleSelectOptions}
                defaultValue={defaultValue}
                isClearable={false}
                value={selectedRole}
            />
        </>
    )
}
