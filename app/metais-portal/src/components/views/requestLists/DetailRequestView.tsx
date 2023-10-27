/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    BreadCrumbs,
    Button,
    ButtonGroupRow,
    ButtonLink,
    ButtonPopup,
    CheckBox,
    ExpandableRowCellWrapper,
    GridCol,
    GridRow,
    HomeIcon,
    Input,
    SelectLazyLoading,
    Table,
    TextArea,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import { ActionsOverTable, QueryFeedback, useGetRoleParticipantHook } from '@isdd/metais-common/index'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { DEFAULT_PAGESIZE_OPTIONS, RequestListState } from '@isdd/metais-common/constants'
import { ExpandedState, Row } from '@tanstack/react-table'
import { RequestListActions } from '@isdd/metais-common/hooks/permissions/useRequestPermissions'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

import { getName } from '@/components/views/codeLists/CodeListDetailUtils'
import { ImportCodeListModal } from '@/components/views/codeLists/components/modals/ImportCodeListModal/ImportCodeListModal'
import { ExportCodeListModal } from '@/components/views/codeLists/components/modals/ExportCodeListModal/ExportCodeListModal'
import { ConfirmModal } from '@/components/views/requestLists/components/modalItem/ConfirmModal'
import { RequestDetailItemsTableExpandedRow } from '@/components/views/requestLists/components/RequestDetailItemsTableExpandedRow'
import { IItemForm } from '@/components/views/requestLists/components/modalItem/ModalItem'
import styles from '@/components/views/requestLists/requestView.module.scss'
import { useCreateRequestSchema } from '@/components/views/requestLists/useRequestSchemas'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { IRequestForm, mapToCodeListDetail } from '@/componentHelpers/requests'
import { DetailRequestViewProps, RequestActions, RequestState } from '@/components/containers/DetailRequestContainer'

export interface ICodeItem {
    id: string
    value?: string
    language?: string
    effectiveFrom?: string
    effectiveTo?: string
}

export interface IOption {
    poName?: string
    poUUID?: string
}

export interface INoteRow {
    id: number
    text: string
}

export enum RequestFormEnum {
    BASE = 'base',
    CODELISTNAME = 'codeListName',
    CODELISTID = 'codeListId',
    RESORTCODE = 'resortCode',
    MAINGESTOR = 'mainGestor',
    REFINDICATOR = 'refIndicator',
    NOTES = 'notes',
    NAME = 'name',
    LASTNAME = 'lastName',
    PHONE = 'phone',
    EMAIL = 'email',
    CODELISTS = 'codeLists',
    VALIDDATE = 'validDate',
    EFFECTIVEFROM = 'effectiveFrom',
}

export const DetailRequestView: React.FC<DetailRequestViewProps> = ({
    data,
    actions,
    isError,
    isLoading,
    entityName,
    attributeProfile,
    loadOptions,
    requestId,
    onAccept,
}) => {
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const { schema } = useCreateRequestSchema()
    const userAbility = useAbilityContext()

    const [notes, setNotes] = useState<INoteRow[]>([{ id: 0, text: '' }])
    const [codeList, setCodeList] = useState<IItemForm[]>([])
    const [isErrorParticipant, setErrorParticipant] = useState<boolean>(false)
    const [confirmationModal, setConfirmationModal] = useState<{ action: RequestState; isOpen: boolean; title: string; description: string }>({
        action: RequestState.DRAFT,
        isOpen: false,
        title: '',
        description: '',
    })
    const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false)
    const [defaultSelectOrg, setDefaultSelectOrg] = useState<IOption>()
    const [expanded, setExpanded] = useState<ExpandedState>({})
    const { register, formState, setValue } = useForm<IRequestForm>({
        resolver: yupResolver(schema),
        defaultValues: data,
    })
    const getRoleParticipantHook = useGetRoleParticipantHook()

    useEffect(() => {
        if (data) {
            setCodeList(data.codeLists ?? [])
            setNotes(data.notes ?? [])

            getRoleParticipantHook(data?.gid ?? '')
                .then((res) => {
                    const val = {
                        poUUID: res?.gid,
                        poName: res?.configurationItemUi?.attributes?.['Gen_Profil_nazov'],
                    }

                    setValue(RequestFormEnum.MAINGESTOR, Array.isArray(val) ? val[0].poUUID : val.poUUID)
                    setDefaultSelectOrg(val)
                })
                .catch(() => {
                    setErrorParticipant(true)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('codeList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('codeList.breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('codeList.breadcrumbs.codeLists'), href: RouteNames.CODELISTS },
                    { label: t('codeList.breadcrumbs.requestList'), href: RouteNames.REQUESTLIST },
                    { label: data?.codeListId ?? '', href: `${RouteNames.REQUESTLIST}/${data?.codeListId}` },
                ]}
            />
            {userAbility.can(RequestListActions.SHOW, entityName) && (
                <MainContentWrapper>
                    <QueryFeedback loading={isLoading} error={isError || isErrorParticipant} withChildren>
                        <div className={styles.headerDiv}>
                            <TextHeading size="XL">{t('codeListList.requestTitle')}</TextHeading>
                            <ButtonGroupRow>
                                {actions.canEdit && (
                                    <Button
                                        label={t('codeListList.buttons.EDIT')}
                                        onClick={() => navigate(`${RouteNames.REQUESTLIST}/edit/${requestId}`, { state: location.state })}
                                    />
                                )}

                                <ButtonPopup
                                    buttonLabel={t('ciType.moreButton')}
                                    popupPosition="right"
                                    popupContent={() => {
                                        return (
                                            <div className={styles.buttonLinksDiv}>
                                                {actions.accept && (
                                                    <ButtonLink
                                                        onClick={() => {
                                                            setConfirmationModal({
                                                                action: RequestState.ACCEPT,
                                                                isOpen: true,
                                                                title: t('codeListList.requestModal.acceptTitle'),
                                                                description: t('codeListList.requestModal.acceptDesc'),
                                                            })
                                                        }}
                                                        label={t('codeListList.buttons.ACCEPT')}
                                                    />
                                                )}
                                                {actions.accept_SZZC && (
                                                    <ButtonLink
                                                        onClick={() => {
                                                            setConfirmationModal({
                                                                action: RequestState.ACCEPTSZZC,
                                                                isOpen: true,
                                                                title: t('codeListList.requestModal.acceptSzzcTitle'),
                                                                description: t('codeListList.requestModal.acceptSzzcDesc'),
                                                            })
                                                        }}
                                                        label={t('codeListList.buttons.ACCEPT_SZZC')}
                                                    />
                                                )}
                                                {actions.cancelRequest && (
                                                    <ButtonLink
                                                        onClick={() => {
                                                            setConfirmationModal({
                                                                action: RequestState.CANCEL,
                                                                isOpen: true,
                                                                title: t('codeListList.requestModal.cancelReqTitle'),
                                                                description: t('codeListList.requestModal.cancelReqDesc'),
                                                            })
                                                        }}
                                                        label={t('codeListList.buttons.CANCEL_REQUEST')}
                                                    />
                                                )}
                                                {actions.reject && (
                                                    <ButtonLink
                                                        onClick={() => {
                                                            setConfirmationModal({
                                                                action: RequestState.REJECT,
                                                                isOpen: true,
                                                                title: t('codeListList.requestModal.rejectRequestTitle'),
                                                                description: t('codeListList.requestModal.rejectRequestDesc'),
                                                            })
                                                        }}
                                                        label={t('codeListList.buttons.REJECT')}
                                                    />
                                                )}
                                                {actions.moveToKSISVS && (
                                                    <ButtonLink
                                                        onClick={() => {
                                                            setConfirmationModal({
                                                                action: RequestState.ACCEPTKSISVS,
                                                                isOpen: true,
                                                                title: t('codeListList.requestModal.acceptTitle'),
                                                                description: t('codeListList.requestModal.acceptDesc'),
                                                            })
                                                        }}
                                                        label={t('codeListList.buttons.MOVE_TO_KSISVS')}
                                                    />
                                                )}
                                                {actions.send && (
                                                    <ButtonLink
                                                        onClick={() => {
                                                            setConfirmationModal({
                                                                action: RequestState.SEND,
                                                                isOpen: true,
                                                                title: t('codeListList.requestModal.sendTitle'),
                                                                description: t('codeListList.requestModal.sendDesc'),
                                                            })
                                                        }}
                                                        label={t('codeListList.buttons.SEND')}
                                                    />
                                                )}
                                                <ButtonLink onClick={() => setIsExportModalOpen(true)} label={t('codeListList.buttons.EXPORT')} />
                                                <ButtonLink onClick={() => setIsImportModalOpen(true)} label={t('codeListList.buttons.IMPORT')} />
                                            </div>
                                        )
                                    }}
                                />
                            </ButtonGroupRow>
                        </div>
                        <form>
                            <div className={styles.bottomGap}>
                                <Tooltip
                                    descriptionElement={getName(attributeProfile, 'Gui_Profil_ZC_kod_polozky', i18n.language)}
                                    tooltipContent={() => (
                                        <CheckBox
                                            disabled
                                            label={t('codeListList.requestCreate.base')}
                                            id={RequestFormEnum.BASE}
                                            {...register(RequestFormEnum.BASE)}
                                            name={RequestFormEnum.BASE}
                                        />
                                    )}
                                />
                            </div>
                            <Input
                                disabled
                                label={t('codeListList.requestCreate.codeListName')}
                                id={RequestFormEnum.CODELISTNAME}
                                {...register(RequestFormEnum.CODELISTNAME)}
                                error={formState.errors[RequestFormEnum.CODELISTNAME]?.message}
                            />
                            <Input
                                disabled
                                label={t('codeListList.requestCreate.codeListId')}
                                id={RequestFormEnum.CODELISTID}
                                {...register(RequestFormEnum.CODELISTID)}
                                error={formState.errors[RequestFormEnum.CODELISTID]?.message}
                            />
                            <Input
                                disabled
                                label={t('codeListList.requestCreate.refIndicator')}
                                id={RequestFormEnum.REFINDICATOR}
                                {...register(RequestFormEnum.REFINDICATOR)}
                                error={formState.errors[RequestFormEnum.REFINDICATOR]?.message}
                            />
                            <SelectLazyLoading
                                disabled
                                key={defaultSelectOrg?.poUUID}
                                id={RequestFormEnum.MAINGESTOR}
                                name={RequestFormEnum.MAINGESTOR}
                                loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, additional)}
                                getOptionLabel={(item) => item.poName ?? ''}
                                getOptionValue={(item) => item.poUUID ?? ''}
                                label={t('codeListList.requestCreate.mainGestor')}
                                isMulti={false}
                                setValue={setValue}
                                error={formState.errors[RequestFormEnum.MAINGESTOR]?.message}
                                defaultValue={defaultSelectOrg}
                            />
                            <Input
                                disabled
                                label={t('codeListList.requestCreate.resortCode')}
                                id={RequestFormEnum.RESORTCODE}
                                {...register(RequestFormEnum.RESORTCODE)}
                                error={formState.errors[RequestFormEnum.RESORTCODE]?.message}
                            />
                            <Input
                                disabled
                                label={t('codeListList.requestModal.startDate')}
                                id={RequestFormEnum.EFFECTIVEFROM}
                                name={RequestFormEnum.EFFECTIVEFROM}
                                type="datetime-local"
                            />
                            <Input
                                disabled
                                label={t('codeListDetail.modal.form.validFrom')}
                                id={RequestFormEnum.VALIDDATE}
                                {...register(RequestFormEnum.VALIDDATE)}
                                type="datetime-local"
                            />
                            {notes?.map((note, index) => {
                                const name = (RequestFormEnum.NOTES + index).toString()
                                return (
                                    <TextArea
                                        key={index}
                                        defaultValue={note.text}
                                        rows={5}
                                        label={`${t('codeListList.requestCreate.note')} ${notes.length > 1 ? index + 1 : ''}`}
                                        id={name}
                                        error={formState.errors[RequestFormEnum.NOTES]?.message}
                                        name={name}
                                    />
                                )
                            })}
                            <TextHeading size="L">{t('codeListList.requestCreate.contactTitle')}</TextHeading>
                            <GridRow>
                                <GridCol setWidth="one-half">
                                    <Input
                                        disabled
                                        label={t('codeListList.requestCreate.name')}
                                        id={RequestFormEnum.NAME}
                                        {...register(RequestFormEnum.NAME)}
                                        error={formState.errors[RequestFormEnum.NAME]?.message}
                                    />
                                </GridCol>
                                <GridCol setWidth="one-half">
                                    <Input
                                        disabled
                                        label={t('codeListList.requestCreate.lastName')}
                                        id={RequestFormEnum.LASTNAME}
                                        {...register(RequestFormEnum.LASTNAME)}
                                        error={formState.errors[RequestFormEnum.LASTNAME]?.message}
                                    />
                                </GridCol>
                            </GridRow>
                            <GridRow>
                                <GridCol setWidth="one-half">
                                    <Input
                                        disabled
                                        label={t('codeListList.requestCreate.phone')}
                                        id={RequestFormEnum.PHONE}
                                        {...register(RequestFormEnum.PHONE)}
                                        error={formState.errors[RequestFormEnum.PHONE]?.message}
                                    />
                                </GridCol>
                                <GridCol setWidth="one-half">
                                    <Input
                                        disabled
                                        label={t('codeListList.requestCreate.email')}
                                        id={RequestFormEnum.EMAIL}
                                        {...register(RequestFormEnum.EMAIL)}
                                        error={formState.errors[RequestFormEnum.EMAIL]?.message}
                                    />
                                </GridCol>
                            </GridRow>
                            <TextHeading size="L">{t('codeListList.requestCreate.codeListTableTitle')}</TextHeading>
                            <ActionsOverTable
                                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                                entityName={'codelists'}
                                hiddenButtons={{ SELECT_COLUMNS: true }}
                            />
                            <Table
                                data={codeList ?? []}
                                expandedRowsState={expanded}
                                onExpandedChange={setExpanded}
                                columns={[
                                    {
                                        header: t('codeListList.requestCreate.codeId'),
                                        accessorFn: (row) => row?.codeItem,
                                        id: 'name',
                                        cell: ({ row }) => (
                                            <ExpandableRowCellWrapper row={row}>
                                                <span>{row?.original?.codeItem}</span>
                                            </ExpandableRowCellWrapper>
                                        ),
                                    },
                                    {
                                        header: t('codeListList.requestCreate.codeName'),
                                        accessorFn: (row) => row?.codeName,
                                        id: 'ekoCodeState',
                                        cell: (ctx) => <span>{ctx?.row?.original?.codeName}</span>,
                                    },
                                ]}
                                getExpandedRow={(row: Row<IItemForm>) => {
                                    return (
                                        <RequestDetailItemsTableExpandedRow
                                            workingLanguage={i18n.language}
                                            codelistItem={mapToCodeListDetail(
                                                i18n.language,
                                                codeList?.find((item) => item.codeItem === row.original.codeItem),
                                            )}
                                            attributeProfile={attributeProfile}
                                        />
                                    )
                                }}
                            />
                            <ButtonGroupRow>
                                <Button
                                    label={t('form.cancel')}
                                    type="reset"
                                    variant="secondary"
                                    onClick={() => navigate(`${RouteNames.REQUESTLIST}`)}
                                />
                            </ButtonGroupRow>
                        </form>
                        <ExportCodeListModal
                            code={data?.codeListId ?? ''}
                            isRequest
                            isOpen={isExportModalOpen}
                            onClose={() => setIsExportModalOpen(false)}
                        />
                        <ImportCodeListModal code={data?.codeListId ?? ''} isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
                        <ConfirmModal
                            action={confirmationModal.action}
                            isOpen={confirmationModal.isOpen}
                            title={confirmationModal.title}
                            description={confirmationModal.description}
                            close={() => setConfirmationModal({ action: RequestState.DRAFT, isOpen: false, title: '', description: '' })}
                            onSubmit={(action, note) => {
                                switch (action) {
                                    case RequestState.ACCEPT: {
                                        onAccept(RequestActions.ACCEPT)
                                        break
                                    }
                                    case RequestState.ACCEPTSZZC: {
                                        onAccept(RequestActions.ACCEPTSZZC)
                                        break
                                    }
                                    case RequestState.ACCEPTKSISVS: {
                                        onAccept(RequestActions.ACCEPTKSISVS)
                                        break
                                    }
                                    case RequestState.SEND: {
                                        onAccept(RequestActions.SEND)
                                        break
                                    }
                                    case RequestState.CANCEL: {
                                        onAccept(RequestActions.CANCEL)
                                        break
                                    }
                                    case RequestState.REJECT: {
                                        onAccept(RequestActions.REJECT, note)
                                        break
                                    }
                                }
                                setConfirmationModal({ action: RequestState.DRAFT, isOpen: false, title: '', description: '' })
                                navigate(`${RouteNames.REQUESTLIST}`)
                            }}
                        />
                    </QueryFeedback>
                </MainContentWrapper>
            )}
        </>
    )
}

export default DetailRequestView
