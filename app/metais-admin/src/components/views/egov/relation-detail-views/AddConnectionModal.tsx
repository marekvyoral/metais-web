import React from 'react'
import { BaseModal } from '@isdd/idsk-ui-kit'

import { AddConnectionView } from './AddConnectionView'

import { EntityListContainer } from '@/components/containers/Egov/Entity/EntityListContainer'

interface ConnectionModal {
    open: boolean
    onClose: () => void
}

export const AddConnectionModal = ({ onClose, open }: ConnectionModal) => {
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
                    return <AddConnectionView listOptions={listOptions} onClose={onClose} />
                }}
            />
        </BaseModal>
    )
}
