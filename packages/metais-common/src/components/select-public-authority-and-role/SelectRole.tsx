import { SimpleSelect } from '@isdd/idsk-ui-kit'
import React, { useEffect, useState } from 'react'
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
    } = useGetRightsForPO({ identityUuid: user.state.user?.uuid ?? '', cmdbId: selectedOrg?.poUUID ?? '' })

    useEffect(() => {
        if (rightsForPOData && rightsForPOData.length > 0 && selectedRoleId === '') {
            const firstValue = rightsForPOData?.[0]?.roleUuid
            if (firstValue) {
                onChangeRole(firstValue)
                setDefaultValue(firstValue)
            }
        }
    }, [onChangeRole, rightsForPOData, selectedRoleId])

    const roleSelectOptions = rightsForPOData?.map((role: GidRoleData) => ({ value: role.roleUuid ?? '', label: role.roleDescription ?? '' })) ?? [
        { value: '', label: '' },
    ]

    useEffect(() => {
        // SelectLazyLoading component does not rerender on defaultValue change.
        // Once default value is set, it cant be changed.
        // Change of key forces the component to render changed default value.
        setSeed(Math.random())
    }, [defaultValue])

    return (
        <>
            {isRightsForPOLoading && !rightsForPOData && selectedOrg?.poUUID && (
                <QueryFeedback
                    loading={isRightsForPOLoading}
                    error={false}
                    indicatorProps={{ fullscreen: true, layer: 'parent', label: t('selectRole.loading') }}
                />
            )}
            <SimpleSelect
                key={seed}
                error={isRightsForPOError ? t('selectRole.error') : ''}
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
