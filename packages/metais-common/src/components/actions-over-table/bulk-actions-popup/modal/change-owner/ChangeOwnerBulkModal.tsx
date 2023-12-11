import { BaseModal, LoadingIndicator } from '@isdd/idsk-ui-kit'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ChangeOwnerBulkView } from './ChangeOwnerBulkView'

import {
    ChangeOwnerDataUi,
    ChangeOwnerSetUi,
    ConfigurationItemUi,
    HierarchyRightsUi,
    useChangeOwnerSet,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { GidRoleData, useAddOrGetGroupHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { IBulkActionResult } from '@isdd/metais-common/hooks/useBulkAction'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useInvalidateCiHistoryListCache } from '@isdd/metais-common/hooks/invalidate-cache'

export interface IChangeOwnerBulkModalProps {
    open: boolean
    multiple?: boolean
    onClose: () => void
    onSubmit: (result: IBulkActionResult) => void
    items: ConfigurationItemUi[]
    ciRoles: string[]
    isRelation?: boolean
}

export const ChangeOwnerBulkModal: React.FC<IChangeOwnerBulkModalProps> = ({ items, open, multiple, onSubmit, onClose, ciRoles, isRelation }) => {
    const { t } = useTranslation()

    const successMessage = multiple ? t('mutationFeedback.successfulUpdatedList') : t('mutationFeedback.successfulUpdated')
    const { getRequestStatus, isError, isProcessedError, isTooManyFetchesError } = useGetStatus()
    const { invalidate: invalidateHistoryListCache } = useInvalidateCiHistoryListCache()

    useEffect(() => {
        if (isError || isProcessedError || isTooManyFetchesError) {
            onSubmit({ isSuccess: false, isError: true })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError, isProcessedError, isTooManyFetchesError])

    const { isLoading, mutateAsync: changeOwner } = useChangeOwnerSet({
        mutation: {
            async onSuccess(data) {
                if (data.requestId) {
                    await getRequestStatus(data.requestId, () => {
                        onSubmit({ isSuccess: true, isError: false, successMessage })
                        items.forEach((item) => invalidateHistoryListCache(item.uuid ?? ''))
                    })
                }
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

        let dataToSend: ChangeOwnerSetUi = {}
        if (isRelation) {
            dataToSend = {
                relationshipSet: mappedItems,
                changeOwnerData: {
                    newOwner: groupData.gid,
                    changeReason: data.changeReason,
                    changeDescription: data.changeDescription,
                    changeType: data.changeType,
                },
            }
        } else {
            dataToSend = {
                configurationItemSet: mappedItems,
                changeOwnerData: {
                    newOwner: groupData.gid,
                    changeReason: data.changeReason,
                    changeDescription: data.changeDescription,
                    changeType: data.changeType,
                },
            }
        }

        await changeOwner({
            data: dataToSend,
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
