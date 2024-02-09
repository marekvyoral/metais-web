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
    LoadingIndicator,
    PaginatorWrapper,
    SelectLazyLoading,
    Table,
    TextArea,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import { ActionsOverTable, BulkPopup, CreateEntityButton, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { useGetRoleParticipantHook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS, RequestListState } from '@isdd/metais-common/constants'
import { CellContext, ColumnDef, ExpandedState, Row } from '@tanstack/react-table'
import { Actions, Subjects } from '@isdd/metais-common/hooks/permissions/useRequestPermissions'
import { Can, useAbilityContextWithFeedback } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Pagination, IFilter } from '@isdd/idsk-ui-kit/types/'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'

import { getDescription, getName } from '@/components/views/codeLists/CodeListDetailUtils'
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
    name?: string
    value?: string
}

export interface INoteRow {
    id?: number
    text?: string
}

export enum RequestFormEnum {
    BASE = 'base',
    CODELISTNAME = 'codeListName',
    CODELISTCODE = 'codeListCode',
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
    STARTDATE = 'startDate',
}

export const CreateRequestView: React.FC<CreateRequestViewProps> = ({
    workingLanguage,
    isError,
    errorMessages,
    isLoading,
    isLoadingMutation,
    errorMessageSetDates,
    isSuccessSetDates,
    editData,
    onHandleCheckIfCodeIsAvailable,
    firstNotUsedCode,
    loadOptions,
    onSend,
    onSave,
    canEdit,
    attributeProfile,
    onSaveDates,
    requestId,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const navigate = useNavigate()
    const { schema } = useCreateRequestSchema(canEdit ?? false)
    const getRoleParticipantHook = useGetRoleParticipantHook()
    const { ability, isLoading: isAbilityLoading, isError: isAbilityError } = useAbilityContextWithFeedback()

    const [pagination, setPagination] = useState<Pagination>({
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
        dataLength: 0,
    })
    const [rowSelection, setRowSelection] = useState<Record<string, IItemForm>>({})
    const [notes, setNotes] = useState<INoteRow[]>([{ id: 0, text: '' }])
    const [codeList, setCodeList] = useState<IItemForm[]>([])
    const [codeListItem, setCodeListItem] = useState<IItemForm>()
    const [isOpen, setOpen] = useState<boolean>(false)
    const [isSend, setSend] = useState<boolean>(false)
    const [isSetDatesDialogOpened, setIsSetDatesDialogOpened] = useState<boolean>(false)
    const [defaultSelectOrg, setDefaultSelectOrg] = useState<IOption>()
    const [expanded, setExpanded] = useState<ExpandedState>({})
    const [isCodeAvailable, setIsCodeAvailable] = useState<boolean>(false)
    const { register, handleSubmit, formState, getValues, setValue, setError, trigger } = useForm<IRequestForm>({
        resolver: yupResolver(schema),
        defaultValues: editData || {
            base: true,
        },
    })

    const onHandleSubmit = (formData: IRequestForm) => {
        const res = { ...formData, codeLists: [...codeList] }
        isSend ? onSend(res) : onSave(res)
    }

    const onClickCheck = async () => {
        const isValid = await trigger(RequestFormEnum.CODELISTCODE)
        if (!isValid) {
            setIsCodeAvailable(false)
            return
        }

        const code = getValues(RequestFormEnum.CODELISTCODE)
        const result = await onHandleCheckIfCodeIsAvailable(code)
        if (result.isAvailable) {
            setIsCodeAvailable(true)
        } else {
            setIsCodeAvailable(false)
            result.errorTranslateKeys?.forEach((error) => {
                setError(RequestFormEnum.CODELISTCODE, { message: t([error, 'feedback.mutationErrorMessage']) })
            })
        }
    }

    const close = () => {
        setOpen(false)
    }

    const closeDate = () => {
        setIsSetDatesDialogOpened(false)
    }

    useEffect(() => {
        if (firstNotUsedCode) setValue(RequestFormEnum.CODELISTCODE, firstNotUsedCode)
    }, [firstNotUsedCode, setValue])

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

    const handleFilterChange = (filter: IFilter) => {
        setPagination({
            ...pagination,
            pageSize: filter.pageSize ?? BASE_PAGE_SIZE,
            pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
        })
    }

    const paginatedCodeList = useMemo(() => {
        const startOfList = pagination.pageNumber * pagination.pageSize - pagination.pageSize
        const endOfList = pagination.pageNumber * pagination.pageSize
        return codeList?.slice(startOfList, endOfList) || []
    }, [codeList, pagination.pageNumber, pagination.pageSize])

    useEffect(() => {
        if (editData) {
            setCodeList(editData.codeLists ?? [])
            setNotes(editData.notes ?? [])
            setPagination({
                ...pagination,
                dataLength: editData.codeLists?.length ?? 0,
            })

            getRoleParticipantHook(editData?.gid ?? '')
                .then((res) => {
                    const val = {
                        name: res?.configurationItemUi?.attributes?.['Gen_Profil_nazov'],
                        value: res?.gid,
                    }

                    setValue(RequestFormEnum.MAINGESTOR, Array.isArray(val) ? val[0].value : val.value)
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
            id: CHECKBOX_CELL,
            header: ({ table }) => {
                const tableRows = table.getRowModel().rows
                const checked =
                    table.getRowModel().rows.length > 0 && tableRows.every((row) => (row.original.id ? !!rowSelection[row.original.id] : false))
                return (
                    editData && (
                        <div className="govuk-checkboxes govuk-checkboxes--small">
                            <CheckBox
                                label=""
                                name="checkbox"
                                id="checkbox-all"
                                onChange={() => handleAllCheckboxChange(codeList || [])}
                                disabled={tableRows.length === 0}
                                checked={checked}
                            />
                        </div>
                    )
                )
            },
            cell: ({ row }) => (
                <ExpandableRowCellWrapper row={row}>
                    {editData && (
                        <div className="govuk-checkboxes govuk-checkboxes--small">
                            <CheckBox
                                label=""
                                name="checkbox"
                                id={`checkbox_${row.id}`}
                                value="true"
                                onChange={() => handleCheckboxChange(row)}
                                checked={row.original.id ? !!rowSelection[row.original.id] : false}
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
            size: 200,
            cell: (ctx: CellContext<IItemForm, unknown>) => <span>{ctx?.row?.original?.codeItem}</span>,
        },
        {
            header: t('codeListList.requestCreate.codeName'),
            accessorFn: (row: IItemForm) => row?.codeName,
            id: 'ekoCodeState',
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
            size: 200,
            cell: (ctx: CellContext<IItemForm, unknown>) => <span>{ctx?.row?.original?.codeName}</span>,
        },
        {
            header: '',
            accessorFn: (row: IItemForm) => row?.codeItem,
            id: 'btn',
            size: 200,
            cell: (ctx: CellContext<IItemForm, unknown>) =>
                canEdit && (
                    <Button
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

    const canUse = requestId ? ability.can(Actions.EDIT, Subjects.DETAIL) : ability.can(Actions.CREATE, Subjects.DETAIL)

    return (
        <>
            {editData ? (
                <BreadCrumbs
                    withWidthContainer
                    links={[
                        { label: t('codeList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                        { label: t('codeList.breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                        { label: t('codeList.breadcrumbs.codeLists'), href: RouteNames.HOW_TO_CODELIST },
                        { label: t('codeList.breadcrumbs.requestList'), href: NavigationSubRoutes.REQUESTLIST },
                        { label: editData?.codeListCode ?? '', href: `${NavigationSubRoutes.REQUESTLIST}/${requestId}` },
                        { label: t('codeList.breadcrumbs.requestEdit'), href: `${NavigationSubRoutes.REQUESTLIST}/${requestId}/edit` },
                    ]}
                />
            ) : (
                <BreadCrumbs
                    withWidthContainer
                    links={[
                        { label: t('codeList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                        { label: t('codeList.breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                        { label: t('codeList.breadcrumbs.codeLists'), href: RouteNames.HOW_TO_CODELIST },
                        { label: t('codeList.breadcrumbs.requestList'), href: NavigationSubRoutes.REQUESTLIST },
                        { label: t('codeList.breadcrumbs.requestCreate'), href: `${NavigationSubRoutes.REQUESTLIST}/create` },
                    ]}
                />
            )}
            {canUse && (
                <MainContentWrapper>
                    <QueryFeedback loading={isLoading || !!isAbilityLoading} error={isError || isAbilityError} withChildren>
                        {isLoadingMutation && <LoadingIndicator label={t('feedback.saving')} />}
                        <TextHeading size="XL">{t('codeListList.requestTitle')}</TextHeading>
                        <form onSubmit={handleSubmit(onHandleSubmit)}>
                            <div className={styles.bottomGap}>
                                <CheckBox
                                    disabled={!canEdit}
                                    label={getDescription('Gui_Profil_ZC_zakladny_ciselnik', language, attributeProfile)}
                                    info={getName('Gui_Profil_ZC_zakladny_ciselnik', language, attributeProfile)}
                                    id={RequestFormEnum.BASE}
                                    {...register(RequestFormEnum.BASE)}
                                    name={RequestFormEnum.BASE}
                                />
                            </div>
                            <Input
                                required
                                disabled={!canEdit}
                                label={getDescription('Gui_Profil_ZC_nazov_ciselnika', language, attributeProfile)}
                                info={getName('Gui_Profil_ZC_nazov_ciselnika', language, attributeProfile)}
                                id={RequestFormEnum.CODELISTNAME}
                                {...register(RequestFormEnum.CODELISTNAME)}
                                error={formState.errors[RequestFormEnum.CODELISTNAME]?.message}
                            />
                            <Input
                                correct={isCodeAvailable}
                                required
                                disabled={!canEdit}
                                label={getDescription('Gui_Profil_ZC_kod_ciselnika', language, attributeProfile)}
                                info={getName('Gui_Profil_ZC_kod_ciselnika', language, attributeProfile)}
                                id={RequestFormEnum.CODELISTCODE}
                                {...register(RequestFormEnum.CODELISTCODE)}
                                error={formState.errors[RequestFormEnum.CODELISTCODE]?.message}
                            />
                            {!!canEdit && <Button label={t('codeListList.requestCreate.btnCheck')} variant="secondary" onClick={onClickCheck} />}
                            <Input
                                required
                                disabled={!canEdit}
                                label={getDescription('Gui_Profil_ZC_rezort', language, attributeProfile)}
                                info={getName('Gui_Profil_ZC_rezort', language, attributeProfile)}
                                id={RequestFormEnum.RESORTCODE}
                                {...register(RequestFormEnum.RESORTCODE)}
                                error={formState.errors[RequestFormEnum.RESORTCODE]?.message}
                            />
                            <SelectLazyLoading
                                required
                                key={defaultSelectOrg?.value}
                                disabled={!canEdit}
                                id={RequestFormEnum.MAINGESTOR}
                                name={RequestFormEnum.MAINGESTOR}
                                loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, additional)}
                                getOptionLabel={(item) => item.name ?? ''}
                                getOptionValue={(item) => item.value ?? ''}
                                label={getDescription('Gui_Profil_ZC_hlavny_gestor', language, attributeProfile)}
                                info={getName('Gui_Profil_ZC_hlavny_gestor', language, attributeProfile)}
                                isMulti={false}
                                setValue={setValue}
                                error={formState.errors[RequestFormEnum.MAINGESTOR]?.message}
                                defaultValue={defaultSelectOrg}
                            />
                            <Input
                                disabled={!canEdit}
                                label={getDescription('Gui_Profil_ZC_uri', language, attributeProfile)}
                                info={getName('Gui_Profil_ZC_uri', language, attributeProfile)}
                                id={RequestFormEnum.REFINDICATOR}
                                {...register(RequestFormEnum.REFINDICATOR)}
                                error={formState.errors[RequestFormEnum.REFINDICATOR]?.message}
                            />
                            {(editData?.codeListState === RequestListState.ACCEPTED_SZZC ||
                                editData?.codeListState === RequestListState.KS_ISVS_ACCEPTED) && (
                                <>
                                    <Input
                                        required
                                        label={getDescription('Gui_Profil_ZC_zaciatok_ucinnosti_polozky', language, attributeProfile)}
                                        info={getName('Gui_Profil_ZC_zaciatok_ucinnosti_polozky', language, attributeProfile)}
                                        id={RequestFormEnum.STARTDATE}
                                        {...register(RequestFormEnum.STARTDATE)}
                                        type="date"
                                        error={formState.errors[RequestFormEnum.STARTDATE]?.message}
                                    />
                                    <Input
                                        label={getDescription('Gui_Profil_ZC_datum_platnosti', language, attributeProfile)}
                                        info={getName('Gui_Profil_ZC_datum_platnosti', language, attributeProfile)}
                                        id={RequestFormEnum.VALIDDATE}
                                        {...register(RequestFormEnum.VALIDDATE)}
                                        type="date"
                                        error={formState.errors[RequestFormEnum.VALIDDATE]?.message}
                                    />
                                </>
                            )}
                            {notes?.map((note, index) => {
                                const name = `${RequestFormEnum.NOTES}.${index}.text`
                                return (
                                    <TextArea
                                        key={index}
                                        defaultValue={note.text}
                                        rows={5}
                                        label={`${getDescription('Gui_Profil_ZC_poznamka_pre_ciselnik', language, attributeProfile)}  ${
                                            notes.length > 1 ? index + 1 : ''
                                        }`}
                                        info={getName('Gui_Profil_ZC_poznamka_pre_ciselnik', language, attributeProfile)}
                                        id={name}
                                        {...register(name)}
                                        error={formState.errors[RequestFormEnum.NOTES]?.[index]?.text?.message}
                                    />
                                )
                            })}
                            <ButtonGroupRow className={styles.bottomGap}>
                                <ButtonLink
                                    label={t('codeListList.requestCreate.addNote')}
                                    type="button"
                                    onClick={() => {
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
                                        label={getDescription('Gui_Profil_ZC_meno', language, attributeProfile)}
                                        info={getName('Gui_Profil_ZC_meno', language, attributeProfile)}
                                        id={RequestFormEnum.NAME}
                                        {...register(RequestFormEnum.NAME)}
                                        error={formState.errors[RequestFormEnum.NAME]?.message}
                                    />
                                </GridCol>
                                <GridCol setWidth="one-half">
                                    <Input
                                        required
                                        disabled={!canEdit}
                                        label={getDescription('Gui_Profil_ZC_priezvisko', language, attributeProfile)}
                                        info={getName('Gui_Profil_ZC_priezvisko', language, attributeProfile)}
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
                                        label={getDescription('Gui_Profil_ZC_tel_cislo', language, attributeProfile)}
                                        info={getName('Gui_Profil_ZC_tel_cislo', language, attributeProfile)}
                                        id={RequestFormEnum.PHONE}
                                        {...register(RequestFormEnum.PHONE)}
                                        error={formState.errors[RequestFormEnum.PHONE]?.message}
                                    />
                                </GridCol>
                                <GridCol setWidth="one-half">
                                    <Input
                                        required
                                        disabled={!canEdit}
                                        label={getDescription('Gui_Profil_ZC_email', language, attributeProfile)}
                                        info={getName('Gui_Profil_ZC_email', language, attributeProfile)}
                                        id={RequestFormEnum.EMAIL}
                                        {...register(RequestFormEnum.EMAIL)}
                                        error={formState.errors[RequestFormEnum.EMAIL]?.message}
                                    />
                                </GridCol>
                            </GridRow>
                            <TextHeading size="L">{t('codeListList.requestCreate.codeListTableTitle')}</TextHeading>
                            <MutationFeedback
                                success={isSuccessSetDates ?? false}
                                successMessage={t('codeListDetail.feedback.editCodeListItems')}
                                error={errorMessageSetDates && t([errorMessageSetDates, 'feedback.mutationErrorMessage'])}
                            />
                            <ActionsOverTable
                                pagination={{ pageNumber: BASE_PAGE_NUMBER, pageSize: BASE_PAGE_SIZE, dataLength: 0 }}
                                entityName={''}
                                createButton={
                                    canEdit && (
                                        <Can I={Actions.ADD_ITEMS} a={Subjects.DETAIL}>
                                            <CreateEntityButton
                                                onClick={() => {
                                                    setCodeListItem(undefined)
                                                    setOpen(true)
                                                }}
                                                label={t('codeListList.requestCreate.addItemBtn')}
                                            />
                                        </Can>
                                    )
                                }
                                selectedRowsCount={Object.keys(rowSelection).length}
                                bulkPopup={
                                    !!editData && (
                                        <BulkPopup
                                            checkedRowItems={Object.keys(rowSelection).length}
                                            items={(closePopup) => [
                                                <ButtonLink
                                                    key={'setDates'}
                                                    label={t('codeListDetail.button.setDatesBulk')}
                                                    onClick={() => {
                                                        setIsSetDatesDialogOpened(true)
                                                        closePopup()
                                                    }}
                                                />,
                                            ]}
                                        />
                                    )
                                }
                                handleFilterChange={handleFilterChange}
                                pagingOptions={[...DEFAULT_PAGESIZE_OPTIONS, { label: '1', value: '1' }]}
                                hiddenButtons={{ SELECT_COLUMNS: true }}
                            />
                            <Table
                                data={paginatedCodeList ?? []}
                                expandedRowsState={expanded}
                                onExpandedChange={setExpanded}
                                columns={colDef}
                                getExpandedRow={(row: Row<IItemForm>) => {
                                    return (
                                        <RequestDetailItemsTableExpandedRow
                                            workingLanguage={workingLanguage}
                                            codelistItem={mapToCodeListDetail(
                                                workingLanguage,
                                                codeList?.find((item) => item.codeItem === row.original.codeItem),
                                            )}
                                            attributeProfile={attributeProfile}
                                        />
                                    )
                                }}
                            />
                            <PaginatorWrapper
                                {...pagination}
                                handlePageChange={(filter) => setPagination({ ...pagination, pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER })}
                            />
                            {errorMessages.map((errorMessage, index) => (
                                <MutationFeedback success={false} key={index} error={t([errorMessage, 'feedback.mutationErrorMessage'])} />
                            ))}
                            <ButtonGroupRow>
                                <Button
                                    label={t('form.cancel')}
                                    type="reset"
                                    variant="secondary"
                                    onClick={() => {
                                        const path = requestId
                                            ? `${NavigationSubRoutes.REQUESTLIST}/${requestId}`
                                            : `${NavigationSubRoutes.REQUESTLIST}`
                                        navigate(path)
                                    }}
                                />
                                <Button
                                    label={t('codeListList.requestCreate.saveBtn')}
                                    variant="secondary"
                                    type="submit"
                                    onClick={() => setSend(false)}
                                />
                                {canEdit &&
                                    editData?.codeListState !== RequestListState.KS_ISVS_ACCEPTED &&
                                    editData?.codeListState !== RequestListState.ACCEPTED_SZZC && (
                                        <Button label={t('codeListList.requestCreate.submitBtn')} type="submit" onClick={() => setSend(true)} />
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
                                attributeProfile={attributeProfile}
                                canEdit={!!canEdit}
                            />
                        )}
                        <DateModalItem
                            isOpen={isSetDatesDialogOpened}
                            rowSelection={rowSelection}
                            close={closeDate}
                            onSubmit={(i) => {
                                onSaveDates?.(i, rowSelection)
                                setRowSelection({})
                                closeDate()
                            }}
                        />
                    </QueryFeedback>
                </MainContentWrapper>
            )}
        </>
    )
}

export default CreateRequestView
