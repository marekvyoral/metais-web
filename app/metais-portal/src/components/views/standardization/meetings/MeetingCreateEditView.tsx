import { BreadCrumbs, Button, ButtonGroupRow, ButtonLink, GridCol, GridRow, HomeIcon, Input, TextHeading } from '@isdd/idsk-ui-kit/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { formatDateForDefaultValue, formatDateTimeForDefaultValue } from '@isdd/metais-common/componentHelpers/formatting/formatDateUtils'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import { yupResolver } from '@hookform/resolvers/yup'
import { QueryFeedback } from '@isdd/metais-common/index'

import styles from './createEditView.module.scss'
import { MeetingFormEnum, createMeetingSchema, editMeetingSchema } from './meetingSchema'
import { MeetingExternalActorsForm } from './MeetingExternalActorsForm'
import { MeetingReasonModal } from './MeetingReasonModal'
import { MeetingProposalsGroup } from './MeetingProposalsGroup'
import { SelectMeetingGroupWithActors } from './SelectMeetingGroupWithActors'
import { MeetingProposalsModal } from './MeetingProposalsModal'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { IMeetingEditViewParams } from '@/components/containers/standardization/meetings/MeetingEditContainer'

export const MeetingCreateEditView: React.FC<IMeetingEditViewParams> = ({ onSubmit, goBack, infoData, isEdit, isLoading, isError }) => {
    const { t } = useTranslation()
    const formRef = useRef<HTMLFormElement>(null)

    // const fileUploadRef = useRef<IFileUploadRef>(null)

    // const mapUploadedFilesToApiAttachment = (uploadData: FileUploadData[]): standards.ApiAttachment[] => {
    //     const filteredFilesUploadData = uploadData.filter((ud) => !ud.hasError)
    //     const apiAttachmentData = new Array<FileUploadData>(...filteredFilesUploadData).map((uploadedData) => {
    //         return {
    //             attachmentId: uploadedData.fileId,
    //             attachmentName: uploadedData.fileName,
    //             attachmentSize: uploadedData.fileSize,
    //             attachmentType: uploadedData.fileType,
    //             attachmentDescription: '',
    //         }
    //     })
    //     return apiAttachmentData
    // }
    // const handleUploadSuccess = (data: FileUploadData[]) => {
    //     const attachmentsData = mapUploadedFilesToApiAttachment(data)
    //     //callApi(formDataRef.current, attachmentsData)
    // }
    const [selectedProposals, setSelectedProposals] = useState(infoData?.standardRequestIds?.map((o) => o.toString()) ?? [])
    const [modalOpenProposal, setModalOpenProposal] = useState(false)
    const openModalProposal = () => {
        setModalOpenProposal(true)
    }
    const onCloseProposal = () => {
        setModalOpenProposal(false)
    }
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
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(isEdit ? editMeetingSchema(t) : createMeetingSchema(t)),
    })
    const meetingDescription = watch(MeetingFormEnum.DESCRIPTION)
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'meetingExternalActors',
    })

    const submit = () => {
        handleSubmit((d) => {
            onSubmit(d)
        })()
    }

    useEffect(() => {
        setValue(MeetingFormEnum.DESCRIPTION, infoData?.description || '')
        setValue(
            MeetingFormEnum.MEETING_ACTORS,
            infoData?.meetingActors?.map((actor) => ({
                userId: actor.userId,
                groupId: actor.groupId,
                userRoleId: actor.userRoleId,
                userOrgId: actor.userOrgId,
            })) || [],
        )
        setValue(
            MeetingFormEnum.MEETING_EXTERNAL_ACTORS,
            infoData?.meetingExternalActors?.map((actor) => ({
                name: actor.name || '',
                email: actor.email || '',
                description: actor.description || '',
            })) || [],
        )
        setValue(MeetingFormEnum.GROUP, infoData?.groups || [])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
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
                <QueryFeedback loading={isLoading} error={isError} withChildren>
                    <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                        <TextHeading size="L">{t('meetings.form.heading.dateTime')}</TextHeading>
                        <Input
                            label={`${t('meetings.form.name')} (${t('meetings.mandatory')}):`}
                            id={MeetingFormEnum.NAME}
                            error={errors[MeetingFormEnum.NAME]?.message}
                            {...register(MeetingFormEnum.NAME, { value: infoData?.name })}
                        />
                        <GridRow>
                            <GridCol setWidth="one-half">
                                <Input
                                    label={`${t('meetings.form.date')} (${t('meetings.mandatory')}):`}
                                    type="date"
                                    id={MeetingFormEnum.DATE}
                                    error={errors[MeetingFormEnum.DATE]?.message}
                                    {...register(MeetingFormEnum.DATE, { value: formatDateForDefaultValue(infoData?.beginDate ?? '') })}
                                />
                            </GridCol>
                            <GridCol setWidth="one-quarter">
                                <Input
                                    label={`${t('meetings.form.timeStart')} (${t('meetings.mandatory')}):`}
                                    type="time"
                                    id={MeetingFormEnum.TIME_START}
                                    error={errors[MeetingFormEnum.TIME_START]?.message}
                                    {...register(MeetingFormEnum.TIME_START, {
                                        value: formatDateTimeForDefaultValue(infoData?.beginDate ?? '', 'HH:mm'),
                                    })}
                                />
                            </GridCol>
                            <GridCol setWidth="one-quarter">
                                <Input
                                    label={`${t('meetings.form.timeEnd')} (${t('meetings.mandatory')}):`}
                                    type="time"
                                    id={MeetingFormEnum.TIME_END}
                                    error={errors[MeetingFormEnum.TIME_END]?.message}
                                    {...register(MeetingFormEnum.TIME_END, {
                                        value: formatDateTimeForDefaultValue(infoData?.endDate ?? '', 'HH:mm'),
                                    })}
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
                        <SelectMeetingGroupWithActors groupDefaultValue={infoData} setValue={setValue} watch={watch} errors={errors} />
                        <TextHeading size="M">{t('meetings.form.heading.externalActors')}</TextHeading>

                        {fields?.map((actor, index) => (
                            <MeetingExternalActorsForm
                                key={actor?.id}
                                meetingActor={actor ?? {}}
                                index={index}
                                register={register}
                                remove={remove}
                                errors={errors}
                            />
                        ))}
                        <ButtonLink
                            label={t('meetings.form.addExternalActors')}
                            className={styles.buttonLinkWithIcon}
                            type="button"
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
                            id={MeetingFormEnum.DESCRIPTION}
                            name={MeetingFormEnum.DESCRIPTION}
                            label={`${t('meetings.form.program')} (${t('meetings.mandatory')}):`}
                            info={'info'}
                            value={meetingDescription}
                            defaultValue={infoData?.description}
                            error={errors[MeetingFormEnum.DESCRIPTION]?.message} // value: <p><br/></p> (on edit)
                            onChange={(text) => setValue(MeetingFormEnum.DESCRIPTION, text)}
                        />
                        <MeetingProposalsGroup
                            setValue={setValue}
                            selectedProposals={selectedProposals}
                            setSelectedProposals={setSelectedProposals}
                            openModalProposal={openModalProposal}
                        />
                        <TextHeading size="L">{t('meetings.form.heading.documents')}</TextHeading>
                        <TextHeading size="M">{t('meetings.form.heading.documentsDetail')}</TextHeading>

                        {/* <LinksImport defaultValues={infoData?.meetingLinks} register={register} errors={formState.errors} /> */}
                        <TextHeading size="M">{t('meetings.form.heading.documentsExport')}</TextHeading>
                        {/* <FileUpload
                        ref={fileUploadRef}
                        allowedFileTypes={['.txt', '.rtf', '.pdf', '.doc', '.docx', '.xcl', '.xclx', '.jpg', '.png', '.gif']}
                        multiple
                        isUsingUuidInFilePath
                        onUploadSuccess={handleUploadSuccess}
                    /> */}
                        {isEdit ? (
                            <>
                                <ButtonGroupRow>
                                    <Button label={t('form.cancel')} type="reset" variant="secondary" onClick={goBack} />
                                    <Button label={t('form.submit')} onClick={openModalReason} />
                                </ButtonGroupRow>
                                <MeetingReasonModal
                                    isOpen={modalOpenReason}
                                    close={onCloseReason}
                                    meetingName={infoData?.name ?? ''}
                                    submit={submit}
                                    register={register}
                                    watch={watch}
                                />
                            </>
                        ) : (
                            <>
                                <ButtonGroupRow>
                                    <Button label={t('form.cancel')} type="reset" variant="secondary" onClick={goBack} />
                                    <Button label={t('form.submit')} type="submit" />
                                </ButtonGroupRow>
                            </>
                        )}
                    </form>
                    <MeetingProposalsModal
                        isOpen={modalOpenProposal}
                        close={onCloseProposal}
                        setSelectedProposals={setSelectedProposals}
                        selectedProposals={selectedProposals}
                    />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
