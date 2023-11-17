import { BaseModal } from '@isdd/idsk-ui-kit/modal/BaseModal'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input } from '@isdd/idsk-ui-kit/index'
import { ApiMeetingRequest, useCancelMeetingRequest } from '@isdd/metais-common/api/generated/standards-swagger'

import styles from './meetingProposalsModal.module.scss'

interface IMeetingCancelModal {
    isOpen: boolean
    className?: string
    close: () => void
    isLoading?: boolean
    error?: boolean
    infoData: ApiMeetingRequest | undefined
}

export const MeetingCancelModal: React.FC<IMeetingCancelModal> = ({ isOpen, close, infoData }) => {
    const { t } = useTranslation()
    const [cancelMeetingDescription, setCancelMeetingDescription] = useState('')
    const handleClose = () => {
        close()
    }
    const cancelMeeting = useCancelMeetingRequest()
    const handleCancelMeeting = () => {
        if (infoData?.id) cancelMeeting.mutateAsync({ meetingRequestId: infoData?.id, data: { description: cancelMeetingDescription } })
    }
    return (
        <BaseModal isOpen={isOpen} close={handleClose}>
            <div className={styles.modalContainer}>
                <div className={styles.content}>
                    <Input
                        name={t('meetings.reasonOfCanceling')}
                        label={t('meetings.reasonOfCanceling')}
                        onChange={(e) => setCancelMeetingDescription(e.target.value)}
                    />
                    <div className={styles.submitButton}>
                        <Button
                            label={t('meetings.cancelMeeting')}
                            onClick={() => {
                                handleCancelMeeting()
                                handleClose()
                            }}
                            disabled={!cancelMeetingDescription}
                        />

                        <Button
                            variant="secondary"
                            label={t('button.back')}
                            onClick={() => {
                                handleClose()
                            }}
                        />
                    </div>
                </div>
            </div>
        </BaseModal>
    )
}
