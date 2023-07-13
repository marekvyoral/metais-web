import React from 'react'
import { BaseModal } from '@isdd/idsk-ui-kit'

import AddAttributeContainer from './AddAttributeContainer'
import AddAttributeView from './AddAttributeView'

interface IAddAttributeModal {
    open: boolean
    onClose: () => void
    entityName: string
}

const AddAttributeModal = ({ open, onClose, entityName }: IAddAttributeModal) => {
    return (
        <BaseModal isOpen={open} close={onClose}>
            <AddAttributeContainer
                View={(props) => (
                    <AddAttributeView
                        data={{ measureUnit: props?.data?.measureUnit, allEnumsData: props?.data?.allEnumsData, entityName }}
                        storeAttribute={props?.storeAttribute}
                    />
                )}
            />
        </BaseModal>
    )
}

export default AddAttributeModal
