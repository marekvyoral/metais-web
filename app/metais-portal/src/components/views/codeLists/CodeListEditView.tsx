import { yupResolver } from '@hookform/resolvers/yup'
import {
    BreadCrumbs,
    Button,
    ButtonGroupRow,
    ButtonLink,
    CheckBox,
    GridCol,
    GridRow,
    HomeIcon,
    Input,
    SelectLazyLoading,
    TextArea,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import { QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useEditCodeListSchema } from './useEditCodeListSchemas'

import { IEditCodeListForm } from '@/componentHelpers'
import { DEFAULT_EMPTY_NOTE, mapCodeListToEditForm } from '@/componentHelpers/code-list'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { EditCodeListContainerViewProps } from '@/components/containers/EditCodeListContainer'
import styles from '@/components/views/codeLists/codeList.module.scss'

export interface ICodeItem {
    value?: string
    language?: string
    effectiveFrom?: string
    effectiveTo?: string
}

export interface IOption {
    poName?: string
    poUUID?: string
}

export interface IFieldTextRow {
    id: number
    text: string
}

export enum RequestFormEnum {
    BASE = 'base',
    CODE = 'code',
    CODE_LIST_NAME = 'codeListName',
    NEW_CODE_LIST_NAME = 'newCodeListName',
    CODE_LIST_NOTES = 'codeListNotes',
    CODE_LIST_SOURCE = 'codeListSource',
    MAIN_GESTOR = 'mainGestor',
    NEW_MAIN_GESTOR = 'newMainGestor',
    NEXT_GESTOR = 'nextGestor',
    REF_INDICATOR = 'refIndicator',
    DATE_FROM = 'fromDate',
    DATE_TO = 'toDate',
    NAME = 'name',
    LAST_NAME = 'lastName',
    PHONE = 'phone',
    EMAIL = 'email',
}

export const CodeListEditView: React.FC<EditCodeListContainerViewProps> = ({
    data,
    isError,
    isLoading,
    loadOptions,
    handleSave,
    handleDiscardChanges,
    handleRemoveLock,
}) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const { id: codeId } = useParams()
    const { schema } = useEditCodeListSchema()
    const { codeList, defaultManagers } = data
    const mappedData = useMemo(() => {
        return mapCodeListToEditForm(codeList, i18n.language)
    }, [codeList, i18n.language])
    const [isNewGestor, setNewGestor] = useState<boolean>(false)
    const [isNewCodeListName, setNewCodeListName] = useState<boolean>(false)
    const [nextGestorList, setNextGestorList] = useState<IOption[]>(defaultManagers || [])
    const [notes, setNotes] = useState<IFieldTextRow[]>(DEFAULT_EMPTY_NOTE)
    const [sourceCodeList, setSourceCodeList] = useState<IFieldTextRow[]>(DEFAULT_EMPTY_NOTE)
    const { register, handleSubmit, formState, watch, setValue, reset } = useForm<IEditCodeListForm>({
        resolver: yupResolver(schema),
        reValidateMode: 'onSubmit',
        defaultValues: mappedData,
    })

    const nextGestorFormList = watch(RequestFormEnum.NEXT_GESTOR)

    useEffect(() => {
        reset(mappedData)
        setNotes(mappedData?.codeListNotes ?? DEFAULT_EMPTY_NOTE)
        setSourceCodeList(mappedData?.codeListSource ?? DEFAULT_EMPTY_NOTE)
    }, [mappedData, reset])

    useEffect(() => {
        setNextGestorList(defaultManagers || [])
    }, [defaultManagers])

    const onHandleSubmit = (formData: IEditCodeListForm) => {
        handleSave(formData)
    }

    const codeListName = useMemo(() => {
        return data?.codeList?.codelistNames?.find((i) => i.language == i18n.language)?.value
    }, [data?.codeList?.codelistNames, i18n.language])

    const nextGestorDefault = useMemo(() => {
        const val = defaultManagers?.filter((item) => mappedData?.nextGestor?.find((gestor) => item.poUUID === gestor.value?.substring(37)))
        return val
    }, [mappedData, defaultManagers])

    const newGestorLabel = isNewGestor ? t('codeListList.edit.cancelAddNewGestor') : t('codeListList.edit.addNewGestor')
    const newCodeListNameLabel = isNewCodeListName ? t('codeListList.edit.cancelAddNewVersionName') : t('codeListList.edit.addNewVersionName')

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('codeList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('codeList.breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('codeList.breadcrumbs.codeLists'), href: RouteNames.CODELISTS },
                    { label: t('codeList.breadcrumbs.codeListsList'), href: NavigationSubRoutes.CISELNIKY },
                    { label: codeListName ?? t('codeList.breadcrumbs.codeListsList'), href: '' },
                ]}
            />

            <MainContentWrapper>
                <QueryFeedback loading={isLoading} error={isError} withChildren>
                    <TextHeading size="XL">{t('codeListList.edit.title')}</TextHeading>
                    <form onSubmit={handleSubmit(onHandleSubmit)}>
                        <div className={styles.bottomGap}>
                            <CheckBox
                                label={t('codeListList.edit.base')}
                                id={RequestFormEnum.BASE}
                                {...register(RequestFormEnum.BASE)}
                                name={RequestFormEnum.BASE}
                            />
                        </div>
                        <Input
                            required
                            label={t('codeListList.edit.codeListName')}
                            id={`${RequestFormEnum.CODE_LIST_NAME}.value`}
                            {...register(`${RequestFormEnum.CODE_LIST_NAME}.value`)}
                            error={formState.errors[RequestFormEnum.CODE_LIST_NAME]?.value?.message}
                        />
                        <GridRow className={styles.dateGap}>
                            <GridCol setWidth="one-half">
                                <Input
                                    label={t('codeListList.edit.dateFrom')}
                                    id={`${RequestFormEnum.CODE_LIST_NAME}.effectiveFrom`}
                                    {...register(`${RequestFormEnum.CODE_LIST_NAME}.effectiveFrom`)}
                                    type="date"
                                    error={formState.errors[RequestFormEnum.CODE_LIST_NAME]?.effectiveFrom?.message}
                                />
                            </GridCol>
                            <GridCol setWidth="one-half">
                                <Input
                                    label={t('codeListList.edit.dateTo')}
                                    id={`${RequestFormEnum.CODE_LIST_NAME}.effectiveTo`}
                                    {...register(`${RequestFormEnum.CODE_LIST_NAME}.effectiveTo`)}
                                    type="date"
                                    error={formState.errors[RequestFormEnum.CODE_LIST_NAME]?.effectiveTo?.message}
                                />
                            </GridCol>
                        </GridRow>

                        <ButtonLink className={styles.bottomGap} label={newCodeListNameLabel} onClick={() => setNewCodeListName((prev) => !prev)} />

                        {isNewCodeListName && (
                            <>
                                <Input
                                    label={t('codeListList.edit.newCodeListName')}
                                    id={`${RequestFormEnum.NEW_CODE_LIST_NAME}.value`}
                                    {...register(`${RequestFormEnum.NEW_CODE_LIST_NAME}.value`)}
                                    error={formState.errors[RequestFormEnum.NEW_CODE_LIST_NAME]?.value?.message}
                                />
                                <GridRow className={styles.dateGap}>
                                    <GridCol setWidth="one-half">
                                        <Input
                                            label={t('codeListList.edit.dateFrom')}
                                            id={`${RequestFormEnum.NEW_CODE_LIST_NAME}.effectiveFrom`}
                                            {...register(`${RequestFormEnum.NEW_CODE_LIST_NAME}.effectiveFrom`)}
                                            type="date"
                                            error={formState.errors[RequestFormEnum.NEW_CODE_LIST_NAME]?.effectiveFrom?.message}
                                        />
                                    </GridCol>
                                    <GridCol setWidth="one-half">
                                        <Input
                                            label={t('codeListList.edit.dateTo')}
                                            id={`${RequestFormEnum.NEW_CODE_LIST_NAME}.effectiveTo`}
                                            {...register(`${RequestFormEnum.NEW_CODE_LIST_NAME}.effectiveTo`)}
                                            type="date"
                                            error={formState.errors[RequestFormEnum.NEW_CODE_LIST_NAME]?.effectiveTo?.message}
                                        />
                                    </GridCol>
                                </GridRow>
                            </>
                        )}

                        <Input
                            required
                            disabled
                            label={t('codeListList.edit.codeListId')}
                            id={RequestFormEnum.CODE}
                            {...register(RequestFormEnum.CODE)}
                            error={formState.errors[RequestFormEnum.CODE]?.message}
                        />
                        <Input
                            disabled
                            label={t('codeListList.edit.refIndicator')}
                            id={RequestFormEnum.REF_INDICATOR}
                            {...register(RequestFormEnum.REF_INDICATOR)}
                            error={formState.errors[RequestFormEnum.REF_INDICATOR]?.message}
                        />

                        {defaultManagers?.length !== 0 &&
                            mappedData?.mainGestor?.map((gestor, index) => (
                                <>
                                    <SelectLazyLoading<IOption>
                                        key={gestor.id}
                                        defaultValue={defaultManagers?.find((i) => i.poUUID === gestor.value?.substring(37))}
                                        id={RequestFormEnum.MAIN_GESTOR}
                                        name={`${RequestFormEnum.MAIN_GESTOR}[${index}].value`}
                                        loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, additional)}
                                        getOptionLabel={(item) => item.poName ?? ''}
                                        getOptionValue={(item) => item.poUUID ?? ''}
                                        label={`${t('codeListList.edit.mainGestor')} ${index + 1}`}
                                        isMulti={false}
                                        setValue={setValue}
                                        error={formState.errors[RequestFormEnum.MAIN_GESTOR]?.[index]?.value?.message}
                                    />
                                    <GridRow className={styles.dateGap}>
                                        <GridCol setWidth="one-half">
                                            <Input
                                                label={t('codeListList.edit.dateFrom')}
                                                id={`${RequestFormEnum.MAIN_GESTOR}.${index}.effectiveFrom`}
                                                {...register(`${RequestFormEnum.MAIN_GESTOR}.${index}.effectiveFrom`)}
                                                type="date"
                                                error={formState.errors[RequestFormEnum.MAIN_GESTOR]?.[index]?.effectiveFrom?.message}
                                            />
                                        </GridCol>
                                        <GridCol setWidth="one-half">
                                            <Input
                                                label={t('codeListList.edit.dateTo')}
                                                id={`${RequestFormEnum.MAIN_GESTOR}.${index}.effectiveTo`}
                                                {...register(`${RequestFormEnum.MAIN_GESTOR}.${index}.effectiveTo`)}
                                                type="date"
                                                error={formState.errors[RequestFormEnum.MAIN_GESTOR]?.[index]?.effectiveTo?.message}
                                            />
                                        </GridCol>
                                    </GridRow>
                                </>
                            ))}

                        <ButtonLink className={styles.bottomGap} label={newGestorLabel} onClick={() => setNewGestor((prev) => !prev)} />

                        {isNewGestor && (
                            <>
                                <SelectLazyLoading<IOption>
                                    id={`${RequestFormEnum.NEW_MAIN_GESTOR}.value`}
                                    name={`${RequestFormEnum.NEW_MAIN_GESTOR}.value`}
                                    loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, additional)}
                                    getOptionLabel={(item) => item.poName ?? ''}
                                    getOptionValue={(item) => item.poUUID ?? ''}
                                    label={t('codeListList.edit.newMainGestor')}
                                    isMulti={false}
                                    setValue={setValue}
                                    error={formState.errors[RequestFormEnum.NEW_MAIN_GESTOR]?.value?.message}
                                />
                                <GridRow className={styles.dateGap}>
                                    <GridCol setWidth="one-half">
                                        <Input
                                            label={t('codeListList.edit.dateFrom')}
                                            id={`${RequestFormEnum.NEW_MAIN_GESTOR}.effectiveFrom`}
                                            {...register(`${RequestFormEnum.NEW_MAIN_GESTOR}.effectiveFrom`)}
                                            type="date"
                                            error={formState.errors[RequestFormEnum.NEW_MAIN_GESTOR]?.effectiveFrom?.message}
                                        />
                                    </GridCol>
                                    <GridCol setWidth="one-half">
                                        <Input
                                            label={t('codeListList.edit.dateTo')}
                                            id={`${RequestFormEnum.NEW_MAIN_GESTOR}.effectiveTo`}
                                            {...register(`${RequestFormEnum.NEW_MAIN_GESTOR}.effectiveTo`)}
                                            type="date"
                                            error={formState.errors[RequestFormEnum.NEW_MAIN_GESTOR]?.effectiveTo?.message}
                                        />
                                    </GridCol>
                                </GridRow>
                            </>
                        )}
                        {nextGestorDefault?.length !== 0 && (
                            <SelectLazyLoading<IOption>
                                id={RequestFormEnum.NEXT_GESTOR}
                                name={RequestFormEnum.NEXT_GESTOR}
                                defaultValue={nextGestorDefault}
                                loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, additional)}
                                getOptionLabel={(item) => item.poName ?? ''}
                                getOptionValue={(item) => item.poUUID ?? ''}
                                label={t('codeListList.edit.nextGestor')}
                                isMulti
                                onChange={(options) => {
                                    setNextGestorList(options as IOption[])
                                    setValue(
                                        RequestFormEnum.NEXT_GESTOR,
                                        (options as IOption[])?.map((i) => ({
                                            value: i.poUUID,
                                        })),
                                    )
                                }}
                                setValue={setValue}
                                error={formState.errors[RequestFormEnum.NEXT_GESTOR]?.message}
                            />
                        )}

                        {nextGestorFormList?.map((gestor, index) => {
                            const nameTo = `${RequestFormEnum.NEXT_GESTOR}[${index}].effectiveTo`
                            const nameFrom = `${RequestFormEnum.NEXT_GESTOR}[${index}].effectiveFrom`
                            return (
                                <>
                                    <TextHeading size="S">
                                        {
                                            nextGestorList.find(
                                                (item) =>
                                                    item.poUUID === ((gestor.value || '').length > 36 ? gestor.value?.substring(37) : gestor.value),
                                            )?.poName
                                        }
                                    </TextHeading>
                                    <GridRow className={styles.dateGap} key={index}>
                                        <GridCol setWidth="one-half">
                                            <Input label={t('codeListList.edit.dateFrom')} id={nameFrom} {...register(nameFrom)} type="date" />
                                        </GridCol>
                                        <GridCol setWidth="one-half">
                                            <Input label={t('codeListList.edit.dateTo')} id={nameTo} {...register(nameTo)} type="date" />
                                        </GridCol>
                                    </GridRow>
                                </>
                            )
                        })}

                        {sourceCodeList?.map((_item, index) => {
                            const name = `${RequestFormEnum.CODE_LIST_SOURCE}.${index}.text`
                            return (
                                <TextArea
                                    key={`sourceCode-${index}`}
                                    rows={5}
                                    label={`${t('codeListList.edit.sourceCode')} ${sourceCodeList.length > 1 ? index + 1 : ''}`}
                                    id={name}
                                    {...register(name)}
                                    error={formState.errors[RequestFormEnum.CODE_LIST_SOURCE]?.[index]?.text?.message}
                                />
                            )
                        })}
                        <ButtonGroupRow className={styles.bottomGap}>
                            <ButtonLink
                                label={t('codeListList.edit.addNewRow')}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setSourceCodeList([...sourceCodeList, { id: notes.length, text: '' }])
                                }}
                            />
                        </ButtonGroupRow>
                        <GridRow>
                            <GridCol setWidth="one-half">
                                <Input
                                    label={t('codeListList.edit.dateStartValid')}
                                    id={RequestFormEnum.DATE_FROM}
                                    {...register(RequestFormEnum.DATE_FROM)}
                                    type="date"
                                    error={formState.errors[RequestFormEnum.DATE_FROM]?.message}
                                />
                            </GridCol>
                            <GridCol setWidth="one-half">
                                <Input
                                    label={t('codeListList.edit.dateEndValid')}
                                    id={RequestFormEnum.DATE_TO}
                                    {...register(RequestFormEnum.DATE_TO)}
                                    type="date"
                                    error={formState.errors[RequestFormEnum.DATE_TO]?.message}
                                />
                            </GridCol>
                        </GridRow>

                        {notes?.map((note, index) => {
                            const name = `${RequestFormEnum.CODE_LIST_NOTES}.${index}.text`
                            return (
                                <TextArea
                                    key={index}
                                    defaultValue={note.text}
                                    rows={5}
                                    label={`${t('codeListList.edit.noteCode')} ${notes.length > 1 ? index + 1 : ''}`}
                                    id={name}
                                    {...register(name)}
                                    error={formState.errors[RequestFormEnum.CODE_LIST_NOTES]?.[index]?.text?.message}
                                />
                            )
                        })}
                        <ButtonGroupRow className={styles.bottomGap}>
                            <ButtonLink
                                label={t('codeListList.edit.addNewRow')}
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
                                    label={t('codeListList.requestCreate.name')}
                                    id={RequestFormEnum.NAME}
                                    {...register(RequestFormEnum.NAME)}
                                    error={formState.errors[RequestFormEnum.NAME]?.message}
                                />
                            </GridCol>
                            <GridCol setWidth="one-half">
                                <Input
                                    required
                                    label={t('codeListList.requestCreate.lastName')}
                                    id={RequestFormEnum.LAST_NAME}
                                    {...register(RequestFormEnum.LAST_NAME)}
                                    error={formState.errors[RequestFormEnum.LAST_NAME]?.message}
                                />
                            </GridCol>
                        </GridRow>
                        <GridRow>
                            <GridCol setWidth="one-half">
                                <Input
                                    required
                                    label={t('codeListList.requestCreate.phone')}
                                    id={RequestFormEnum.PHONE}
                                    {...register(RequestFormEnum.PHONE)}
                                    error={formState.errors[RequestFormEnum.PHONE]?.message}
                                />
                            </GridCol>
                            <GridCol setWidth="one-half">
                                <Input
                                    required
                                    label={t('codeListList.requestCreate.email')}
                                    id={RequestFormEnum.EMAIL}
                                    {...register(RequestFormEnum.EMAIL)}
                                    error={formState.errors[RequestFormEnum.EMAIL]?.message}
                                />
                            </GridCol>
                        </GridRow>

                        <ButtonGroupRow className={styles.buttonGroupEdit}>
                            <ButtonLink className={styles.buttonLock} label={t('codeListList.edit.removeLock')} onClick={handleRemoveLock} />

                            <Button
                                label={t('form.cancel')}
                                type="reset"
                                variant="secondary"
                                onClick={() => navigate(`${RouteNames.CODELISTS}/${codeId}`)}
                            />

                            <Button label={t('form.submit')} type="submit" />

                            <ButtonLink
                                className={styles.buttonDiscard}
                                label={t('codeListList.edit.discardUpdating')}
                                onClick={handleDiscardChanges}
                            />
                        </ButtonGroupRow>
                    </form>
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}

export default CodeListEditView
