import { BreadCrumbs, Button, ButtonGroupRow, ButtonLink, GridCol, GridRow, HomeIcon, Input, TextHeading } from '@isdd/idsk-ui-kit/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FieldValues, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { formatDateForDefaultValue, formatDateTimeForDefaultValue } from '@isdd/metais-common/componentHelpers/formatting/formatDateUtils'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import { yupResolver } from '@hookform/resolvers/yup'
import { QueryFeedback } from '@isdd/metais-common/index'
import { ApiAttachment } from '@isdd/metais-common/api/generated/standards-swagger'
import { FileUpload, FileUploadData, IFileUploadRef } from '@isdd/metais-common/components/FileUpload/FileUpload'
import { v4 as uuidV4 } from 'uuid'
import { formatTitleString } from '@isdd/metais-common/utils/utils'

import styles from './createEditView.module.scss'
import { MeetingFormEnum, createMeetingSchema, editMeetingSchema } from './meetingSchema'
import { MeetingExternalActorsForm } from './MeetingExternalActorsForm'
import { MeetingReasonModal } from './MeetingReasonModal'
import { MeetingProposalsGroup } from './MeetingProposalsGroup'
import { SelectMeetingGroupWithActors } from './SelectMeetingGroupWithActors'
import { MeetingProposalsModal } from './MeetingProposalsModal'

import {
    mapProcessedExistingFilesToApiAttachment,
    mapUploadedFilesToApiAttachment,
} from '@/components/views/standardization/votes/VoteComposeForm/functions/voteEditFunc'
import {
    ExistingFileData,
    ExistingFilesHandler,
    IExistingFilesHandlerRef,
} from '@/components/views/standardization/votes/VoteComposeForm/components/ExistingFilesHandler/ExistingFilesHandler'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { IMeetingEditViewParams } from '@/components/containers/standardization/meetings/MeetingEditContainer'
import { LinksImport } from '@/components/LinksImport/LinksImport'

export const MeetingCreateEditView: React.FC<IMeetingEditViewParams> = ({ onSubmit, goBack, infoData, isEdit, isLoading, isError }) => {
    const { t } = useTranslation()
    document.title = formatTitleString(`${t('meetings.editMeeting')} - ${infoData?.name}`)

    const formRef = useRef<HTMLFormElement>(null)
    //files
    const fileUploadRef = useRef<IFileUploadRef>(null)
    const formDataRef = useRef<FieldValues>([])
    const existingFilesProcessRef = useRef<IExistingFilesHandlerRef>(null)
    const attachmentsDataRef = useRef<ApiAttachment[]>([])

    const [selectedProposals, setSelectedProposals] = useState(infoData?.standardRequestIds?.map((o) => o.toString()) ?? [])
    // modals
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
    // files
    const handleUploadData = useCallback(() => {
        fileUploadRef.current?.startUploading()
    }, [])
    const handleDeleteFiles = () => {
        existingFilesProcessRef?.current?.startFilesProcessing()
    }
    const handleDeleteSuccess = () => {
        onSubmit(
            formDataRef.current,
            attachmentsDataRef.current.concat(
                mapProcessedExistingFilesToApiAttachment(existingFilesProcessRef.current?.getRemainingFileList() ?? []),
            ),
        )
    }
    // forms
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        unregister,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(isEdit ? editMeetingSchema(t) : createMeetingSchema(t)),
        defaultValues: {
            [MeetingFormEnum.DESCRIPTION]: infoData?.description || '',
            [MeetingFormEnum.MEETING_ACTORS]:
                infoData?.meetingActors?.map((actor) => ({
                    userId: actor.userId,
                    groupId: actor.groupId,
                    userRoleId: actor.userRoleId,
                    userOrgId: actor.userOrgId,
                })) || [],
            [MeetingFormEnum.MEETING_EXTERNAL_ACTORS]:
                infoData?.meetingExternalActors?.map((actor) => ({
                    name: actor.name || '',
                    email: actor.email || '',
                    description: actor.description || '',
                })) || [],
            [MeetingFormEnum.GROUP]: infoData?.groups || [],
            [MeetingFormEnum.NAME]: infoData?.name || '',
            [MeetingFormEnum.DATE]: formatDateForDefaultValue(infoData?.beginDate ?? ''),
            [MeetingFormEnum.TIME_START]: formatDateTimeForDefaultValue(infoData?.beginDate ?? '', 'HH:mm'),
            [MeetingFormEnum.TIME_END]: formatDateTimeForDefaultValue(infoData?.endDate ?? '', 'HH:mm'),
            [MeetingFormEnum.PLACE]: infoData?.place || '',
            [MeetingFormEnum.MEETING_LINKS]:
                infoData?.meetingLinks?.map((link) => ({
                    id: link.id,
                    linkDescription: link.linkDescription,
                    linkSize: link.linkSize,
                    linkType: link.linkType,
                    url: link.url,
                })) || [],
        },
    })
    const meetingDescription = watch(MeetingFormEnum.DESCRIPTION)

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'meetingExternalActors',
    })

    const callSubmit = (data: FieldValues) => {
        formDataRef.current = { ...data }
        if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
            handleUploadData()
            return
        }
        if (existingFilesProcessRef.current?.hasDataToProcess()) {
            handleDeleteFiles()
            return
        }

        onSubmit(data, [])
    }
    const submit = () => {
        handleSubmit((data) => {
            callSubmit(data)
        })()
    }
    const handleUploadSuccess = (data: FileUploadData[]) => {
        const attachmentsData = mapUploadedFilesToApiAttachment(data)
        if (existingFilesProcessRef.current?.hasDataToProcess()) {
            attachmentsDataRef.current = attachmentsData
            handleDeleteFiles()
        } else {
            onSubmit(formDataRef.current, attachmentsData)
        }
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
        setValue(
            MeetingFormEnum.MEETING_LINKS,
            infoData?.meetingLinks?.map((link) => ({
                id: link.id,
                linkDescription: link.linkDescription,
                linkSize: link.linkSize,
                linkType: link.linkType,
                url: link.url,
            })) || [],
        )
        setValue(MeetingFormEnum.GROUP, infoData?.groups || [])
        setValue(MeetingFormEnum.NAME, infoData?.name || '')
        setValue(MeetingFormEnum.DATE, formatDateForDefaultValue(infoData?.beginDate ?? ''))
        setValue(MeetingFormEnum.TIME_START, formatDateTimeForDefaultValue(infoData?.beginDate ?? '', 'HH:mm'))
        setValue(MeetingFormEnum.TIME_END, formatDateTimeForDefaultValue(infoData?.endDate ?? '', 'HH:mm'))
        setValue(MeetingFormEnum.PLACE, infoData?.place || '')
        setSelectedProposals(infoData?.standardRequestIds?.map((o) => o.toString()) ?? [])
    }, [infoData, setValue])

    const fileMetaAttributes = {
        'x-content-uuid': uuidV4(),
        refAttributes: new Blob(
            [
                JSON.stringify({
                    refType: 'STANDARD',
                }),
            ],
            { type: 'application/json' },
        ),
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
                <QueryFeedback loading={isLoading} error={isError} withChildren>
                    <form onSubmit={handleSubmit(callSubmit)} ref={formRef}>
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

                        <LinksImport defaultValues={infoData?.meetingLinks ?? []} register={register} unregister={unregister} errors={errors} />

                        <TextHeading size="M">{t('meetings.form.heading.documentsExport')}</TextHeading>
                        <FileUpload
                            ref={fileUploadRef}
                            allowedFileTypes={['.txt', '.rtf', '.pdf', '.doc', '.docx', '.xcl', '.xclx', '.jpg', '.png', '.gif']}
                            multiple
                            isUsingUuidInFilePath
                            fileMetaAttributes={fileMetaAttributes}
                            onUploadSuccess={handleUploadSuccess}
                        />
                        <ExistingFilesHandler
                            existingFiles={
                                infoData?.meetingAttachments?.map<ExistingFileData>((attachment) => {
                                    return {
                                        fileId: attachment.attachmentId,
                                        fileName: attachment.attachmentName,
                                        fileSize: attachment.attachmentSize,
                                        fileType: attachment.attachmentType,
                                    }
                                }) ?? []
                            }
                            ref={existingFilesProcessRef}
                            onFilesProcessingSuccess={handleDeleteSuccess}
                        />
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
