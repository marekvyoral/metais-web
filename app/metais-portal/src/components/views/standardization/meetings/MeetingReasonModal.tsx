import { BaseModal } from '@isdd/idsk-ui-kit/modal/BaseModal'
import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, CheckBox, GridCol, GridRow, TextArea } from '@isdd/idsk-ui-kit/index'

import styles from './meetingProposalsModal.module.scss'

interface IMeetingProposalsModalProps {
    isOpen: boolean
    className?: string
    close: () => void
    isLoading?: boolean
    error?: boolean
    meetingName: string
    submit: () => void
}

export const MeetingReasonModal: React.FC<IMeetingProposalsModalProps> = ({ isOpen, close, meetingName, submit }) => {
    const { t } = useTranslation()

    const handleClose = () => {
        close()
    }
    return (
        <BaseModal isOpen={isOpen} close={handleClose}>
            <div className={styles.modalContainer}>
                <div className={styles.content}>
                    <TextHeading size={'L'} className={styles.heading}>
                        {`${t('meetings.form.heading.reasons')} ${meetingName}`}
                    </TextHeading>
                    <TextArea
                        name={t('meetings.reasonsDescription')}
                        rows={2}
                        label={`${t('meetings.reasonsDescription')} (${t('meetings.mandatory')}):`}
                    />
                    <GridRow>
                        <GridCol>
                            <div className="govuk-checkboxes govuk-checkboxes--small">
                                <CheckBox id={'notificationUser'} label={t('meetings.notificationUser')} name={t('meetings.notificationUser')} />
                            </div>
                        </GridCol>
                    </GridRow>
                    <GridRow>
                        <GridCol>
                            <div className="govuk-checkboxes govuk-checkboxes--small">
                                <CheckBox id={'notification'} label={t('meetings.notification')} name={t('meetings.notification')} />
                            </div>
                        </GridCol>
                    </GridRow>

                    <div className={styles.submitButton}>
                        <Button
                            label={t('button.saveChanges')}
                            onClick={() => {
                                submit()
                                handleClose()
                            }}
                        />

                        <Button
                            variant="secondary"
                            label={t('button.cancel')}
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
