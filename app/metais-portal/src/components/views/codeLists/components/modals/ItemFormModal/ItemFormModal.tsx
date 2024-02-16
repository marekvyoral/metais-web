import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { BaseModal, CheckBox, Input, LoadingIndicator, TextArea, TextHeading, TextWarning } from '@isdd/idsk-ui-kit/index'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { ModalButtons, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import {
    ApiCodelistItem,
    useCreateCodelistItem,
    useCreateNewCodelistItemLangExtended,
    useGetTemporalCodelistItemWithLockHook,
    useProcessItemAction,
    useUpdateAndUnlockTemporalCodelistItem,
    useUpdateCodelistItemLangExtended,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { useMutation } from '@tanstack/react-query'

import { getDescription, getName } from '@/components/views/codeLists/CodeListDetailUtils'
import { useItemSchema } from '@/components/views/codeLists/useCodeListSchemas'
import {
    ApiCodeListItemsActions,
    CodeListItemState,
    getErrorTranslateKeys,
    mapCodeListItemToForm,
    mapFormToCodeListItem,
    removeOtherLanguagesFromItem,
} from '@/componentHelpers/codeList'

export interface IItemForm {
    id?: string
    code: string
    name: string
    shortenedName?: string
    abbreviatedName?: string
    refIdent?: string
    additionalContent?: string
    unitOfMeasure?: string
    note?: string
    legislativeValidity?: string
    exclude?: string
    include?: string
    includeAlso?: string
    order?: number
    validFrom?: string
    effectiveFrom: string
    effectiveTo?: string
    lockedBy?: string
    lockedFrom?: string
    selected?: boolean
}

export interface ItemFormModalProps {
    isOpen: boolean
    item?: ApiCodelistItem
    codeListCode: string
    defaultOrderValue: number
    attributeProfile?: AttributeProfile
    workingLanguage: string
    close: () => void
}

export enum CodeListItemFormEnum {
    ID = 'id',
    CODE = 'code',
    NAME = 'name',
    SHORTENED_NAME = 'shortenedName',
    ABBREVIATED_NAME = 'abbreviatedName',
    REF_IDENT = 'refIdent',
    ADDITIONAL_CONTENT = 'additionalContent',
    UNIT_OF_MEASURE = 'unitOfMeasure',
    NOTE = 'note',
    EXCLUDE = 'exclude',
    INCLUDE = 'include',
    INCLUDE_ALSO = 'includeAlso',
    ORDER = 'order',
    LEGISLATIVE_VALIDITY = 'legislativeValidity',
    VALID_FROM = 'validFrom',
    EFFECTIVE_FROM = 'effectiveFrom',
    EFFECTIVE_TO = 'effectiveTo',
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
    isOpen,
    close,
    item,
    codeListCode,
    attributeProfile,
    workingLanguage,
    defaultOrderValue = 1,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const { schema } = useItemSchema()

    const [defaultValues, setDefaultValues] = useState<IItemForm | undefined>(undefined)

    const isEdit = !!item?.id ?? false

    const mutationCreateItemLangExtended = useCreateNewCodelistItemLangExtended()
    const mutationUpdateAndUnlockItem = useUpdateAndUnlockTemporalCodelistItem()
    const mutationUpdateItemLangExtended = useUpdateCodelistItemLangExtended()
    const mutationCreateItem = useCreateCodelistItem()
    const mutationItemAction = useProcessItemAction()
    const getTemporalItemWithLock = useGetTemporalCodelistItemWithLockHook()
    const mutationTemporalItemWithLock = useMutation({
        mutationFn: (variables: { code: string; itemCode: string }) => {
            return getTemporalItemWithLock(variables.code, variables.itemCode)
        },
    })

    const fetchAndSetDefaultValues = async () => {
        if (item?.codelistItemState === CodeListItemState.READY_TO_PUBLISH) {
            await mutationItemAction.mutateAsync({
                code: codeListCode,
                itemCode: item.itemCode ?? '',
                params: { action: ApiCodeListItemsActions.CODELIST_ITEM_BACK_FROM_READY_TO_PUBLISH },
            })
            if (mutationItemAction.isError) return {}
        }

        const lockedItem = await mutationTemporalItemWithLock.mutateAsync({ code: codeListCode, itemCode: item?.itemCode ?? '' })
        if (!lockedItem || mutationTemporalItemWithLock.isError) return {}

        const newDefaultValues = {
            ...mapCodeListItemToForm(lockedItem || {}, workingLanguage),
        }

        if (!newDefaultValues.order) {
            newDefaultValues.order = defaultOrderValue
        }

        setDefaultValues(newDefaultValues)
    }

    const { register, handleSubmit, formState } = useForm<IItemForm>({
        resolver: yupResolver(schema),
        values: defaultValues,
    })

    const handleApiSubmitItem = (form: IItemForm) => {
        if (form.id) {
            // edit
            const mappedItem = mapFormToCodeListItem(workingLanguage, form, item)
            if (item?.codelistItemNames?.some((name) => name.language === workingLanguage)) {
                // update existing
                mutationUpdateAndUnlockItem.mutate({ code: codeListCode, itemCode: mappedItem.itemCode || '', data: mappedItem })
            } else {
                // add language version
                const strippedItem = removeOtherLanguagesFromItem(mappedItem, workingLanguage)
                mutationCreateItemLangExtended.mutate({
                    code: codeListCode,
                    itemCode: strippedItem.itemCode || '',
                    data: strippedItem,
                    actualLang: workingLanguage,
                })
                mutationUpdateItemLangExtended.mutate({ code: codeListCode, itemCode: strippedItem.itemCode || '', data: strippedItem })
            }
        } else {
            // create
            const mappedItem = mapFormToCodeListItem(workingLanguage, form)
            mutationCreateItem.mutate({ code: codeListCode, data: mappedItem })
        }
    }
    const submitMutations = [mutationCreateItem, mutationUpdateAndUnlockItem, mutationUpdateItemLangExtended, mutationCreateItemLangExtended]
    const loadMutations = [mutationItemAction, mutationTemporalItemWithLock]

    const [submitErrorMessage] = getErrorTranslateKeys(submitMutations.map((mutation) => mutation.error as { message: string }))
    const [loadErrorMessage] = getErrorTranslateKeys(loadMutations.map((mutation) => mutation.error as { message: string }))
    const isLoadingMutation = submitMutations.some((mutation) => mutation.isLoading)
    const isLoadingFormData = loadMutations.some((mutation) => mutation.isLoading)
    const isSuccess = submitMutations.some((mutation) => mutation.isSuccess)

    useEffect(() => {
        if (isEdit) {
            fetchAndSetDefaultValues()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item])

    return (
        <QueryFeedback loading={isLoadingFormData} indicatorProps={{ fullscreen: true }}>
            <BaseModal isOpen={isOpen} close={close}>
                <TextHeading size="L">{t(`codeListDetail.title.${isEdit ? 'editItem' : 'addNewItem'}`)}</TextHeading>
                <TextWarning>
                    {t(`codeListDetail.warning.workingLanguageNotice`, { language: t(`codeListDetail.languages.${workingLanguage}`) })}
                </TextWarning>
                {isLoadingMutation && <LoadingIndicator label={t('feedback.saving')} />}
                {loadErrorMessage && (
                    <QueryFeedback
                        loading={false}
                        error={!!loadErrorMessage}
                        errorProps={{ errorMessage: t([loadErrorMessage, 'feedback.queryErrorMessage']) }}
                        showSupportEmail
                    />
                )}
                {!loadErrorMessage && (
                    <form onSubmit={handleSubmit(handleApiSubmitItem)}>
                        {isEdit && <input hidden {...register(CodeListItemFormEnum.ID)} id={CodeListItemFormEnum.ID} />}
                        <Input
                            required
                            label={getDescription('Gui_Profil_ZC_nazov_polozky', language, attributeProfile)}
                            info={getName('Gui_Profil_ZC_nazov_polozky', language, attributeProfile)}
                            id={CodeListItemFormEnum.NAME}
                            {...register(CodeListItemFormEnum.NAME)}
                            error={formState.errors?.[CodeListItemFormEnum.NAME]?.message}
                        />
                        <Input
                            required
                            disabled={isEdit}
                            label={getDescription('Gui_Profil_ZC_kod_polozky', language, attributeProfile)}
                            info={getName('Gui_Profil_ZC_kod_polozky', language, attributeProfile)}
                            id={CodeListItemFormEnum.CODE}
                            {...register(CodeListItemFormEnum.CODE)}
                            error={formState.errors?.[CodeListItemFormEnum.CODE]?.message}
                        />
                        <Input
                            label={getDescription('Gui_Profil_ZC_skrateny_nazov_polozky', language, attributeProfile)}
                            info={getName('Gui_Profil_ZC_skrateny_nazov_polozky', language, attributeProfile)}
                            id={CodeListItemFormEnum.SHORTENED_NAME}
                            {...register(CodeListItemFormEnum.SHORTENED_NAME)}
                            error={formState.errors?.[CodeListItemFormEnum.SHORTENED_NAME]?.message}
                        />
                        <Input
                            label={getDescription('Gui_Profil_ZC_skratka_nazvu_polozky', language, attributeProfile)}
                            info={getName('Gui_Profil_ZC_skratka_nazvu_polozky', language, attributeProfile)}
                            id={CodeListItemFormEnum.ABBREVIATED_NAME}
                            {...register(CodeListItemFormEnum.ABBREVIATED_NAME)}
                            error={formState.errors?.[CodeListItemFormEnum.ABBREVIATED_NAME]?.message}
                        />
                        <Input
                            label={getDescription('Gui_Profil_ZC_uri', language, attributeProfile)}
                            info={getName('Gui_Profil_ZC_uri', language, attributeProfile)}
                            id={CodeListItemFormEnum.REF_IDENT}
                            {...register(CodeListItemFormEnum.REF_IDENT)}
                            error={formState.errors?.[CodeListItemFormEnum.REF_IDENT]?.message}
                        />
                        <Input
                            label={getDescription('Gui_Profil_ZC_doplnujuci_obsah', language, attributeProfile)}
                            info={getName('Gui_Profil_ZC_doplnujuci_obsah', language, attributeProfile)}
                            id={CodeListItemFormEnum.ADDITIONAL_CONTENT}
                            {...register(CodeListItemFormEnum.ADDITIONAL_CONTENT)}
                            error={formState.errors?.[CodeListItemFormEnum.ADDITIONAL_CONTENT]?.message}
                        />
                        <Input
                            label={getDescription('Gui_Profil_ZC_merna_jednotka', language, attributeProfile)}
                            info={getName('Gui_Profil_ZC_merna_jednotka', language, attributeProfile)}
                            id={CodeListItemFormEnum.UNIT_OF_MEASURE}
                            {...register(CodeListItemFormEnum.UNIT_OF_MEASURE)}
                            error={formState.errors?.[CodeListItemFormEnum.UNIT_OF_MEASURE]?.message}
                        />
                        <TextArea
                            label={getDescription('Gui_Profil_ZC_poznamka_pre_polozku', language, attributeProfile)}
                            info={getName('Gui_Profil_ZC_poznamka_pre_polozku', language, attributeProfile)}
                            id={CodeListItemFormEnum.NOTE}
                            rows={3}
                            {...register(CodeListItemFormEnum.NOTE)}
                            error={formState.errors?.[CodeListItemFormEnum.NOTE]?.message}
                        />
                        <Input
                            label={getDescription('Gui_Profil_ZC_zahrna', language, attributeProfile)}
                            info={getName('Gui_Profil_ZC_zahrna', language, attributeProfile)}
                            id={CodeListItemFormEnum.INCLUDE}
                            {...register(CodeListItemFormEnum.INCLUDE)}
                            error={formState.errors?.[CodeListItemFormEnum.INCLUDE]?.message}
                        />
                        <Input
                            label={getDescription('Gui_Profil_ZC_tiez_zahrna', language, attributeProfile)}
                            info={getName('Gui_Profil_ZC_tiez_zahrna', language, attributeProfile)}
                            id={CodeListItemFormEnum.INCLUDE_ALSO}
                            {...register(CodeListItemFormEnum.INCLUDE_ALSO)}
                            error={formState.errors?.[CodeListItemFormEnum.INCLUDE_ALSO]?.message}
                        />
                        <Input
                            label={getDescription('Gui_Profil_ZC_vylucuje', language, attributeProfile)}
                            info={getName('Gui_Profil_ZC_vylucuje', language, attributeProfile)}
                            id={CodeListItemFormEnum.EXCLUDE}
                            {...register(CodeListItemFormEnum.EXCLUDE)}
                            error={formState.errors?.[CodeListItemFormEnum.EXCLUDE]?.message}
                        />
                        <Input
                            type="date"
                            label={getDescription('Gui_Profil_ZC_datum_platnosti_polozky', language, attributeProfile)}
                            info={getName('Gui_Profil_ZC_datum_platnosti_polozky', language, attributeProfile)}
                            id={CodeListItemFormEnum.VALID_FROM}
                            {...register(CodeListItemFormEnum.VALID_FROM)}
                            error={formState.errors?.[CodeListItemFormEnum.VALID_FROM]?.message}
                        />
                        <Input
                            required
                            type="date"
                            label={getDescription('Gui_Profil_ZC_zaciatok_ucinnosti_polozky', language, attributeProfile)}
                            info={getName('Gui_Profil_ZC_zaciatok_ucinnosti_polozky', language, attributeProfile)}
                            id={CodeListItemFormEnum.EFFECTIVE_FROM}
                            {...register(CodeListItemFormEnum.EFFECTIVE_FROM)}
                            error={formState.errors?.[CodeListItemFormEnum.EFFECTIVE_FROM]?.message}
                        />
                        <Input
                            type="date"
                            label={getDescription('Gui_Profil_ZC_koniec_ucinnosti_polozky', language, attributeProfile)}
                            info={getName('Gui_Profil_ZC_koniec_ucinnosti_polozky', language, attributeProfile)}
                            id={CodeListItemFormEnum.EFFECTIVE_TO}
                            {...register(CodeListItemFormEnum.EFFECTIVE_TO)}
                            error={formState.errors?.[CodeListItemFormEnum.EFFECTIVE_TO]?.message}
                        />
                        <Input
                            type="number"
                            label={getDescription('Gui_Profil_ZC_logicke_poradie_polozky', language, attributeProfile)}
                            info={getName('Gui_Profil_ZC_logicke_poradie_polozky', language, attributeProfile)}
                            id={CodeListItemFormEnum.ORDER}
                            {...register(CodeListItemFormEnum.ORDER)}
                            error={formState.errors?.[CodeListItemFormEnum.ORDER]?.message}
                        />
                        <CheckBox
                            label={getDescription('Gui_Profil_ZC_legislativna_uznatelnost', language, attributeProfile)}
                            info={getName('Gui_Profil_ZC_legislativna_uznatelnost', language, attributeProfile)}
                            id={CodeListItemFormEnum.LEGISLATIVE_VALIDITY}
                            {...register(CodeListItemFormEnum.LEGISLATIVE_VALIDITY)}
                            error={formState.errors?.[CodeListItemFormEnum.LEGISLATIVE_VALIDITY]?.message}
                        />
                        <MutationFeedback
                            success={isSuccess}
                            successMessage={isEdit ? t('codeListDetail.feedback.editItemSuccess') : t('codeListDetail.feedback.createItemSuccess')}
                            error={submitErrorMessage && t([submitErrorMessage, 'feedback.mutationErrorMessage'])}
                        />

                        <ModalButtons submitButtonLabel={t('codeListDetail.button.save')} closeButtonLabel={t('form.cancel')} onClose={close} />
                    </form>
                )}
            </BaseModal>
        </QueryFeedback>
    )
}
