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
import { useNavigate } from 'react-router-dom'
import { SafeHtmlComponent } from '@isdd/idsk-ui-kit/save-html-component/SafeHtmlComponent'
import { GetMeta200 } from '@isdd/metais-common/api/generated/dms-swagger'
import { ApiMeetingRequest, useParticipateMeetingRequest, useSummarizeMeetingRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { formatDateTimeForDefaultValue } from '@isdd/metais-common/componentHelpers/formatting/formatDateUtils'
import { formatBytes } from '@isdd/metais-common/components/file-import/fileImportUtils'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { Can, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, Subject } from '@isdd/metais-common/hooks/permissions/useMeetingsDetailPermissions'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import headerStyles from '@isdd/metais-common/src/components/entity-header/ciEntityHeader.module.scss'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'

import { MeetingActorsTable } from './MeetingActorsTable'
import { MeetingCancelModal } from './MeetingCancelModal'
import { MeetingExternalActorsTable } from './MeetingExternalActorsTable'
import { MeetingStateEnum } from './MeetingsListView'

import styles from '@/components/views/standardization/meetings/meetingStyles.module.scss'

interface MeetingDetailBaseInfoProps {
    infoData: ApiMeetingRequest | undefined
    refetch: () => void
    attachmentsMetaData?: GetMeta200
}
export enum MeetingParticipateValue {
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED',
}

const MeetingDetailBaseInfo: React.FC<MeetingDetailBaseInfoProps> = ({ infoData, refetch, attachmentsMetaData }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { isActionSuccess, setIsActionSuccess } = useActionSuccess()
    const {
        state: { user },
    } = useAuth()
    const { register, handleSubmit, setValue } = useForm({ defaultValues: { linkUrl: infoData?.summarizedLink } })
    const meetingParticipate = useParticipateMeetingRequest()
    const [participateValue, setParticipateValue] = useState<string>('')
    const [summarizeLinkChange, setSummarizeLinkChange] = useState(!infoData?.summarizedLink)
    const summarizeLink = useSummarizeMeetingRequest()
    const ability = useAbilityContext()
    const isMeetingFuture = infoData?.state === MeetingStateEnum.FUTURE
    const userIsParticipate = infoData?.meetingActors?.find((guest) => guest.userName === user?.displayName)?.participation
    const [editParticipate, setEditParticipate] = useState(!userIsParticipate)
    const DMS_DOWNLOAD_FILE = `${import.meta.env.VITE_REST_CLIENT_DMS_TARGET_URL}/file/`
    const [modalOpen, setModalOpen] = useState(false)
    const [participateLoading, setParticipateLoading] = useState(false)
    const searchParams = new URLSearchParams(window.location.search)
    const token = searchParams.get('token')
    const participation = searchParams.get('participation')

    console.log('token', token)
    console.log('participation', participation)

    const [error, setError] = useState(false)
    const [isSummarizeLoading, setIsSummarizeLoading] = useState(false)
    const openModal = () => {
        setModalOpen(true)
    }
    const onClose = () => {
        setModalOpen(false)
    }
    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    const onSubmit = (fieldValues: FieldValues) => {
        setIsSummarizeLoading(true)
        if (infoData?.id && fieldValues.linkUrl)
            summarizeLink
                .mutateAsync({ meetingRequestId: infoData?.id, data: { linkUrl: fieldValues.linkUrl } })
                .then(() => {
                    setIsActionSuccess({
                        value: true,
                        path: `${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${infoData?.id}`,
                        additionalInfo: { type: 'summarizeLink' },
                    })
                })
                .catch(() => {
                    setError(true)
                    setIsActionSuccess({ value: false, path: `${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${infoData?.id}` })
                })
                .finally(() => {
                    refetch()
                    setIsSummarizeLoading(false)
                    scrollToMutationFeedback()
                })
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
                    <TextLink key={proposal} to={`/standardization/draftslist/${infoData?.standardRequestIds?.[index]}`} textBodySize>
                        {proposal}
                    </TextLink>
                )
            })}
        </>
    )

    const SummarizeLink: React.FC = () => (
        <>
            <QueryFeedback loading={isSummarizeLoading} withChildren>
                {ability.can(Actions.SET_SUMMARIZE_LINK, Subject.MEETING) && summarizeLinkChange && (
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                {ability.can(Actions.CHANGE_SUMMARIZE_LINK, Subject.MEETING) && !summarizeLinkChange && (
                    <GridRow>
                        <GridCol setWidth="two-thirds">
                            <TextLinkExternal
                                title={infoData?.summarizedLink ?? ''}
                                href={infoData?.summarizedLink ?? ''}
                                textLink={infoData?.summarizedLink ?? ''}
                                newTab
                                textBodySize
                            />
                        </GridCol>
                        <GridCol setWidth="one-third">
                            <Button label={t('meetings.linkChange')} onClick={() => setSummarizeLinkChange(true)} />
                        </GridCol>
                    </GridRow>
                )}
            </QueryFeedback>
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
                            {infoData?.meetingAttachments?.map((attachment) => (
                                <GridRow key={attachment?.id}>
                                    <GridCol setWidth="full">
                                        <img src={IconDocument} className={styles.documentIcon} alt="" />
                                        <TextLinkExternal
                                            key={attachment?.id}
                                            title={`${attachment?.attachmentName}`}
                                            href={`${DMS_DOWNLOAD_FILE}${attachment?.attachmentId}`}
                                            textLink={`${attachment?.attachmentName} (${formatBytes(
                                                attachmentsMetaData?.[attachment.attachmentId ?? 0]?.contentLength ?? 0,
                                            )})`}
                                            newTab
                                            textBodySize
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
                            <TextBody className={classNames({ [styles.documentsLinkMargin]: !!infoData?.meetingAttachments?.length })}>
                                {t('meetings.documentLinks')}:
                            </TextBody>
                            {infoData?.meetingLinks?.map((index) => (
                                <GridRow key={index?.id}>
                                    <GridCol setWidth="full">
                                        <img src={IconLink} className={styles.documentLinkIcon} alt="" />
                                        <TextLinkExternal
                                            key={index?.id}
                                            title={index?.linkDescription ?? ''}
                                            href={`${index?.url}`}
                                            textLink={index?.linkDescription ?? ''}
                                            newTab
                                            textBodySize
                                        />
                                    </GridCol>
                                </GridRow>
                            ))}
                        </>
                    ) : (
                        <TextBody className={classNames({ [styles.documentsLinkMargin]: !!infoData?.meetingAttachments?.length })}>
                            {t('meetings.noDocumentsLinkAttached')}
                        </TextBody>
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
                    {ability.can(Actions.SEE_SUMMARIZE_LINK, Subject.MEETING) ? (
                        <SummarizeLink />
                    ) : ability.can(Actions.SEE_CANCELED_STATE, Subject.MEETING) ? (
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
            <div ref={wrapperRef} />
            <MutationFeedback
                success={isActionSuccess.value}
                error={error}
                successMessage={
                    isActionSuccess.additionalInfo?.type === 'summarizeLink'
                        ? t('meetings.summarizeSuccess')
                        : t('mutationFeedback.successfulUpdated')
                }
            />

            <div className={headerStyles.headerDiv}>
                <TextHeading size="XL">{infoData?.name}</TextHeading>

                <Can I={Actions.EDIT} a={Subject.MEETING}>
                    <ButtonPopup
                        buttonLabel={t('meetings.actions')}
                        popupPosition="right"
                        popupContent={(closePopup) => (
                            <div className={classNames(styles.actions, headerStyles.buttonLinksDiv)}>
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
                                    aria-haspopup="dialog"
                                />
                            </div>
                        )}
                    />
                </Can>
            </div>
            <InformationGridRow label={t('meetings.date')} value={formatDateTimeForDefaultValue(infoData?.beginDate || '', 'dd.MM.yyyy')} hideIcon />
            <InformationGridRow label={t('meetings.start')} value={formatDateTimeForDefaultValue(infoData?.beginDate || '', 'HH:mm')} hideIcon />
            <InformationGridRow label={t('meetings.end')} value={formatDateTimeForDefaultValue(infoData?.endDate || '', 'HH:mm')} hideIcon />
            <InformationGridRow label={t('meetings.place')} value={infoData?.place} hideIcon />

            {ability.can(Actions.SEE_PARTICIPATION_TO, Subject.MEETING) ? (
                <>
                    <QueryFeedback loading={participateLoading} withChildren>
                        {editParticipate && !token ? (
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
                                {token && participation ? (
                                    <TextBody>{t(`meetings.voteValue.${participation}`)}</TextBody>
                                ) : (
                                    <TextBody>{t(`meetings.voteValue.${userIsParticipate}`)}</TextBody>
                                )}

                                {isMeetingFuture && !token && !participation && (
                                    <Button label={t('meetings.changeVote')} onClick={() => setEditParticipate(true)} />
                                )}
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
