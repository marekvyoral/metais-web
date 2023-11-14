import { BaseModal, Button, ButtonGroupRow, Input, Table, TextBody, TextHeading, TextWarning } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { IItemForm } from '@/components/views/requestLists/components/modalItem/ModalItem'
import { RequestFormEnum } from '@/components/views/requestLists/CreateRequestView'
import { useItemDateSchema } from '@/components/views/requestLists/useRequestSchemas'

export interface IItemDates {
    effectiveFrom: string
    validDate: string
}

export interface DateModalItemProps {
    isOpen: boolean
    rowSelection: Record<string, IItemForm>
    close: () => void
    onSubmit: (dates: IItemDates) => void
}

export const DateModalItem: React.FC<DateModalItemProps> = ({ isOpen, close, onSubmit, rowSelection }) => {
    const { t } = useTranslation()
    const { schema: schemaEdit } = useItemDateSchema()

    const {
        register,
        handleSubmit: handleSubmitItem,
        formState,
    } = useForm<IItemDates>({
        resolver: yupResolver(schemaEdit),
    })

    return (
        <BaseModal isOpen={isOpen} close={close}>
            <TextHeading size="M">{t(`codeListDetail.modal.title.setDates`)}</TextHeading>
            {Object.keys(rowSelection).length > 0 ? (
                <form onSubmit={handleSubmitItem(onSubmit)}>
                    <TextBody>{t('codeListDetail.modal.text.willBeChanged')}</TextBody>
                    <Table
                        data={Object.values(rowSelection)}
                        columns={[
                            {
                                id: 'code',
                                header: t('codeListDetail.table.code'),
                                accessorFn: (row) => row.codeItem,
                            },
                            {
                                id: 'name',
                                header: t('codeListDetail.table.name'),
                                meta: { getCellContext: (ctx) => ctx?.getValue?.() },
                                accessorFn: (row) => row.codeName,
                            },
                        ]}
                    />
                    <Input
                        type="date"
                        label={t('codeListDetail.modal.form.validFrom')}
                        id={RequestFormEnum.VALIDDATE}
                        {...register(RequestFormEnum.VALIDDATE)}
                        error={formState.errors.validDate?.message}
                    />
                    <Input
                        type="date"
                        label={t('codeListDetail.modal.form.effectiveFrom')}
                        id={RequestFormEnum.EFFECTIVEFROM}
                        {...register(RequestFormEnum.EFFECTIVEFROM)}
                        error={formState.errors.effectiveFrom?.message}
                    />
                    <ButtonGroupRow>
                        <Button type="submit" disabled={!formState.isValid} label={t('codeListDetail.modal.button.confirm')} />
                    </ButtonGroupRow>
                </form>
            ) : (
                <TextWarning>{t('codeListDetail.modal.text.nothingSelected')}</TextWarning>
            )}
        </BaseModal>
    )
}
