import { BaseModal } from '@isdd/idsk-ui-kit/modal/BaseModal'
import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, CheckBox, GridCol, GridRow, TextArea } from '@isdd/idsk-ui-kit/index'
import { UseFormRegister, UseFormWatch } from 'react-hook-form'

import styles from './meetingProposalsModal.module.scss'
import { MeetingFormEnum } from './meetingSchema'

interface IMeetingProposalsModalProps {
    isOpen: boolean
    className?: string
    close: () => void
    isLoading?: boolean
    error?: boolean
    meetingName: string
    submit: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    watch: UseFormWatch<any>
}

export const MeetingReasonModal: React.FC<IMeetingProposalsModalProps> = ({ isOpen, close, meetingName, submit, register, watch }) => {
    const { t } = useTranslation()
    const reason = watch(MeetingFormEnum.MEETING_CHANGE_REASON)
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
                        rows={2}
                        label={`${t('meetings.reasonsDescription')} (${t('meetings.mandatory')}):`}
                        {...register(MeetingFormEnum.MEETING_CHANGE_REASON)}
                    />
                    <GridRow>
                        <GridCol>
                            <div className="govuk-checkboxes govuk-checkboxes--small">
                                <CheckBox
                                    id={'notificationUser'}
                                    label={t('meetings.notificationUser')}
                                    {...register(MeetingFormEnum.NOTIF_NEW_USERS)}
                                />
                            </div>
                        </GridCol>
                    </GridRow>
                    <GridRow>
                        <GridCol>
                            <div className="govuk-checkboxes govuk-checkboxes--small">
                                <CheckBox
                                    id={'notification'}
                                    label={t('meetings.notification')}
                                    {...register(MeetingFormEnum.IGNORE_PERSONAL_SETTINGS)}
                                />
                            </div>
                        </GridCol>
                    </GridRow>

                    <div className={styles.submitButton}>
                        <Button
                            label={t('button.saveChanges')}
                            type="submit"
                            onClick={() => {
                                submit()
                                handleClose()
                            }}
                            disabled={!reason}
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
