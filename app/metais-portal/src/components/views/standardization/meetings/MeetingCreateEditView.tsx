import { BreadCrumbs, Button, ButtonGroupRow, ButtonLink, GridCol, GridRow, HomeIcon, Input, TextHeading } from '@isdd/idsk-ui-kit/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import { formatDateForDefaultValue, formatDateTimeForDefaultValue } from '@isdd/metais-common/componentHelpers/formatting/formatDateUtils'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'

import styles from './createEditView.module.scss'
import { createMeetingSchema, editMeetingSchema, MeetingFormEnum } from './meetingSchema'
import { SelectMeetingGroup } from './SelectMeetingGroup'
import { SelectMeetingActor } from './SelectMeetingActor'
import { SelectMeetingProposals } from './SelectMeetingProposals'
import { MeetingExternalActorsForm } from './MeetingExternalActorsForm'
import { MeetingProposalsModal } from './MeetingProposalsModal'
import { MeetingReasonModal } from './MeetingReasonModal'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { IMeetingEditViewParams } from '@/components/containers/standardization/meetings/MeetingEditContainer'

export const MeetingCreateEditView: React.FC<IMeetingEditViewParams> = ({ onSubmit, goBack, infoData, isEdit }) => {
    const { t } = useTranslation()
    const formRef = useRef<HTMLFormElement>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const openModal = () => {
        setModalOpen(true)
    }
    const onClose = () => {
        setModalOpen(false)
    }
    const [selectedProposals, setSelectedProposals] = useState(infoData?.standardRequestsNames ?? [])
    const [modalOpenReason, setModalOpenReason] = useState(false)
    const openModalReason = () => {
        setModalOpenReason(true)
    }
    const onCloseReason = () => {
        setModalOpenReason(false)
    }
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(isEdit ? editMeetingSchema(t) : createMeetingSchema(t)),
        defaultValues: {
            meetingExternalActors: [
                {
                    name: '',
                    email: '',
                    description: '',
                },
            ],
        },
    })
    const { fields, append } = useFieldArray({
        control,
        name: 'meetingExternalActors',
    })

    const submit = () => {
        // console.log('submit')
        handleSubmit((d) => {
            // console.log('handleSubmit')
            onSubmit(d)
        })()
    }

    return (
        <>
            {!isEdit && (
                <BreadCrumbs
                    withWidthContainer
                    links={[
                        { href: RouteNames.HOME, label: t('notifications.home'), icon: HomeIcon },
                        { href: RouteNames.HOW_TO_STANDARDIZATION, label: t('navMenu.standardization') },
                        { href: NavigationSubRoutes.ZOZNAM_ZASADNUTI, label: t('navMenu.lists.meetings') },
                        {
                            href: NavigationSubRoutes.ZOZNAM_ZASADNUTI_CREATE,
                            label: t('meetings.addNewMeeting'),
                        },
                    ]}
                />
            )}
            {isEdit && (
                <>
                    <BreadCrumbs
                        withWidthContainer
                        links={[
                            { href: RouteNames.HOME, label: t('notifications.home'), icon: HomeIcon },
                            { href: RouteNames.HOW_TO_STANDARDIZATION, label: t('navMenu.standardization') },
                            { href: NavigationSubRoutes.ZOZNAM_ZASADNUTI, label: t('navMenu.lists.meetings') },
                            { href: `${NavigationSubRoutes.ZOZNAM_ZASADNUTI_DETAIL}/${infoData?.id}`, label: `${infoData?.name}` },
                            {
                                href: `${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${infoData?.id}/edit`,
                                label: t('meetings.editMeeting'),
                            },
                        ]}
                    />
                </>
            )}
            <MainContentWrapper>
                <TextHeading size="XL">{isEdit ? `${t('meetings.editMeeting')} - ${infoData?.name}` : t('meetings.addNewMeeting')}</TextHeading>
                <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <TextHeading size="L">{t('meetings.form.heading.dateTime')}</TextHeading>
                    <Input
                        label={`${t('meetings.form.name')} (${t('meetings.mandatory')}):`}
                        id={MeetingFormEnum.NAME}
                        {...register(MeetingFormEnum.NAME, { value: infoData?.name })}
                        error={errors[MeetingFormEnum.NAME]?.message}
                    />
                    <GridRow>
                        <GridCol setWidth="one-half">
                            <Input
                                label={`${t('meetings.form.date')} (${t('meetings.mandatory')}):`}
                                type="date"
                                id={MeetingFormEnum.DATE}
                                {...register(MeetingFormEnum.DATE, { value: formatDateForDefaultValue(infoData?.beginDate ?? '') })}
                                error={errors[MeetingFormEnum.DATE]?.message}
                            />
                        </GridCol>
                        <GridCol setWidth="one-quarter">
                            <Input
                                label={`${t('meetings.form.timeStart')} (${t('meetings.mandatory')}):`}
                                type="time"
                                id={MeetingFormEnum.TIME_START}
                                {...register(MeetingFormEnum.TIME_START, {
                                    value: formatDateTimeForDefaultValue(infoData?.beginDate ?? '', 'HH:mm'),
                                })}
                                error={errors[MeetingFormEnum.TIME_START]?.message}
                            />
                        </GridCol>
                        <GridCol setWidth="one-quarter">
                            <Input
                                label={`${t('meetings.form.timeEnd')} (${t('meetings.mandatory')}):`}
                                type="time"
                                id={MeetingFormEnum.TIME_END}
                                {...register(MeetingFormEnum.TIME_END, { value: formatDateTimeForDefaultValue(infoData?.endDate ?? '', 'HH:mm') })}
                                error={errors[MeetingFormEnum.TIME_END]?.message}
                            />
                        </GridCol>
                    </GridRow>
                    <Input
                        label={`${t('meetings.form.place')} (${t('meetings.mandatory')}):`}
                        id={MeetingFormEnum.PLACE}
                        {...register(MeetingFormEnum.PLACE, { value: infoData?.place })}
                        error={errors[MeetingFormEnum.PLACE]?.message}
                    />
                    <TextHeading size="L">{t('meetings.form.heading.actors')}</TextHeading>
                    <SelectMeetingGroup
                        label={`${t('meetings.form.group')} (${t('meetings.mandatory')}):`}
                        id={MeetingFormEnum.GROUP}
                        meetingGroups={infoData?.groups ?? []}
                    />
                    <SelectMeetingActor
                        id={MeetingFormEnum.MEETING_ACTORS}
                        label={`${t('meetings.form.meetingActors')} (${t('meetings.mandatory')}):`}
                        meetingActors={infoData?.meetingActors ?? []}
                    />
                    <TextHeading size="M">{t('meetings.form.heading.externalActors')}</TextHeading>

                    {fields?.map((actor, index) => (
                        <MeetingExternalActorsForm key={actor?.id} meetingActor={actor ?? {}} index={index} />
                    ))}
                    <ButtonLink
                        label={t('meetings.form.addExternalActors')}
                        className={styles.buttonLinkWithIcon}
                        onClick={() => {
                            append({
                                name: '',
                                email: '',
                                description: '',
                            })
                        }}
                    />
                    <TextHeading size="L">{t('meetings.form.heading.program')}</TextHeading>
                    <RichTextQuill
                        name={t('meetings.form.program')}
                        label={`${t('meetings.form.program')} (${t('meetings.mandatory')}):`}
                        info={'info'}
                        id="meeting"
                    />
                    <GridRow className={styles.proposalsButtonGridRow}>
                        <GridCol setWidth="two-thirds" className={styles.proposalsButtonGrid}>
                            <SelectMeetingProposals
                                meetingProposals={selectedProposals}
                                id={MeetingFormEnum.MEETING_PROPOSAL}
                                label={`${t('meetings.form.proposalsSelect')}:`}
                                setSelectedProposals={setSelectedProposals}
                            />
                        </GridCol>
                        <GridCol setWidth="one-third" className={styles.proposalsButtonGrid}>
                            <Button
                                variant="secondary"
                                label={t('meetings.form.proposalsButton')}
                                onClick={openModal}
                                className={styles.proposalsButton}
                            />
                            <MeetingProposalsModal
                                isOpen={modalOpen}
                                close={onClose}
                                setSelectedProposals={setSelectedProposals}
                                selectedProposals={selectedProposals}
                            />
                        </GridCol>
                    </GridRow>
                    <TextHeading size="L">{t('meetings.form.heading.documents')}</TextHeading>
                    <TextHeading size="M">{t('meetings.form.heading.documentsDetail')}</TextHeading>
                    <TextHeading size="M">{t('meetings.form.heading.documentsExport')}</TextHeading>
                    <ButtonGroupRow>
                        <Button label={t('form.cancel')} type="reset" variant="secondary" onClick={goBack} />
                        <Button label={t('form.submit')} onClick={openModalReason} />
                    </ButtonGroupRow>
                    <MeetingReasonModal isOpen={modalOpenReason} close={onCloseReason} meetingName={infoData?.name ?? ''} submit={submit} />
                </form>
            </MainContentWrapper>
        </>
    )
}
