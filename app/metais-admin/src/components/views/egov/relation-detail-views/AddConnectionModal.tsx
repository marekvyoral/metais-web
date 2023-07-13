import React from 'react'
import { BaseModal } from '@isdd/idsk-ui-kit'
import { CiTypePreview } from '@isdd/metais-common/api'

import { AddConnectionView } from './AddConnectionView'

import { EntityListContainer } from '@/components/containers/Egov/Entity/EntityListContainer'

interface ConnectionModal {
    open: boolean
    onClose: () => void
    addConnection?: (selectedConnection: CiTypePreview, ciTypeRoleEnum: 'TARGET' | 'SOURCE') => void
}

export const AddConnectionModal = ({ onClose, open, addConnection }: ConnectionModal) => {
    return (
        <BaseModal isOpen={open} close={onClose}>
            <EntityListContainer
                View={(props) => {
                    const listData = props?.data?.results
                    const listOptions =
                        listData?.map((data) => {
                            return {
                                value: JSON.stringify(data) ?? '',
                                label: data?.name ?? '',
                            }
                        }) ?? []
                    return <AddConnectionView listOptions={listOptions} onClose={onClose} addConnection={addConnection} />
                }}
            />
        </BaseModal>
    )
}
