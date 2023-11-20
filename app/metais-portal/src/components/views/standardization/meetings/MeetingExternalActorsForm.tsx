import { Button, Input, TextHeading } from '@isdd/idsk-ui-kit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FieldErrors, UseFieldArrayRemove, UseFormRegister } from 'react-hook-form'
import { ApiMeetingRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { ImportDeleteIcon } from '@isdd/metais-common/assets/images'
import { IconLabel } from '@isdd/metais-common/index'

import { MeetingFormEnum } from './meetingSchema'
import styles from './createEditView.module.scss'

export interface IErrors {
    name?: string
    email?: string
    description?: string
}

interface IMeetingExternalActorsForm {
    meetingActor: Record<string, string>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any>
    index: number
    remove: UseFieldArrayRemove
    errors: FieldErrors<ApiMeetingRequest>
}

export const MeetingExternalActorsForm = ({ meetingActor, index, register, remove, errors }: IMeetingExternalActorsForm) => {
    const { t } = useTranslation()
    return (
        <>
            <div className={styles.externalActorsForm}>
                <div>
                    <TextHeading size={'S'}>
                        {t('meetings.guestNumber')} {index + 1}:
                    </TextHeading>
                </div>
                <div className={styles.externalActorsFields}>
                    <div className={styles.externalActorsInputs}>
                        <Input
                            label={`${t('meetings.form.externalActorName')} (${t('meetings.mandatory')}):`}
                            defaultValue={meetingActor?.name}
                            error={errors[MeetingFormEnum.MEETING_EXTERNAL_ACTORS]?.[index]?.name?.message}
                            {...register(`${MeetingFormEnum.MEETING_EXTERNAL_ACTORS}.${index}.name`)}
                        />
                        <Input
                            label={`${t('meetings.form.externalActorEmail')} (${t('meetings.mandatory')}):`}
                            defaultValue={meetingActor?.email}
                            error={errors[MeetingFormEnum.MEETING_EXTERNAL_ACTORS]?.[index]?.email?.message}
                            {...register(`${MeetingFormEnum.MEETING_EXTERNAL_ACTORS}.${index}.email`)}
                        />
                        <Input
                            label={`${t('meetings.form.externalActorDescription')}:`}
                            defaultValue={meetingActor?.description}
                            {...register(`${MeetingFormEnum.MEETING_EXTERNAL_ACTORS}.${index}.description`)}
                        />
                    </div>
                    <div className={styles.externalActorsButton}>
                        <Button label={<IconLabel label={''} icon={ImportDeleteIcon} />} onClick={() => remove(index)} variant="secondary" />
                    </div>
                </div>
            </div>
        </>
    )
}
