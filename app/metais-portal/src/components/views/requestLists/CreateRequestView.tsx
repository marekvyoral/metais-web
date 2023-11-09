import {
    BreadCrumbs,
    Button,
    ButtonGroupRow,
    ButtonLink,
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
import { ActionsOverTable, BulkPopup, CreateEntityButton, QueryFeedback } from '@isdd/metais-common/index'
import { useGetRoleParticipantHook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, RequestListState } from '@isdd/metais-common/constants'
import { CellContext, ColumnDef, ExpandedState, Row } from '@tanstack/react-table'
import { RequestListActions } from '@isdd/metais-common/hooks/permissions/useRequestPermissions'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'

import { RequestDetailItemsTableExpandedRow } from '@/components/views/requestLists/components/RequestDetailItemsTableExpandedRow'
import { IItemForm, ModalItem } from '@/components/views/requestLists/components/modalItem/ModalItem'
import styles from '@/components/views/requestLists/requestView.module.scss'
import { DateModalItem } from '@/components/views/requestLists/components/modalItem/DateModalItem'
import { useCreateRequestSchema } from '@/components/views/requestLists/useRequestSchemas'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CreateRequestViewProps } from '@/components/containers/CreateRequestContainer'
import { IRequestForm, mapToCodeListDetail } from '@/componentHelpers/requests'

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

export const CreateRequestView: React.FC<CreateRequestViewProps> = ({
    entityName,
    isError,
    isLoading,
    editData,
    onCheckIfCodeListExist,
    firstNotUsedCode,
    loadOptions,
    onSend,
    onSave,
    canEdit,
    canEditDate,
    attributeProfile,
    onSaveDates,
    requestId,
}) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const { schema } = useCreateRequestSchema()
    const getRoleParticipantHook = useGetRoleParticipantHook()
    const userAbility = useAbilityContext()

    const [rowSelection, setRowSelection] = useState<Record<string, IItemForm>>({})
    const [notes, setNotes] = useState<INoteRow[]>([{ id: 0, text: '' }])
    const [codeList, setCodeList] = useState<IItemForm[]>([])
    const [codeListItem, setCodeListItem] = useState<IItemForm>()
    const [isOpen, setOpen] = useState<boolean>(false)
    const [isSend, setSend] = useState<boolean>(false)
    const [isSetDatesDialogOpened, setIsSetDatesDialogOpened] = useState<boolean>(false)
    const [defaultSelectOrg, setDefaultSelectOrg] = useState<IOption>()
    const [expanded, setExpanded] = useState<ExpandedState>({})
    const { register, handleSubmit, formState, getValues, setValue } = useForm<IRequestForm>({
        resolver: yupResolver(schema),
        defaultValues: editData,
    })

    const onHandleSubmit = (formData: IRequestForm) => {
        const res = { ...formData, notes: [...notes], codeLists: [...codeList] }
        isSend ? onSend(res) : onSave(res)
    }

    const onClickCheck = async () => {
        const code = getValues(RequestFormEnum.CODELISTID)
        await onCheckIfCodeListExist(code)
    }

    const close = () => {
        setOpen(false)
    }

    const closeDate = () => {
        setIsSetDatesDialogOpened(false)
    }

    const addItem = (data: IItemForm) => {
        if (data.id) {
            const removeItem = codeList.filter((i) => i.id !== data.id)
            setCodeList([...removeItem, { ...data }])
        } else {
            if (codeList.every((i) => i.codeItem !== data.codeItem)) {
                setCodeList([...codeList, { ...data, state: 'PUBLISHED', id: 'create' + codeList.length }])
            } else {
                const removeItem = codeList.filter((i) => i.codeItem !== data.codeItem)
                setCodeList([...removeItem, { ...data, state: 'PUBLISHED', id: 'create' + removeItem.length }])
            }
        }
        close()
    }

    useEffect(() => {
        if (editData) {
            setCodeList(editData.codeLists ?? [])
            setNotes(editData.notes ?? [])

            getRoleParticipantHook(editData?.gid ?? '')
                .then((res) => {
                    const val = {
                        poUUID: res?.gid,
                        poName: res?.configurationItemUi?.attributes?.['Gen_Profil_nazov'],
                    }

                    setValue(RequestFormEnum.MAINGESTOR, Array.isArray(val) ? val[0].poUUID : val.poUUID)
                    setDefaultSelectOrg(val)
                })
                .catch(() => {
                    return
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editData])

    function reduceRowsToObject(rows: IItemForm[]) {
        return rows.reduce<Record<string, IItemForm>>((result, item) => {
            if (item.id) {
                result[item.id] = item
            }
            return result
        }, {})
    }

    const handleAllCheckboxChange = useCallback(
        (rows: IItemForm[]) => {
            const checked = rows.every(({ id }) => (id ? !!rowSelection[id] : false))
            if (checked) {
                setRowSelection({})
            } else {
                setRowSelection(reduceRowsToObject(rows))
            }
        },
        [rowSelection, setRowSelection],
    )

    const handleCheckboxChange = useCallback(
        (row: Row<IItemForm>) => {
            if (!row.original.id) return
            const { id } = row.original
            const newRowSelection = { ...rowSelection }
            if (rowSelection[id]) {
                delete newRowSelection[id]
            } else {
                newRowSelection[id] = row.original
            }
            setRowSelection(newRowSelection)
        },
        [rowSelection, setRowSelection],
    )

    const colDef: ColumnDef<IItemForm>[] = [
        {
            id: 'checkbox',
            header: ({ table }) => {
                const tableRows = table.getRowModel().rows
                const checked =
                    table.getRowModel().rows.length > 0 && tableRows.every((row) => (row.original.id ? !!rowSelection[row.original.id] : false))
                return (
                    canEditDate &&
                    editData && (
                        <div className="govuk-checkboxes govuk-checkboxes--small">
                            <CheckBox
                                label=""
                                name="checkbox"
                                id="checkbox-all"
                                onChange={() => handleAllCheckboxChange(codeList || [])}
                                disabled={tableRows.length === 0 || (!canEditDate && !!editData)}
                                checked={checked}
                            />
                        </div>
                    )
                )
            },
            cell: ({ row }) => (
                <ExpandableRowCellWrapper row={row}>
                    {canEditDate && editData && (
                        <div className="govuk-checkboxes govuk-checkboxes--small">
                            <CheckBox
                                label=""
                                name="checkbox"
                                id={`checkbox_${row.id}`}
                                value="true"
                                onChange={() => handleCheckboxChange(row)}
                                checked={row.original.id ? !!rowSelection[row.original.id] : false}
                                disabled={!canEditDate && !!editData}
                            />
                        </div>
                    )}
                </ExpandableRowCellWrapper>
            ),
        },
        {
            header: t('codeListList.requestCreate.codeId'),
            accessorFn: (row: IItemForm) => row?.codeItem,
            id: 'name',
            cell: (ctx: CellContext<IItemForm, unknown>) => <span>{ctx?.row?.original?.codeItem}</span>,
        },
        {
            header: t('codeListList.requestCreate.codeName'),
            accessorFn: (row: IItemForm) => row?.codeName,
            id: 'ekoCodeState',
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
            cell: (ctx: CellContext<IItemForm, unknown>) => <span>{ctx?.row?.original?.codeName}</span>,
        },
        {
            header: '',
            accessorFn: (row: IItemForm) => row?.codeItem,
            id: 'btn',
            cell: (ctx: CellContext<IItemForm, unknown>) => (
                <Button
                    disabled={!canEdit}
                    label={t('form.editItem')}
                    type="submit"
                    onClick={() => {
                        setCodeListItem(ctx?.row?.original)
                        setOpen(true)
                    }}
                />
            ),
        },
    ]

    return (
        <>
            {editData ? (
                <BreadCrumbs
                    withWidthContainer
                    links={[
                        { label: t('codeList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                        { label: t('codeList.breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                        { label: t('codeList.breadcrumbs.codeLists'), href: RouteNames.CODELISTS },
                        { label: t('codeList.breadcrumbs.requestList'), href: RouteNames.REQUESTLIST },
                        { label: editData?.codeListId ?? '', href: `${RouteNames.REQUESTLIST}/${requestId}` },
                        { label: t('codeList.breadcrumbs.requestEdit'), href: `${RouteNames.EDITREQUEST}/${requestId}` },
                    ]}
                />
            ) : (
                <BreadCrumbs
                    withWidthContainer
                    links={[
                        { label: t('codeList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                        { label: t('codeList.breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                        { label: t('codeList.breadcrumbs.codeLists'), href: RouteNames.CODELISTS },
                        { label: t('codeList.breadcrumbs.requestList'), href: RouteNames.REQUESTLIST },
                        { label: t('codeList.breadcrumbs.requestCreate'), href: `${RouteNames.CREATEREQUEST}/create` },
                    ]}
                />
            )}
            {userAbility.can(RequestListActions.SHOW, entityName) && (
                <MainContentWrapper>
                    <QueryFeedback loading={isLoading} error={isError} withChildren>
                        <TextHeading size="XL">{t('codeListList.requestTitle')}</TextHeading>
                        <form onSubmit={handleSubmit(onHandleSubmit)}>
                            <div className={styles.bottomGap}>
                                <CheckBox
                                    disabled={!canEdit}
                                    label={t('codeListList.requestCreate.base')}
                                    id={RequestFormEnum.BASE}
                                    {...register(RequestFormEnum.BASE)}
                                    name={RequestFormEnum.BASE}
                                />
                            </div>
                            <Input
                                required
                                disabled={!canEdit}
                                label={t('codeListList.requestCreate.codeListName')}
                                id={RequestFormEnum.CODELISTNAME}
                                {...register(RequestFormEnum.CODELISTNAME)}
                                error={formState.errors[RequestFormEnum.CODELISTNAME]?.message}
                            />
                            <Input
                                required
                                disabled={!canEdit}
                                label={t('codeListList.requestCreate.codeListId')}
                                defaultValue={firstNotUsedCode}
                                id={RequestFormEnum.CODELISTID}
                                {...register(RequestFormEnum.CODELISTID)}
                                error={formState.errors[RequestFormEnum.CODELISTID]?.message}
                            />
                            {!!canEdit && <Button label={t('codeListList.requestCreate.btnCheck')} variant="secondary" onClick={onClickCheck} />}
                            <Input
                                required
                                disabled={!canEdit}
                                label={t('codeListList.requestCreate.refIndicator')}
                                id={RequestFormEnum.REFINDICATOR}
                                {...register(RequestFormEnum.REFINDICATOR)}
                                error={formState.errors[RequestFormEnum.REFINDICATOR]?.message}
                            />
                            <SelectLazyLoading
                                key={defaultSelectOrg?.poUUID}
                                disabled={!canEdit}
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
                                required
                                disabled={!canEdit}
                                label={t('codeListList.requestCreate.resortCode')}
                                id={RequestFormEnum.RESORTCODE}
                                {...register(RequestFormEnum.RESORTCODE)}
                                error={formState.errors[RequestFormEnum.RESORTCODE]?.message}
                            />
                            {editData?.codeListSate === RequestListState.ACCEPTED_SZZC ||
                                (editData?.codeListSate === RequestListState.KS_ISVS_ACCEPTED && (
                                    <>
                                        <Input
                                            label={t('codeListList.requestModal.startDate')}
                                            id={RequestFormEnum.EFFECTIVEFROM}
                                            name={RequestFormEnum.EFFECTIVEFROM}
                                            type="datetime-local"
                                        />
                                        <Input
                                            label={t('codeListDetail.modal.form.validFrom')}
                                            id={RequestFormEnum.VALIDDATE}
                                            {...register(RequestFormEnum.VALIDDATE)}
                                            type="datetime-local"
                                        />
                                    </>
                                ))}
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
                            <ButtonGroupRow className={styles.bottomGap}>
                                <ButtonLink
                                    label={t('codeListList.requestCreate.addNote')}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setNotes([...notes, { id: notes.length, text: '' }])
                                    }}
                                />
                            </ButtonGroupRow>
                            <TextHeading size="L">{t('codeListList.requestCreate.contactTitle')}</TextHeading>
                            <GridRow>
                                <GridCol setWidth="one-half">
                                    <Input
                                        required
                                        disabled={!canEdit}
                                        label={t('codeListList.requestCreate.name')}
                                        id={RequestFormEnum.NAME}
                                        {...register(RequestFormEnum.NAME)}
                                        error={formState.errors[RequestFormEnum.NAME]?.message}
                                    />
                                </GridCol>
                                <GridCol setWidth="one-half">
                                    <Input
                                        required
                                        disabled={!canEdit}
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
                                        required
                                        disabled={!canEdit}
                                        label={t('codeListList.requestCreate.phone')}
                                        id={RequestFormEnum.PHONE}
                                        {...register(RequestFormEnum.PHONE)}
                                        error={formState.errors[RequestFormEnum.PHONE]?.message}
                                    />
                                </GridCol>
                                <GridCol setWidth="one-half">
                                    <Input
                                        required
                                        disabled={!canEdit}
                                        label={t('codeListList.requestCreate.email')}
                                        id={RequestFormEnum.EMAIL}
                                        {...register(RequestFormEnum.EMAIL)}
                                        error={formState.errors[RequestFormEnum.EMAIL]?.message}
                                    />
                                </GridCol>
                            </GridRow>
                            <TextHeading size="L">{t('codeListList.requestCreate.codeListTableTitle')}</TextHeading>
                            <ActionsOverTable
                                pagination={{ pageNumber: BASE_PAGE_NUMBER, pageSize: BASE_PAGE_SIZE, dataLength: 0 }}
                                entityName={'codelists'}
                                createButton={
                                    !editData &&
                                    canEdit && (
                                        <CreateEntityButton
                                            onClick={() => {
                                                setCodeListItem(undefined)
                                                setOpen(true)
                                            }}
                                            label={t('codeListList.requestCreate.addItemBtn')}
                                        />
                                    )
                                }
                                bulkPopup={
                                    canEditDate &&
                                    !!editData && (
                                        <BulkPopup
                                            checkedRowItems={Object.keys(rowSelection).length}
                                            items={() => [
                                                <ButtonLink
                                                    key={'setDates'}
                                                    label={t('codeListDetail.button.setDatesBulk')}
                                                    onClick={() => setIsSetDatesDialogOpened(true)}
                                                />,
                                            ]}
                                        />
                                    )
                                }
                                hiddenButtons={{ SELECT_COLUMNS: true }}
                            />
                            <Table
                                data={codeList ?? []}
                                expandedRowsState={expanded}
                                onExpandedChange={setExpanded}
                                columns={colDef}
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
                            <DateModalItem
                                isOpen={isSetDatesDialogOpened}
                                rowSelection={rowSelection}
                                close={closeDate}
                                onSubmit={(i) => {
                                    onSaveDates?.(i, rowSelection)
                                    closeDate()
                                }}
                            />
                            <ButtonGroupRow>
                                <Button
                                    label={t('form.cancel')}
                                    type="reset"
                                    variant="secondary"
                                    onClick={() => navigate(`${RouteNames.REQUESTLIST}`)}
                                />
                                {(canEdit || canEditDate) &&
                                    userAbility.can(RequestListActions.EDIT, entityName) &&
                                    editData?.codeListSate !== RequestListState.KS_ISVS_ACCEPTED &&
                                    editData?.codeListSate !== RequestListState.ACCEPTED_SZZC && (
                                        <Button label={t('form.submit')} type="submit" variant="secondary" onClick={() => setSend(true)} />
                                    )}
                                {(canEdit || canEditDate) && userAbility.can(RequestListActions.EDIT, entityName) && (
                                    <Button label={t('form.save')} type="submit" onClick={() => setSend(false)} />
                                )}
                            </ButtonGroupRow>
                        </form>
                        {isOpen && (
                            <ModalItem
                                isOpen={isOpen}
                                close={close}
                                isCreate={!editData}
                                onSubmit={addItem}
                                item={codeListItem}
                                canEdit={!!canEdit}
                                canEditDate={!!canEditDate}
                            />
                        )}
                    </QueryFeedback>
                </MainContentWrapper>
            )}
        </>
    )
}

export default CreateRequestView
