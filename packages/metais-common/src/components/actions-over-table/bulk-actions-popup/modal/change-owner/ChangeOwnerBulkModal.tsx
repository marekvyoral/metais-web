import { BaseModal, LoadingIndicator } from '@isdd/idsk-ui-kit'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ChangeOwnerBulkView } from './ChangeOwnerBulkView'

import { ChangeOwnerDataUi, ConfigurationItemUi, HierarchyRightsUi, useChangeOwnerSet } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { GidRoleData, useAddOrGetGroupHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { IBulkActionResult } from '@isdd/metais-common/hooks/useBulkAction'

export interface IChangeOwnerBulkModalProps {
    open: boolean
    multiple?: boolean
    onClose: () => void
    onSubmit: (result: IBulkActionResult) => void
    items: ConfigurationItemUi[]
    ciRoles: string[]
}

export const ChangeOwnerBulkModal: React.FC<IChangeOwnerBulkModalProps> = ({ items, open, multiple, onSubmit, onClose, ciRoles }) => {
    const { t } = useTranslation()

    const successMessage = multiple ? t('bulkActions.changeOwner.successList') : t('bulkActions.changeOwner.success')

    const { isLoading, mutateAsync: changeOwner } = useChangeOwnerSet({
        mutation: {
            onSuccess() {
                onSubmit({ isSuccess: true, isError: false, successMessage })
            },
            onError() {
                onSubmit({ isSuccess: false, isError: true, successMessage })
            },
        },
    })
    const getAddOrGetGroup = useAddOrGetGroupHook()

    const [selectedRole, setSelectedRole] = useState<GidRoleData | null>(null)
    const [selectedOrg, setSelectedOrg] = useState<HierarchyRightsUi | null>(null)

    const handleChangeOwner = async (data: ChangeOwnerDataUi) => {
        const mappedItems = items.map((i) => {
            const attributes = Object.entries(i.attributes || {}).map(([key, value]) => ({ name: key, value }))
            return { ...i, attributes }
        })

        if (!selectedOrg || !selectedOrg.poUUID || !selectedRole?.roleUuid) return
        const groupData = await getAddOrGetGroup(selectedRole.roleUuid, selectedOrg.poUUID || '')

        await changeOwner({
            data: {
                configurationItemSet: mappedItems,
                changeOwnerData: {
                    newOwner: groupData.gid,
                    changeReason: data.changeReason,
                    changeDescription: data.changeDescription,
                    changeType: data.changeType,
                },
            },
        })
    }

    return (
        <BaseModal isOpen={open} close={onClose}>
            {isLoading && <LoadingIndicator label={t('form.waitSending')} />}
            <ChangeOwnerBulkView
                items={items}
                onClose={onClose}
                onSubmit={handleChangeOwner}
                onChangeAuthority={setSelectedOrg}
                onChangeRole={setSelectedRole}
                selectedOrg={selectedOrg}
                selectedRole={selectedRole ?? {}}
                multiple={multiple}
                ciRoles={ciRoles}
            />
        </BaseModal>
    )
}
