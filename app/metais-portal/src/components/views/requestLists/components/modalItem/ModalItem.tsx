import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { BaseModal, CheckBox, Input, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { ModalButtons } from '@isdd/metais-common/index'
import { useGetNextItemCodeHook } from '@isdd/metais-common/api/generated/codelist-repo-swagger'

import { useItemSchema } from '@/components/views/requestLists/useRequestSchemas'
import { getDescription, getName } from '@/components/views/codeLists/CodeListDetailUtils'
import { IRequestForm, getItemCodelistRefId } from '@/componentHelpers/requests'

export interface IItemForm {
    id?: string
    codeItem: string
    codeName: string
    shortname?: string
    shortcut?: string
    refident?: string
    addData?: string
    unit?: string
    note?: string
    contain?: string
    alsoContain?: string
    law?: boolean
    exclude?: string
    order?: number
    validDate?: string
    effectiveFrom?: string
    lockedBy?: string
    lockedFrom?: string
    state?: string
    selected?: boolean
}

export interface ModalItemProps {
    isOpen: boolean
    canEdit: boolean
    item?: IItemForm
    attributeProfile?: AttributeProfile
    close: () => void
    onSubmit: (form: IItemForm) => void
    createRefIdUri?: string
    createItemCode?: string
    editData?: IRequestForm | undefined
    charCount?: number
    prefix?: string
    isAutoincrementValid: boolean
}

export enum RequestItemFormEnum {
    CODEITEM = 'codeItem',
    CODENAME = 'codeName',
    SHORTNAME = 'shortname',
    SHORTCUT = 'shortcut',
    REFIDENT = 'refident',
    ADDATA = 'addData',
    UNIT = 'unit',
    NOTE = 'note',
    CONTAIN = 'contain',
    ALSOCONTAIN = 'alsoContain',
    EXCLUDE = 'exclude',
    ORDER = 'order',
    LAW = 'law',
    VALIDDATE = 'validDate',
    STARTDATE = 'effectiveFrom',
    ENDDATE = 'endDate',
}

export const ModalItem: React.FC<ModalItemProps> = ({
    isOpen,
    canEdit,
    close,
    onSubmit,
    item,
    attributeProfile,
    createRefIdUri,
    editData,
    charCount,
    prefix,
    createItemCode,
    isAutoincrementValid,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const { schema } = useItemSchema()
    const isEdit = !!editData

    const { register, handleSubmit, formState, reset } = useForm<IItemForm>({
        resolver: yupResolver(schema),
        defaultValues: { ...item, refident: isEdit ? undefined : createRefIdUri, codeItem: createItemCode },
    })

    const nextItemCode = useGetNextItemCodeHook()
    useEffect(() => {
        if (isEdit) {
            const getNextItemCode = async () => {
                const itemCode = await nextItemCode(editData.codeListCode, { charCount, prefix })
                const finalRefId = getItemCodelistRefId(editData.refIndicator ?? '', itemCode)
                reset({ ...item, refident: finalRefId, codeItem: itemCode })
            }

            getNextItemCode()
        }
    }, [item, reset, editData, isEdit, nextItemCode, charCount, prefix])

    return (
        <BaseModal isOpen={isOpen} close={close}>
            <TextHeading size="L">{'Pridanie novej položky do číselníka'}</TextHeading>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Input
                    required
                    disabled={!canEdit || isAutoincrementValid}
                    label={getDescription('Gui_Profil_ZC_kod_polozky', language, attributeProfile)}
                    info={getName('Gui_Profil_ZC_kod_polozky', language, attributeProfile)}
                    id={RequestItemFormEnum.CODEITEM}
                    {...register(RequestItemFormEnum.CODEITEM)}
                    error={formState.errors?.[RequestItemFormEnum.CODEITEM]?.message}
                />
                <Input
                    required
                    disabled={!canEdit}
                    label={getDescription('Gui_Profil_ZC_nazov_polozky', language, attributeProfile)}
                    info={getName('Gui_Profil_ZC_nazov_polozky', language, attributeProfile)}
                    id={RequestItemFormEnum.CODENAME}
                    {...register(RequestItemFormEnum.CODENAME)}
                    error={formState.errors?.[RequestItemFormEnum.CODENAME]?.message}
                />
                <Input
                    disabled={!canEdit}
                    label={getDescription('Gui_Profil_ZC_skrateny_nazov_polozky', language, attributeProfile)}
                    info={getName('Gui_Profil_ZC_skrateny_nazov_polozky', language, attributeProfile)}
                    id={RequestItemFormEnum.SHORTNAME}
                    {...register(RequestItemFormEnum.SHORTNAME)}
                    error={formState.errors?.[RequestItemFormEnum.SHORTNAME]?.message}
                />
                <Input
                    disabled={!canEdit}
                    label={getDescription('Gui_Profil_ZC_skratka_nazvu_polozky', language, attributeProfile)}
                    info={getName('Gui_Profil_ZC_skratka_nazvu_polozky', language, attributeProfile)}
                    id={RequestItemFormEnum.SHORTCUT}
                    {...register(RequestItemFormEnum.SHORTCUT)}
                    error={formState.errors?.[RequestItemFormEnum.SHORTCUT]?.message}
                />
                <Input
                    disabled={!canEdit || isAutoincrementValid}
                    label={getDescription('Gui_Profil_ZC_uri', language, attributeProfile)}
                    info={getName('Gui_Profil_ZC_uri', language, attributeProfile)}
                    id={RequestItemFormEnum.REFIDENT}
                    {...register(RequestItemFormEnum.REFIDENT)}
                    error={formState.errors?.[RequestItemFormEnum.REFIDENT]?.message}
                />
                <Input
                    disabled={!canEdit}
                    label={getDescription('Gui_Profil_ZC_doplnujuci_obsah', language, attributeProfile)}
                    info={getName('Gui_Profil_ZC_doplnujuci_obsah', language, attributeProfile)}
                    id={RequestItemFormEnum.ADDATA}
                    {...register(RequestItemFormEnum.ADDATA)}
                    error={formState.errors?.[RequestItemFormEnum.ADDATA]?.message}
                />
                <Input
                    disabled={!canEdit}
                    label={getDescription('Gui_Profil_ZC_merna_jednotka', language, attributeProfile)}
                    info={getName('Gui_Profil_ZC_merna_jednotka', language, attributeProfile)}
                    id={RequestItemFormEnum.UNIT}
                    {...register(RequestItemFormEnum.UNIT)}
                    error={formState.errors?.[RequestItemFormEnum.UNIT]?.message}
                />
                <TextArea
                    disabled={!canEdit}
                    label={getDescription('Gui_Profil_ZC_poznamka_pre_polozku', language, attributeProfile)}
                    info={getName('Gui_Profil_ZC_poznamka_pre_polozku', language, attributeProfile)}
                    id={RequestItemFormEnum.NOTE}
                    rows={3}
                    {...register(RequestItemFormEnum.NOTE)}
                    error={formState.errors?.[RequestItemFormEnum.NOTE]?.message}
                />
                <Input
                    disabled={!canEdit}
                    label={getDescription('Gui_Profil_ZC_zahrna', language, attributeProfile)}
                    info={getName('Gui_Profil_ZC_zahrna', language, attributeProfile)}
                    id={RequestItemFormEnum.CONTAIN}
                    {...register(RequestItemFormEnum.CONTAIN)}
                    error={formState.errors?.[RequestItemFormEnum.CONTAIN]?.message}
                />
                <Input
                    disabled={!canEdit}
                    label={getDescription('Gui_Profil_ZC_tiez_zahrna', language, attributeProfile)}
                    info={getName('Gui_Profil_ZC_tiez_zahrna', language, attributeProfile)}
                    id={RequestItemFormEnum.ALSOCONTAIN}
                    {...register(RequestItemFormEnum.ALSOCONTAIN)}
                    error={formState.errors?.[RequestItemFormEnum.ALSOCONTAIN]?.message}
                />
                <Input
                    disabled={!canEdit}
                    label={getDescription('Gui_Profil_ZC_vylucuje', language, attributeProfile)}
                    info={getName('Gui_Profil_ZC_vylucuje', language, attributeProfile)}
                    id={RequestItemFormEnum.EXCLUDE}
                    {...register(RequestItemFormEnum.EXCLUDE)}
                    error={formState.errors?.[RequestItemFormEnum.EXCLUDE]?.message}
                />
                <Input
                    disabled={!canEdit}
                    type="number"
                    label={getDescription('Gui_Profil_ZC_logicke_poradie_polozky', language, attributeProfile)}
                    info={getName('Gui_Profil_ZC_logicke_poradie_polozky', language, attributeProfile)}
                    id={RequestItemFormEnum.ORDER}
                    {...register(RequestItemFormEnum.ORDER)}
                    error={formState.errors?.[RequestItemFormEnum.ORDER]?.message}
                />
                <CheckBox
                    disabled={!canEdit}
                    label={getDescription('Gui_Profil_ZC_legislativna_uznatelnost', language, attributeProfile)}
                    info={getName('Gui_Profil_ZC_legislativna_uznatelnost', language, attributeProfile)}
                    id={RequestItemFormEnum.LAW}
                    {...register(RequestItemFormEnum.LAW)}
                    error={formState.errors?.[RequestItemFormEnum.LAW]?.message}
                />

                <ModalButtons submitButtonLabel={t('codeListList.requestCreate.saveBtn')} closeButtonLabel={t('form.cancel')} onClose={close} />
            </form>
        </BaseModal>
    )
}
