import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { BaseModal, Button, ButtonGroupRow, CheckBox, Input, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useItemSchema } from '@/components/views/requestLists/useRequestSchemas'

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
    law?: string
    exclude?: string
    order?: number
    validDate?: string
    effectiveFrom?: string
    lockedBy?: string
    lockedFrom?: string
    selected?: boolean
}

export interface ModalItemProps {
    isOpen: boolean
    canEdit: boolean
    isCreate: boolean
    canEditDate: boolean
    item?: IItemForm
    close: () => void
    onSubmit: (form: IItemForm) => void
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
    VALIDATE = 'validDate',
    STARTDATE = 'effectiveFrom',
    ENDDATE = 'endDate',
}

export const ModalItem: React.FC<ModalItemProps> = ({ isOpen, canEdit, close, onSubmit, item }) => {
    const { t } = useTranslation()
    const { schema } = useItemSchema()

    const { register: registerItem, handleSubmit: handleSubmitItem } = useForm<IItemForm>({
        resolver: yupResolver(schema),
        defaultValues: { ...item },
    })

    return (
        <BaseModal isOpen={isOpen} close={close}>
            <TextHeading size="L">{'Pridanie novej položky do číselníka'}</TextHeading>
            <form onSubmit={handleSubmitItem(onSubmit)}>
                <Input
                    required
                    disabled={!canEdit}
                    {...registerItem(RequestItemFormEnum.CODEITEM)}
                    label={t('codeListList.requestModal.codeItem')}
                    id={RequestItemFormEnum.CODEITEM}
                />
                <Input
                    required
                    disabled={!canEdit}
                    {...registerItem(RequestItemFormEnum.CODENAME)}
                    label={t('codeListList.requestModal.codeName')}
                    id={RequestItemFormEnum.CODENAME}
                />
                <Input
                    disabled={!canEdit}
                    label={t('codeListList.requestModal.shortname')}
                    {...registerItem(RequestItemFormEnum.SHORTNAME)}
                    id={RequestItemFormEnum.SHORTNAME}
                />
                <Input
                    disabled={!canEdit}
                    label={t('codeListList.requestModal.shortcut')}
                    {...registerItem(RequestItemFormEnum.SHORTCUT)}
                    id={RequestItemFormEnum.SHORTCUT}
                />
                <Input
                    disabled={!canEdit}
                    label={t('codeListList.requestModal.refident')}
                    {...registerItem(RequestItemFormEnum.REFIDENT)}
                    id={RequestItemFormEnum.REFIDENT}
                />
                <Input
                    disabled={!canEdit}
                    label={t('codeListList.requestModal.addData')}
                    {...registerItem(RequestItemFormEnum.ADDATA)}
                    id={RequestItemFormEnum.ADDATA}
                />
                <Input
                    disabled={!canEdit}
                    label={t('codeListList.requestModal.unit')}
                    {...registerItem(RequestItemFormEnum.UNIT)}
                    id={RequestItemFormEnum.UNIT}
                    name={RequestItemFormEnum.UNIT}
                />
                <TextArea
                    disabled={!canEdit}
                    label={t('codeListList.requestModal.note')}
                    {...registerItem(RequestItemFormEnum.NOTE)}
                    id={RequestItemFormEnum.NOTE}
                    rows={3}
                />
                <Input
                    disabled={!canEdit}
                    label={t('codeListList.requestModal.contain')}
                    {...registerItem(RequestItemFormEnum.CONTAIN)}
                    id={RequestItemFormEnum.CONTAIN}
                />
                <Input
                    disabled={!canEdit}
                    label={t('codeListList.requestModal.alsoContain')}
                    {...registerItem(RequestItemFormEnum.ALSOCONTAIN)}
                    id={RequestItemFormEnum.ALSOCONTAIN}
                />
                <Input
                    disabled={!canEdit}
                    label={t('codeListList.requestModal.exclude')}
                    {...registerItem(RequestItemFormEnum.EXCLUDE)}
                    id={RequestItemFormEnum.EXCLUDE}
                />
                <CheckBox
                    disabled={!canEdit}
                    label={t('codeListList.requestModal.law')}
                    {...registerItem(RequestItemFormEnum.LAW)}
                    id={RequestItemFormEnum.LAW}
                    name={RequestItemFormEnum.LAW}
                />
                <ButtonGroupRow>
                    <Button label={t('form.cancel')} type="reset" variant="secondary" onClick={close} />
                    <Button label={t('form.submit')} type="submit" />
                </ButtonGroupRow>
            </form>
        </BaseModal>
    )
}
