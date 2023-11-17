import {
    AccordionContainer,
    Button,
    ButtonPopup,
    GridCol,
    GridRow,
    IconDocument,
    IconLink,
    Input,
    RadioButton,
    Tab,
    Tabs,
    TextBody,
    TextHeading,
    TextLink,
    TextLinkExternal,
} from '@isdd/idsk-ui-kit/index'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ApiMeetingRequest, useParticipateMeetingRequest, useSummarizeMeetingRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { formatDateTimeForDefaultValue } from '@isdd/metais-common/componentHelpers/formatting/formatDateUtils'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { SafeHtmlComponent } from '@isdd/idsk-ui-kit/save-html-component/SafeHtmlComponent'
import { FieldValues, useForm } from 'react-hook-form'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'

import { MeetingActorsTable } from './MeetingActorsTable'
import { MeetingExternalActorsTable } from './MeetingExternalActorsTable'
import { MeetingStateEnum } from './MeetingsListView'
import { MeetingCancelModal } from './MeetingCancelModal'

import styles from '@/components/views/standardization/meetings/meetingStyles.module.scss'

interface MeetingDetailBaseInfoProps {
    infoData: ApiMeetingRequest | undefined
    refetch: () => void
}
export enum MeetingParticipateValue {
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED',
}

const MeetingDetailBaseInfo: React.FC<MeetingDetailBaseInfoProps> = ({ infoData, refetch }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { isActionSuccess } = useActionSuccess()
    const {
        state: { user },
    } = useAuth()
    const { register, handleSubmit, setValue } = useForm({ defaultValues: { linkUrl: infoData?.summarizedLink } })
    const meetingParticipate = useParticipateMeetingRequest()
    const [participateValue, setParticipateValue] = useState<string>('')
    const [summarizeLinkChange, setSummarizeLinkChange] = useState(!infoData?.summarizedLink)
    const summarizeLink = useSummarizeMeetingRequest()
    const canceledState = infoData?.state === MeetingStateEnum.CANCELED
    const summarizeState = infoData?.state === MeetingStateEnum.SUMMARIZED
    const pastState = infoData?.state === MeetingStateEnum.PAST
    const createdByUser = infoData?.createdBy === user?.login
    const userIsRole = user?.roles.includes('STD_KOORDINATOR_AGENDY')
    const userIsGuest = infoData?.meetingActors?.some((guest) => guest.userName === user?.displayName)
    const userIsParticipate = infoData?.meetingActors?.find((guest) => guest.userName === user?.displayName)?.participation
    const [editParticipate, setEditParticipate] = useState(!userIsParticipate)
    const dateNow = new Date()
    const endDateMeeting = new Date(infoData?.endDate as string)
    const startDateMeeting = new Date(infoData?.beginDate as string)
    const meetingIsFinished = endDateMeeting.getTime() - dateNow.getTime() < 0
    const meetingIsStarting = startDateMeeting.getTime() - dateNow.getTime() > 0
    const DMS_DOWNLOAD_FILE = `${import.meta.env.VITE_REST_CLIENT_DMS_TARGET_URL}/file/`
    const [modalOpen, setModalOpen] = useState(false)
    const [participateLoading, setParticipateLoading] = useState(false)
    const openModal = () => {
        setModalOpen(true)
    }
    const onClose = () => {
        setModalOpen(false)
    }

    const onSubmit = (fieldValues: FieldValues) => {
        if (infoData?.id && fieldValues.linkUrl) summarizeLink.mutateAsync({ meetingRequestId: infoData?.id, data: { linkUrl: fieldValues.linkUrl } })
    }
    const handleParticipate = () => {
        if (infoData?.id) {
            setParticipateLoading(true)
            meetingParticipate
                .mutateAsync({ meetingRequestId: infoData?.id, params: { participation: participateValue } })
                .then(() => refetch())
                .finally(() => setParticipateLoading(false))
        }
    }

    useEffect(() => {
        if (infoData) {
            setSummarizeLinkChange(!infoData?.summarizedLink)
            setValue('linkUrl', infoData?.summarizedLink)
        }
    }, [infoData, setValue])

    useEffect(() => {
        if (userIsParticipate) {
            setEditParticipate(!userIsParticipate)
        }
    }, [userIsParticipate])

    const LinkProposals: React.FC = () => (
        <>
            {infoData?.standardRequestsNames?.map((proposal, index) => {
                return (
                    <TextLink key={proposal} to={`/standardization/draftslist/${infoData?.standardRequestIds?.[index]}`}>
                        {proposal}
                    </TextLink>
                )
            })}
        </>
    )

    const SummarizeLink: React.FC = () => (
        <>
            {(createdByUser || userIsRole) && summarizeLinkChange && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <GridRow>
                        <GridCol setWidth="two-thirds">
                            <Input {...register('linkUrl')} />
                        </GridCol>
                        <GridCol setWidth="one-third">
                            <Button label={t('meetings.linkSave')} type="submit" />
                        </GridCol>
                    </GridRow>
                </form>
            )}
            {summarizeState && (createdByUser || userIsRole) && !summarizeLinkChange && (
                <GridRow>
                    <GridCol setWidth="two-thirds">
                        <TextLinkExternal
                            title={infoData?.summarizedLink ?? ''}
                            href={infoData?.summarizedLink ?? ''}
                            textLink={infoData?.summarizedLink ?? ''}
                            newTab
                        />
                    </GridCol>
                    <GridCol setWidth="one-third">
                        <Button label={t('meetings.linkChange')} onClick={() => setSummarizeLinkChange(true)} />
                    </GridCol>
                </GridRow>
            )}
        </>
    )
    const sections = [
        {
            title: t('meetings.documents'),
            summary: null,
            content: (
                <>
                    {infoData?.meetingAttachments?.length ? (
                        <>
                            <TextBody>{t('meetings.otherDocuments')}:</TextBody>
                            {infoData?.meetingAttachments?.map((index) => (
                                <GridRow key={index?.id}>
                                    <GridCol setWidth="full">
                                        <img src={IconDocument} className={styles.documentIcon} />
                                        <TextLinkExternal
                                            key={index?.id}
                                            title={index?.attachmentName ?? ''}
                                            href={`${DMS_DOWNLOAD_FILE}${index?.attachmentId}`}
                                            textLink={index?.attachmentName ?? ''}
                                            newTab
                                        />
                                    </GridCol>
                                </GridRow>
                            ))}
                        </>
                    ) : (
                        <TextBody>{t('meetings.noDocumentsAttached')}</TextBody>
                    )}
                    {infoData?.meetingLinks?.length ? (
                        <>
                            <TextBody>{t('meetings.documentLinks')}:</TextBody>
                            {infoData?.meetingLinks?.map((index) => (
                                <GridRow key={index?.id}>
                                    <GridCol setWidth="full">
                                        <img src={IconLink} className={styles.documentLinkIcon} />
                                        <TextLinkExternal
                                            key={index?.id}
                                            title={index?.linkDescription ?? ''}
                                            href={`${index?.url}`}
                                            textLink={index?.linkDescription ?? ''}
                                            newTab
                                        />
                                    </GridCol>
                                </GridRow>
                            ))}
                        </>
                    ) : (
                        <TextBody>{t('meetings.noDocumentsLinkAttached')}</TextBody>
                    )}
                </>
            ),
        },
        {
            title: t('meetings.proposal'),
            summary: null,
            content: <LinkProposals />,
        },
        {
            title: t('meetings.record'),
            summary: null,
            content: (
                <>
                    {pastState || summarizeState ? (
                        <SummarizeLink />
                    ) : canceledState ? (
                        <>
                            <TextBody>{t('meetings.canseledMeeting')}</TextBody>
                            {infoData?.actionDesription ? (
                                <GridRow>
                                    <GridCol setWidth="one-quarter">
                                        <TextBody>{t('meetings.canseledMeetingReason')}:</TextBody>
                                    </GridCol>
                                    <GridCol setWidth="two-thirds">
                                        <TextBody>{infoData?.actionDesription}</TextBody>
                                    </GridCol>
                                </GridRow>
                            ) : (
                                ''
                            )}
                        </>
                    ) : (
                        ''
                    )}
                </>
            ),
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
            <MutationFeedback success={isActionSuccess.value} error={false} />
            <GridRow className={styles.row}>
                <GridCol>
                    <TextHeading size="XL">{infoData?.name}</TextHeading>
                </GridCol>

                {(createdByUser || userIsRole) && meetingIsStarting && !canceledState && (
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
                                            openModal()
                                            closePopup()
                                        }}
                                    />
                                </div>
                            )}
                        />
                    </GridCol>
                )}
            </GridRow>
            <InformationGridRow label={t('meetings.date')} value={formatDateTimeForDefaultValue(infoData?.beginDate || '', 'dd.MM.yyyy')} hideIcon />
            <InformationGridRow label={t('meetings.start')} value={formatDateTimeForDefaultValue(infoData?.beginDate || '', 'HH:mm')} hideIcon />
            <InformationGridRow label={t('meetings.end')} value={formatDateTimeForDefaultValue(infoData?.endDate || '', 'HH:mm')} hideIcon />
            <InformationGridRow label={t('meetings.place')} value={infoData?.place} hideIcon />

            {userIsGuest && !canceledState && !meetingIsFinished ? (
                <>
                    <QueryFeedback loading={participateLoading} withChildren>
                        {editParticipate ? (
                            <>
                                <TextHeading size="L">{t('meetings.vote')}</TextHeading>
                                <RadioButton
                                    name={'participate'}
                                    label={t('meetings.labelYes')}
                                    id={MeetingParticipateValue.ACCEPTED}
                                    value={MeetingParticipateValue.ACCEPTED}
                                    onChange={() => setParticipateValue(MeetingParticipateValue.ACCEPTED)}
                                />
                                <RadioButton
                                    name={'participate'}
                                    label={t('meetings.labelNo')}
                                    id={MeetingParticipateValue.DECLINED}
                                    value={MeetingParticipateValue.DECLINED}
                                    onChange={() => setParticipateValue(MeetingParticipateValue.DECLINED)}
                                />
                                <Button
                                    className={styles.buttonMargin}
                                    type="button"
                                    label={t('meetings.participateButton')}
                                    onClick={() => {
                                        handleParticipate()
                                        setEditParticipate(false)
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <TextHeading size="L">{t('meetings.vote')}</TextHeading>
                                <TextBody>{t(`meetings.voteValue.${userIsParticipate}`)}</TextBody>
                                <Button label={t('meetings.changeVote')} onClick={() => setEditParticipate(true)} />
                            </>
                        )}
                    </QueryFeedback>
                </>
            ) : (
                ''
            )}

            <TextHeading size="L">{t('meetings.program')}</TextHeading>
            <TextBody>
                <SafeHtmlComponent dirtyHtml={infoData?.description ?? ''} />
            </TextBody>
            <AccordionContainer sections={sections} />
            <TextHeading size="L">{t('meetings.listActors')}</TextHeading>
            <Tabs tabList={tabList} />
            <MeetingCancelModal isOpen={modalOpen} close={onClose} infoData={infoData} />
        </>
    )
}

export default MeetingDetailBaseInfo
