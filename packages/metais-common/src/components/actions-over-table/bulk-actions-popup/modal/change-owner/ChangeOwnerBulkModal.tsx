import { BaseModal, LoadingIndicator } from '@isdd/idsk-ui-kit'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ChangeOwnerBulkView } from './ChangeOwnerBulkView'

import { ChangeOwnerDataUi, ConfigurationItemUi, HierarchyRightsUi, useChangeOwnerSet } from '@isdd/metais-common/api'
import { useAddOrGetGroupHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { IBulkActionResult } from '@isdd/metais-common/hooks/useBulkAction'

export interface IChangeOwnerBulkModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (result: IBulkActionResult) => void
    items: ConfigurationItemUi[]
}

export const ChangeOwnerBulkModal: React.FC<IChangeOwnerBulkModalProps> = ({ items, open, onSubmit, onClose }) => {
    const { t } = useTranslation()
    const { isLoading, mutateAsync: changeOwner } = useChangeOwnerSet({
        mutation: {
            onSuccess() {
                onSubmit({ isSuccess: true, isError: false, successMessage: t('bulkActions.invalidate.success') })
            },
            onError() {
                onSubmit({ isSuccess: false, isError: true, successMessage: t('bulkActions.invalidate.success') })
            },
        },
    })
    const getAddOrGetGroup = useAddOrGetGroupHook()

    const [selectedRoleId, setSelectedRoleId] = useState<string>('')
    const [selectedOrg, setSelectedOrg] = useState<HierarchyRightsUi | null>(null)

    const handleChangeOwner = async (data: ChangeOwnerDataUi) => {
        const mappedItems = items.map((i) => {
            const attributes = Object.entries(i.attributes || {}).map(([key, value]) => ({ name: key, value }))
            return { ...i, attributes }
        })

        if (!selectedOrg || !selectedOrg.poUUID || !selectedRoleId) return
        const groupData = await getAddOrGetGroup(selectedRoleId, selectedOrg.poUUID || '')

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
                onChangeRole={setSelectedRoleId}
                selectedOrg={selectedOrg}
                selectedRoleId={selectedRoleId}
            />
        </BaseModal>
    )
}
