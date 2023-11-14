import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { BaseModal, Button, ButtonGroupRow, CheckBox, Input, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'

import { getDescription, getName } from '@/components/views/codeLists/CodeListDetailUtils'
import { useItemSchema } from '@/components/views/codeLists/useCodeListSchemas'

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

export interface ItemFormProps {
    isOpen: boolean
    item?: IItemForm
    defaultOrderValue: number
    attributeProfile?: AttributeProfile
    isErrorMutation: boolean
    isLoadingMutation: boolean
    isSuccessMutation: boolean
    close: () => void
    onSubmit: (form: IItemForm) => void
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

export const ItemForm: React.FC<ItemFormProps> = ({
    isOpen,
    close,
    onSubmit,
    item,
    isErrorMutation,
    isSuccessMutation,
    isLoadingMutation,
    attributeProfile,
    defaultOrderValue = 1,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const { schema } = useItemSchema()

    const defaultValues = {
        ...item,
    }
    if (!defaultValues.order) {
        defaultValues.order = defaultOrderValue
    }

    const { register: registerItem, handleSubmit: handleSubmitItem } = useForm<IItemForm>({
        resolver: yupResolver(schema),
        defaultValues,
    })

    const isCreate = !item?.id

    if (!attributeProfile) return <></>

    return (
        <BaseModal isOpen={isOpen} close={close}>
            <QueryFeedback loading={isLoadingMutation} error={false} withChildren>
                <TextHeading size="L">{t('codeListDetail.title.addNewItem')}</TextHeading>
                <form onSubmit={handleSubmitItem(onSubmit)}>
                    {!isCreate && <Input hidden {...registerItem(CodeListItemFormEnum.ID)} id={CodeListItemFormEnum.ID} />}
                    <Input
                        required
                        {...registerItem(CodeListItemFormEnum.NAME)}
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_nazov_polozky', language)}
                        info={getName(attributeProfile, 'Gui_Profil_ZC_nazov_polozky', language)}
                        id={CodeListItemFormEnum.NAME}
                    />
                    <Input
                        required
                        disabled={!isCreate}
                        {...registerItem(CodeListItemFormEnum.CODE)}
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_kod_polozky', language)}
                        info={getName(attributeProfile, 'Gui_Profil_ZC_kod_polozky', language)}
                        id={CodeListItemFormEnum.CODE}
                    />
                    <Input
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_skrateny_nazov_polozky', language)}
                        info={getName(attributeProfile, 'Gui_Profil_ZC_skrateny_nazov_polozky', language)}
                        {...registerItem(CodeListItemFormEnum.SHORTENED_NAME)}
                        id={CodeListItemFormEnum.SHORTENED_NAME}
                    />
                    <Input
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_skratka_nazvu_polozky', language)}
                        info={getName(attributeProfile, 'Gui_Profil_ZC_skratka_nazvu_polozky', language)}
                        {...registerItem(CodeListItemFormEnum.ABBREVIATED_NAME)}
                        id={CodeListItemFormEnum.ABBREVIATED_NAME}
                    />
                    <Input
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_uri', language)}
                        info={getName(attributeProfile, 'Gui_Profil_ZC_uri', language)}
                        {...registerItem(CodeListItemFormEnum.REF_IDENT)}
                        id={CodeListItemFormEnum.REF_IDENT}
                    />
                    <Input
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_doplnujuci_obsah', language)}
                        info={getName(attributeProfile, 'Gui_Profil_ZC_doplnujuci_obsah', language)}
                        {...registerItem(CodeListItemFormEnum.ADDITIONAL_CONTENT)}
                        id={CodeListItemFormEnum.ADDITIONAL_CONTENT}
                    />
                    <Input
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_merna_jednotka', language)}
                        info={getName(attributeProfile, 'Gui_Profil_ZC_merna_jednotka', language)}
                        {...registerItem(CodeListItemFormEnum.UNIT_OF_MEASURE)}
                        id={CodeListItemFormEnum.UNIT_OF_MEASURE}
                        name={CodeListItemFormEnum.UNIT_OF_MEASURE}
                    />
                    <TextArea
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_poznamka_pre_polozku', language)}
                        info={getName(attributeProfile, 'Gui_Profil_ZC_poznamka_pre_polozku', language)}
                        {...registerItem(CodeListItemFormEnum.NOTE)}
                        id={CodeListItemFormEnum.NOTE}
                        rows={3}
                    />
                    <Input
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_zahrna', language)}
                        info={getName(attributeProfile, 'Gui_Profil_ZC_zahrna', language)}
                        {...registerItem(CodeListItemFormEnum.INCLUDE)}
                        id={CodeListItemFormEnum.INCLUDE}
                    />
                    <Input
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_tiez_zahrna', language)}
                        info={getName(attributeProfile, 'Gui_Profil_ZC_tiez_zahrna', language)}
                        {...registerItem(CodeListItemFormEnum.INCLUDE_ALSO)}
                        id={CodeListItemFormEnum.INCLUDE_ALSO}
                    />
                    <Input
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_vylucuje', language)}
                        info={getName(attributeProfile, 'Gui_Profil_ZC_vylucuje', language)}
                        {...registerItem(CodeListItemFormEnum.EXCLUDE)}
                        id={CodeListItemFormEnum.EXCLUDE}
                    />
                    <Input
                        type="date"
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_datum_platnosti_polozky', language)}
                        info={getName(attributeProfile, 'Gui_Profil_ZC_datum_platnosti_polozky', language)}
                        id={CodeListItemFormEnum.VALID_FROM}
                        {...registerItem(CodeListItemFormEnum.VALID_FROM)}
                    />
                    <Input
                        required
                        type="date"
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_zaciatok_ucinnosti_polozky', language)}
                        info={getName(attributeProfile, 'Gui_Profil_ZC_zaciatok_ucinnosti_polozky', language)}
                        id={CodeListItemFormEnum.EFFECTIVE_FROM}
                        {...registerItem(CodeListItemFormEnum.EFFECTIVE_FROM)}
                    />
                    <Input
                        type="date"
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_koniec_ucinnosti_polozky', language)}
                        info={getName(attributeProfile, 'Gui_Profil_ZC_koniec_ucinnosti_polozky', language)}
                        id={CodeListItemFormEnum.EFFECTIVE_TO}
                        {...registerItem(CodeListItemFormEnum.EFFECTIVE_TO)}
                    />
                    <Input
                        type="number"
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_logicke_poradie_polozky', language)}
                        info={getName(attributeProfile, 'Gui_Profil_ZC_logicke_poradie_polozky', language)}
                        id={CodeListItemFormEnum.ORDER}
                        {...registerItem(CodeListItemFormEnum.ORDER)}
                    />
                    <CheckBox
                        label={getDescription(attributeProfile, 'Gui_Profil_ZC_legislativna_uznatelnost', language)}
                        info={getName(attributeProfile, 'Gui_Profil_ZC_legislativna_uznatelnost', language)}
                        {...registerItem(CodeListItemFormEnum.LEGISLATIVE_VALIDITY)}
                        id={CodeListItemFormEnum.LEGISLATIVE_VALIDITY}
                        name={CodeListItemFormEnum.LEGISLATIVE_VALIDITY}
                    />
                    <MutationFeedback
                        success={isSuccessMutation}
                        successMessage={t('codeListDetail.feedback.editCodeListItems')}
                        error={isErrorMutation && t('feedback.mutationErrorMessage')}
                    />
                    <ButtonGroupRow>
                        <Button label={t('form.cancel')} type="reset" variant="secondary" onClick={close} />
                        <Button label={t('form.submit')} type="submit" />
                    </ButtonGroupRow>
                </form>
            </QueryFeedback>
        </BaseModal>
    )
}
