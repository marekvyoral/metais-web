import { BaseModal, Button, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useDeleteGroupRelationHook } from '@isdd/metais-common/api/generated/iam-swagger'

import styles from '../styles.module.scss'
interface deleteMemberPopUpProps {
    uuid?: string
    groupUuid: string
    isOpen: boolean
    onClose: () => void
}

const KSIVSDeleteMemberPopUp: React.FC<deleteMemberPopUpProps> = ({ isOpen, onClose, uuid, groupUuid }) => {
    const deleteRelation = useDeleteGroupRelationHook()

    return (
        <>
            <BaseModal isOpen={isOpen} close={onClose}>
                <TextHeading size="L">Remove group member</TextHeading>
                <TextBody>Do you really want remove group member?</TextBody>
                <div className={styles.displayFlex}>
                    <Button
                        className={styles.marginLeftAuto}
                        label="Yes"
                        onClick={() => {
                            deleteRelation(uuid ?? '', groupUuid)
                            onClose()
                        }}
                    />
                    <Button label="Cancel" variant="secondary" onClick={onClose} />
                </div>
            </BaseModal>
        </>
    )
}
export default KSIVSDeleteMemberPopUp
