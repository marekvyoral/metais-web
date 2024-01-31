import { BaseModal } from '@isdd/idsk-ui-kit'
import { CiTypePreview } from '@isdd/metais-common/api/generated/types-repo-swagger'

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
                    const listData = props?.data
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
