import { AccordionContainer, Button, ButtonPopup, GridCol, GridRow, RadioButton, Tab, Tabs, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ApiMeetingRequest, useParticipateMeetingRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { formatDateTimeForDefaultValue } from '@isdd/metais-common/componentHelpers/formatting/formatDateUtils'

import { MeetingActorsTable } from './MeetingActorsTable'
import { MeetingExternalActorsTable } from './MeetingExternalActorsTable'

import styles from '@/components/views/standardization/meetings/meetingStyles.module.scss'

interface MeetingDetailBaseInfoProps {
    infoData: ApiMeetingRequest | undefined
}

const MeetingDetailBaseInfo: React.FC<MeetingDetailBaseInfoProps> = ({ infoData }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const meetingParticipate = useParticipateMeetingRequest()
    const [participateValue, setParticipateValue] = useState<string>('')
    const handleParticipate = () => {
        if (infoData?.id) meetingParticipate.mutateAsync({ meetingRequestId: infoData?.id, params: { participation: participateValue } })
    }
    const sections = [
        {
            title: t('meetings.documents'),
            summary: null,
            content: <TextBody>content documents</TextBody>,
        },
        {
            title: t('meetings.proposal'),
            summary: null,
            content: <TextBody>content proposal</TextBody>,
        },
        {
            title: t('meetings.record'),
            summary: null,
            content: <TextBody>content record</TextBody>,
        },
    ]

    const tabList: Tab[] = [
        {
            id: 'meetingActors',
            title: t('meetings.meetingActors'),
            content: <MeetingActorsTable data={infoData} />,
        },
        {
            id: 'meetingExternalActors',
            title: t('meetings.meetingExternalActors'),
            content: <MeetingExternalActorsTable data={infoData} />,
        },
    ]

    return (
        <>
            <GridRow className={styles.row}>
                <GridCol>
                    <TextHeading size="XL">{infoData?.name}</TextHeading>
                </GridCol>
                <GridCol setWidth="one-quarter">
                    <ButtonPopup
                        buttonLabel={t('meetings.actions')}
                        popupPosition="right"
                        popupContent={(closePopup) => (
                            <div className={styles.actions}>
                                <Button
                                    className={styles.marginBottom0}
                                    type="button"
                                    label={t('meetings.editItem')}
                                    onClick={() => {
                                        navigate('edit')
                                        closePopup()
                                    }}
                                />
                                <Button
                                    className={styles.marginBottom0}
                                    type="button"
                                    variant="warning"
                                    label={t('meetings.cancelMeeting')}
                                    onClick={() => {
                                        //useCancelMeetingRequest()
                                        closePopup()
                                    }}
                                />
                            </div>
                        )}
                    />
                </GridCol>
            </GridRow>
            <GridRow>
                <GridCol setWidth="one-quarter">
                    <TextBody className={styles.boldText}>{t('meetings.date')}</TextBody>
                </GridCol>
                <GridCol setWidth="two-thirds">
                    <TextBody>{formatDateTimeForDefaultValue(infoData?.beginDate || '', 'dd.MM.yyyy')}</TextBody>
                </GridCol>
            </GridRow>
            <GridRow>
                <GridCol setWidth="one-quarter">
                    <TextBody className={styles.boldText}>{t('meetings.start')}</TextBody>
                </GridCol>
                <GridCol setWidth="two-thirds">
                    <TextBody>{formatDateTimeForDefaultValue(infoData?.beginDate || '', 'HH:mm')}</TextBody>
                </GridCol>
            </GridRow>
            <GridRow>
                <GridCol setWidth="one-quarter">
                    <TextBody className={styles.boldText}>{t('meetings.end')}</TextBody>
                </GridCol>
                <GridCol setWidth="two-thirds">
                    <TextBody>{formatDateTimeForDefaultValue(infoData?.endDate || '', 'HH:mm')}</TextBody>
                </GridCol>
            </GridRow>
            <GridRow>
                <GridCol setWidth="one-quarter">
                    <TextBody className={styles.boldText}>{t('meetings.place')}</TextBody>
                </GridCol>
                <GridCol setWidth="two-thirds">
                    <TextBody>{infoData?.place}</TextBody>
                </GridCol>
            </GridRow>

            <TextHeading size="L">{t('meetings.vote')}</TextHeading>
            <RadioButton
                name={'participate'}
                label={t('meetings.labelYes')}
                id={'ACCEPTED'}
                value={'ACCEPTED'}
                onChange={() => setParticipateValue('ACCEPTED')}
            />
            <RadioButton
                name={'participate'}
                label={t('meetings.labelNo')}
                id={'DECLINED'}
                value={'DECLINED'}
                onChange={() => setParticipateValue('DECLINED')}
            />
            <Button
                type="button"
                label={t('meetings.participateButton')}
                onClick={() => {
                    //console.log('setParticipateValue', participateValue)
                    handleParticipate()
                }}
            />

            <TextHeading size="L">{t('meetings.program')}</TextHeading>
            <TextBody>{infoData?.description}</TextBody>

            <AccordionContainer sections={sections} />

            <TextHeading size="L">{t('meetings.listActors')}</TextHeading>
            <Tabs tabList={tabList} />
        </>
    )
}

export default MeetingDetailBaseInfo
