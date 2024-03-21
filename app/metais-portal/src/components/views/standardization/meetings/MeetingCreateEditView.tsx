import { BreadCrumbs, Button, ButtonGroupRow, ButtonLink, ErrorBlock, GridCol, GridRow, HomeIcon, Input, TextHeading } from '@isdd/idsk-ui-kit/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect, useRef, useState } from 'react'
import { FieldValues, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { formatDateTimeForAPI, formatDateTimeForDefaultValue } from '@isdd/metais-common/componentHelpers/formatting/formatDateUtils'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import { yupResolver } from '@hookform/resolvers/yup'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FileUpload } from '@isdd/metais-common/components/FileUpload/FileUpload'
import { formatTitleString } from '@isdd/metais-common/utils/utils'
import { RefAttributesRefType } from '@isdd/metais-common/api/generated/dms-swagger'
import { DateInput, DateTypeEnum } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { useNavigate } from 'react-router-dom'

import styles from './createEditView.module.scss'
import { MeetingFormEnum, createMeetingSchema, editMeetingSchema } from './meetingSchema'
import { MeetingExternalActorsForm } from './MeetingExternalActorsForm'
import { MeetingReasonModal } from './MeetingReasonModal'
import { MeetingProposalsGroup } from './MeetingProposalsGroup'
import { SelectMeetingGroupWithActors } from './SelectMeetingGroupWithActors'
import { MeetingProposalsModal } from './MeetingProposalsModal'

import {
    ExistingFileData,
    ExistingFilesHandler,
} from '@/components/views/standardization/votes/VoteComposeForm/components/ExistingFilesHandler/ExistingFilesHandler'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { IMeetingEditViewParams } from '@/components/containers/standardization/meetings/MeetingEditContainer'
import { LinksImport } from '@/components/LinksImport/LinksImport'

export const MeetingCreateEditView: React.FC<IMeetingEditViewParams> = ({
    onSubmit,
    infoData,
    isEdit,
    isLoading,
    isError,
    fileUploadRef,
    existingFilesProcessRef,
    handleDeleteSuccess,
    handleUploadSuccess,
    id,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const titleDetailName = infoData?.name ? `- ${infoData?.name}` : ''
    document.title = formatTitleString(`${isEdit ? t('meetings.editMeeting') : t('meetings.addNewMeeting')} ${titleDetailName}`)

    const formRef = useRef<HTMLFormElement>(null)
    const formDataRef = useRef<FieldValues>([])
    //files

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

    // forms
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        unregister,
        formState: { errors, isSubmitted, isValid },
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
            [MeetingFormEnum.BEGIN_DATE]: formatDateTimeForDefaultValue(infoData?.beginDate ?? ''),
            [MeetingFormEnum.END_DATE]: formatDateTimeForDefaultValue(infoData?.endDate ?? ''),
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
        onSubmit(data, [])
    }

    const submit = () => {
        handleSubmit((data) => {
            callSubmit(data)
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
        setValue(MeetingFormEnum.BEGIN_DATE, formatDateTimeForAPI(infoData?.beginDate ?? ''))
        setValue(MeetingFormEnum.END_DATE, formatDateTimeForAPI(infoData?.endDate ?? ''))
        setValue(MeetingFormEnum.PLACE, infoData?.place || '')
        setSelectedProposals(infoData?.standardRequestIds?.map((o) => o.toString()) ?? [])
    }, [infoData, setValue])

    const startDate = watch(MeetingFormEnum.BEGIN_DATE)
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
                    {isSubmitted && !isValid && <ErrorBlock errorTitle={t('formErrors')} hidden />}

                    <form onSubmit={handleSubmit(callSubmit)} ref={formRef} noValidate>
                        <TextHeading size="L">{t('meetings.form.heading.dateTime')}</TextHeading>
                        <Input
                            label={`${t('meetings.form.name')} (${t('meetings.mandatory')}):`}
                            id={MeetingFormEnum.NAME}
                            error={errors[MeetingFormEnum.NAME]?.message}
                            {...register(MeetingFormEnum.NAME, { value: infoData?.name })}
                        />
                        <GridRow>
                            <GridCol setWidth="one-half">
                                <DateInput
                                    label={`${t('meetings.start')} (${t('meetings.mandatory')}):`}
                                    id={MeetingFormEnum.BEGIN_DATE}
                                    error={errors[MeetingFormEnum.BEGIN_DATE]?.message}
                                    {...register(MeetingFormEnum.BEGIN_DATE, { value: formatDateTimeForAPI(infoData?.beginDate ?? '') })}
                                    control={control}
                                    setValue={setValue}
                                    type={DateTypeEnum.DATETIME}
                                />
                            </GridCol>
                            <GridCol setWidth="one-half">
                                <DateInput
                                    disabled={!startDate}
                                    label={`${t('meetings.end')} (${t('meetings.mandatory')}):`}
                                    id={MeetingFormEnum.END_DATE}
                                    error={errors[MeetingFormEnum.END_DATE]?.message}
                                    {...register(MeetingFormEnum.END_DATE, { value: formatDateTimeForAPI(infoData?.endDate ?? '') })}
                                    control={control}
                                    setValue={setValue}
                                    type={DateTypeEnum.DATETIME}
                                    maxDate={new Date(startDate)}
                                    minDate={new Date(startDate)}
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

                        <LinksImport
                            defaultValues={infoData?.meetingLinks ?? []}
                            register={register}
                            unregister={unregister}
                            watch={watch}
                            errors={errors}
                        />

                        <TextHeading size="M">{t('meetings.form.heading.documentsExport')}</TextHeading>
                        <FileUpload
                            ref={fileUploadRef}
                            allowedFileTypes={['.txt', '.rtf', '.pdf', '.doc', '.docx', '.xcl', '.xclx', '.jpg', '.png', '.gif']}
                            multiple
                            isUsingUuidInFilePath
                            refType={RefAttributesRefType.MEETING_REQUEST}
                            refId={id?.toString()}
                            onUploadSuccess={handleUploadSuccess}
                        />
                        {infoData?.meetingAttachments && infoData?.meetingAttachments.length > 0 && (
                            <ExistingFilesHandler
                                existingFiles={
                                    infoData?.meetingAttachments?.map<ExistingFileData>((attachment) => {
                                        return {
                                            fileId: attachment.attachmentId,
                                            fileName: attachment.attachmentName,
                                        }
                                    }) ?? []
                                }
                                ref={existingFilesProcessRef}
                                onFilesProcessingSuccess={handleDeleteSuccess}
                            />
                        )}
                        {isEdit ? (
                            <>
                                <ButtonGroupRow>
                                    <Button
                                        label={t('form.cancel')}
                                        type="reset"
                                        variant="secondary"
                                        onClick={() => navigate(`${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${infoData?.id}`)}
                                    />
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
                                    <Button
                                        label={t('form.cancel')}
                                        type="reset"
                                        variant="secondary"
                                        onClick={() => navigate(NavigationSubRoutes.ZOZNAM_ZASADNUTI)}
                                    />
                                    <Button label={t('meetings.form.createBtn')} type="submit" />
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
