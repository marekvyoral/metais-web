import { SimpleSelect } from '@isdd/idsk-ui-kit'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { useGetRightForPO } from '@isdd/metais-common/hooks/useGetRightForPO'
import { Role, useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { HierarchyRightsUi } from '@isdd/metais-common/api'

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
        rightsForPOData,
        isLoading: isRightsForPOLoading,
        isError: isRightsForPOError,
    } = useGetRightForPO(user.state.user?.uuid ?? '', selectedOrg?.poUUID ?? '')

    useEffect(() => {
        if (rightsForPOData && rightsForPOData.length > 0 && selectedRoleId === '') {
            const firstValue = rightsForPOData[0].gid
            onChangeRole(firstValue)
            setDefaultValue(firstValue)
        }
    }, [onChangeRole, rightsForPOData, selectedRoleId])

    const roleSelectOptions = rightsForPOData?.map((role: Role) => ({ value: role.gid ?? '', label: role.roleDescription ?? '' })) ?? [
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
            />
        </>
    )
}
