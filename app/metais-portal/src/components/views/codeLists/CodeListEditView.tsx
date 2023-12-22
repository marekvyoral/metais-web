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
    LoadingIndicator,
    SelectLazyLoading,
    TextArea,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getOrgIdFromGid } from '@isdd/metais-common/utils/utils'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, Subjects } from '@isdd/metais-common/hooks/permissions/useCodeListPermissions'

import { useEditCodeListSchema } from './useEditCodeListSchemas'
import { getDescription, getName } from './CodeListDetailUtils'

import { IEditCodeListForm, DEFAULT_EMPTY_NOTE, mapCodeListToEditForm } from '@/componentHelpers/codeList'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { EditCodeListContainerViewProps } from '@/components/containers/EditCodeListContainer'
import styles from '@/components/views/codeLists/codeList.module.scss'

export interface IOption {
    name?: string
    value?: string
}

export interface IFieldTextRow {
    id?: number
    text?: string
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
    EFFECTIVE_FROM = 'effectiveFrom',
    EFFECTIVE_TO = 'effectiveTo',
    NAME = 'name',
    LAST_NAME = 'lastName',
    PHONE = 'phone',
    EMAIL = 'email',
}

export const CodeListEditView: React.FC<EditCodeListContainerViewProps> = ({
    data,
    isError,
    errorMessages,
    isLoading,
    isLoadingMutation,
    loadOptions,
    handleSave,
    handleDiscardChanges,
    handleRemoveLock,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const navigate = useNavigate()
    const { schema } = useEditCodeListSchema()
    const { codeList, defaultManagers, attributeProfile } = data
    const mappedData = useMemo(() => {
        return mapCodeListToEditForm(codeList, language)
    }, [codeList, language])
    const [isNewGestor, setNewGestor] = useState<boolean>(false)
    const [isNewCodeListName, setNewCodeListName] = useState<boolean>(false)
    const [nextGestorList, setNextGestorList] = useState<IOption[] | undefined>(undefined)
    const [notes, setNotes] = useState<IFieldTextRow[]>(DEFAULT_EMPTY_NOTE)
    const [sourceCodeList, setSourceCodeList] = useState<IFieldTextRow[]>(DEFAULT_EMPTY_NOTE)
    const { register, handleSubmit, formState, watch, setValue, reset } = useForm<IEditCodeListForm>({
        resolver: yupResolver(schema),
        reValidateMode: 'onSubmit',
        defaultValues: mappedData,
    })

    const codeId = data.codeList?.id
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
        return data?.codeList?.codelistNames?.find((i) => i.language == language)?.value
    }, [data?.codeList?.codelistNames, language])

    const nextGestorDefault = useMemo(() => {
        return mappedData?.nextGestor?.map((gestor) => ({
            name: defaultManagers?.find((manager) => manager.value === getOrgIdFromGid(gestor?.value ?? ''))?.name ?? '',
            value: gestor.value,
        }))
    }, [defaultManagers, mappedData?.nextGestor])

    const newGestorLabel = isNewGestor ? t('codeListList.edit.cancelAddNewGestor') : t('codeListList.edit.addNewGestor')
    const newCodeListNameLabel = isNewCodeListName ? t('codeListList.edit.cancelAddNewVersionName') : t('codeListList.edit.addNewVersionName')

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('codeList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('codeList.breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('codeList.breadcrumbs.codeLists'), href: RouteNames.HOW_TO_CODELIST },
                    { label: t('codeList.breadcrumbs.codeListsList'), href: NavigationSubRoutes.CODELIST },
                    { label: codeListName ?? t('codeList.breadcrumbs.detail'), href: `${NavigationSubRoutes.CODELIST}/${codeId}` },
                    { label: t('codeList.breadcrumbs.detailEdit'), href: `${NavigationSubRoutes.CODELIST}/${codeId}/edit` },
                ]}
            />

            <Can I={Actions.EDIT} a={Subjects.DETAIL}>
                <MainContentWrapper>
                    <QueryFeedback loading={isLoading} error={isError} withChildren>
                        {isLoadingMutation && <LoadingIndicator label={t('feedback.saving')} />}
                        <TextHeading size="XL">{t('codeListList.edit.title')}</TextHeading>
                        <form onSubmit={handleSubmit(onHandleSubmit)}>
                            <div className={styles.bottomGap}>
                                <CheckBox
                                    label={getDescription('Gui_Profil_ZC_zakladny_ciselnik', language, attributeProfile)}
                                    info={getName('Gui_Profil_ZC_zakladny_ciselnik', language, attributeProfile)}
                                    id={RequestFormEnum.BASE}
                                    {...register(RequestFormEnum.BASE)}
                                    name={RequestFormEnum.BASE}
                                />
                            </div>
                            <Input
                                required
                                label={getDescription('Gui_Profil_ZC_nazov_ciselnika', language, attributeProfile)}
                                info={getName('Gui_Profil_ZC_nazov_ciselnika', language, attributeProfile)}
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

                            <ButtonLink
                                className={styles.bottomGap}
                                label={newCodeListNameLabel}
                                type="button"
                                onClick={() => {
                                    setValue(RequestFormEnum.NEW_CODE_LIST_NAME, undefined)
                                    setNewCodeListName((prev) => !prev)
                                }}
                            />

                            {isNewCodeListName && (
                                <>
                                    <Input
                                        label={getDescription('Gui_Profil_ZC_nazov_ciselnika', language, attributeProfile)}
                                        info={getName('Gui_Profil_ZC_nazov_ciselnika', language, attributeProfile)}
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
                                label={getDescription('Gui_Profil_ZC_kod_ciselnika', language, attributeProfile)}
                                info={getName('Gui_Profil_ZC_kod_ciselnika', language, attributeProfile)}
                                id={RequestFormEnum.CODE}
                                {...register(RequestFormEnum.CODE)}
                                error={formState.errors[RequestFormEnum.CODE]?.message}
                            />
                            <Input
                                disabled
                                label={getDescription('Gui_Profil_ZC_uri', language, attributeProfile)}
                                info={getName('Gui_Profil_ZC_uri', language, attributeProfile)}
                                id={RequestFormEnum.REF_INDICATOR}
                                {...register(RequestFormEnum.REF_INDICATOR)}
                                error={formState.errors[RequestFormEnum.REF_INDICATOR]?.message}
                            />

                            {defaultManagers?.length !== 0 &&
                                mappedData?.mainGestor?.map((gestor, index) => (
                                    <>
                                        <SelectLazyLoading<IOption>
                                            key={gestor.id}
                                            defaultValue={defaultManagers?.find((i) => i.value === getOrgIdFromGid(gestor.value ?? ''))}
                                            id={RequestFormEnum.MAIN_GESTOR}
                                            name={`${RequestFormEnum.MAIN_GESTOR}[${index}].value`}
                                            loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, true, additional)}
                                            getOptionLabel={(item) => item.name ?? ''}
                                            getOptionValue={(item) => item.value ?? ''}
                                            label={`${getDescription('Gui_Profil_ZC_hlavny_gestor', language, attributeProfile)}  ${index + 1}`}
                                            info={getName('Gui_Profil_ZC_hlavny_gestor', language, attributeProfile)}
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

                            <ButtonLink
                                className={styles.bottomGap}
                                label={newGestorLabel}
                                type="button"
                                onClick={() => {
                                    setValue(RequestFormEnum.NEW_MAIN_GESTOR, undefined)
                                    setNewGestor((prev) => !prev)
                                }}
                            />

                            {isNewGestor && (
                                <>
                                    <SelectLazyLoading<IOption>
                                        id={`${RequestFormEnum.NEW_MAIN_GESTOR}.value`}
                                        name={`${RequestFormEnum.NEW_MAIN_GESTOR}.value`}
                                        loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, true, additional)}
                                        getOptionLabel={(item) => item.name ?? ''}
                                        getOptionValue={(item) => item.value ?? ''}
                                        label={t('codeListList.edit.newMainGestor')}
                                        info={getName('Gui_Profil_ZC_hlavny_gestor', language, attributeProfile)}
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
                            {nextGestorList !== undefined && (
                                <SelectLazyLoading<IOption>
                                    id={RequestFormEnum.NEXT_GESTOR}
                                    name={RequestFormEnum.NEXT_GESTOR}
                                    defaultValue={nextGestorDefault}
                                    loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, false, additional)}
                                    getOptionLabel={(item) => item.name ?? ''}
                                    getOptionValue={(item) => item.value ?? ''}
                                    label={getDescription('Gui_Profil_ZC_vedlajsi_gestor', language, attributeProfile)}
                                    info={getName('Gui_Profil_ZC_vedlajsi_gestor', language, attributeProfile)}
                                    isMulti
                                    onChange={(options) => {
                                        setNextGestorList(options as IOption[])
                                        setValue(
                                            RequestFormEnum.NEXT_GESTOR,
                                            (options as IOption[])?.map((i) => ({
                                                value: i.value,
                                            })),
                                        )
                                    }}
                                    setValue={setValue}
                                    error={formState.errors[RequestFormEnum.NEXT_GESTOR]?.message}
                                />
                            )}
                            {nextGestorFormList?.map((gestor, index) => {
                                const nameFrom = `${RequestFormEnum.NEXT_GESTOR}[${index}].effectiveFrom`
                                const nameTo = `${RequestFormEnum.NEXT_GESTOR}[${index}].effectiveTo`
                                return (
                                    <>
                                        <TextHeading size="S">
                                            {
                                                nextGestorList?.find((item) => {
                                                    return (
                                                        (item?.value && item.value.length > 36 ? getOrgIdFromGid(item.value ?? '') : item.value) ===
                                                        getOrgIdFromGid(gestor.value ?? '')
                                                    )
                                                })?.name
                                            }
                                        </TextHeading>
                                        <GridRow className={styles.dateGap} key={index}>
                                            <GridCol setWidth="one-half">
                                                <Input
                                                    label={t('codeListList.edit.dateFrom')}
                                                    id={nameFrom}
                                                    {...register(nameFrom)}
                                                    type="date"
                                                    error={formState.errors[RequestFormEnum.NEXT_GESTOR]?.[index]?.effectiveFrom?.message}
                                                />
                                            </GridCol>
                                            <GridCol setWidth="one-half">
                                                <Input
                                                    label={t('codeListList.edit.dateTo')}
                                                    id={nameTo}
                                                    {...register(nameTo)}
                                                    type="date"
                                                    error={formState.errors[RequestFormEnum.NEXT_GESTOR]?.[index]?.effectiveTo?.message}
                                                />
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
                                        label={`${getDescription('Gui_Profil_ZC_zdrojovy_ciselnik', language, attributeProfile)}  ${
                                            sourceCodeList.length > 1 ? index + 1 : ''
                                        }`}
                                        info={getName('Gui_Profil_ZC_zdrojovy_ciselnik', language, attributeProfile)}
                                        id={name}
                                        {...register(name)}
                                        error={formState.errors[RequestFormEnum.CODE_LIST_SOURCE]?.[index]?.text?.message}
                                    />
                                )
                            })}
                            <ButtonGroupRow className={styles.bottomGap}>
                                <ButtonLink
                                    label={t('codeListList.edit.addNewRow')}
                                    type="button"
                                    onClick={() => {
                                        setSourceCodeList([...sourceCodeList, { id: notes.length, text: '' }])
                                    }}
                                />
                            </ButtonGroupRow>
                            <GridRow>
                                <GridCol setWidth="one-half">
                                    <Input
                                        label={getDescription('Gui_Profil_ZC_zaciatok_ucinnosti_polozky', language, attributeProfile)}
                                        info={getName('Gui_Profil_ZC_zaciatok_ucinnosti_polozky', language, attributeProfile)}
                                        id={RequestFormEnum.EFFECTIVE_FROM}
                                        {...register(RequestFormEnum.EFFECTIVE_FROM)}
                                        type="date"
                                        error={formState.errors[RequestFormEnum.EFFECTIVE_FROM]?.message}
                                    />
                                </GridCol>
                                <GridCol setWidth="one-half">
                                    <Input
                                        label={getDescription('Gui_Profil_ZC_koniec_ucinnosti_polozky', language, attributeProfile)}
                                        info={getName('Gui_Profil_ZC_koniec_ucinnosti_polozky', language, attributeProfile)}
                                        id={RequestFormEnum.EFFECTIVE_TO}
                                        {...register(RequestFormEnum.EFFECTIVE_TO)}
                                        type="date"
                                        error={formState.errors[RequestFormEnum.EFFECTIVE_TO]?.message}
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
                                        label={`${getDescription('Gui_Profil_ZC_poznamka_pre_ciselnik', language, attributeProfile)}  ${
                                            notes.length > 1 ? index + 1 : ''
                                        }`}
                                        info={getName('Gui_Profil_ZC_poznamka_pre_ciselnik', language, attributeProfile)}
                                        id={name}
                                        {...register(name)}
                                        error={formState.errors[RequestFormEnum.CODE_LIST_NOTES]?.[index]?.text?.message}
                                    />
                                )
                            })}
                            <ButtonGroupRow className={styles.bottomGap}>
                                <ButtonLink
                                    label={t('codeListList.edit.addNewRow')}
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
                                        label={getDescription('Gui_Profil_ZC_priezvisko', language, attributeProfile)}
                                        info={getName('Gui_Profil_ZC_priezvisko', language, attributeProfile)}
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
                                        label={getDescription('Gui_Profil_ZC_email', language, attributeProfile)}
                                        info={getName('Gui_Profil_ZC_email', language, attributeProfile)}
                                        id={RequestFormEnum.EMAIL}
                                        {...register(RequestFormEnum.EMAIL)}
                                        error={formState.errors[RequestFormEnum.EMAIL]?.message}
                                    />
                                </GridCol>
                            </GridRow>

                            {errorMessages.map((errorMessage, index) => (
                                <MutationFeedback success={false} key={index} error={t([errorMessage, 'feedback.mutationErrorMessage'])} />
                            ))}

                            <ButtonGroupRow className={styles.buttonGroupEdit}>
                                <ButtonLink
                                    type="button"
                                    className={styles.buttonLock}
                                    label={t('codeListList.edit.removeLock')}
                                    onClick={handleRemoveLock}
                                />

                                <Button
                                    label={t('form.cancel')}
                                    type="reset"
                                    variant="secondary"
                                    onClick={() => navigate(`${NavigationSubRoutes.CODELIST}/${data.codeList?.id}`)}
                                />

                                <Button label={t('codeListDetail.button.save')} type="submit" />

                                <ButtonLink
                                    className={styles.buttonDiscard}
                                    label={t('codeListList.edit.discardUpdating')}
                                    type="button"
                                    onClick={handleDiscardChanges}
                                />
                            </ButtonGroupRow>
                        </form>
                    </QueryFeedback>
                </MainContentWrapper>
            </Can>
        </>
    )
}

export default CodeListEditView
