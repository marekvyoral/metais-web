import { yupResolver } from '@hookform/resolvers/yup'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'
import {
    BreadCrumbs,
    Button,
    ButtonGroupRow,
    ButtonLink,
    CheckBox,
    ErrorBlock,
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
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types/'
import { useGetRoleParticipantHook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { AsyncUriSelect } from '@isdd/metais-common/components/async-uri-select/AsyncUriSelect'
import { ElementToScrollTo } from '@isdd/metais-common/components/element-to-scroll-to/ElementToScrollTo'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS, RequestListState } from '@isdd/metais-common/constants'
import { Can, useAbilityContextWithFeedback } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, Subjects } from '@isdd/metais-common/hooks/permissions/useRequestPermissions'
import { ActionsOverTable, BulkPopup, CreateEntityButton, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { CellContext, ColumnDef, ExpandedState, Row } from '@tanstack/react-table'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { IRequestForm, getItemCodelistRefId, mapToCodeListDetail } from '@/componentHelpers/requests'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CreateRequestViewProps } from '@/components/containers/CreateRequestContainer'
import { getDescription, getName } from '@/components/views/codeLists/CodeListDetailUtils'
import { AutoIncrement } from '@/components/views/requestLists/components/AutoIncrement'
import { RequestDetailItemsTableExpandedRow } from '@/components/views/requestLists/components/RequestDetailItemsTableExpandedRow'
import { DateModalItem } from '@/components/views/requestLists/components/modalItem/DateModalItem'
import { IItemForm, ModalItem } from '@/components/views/requestLists/components/modalItem/ModalItem'
import styles from '@/components/views/requestLists/requestView.module.scss'
import { useCreateRequestSchema } from '@/components/views/requestLists/useRequestSchemas'

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
    PREFIX = 'prefix',
    AUTOINCREMENT_VALID = 'valid',
    AUTOINCREMENT_TYPE = 'type',
    AUTOINCREMENT_CHAR_COUNT = 'charCount',
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

    const DEFAULT_CHAR_COUNT = 3
    const canUse = requestId ? ability.can(Actions.EDIT, Subjects.DETAIL) : ability.can(Actions.CREATE, Subjects.DETAIL)

    const { register, handleSubmit, formState, getValues, setValue, setError, trigger, control, watch } = useForm<IRequestForm>({
        resolver: yupResolver(schema),
        defaultValues: editData || {
            base: true,
            charCount: DEFAULT_CHAR_COUNT,
            type: 'NUMERIC',
        },
    })
    const charCountInput = watch(RequestFormEnum.AUTOINCREMENT_CHAR_COUNT)
    const prefixInput = watch(RequestFormEnum.PREFIX)
    const isAutoincrementValid = !!watch(RequestFormEnum.AUTOINCREMENT_VALID)
    const codelistRefId = watch(RequestFormEnum.REFINDICATOR)
    const hasAutoincrementButNotPrefixOrCount = isAutoincrementValid && (!prefixInput || !charCountInput)
    const DEFAULT_AUTOINCREMENT_INDEX = 1

    const handleDateChange = (date: Date | null, name: string) => {
        setValue(name as keyof ICodeItem, date ?? new Date())
    }

    const getAutoIncrement = (index: number, prefix: string, charCount: number) => {
        if (!isAutoincrementValid || !charCount) return ''
        const charCountZeroLength = charCount - index.toString().length
        const charCountZeroArray = charCountZeroLength ? Array(charCountZeroLength).fill(0).join('') : ''
        return `${prefix}${charCountZeroArray}${index}`
    }

    const getAutoIncrementWithCodelistRefId = (index: number, prefix: string, charCount: number) => {
        const code = getAutoIncrement(index, prefix, charCount)
        return code ? getItemCodelistRefId(codelistRefId ?? '', code) : ''
    }

    const onHandleSubmit = (formData: IRequestForm) => {
        let res = { ...formData, codeLists: [...codeList] }
        const formCharCount = formData.charCount
        const formAutoincValid = formData.valid
        const formPrefix = formData.prefix

        //remap codelist with correct prefix as it could change on already created items
        if (formAutoincValid && formPrefix && formCharCount) {
            res = {
                ...res,
                codeLists: res.codeLists.map((i, index) => ({
                    ...i,
                    codeItem: getAutoIncrement(index + 1, formPrefix, formCharCount),
                    refident: getAutoIncrementWithCodelistRefId(index + 1, formPrefix, formCharCount),
                })),
            }
        }
        isSend ? onSend(res) : onSave(res)
    }

    useEffect(() => {
        const currentCharCount = getValues(RequestFormEnum.AUTOINCREMENT_CHAR_COUNT) ?? 1
        const maxItems = Math.pow(10, currentCharCount)
        if (codeList.length >= maxItems - 1) {
            setValue(RequestFormEnum.AUTOINCREMENT_CHAR_COUNT, parseInt(currentCharCount?.toString()) + 1)
        }
    }, [codeList.length, setValue, getValues])

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
                setError(RequestFormEnum.CODELISTCODE, { message: t([error ?? '', 'feedback.mutationErrorMessage']) })
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
        setPagination((prev) => ({
            ...prev,
            dataLength: codeList.length,
        }))
    }, [codeList.length])

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
                                title={t('table.selectAllItems')}
                            />
                        </div>
                    )
                )
            },
            cell: ({ row }) =>
                editData && (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            name="checkbox"
                            id={`checkbox_${row.id}`}
                            value="true"
                            onChange={() => handleCheckboxChange(row)}
                            checked={row.original.id ? !!rowSelection[row.original.id] : false}
                            title={t('table.selectItem', { itemName: row.original.codeName })}
                        />
                    </div>
                ),
        },
        {
            header: t('codeListList.requestCreate.codeId'),
            accessorFn: (row: IItemForm) => row?.codeItem,
            id: 'id',
            cell: (ctx: CellContext<IItemForm, unknown>) => <span>{ctx?.row?.original?.codeItem}</span>,
        },
        {
            header: t('codeListList.requestCreate.codeName'),
            accessorFn: (row: IItemForm) => row?.codeName,
            id: 'name',
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
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
                        <ElementToScrollTo trigger={errorMessages.length > 0} manualScroll>
                            {errorMessages.map((errorMessage, index) => (
                                <MutationFeedback key={index} error errorMessage={errorMessage && t(errorMessage)} />
                            ))}
                        </ElementToScrollTo>
                        {isLoadingMutation && <LoadingIndicator label={t('feedback.saving')} />}
                        <TextHeading size="XL">{t('codeListList.requestTitle')}</TextHeading>

                        {formState.isSubmitted && !formState.isValid && <ErrorBlock errorTitle={t('formErrors')} hidden />}

                        <form onSubmit={handleSubmit(onHandleSubmit)} noValidate>
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
                            <div className={styles.availWrapper}>
                                {!!canEdit && <Button label={t('codeListList.requestCreate.btnCheck')} variant="secondary" onClick={onClickCheck} />}
                                {isCodeAvailable && (
                                    <MutationFeedback
                                        success={isCodeAvailable}
                                        successMessage={t('codeListDetail.feedback.codeIsAvailable')}
                                        onMessageClose={() => {
                                            setIsCodeAvailable(false)
                                        }}
                                    />
                                )}
                            </div>
                            <Input
                                required
                                maxLength={10}
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

                            <AsyncUriSelect
                                control={control}
                                disabled={!canEdit}
                                name={RequestFormEnum.REFINDICATOR}
                                label={getDescription('Gui_Profil_ZC_uri', language, attributeProfile)}
                                error={formState.errors[RequestFormEnum.REFINDICATOR]?.message}
                                info={getName('Gui_Profil_ZC_uri', language, attributeProfile)}
                                hint={t('refIden.hint')}
                            />
                            <AutoIncrement
                                register={register}
                                formState={formState}
                                isAutoIncremenetValid={isAutoincrementValid}
                                autoIncrement={getAutoIncrement(
                                    DEFAULT_AUTOINCREMENT_INDEX,
                                    prefixInput ?? '',
                                    charCountInput ?? DEFAULT_AUTOINCREMENT_INDEX,
                                )}
                            />

                            {(editData?.codeListState === RequestListState.ACCEPTED_SZZC ||
                                editData?.codeListState === RequestListState.KS_ISVS_ACCEPTED) && (
                                <>
                                    <DateInput
                                        required
                                        setValue={setValue}
                                        label={getDescription('Gui_Profil_ZC_zaciatok_ucinnosti_polozky', language, attributeProfile)}
                                        info={getName('Gui_Profil_ZC_zaciatok_ucinnosti_polozky', language, attributeProfile)}
                                        id={RequestFormEnum.STARTDATE}
                                        {...register(RequestFormEnum.STARTDATE)}
                                        error={formState.errors[RequestFormEnum.STARTDATE]?.message}
                                        control={control}
                                        handleDateChange={handleDateChange}
                                    />
                                    <DateInput
                                        setValue={setValue}
                                        label={getDescription('Gui_Profil_ZC_datum_platnosti', language, attributeProfile)}
                                        info={getName('Gui_Profil_ZC_datum_platnosti', language, attributeProfile)}
                                        id={RequestFormEnum.VALIDDATE}
                                        {...register(RequestFormEnum.VALIDDATE)}
                                        error={formState.errors[RequestFormEnum.VALIDDATE]?.message}
                                        control={control}
                                        handleDateChange={handleDateChange}
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
                                success={isSuccessSetDates}
                                successMessage={t('codeListDetail.feedback.editCodeListItems')}
                                error={!!errorMessageSetDates}
                                errorMessage={t([errorMessageSetDates ?? '', 'feedback.mutationErrorMessage'])}
                            />
                            <ActionsOverTable
                                pagination={{ pageNumber: BASE_PAGE_NUMBER, pageSize: BASE_PAGE_SIZE, dataLength: 0 }}
                                entityName={''}
                                createButton={
                                    canEdit && (
                                        <Can I={Actions.ADD_ITEMS} a={Subjects.DETAIL}>
                                            <Tooltip
                                                descriptionElement={t('codeListList.requestCreate.hasAutoincrementButNotPrefixOrCount')}
                                                on={['click']}
                                                disabled={!hasAutoincrementButNotPrefixOrCount}
                                                triggerElement={
                                                    <CreateEntityButton
                                                        onClick={() => {
                                                            setCodeListItem(undefined)
                                                            if (!hasAutoincrementButNotPrefixOrCount) {
                                                                setOpen(true)
                                                            }
                                                        }}
                                                        label={t('codeListList.requestCreate.addItemBtn')}
                                                    />
                                                }
                                            />
                                        </Can>
                                    )
                                }
                                selectedRowsCount={Object.keys(rowSelection).length}
                                bulkPopup={({ selectedRowsCount }) =>
                                    !!editData && (
                                        <BulkPopup
                                            checkedRowItems={selectedRowsCount}
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
                                onSubmit={addItem}
                                item={codeListItem}
                                createRefIdUri={getAutoIncrementWithCodelistRefId(codeList.length + 1, prefixInput ?? '', charCountInput ?? 0)}
                                createItemCode={getAutoIncrement(codeList.length + 1, prefixInput ?? '', charCountInput ?? 0)}
                                attributeProfile={attributeProfile}
                                canEdit={!!canEdit}
                                editData={editData}
                                charCount={charCountInput}
                                prefix={prefixInput}
                                isAutoincrementValid={isAutoincrementValid}
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
