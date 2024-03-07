import { BaseModal, Button, ButtonGroupRow, Table, TextBody, TextHeading, TextWarning } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ModalButtons } from '@isdd/metais-common/index'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'

import { IItemForm, RequestItemFormEnum } from '@/components/views/requestLists/components/modalItem/ModalItem'
import { useItemDateSchema } from '@/components/views/requestLists/useRequestSchemas'

export interface IItemDates {
    effectiveFrom: Date
    validDate: Date
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

    const { register, handleSubmit, formState, control, setValue } = useForm<IItemDates>({
        resolver: yupResolver(schemaEdit),
    })

    const handleDateChange = (date: Date | null, name: string) => {
        setValue(name as keyof IItemDates, date ?? new Date())
    }

    return (
        <BaseModal isOpen={isOpen} close={close}>
            <TextHeading size="M">{t(`codeListDetail.modal.title.setDates`)}</TextHeading>
            {Object.keys(rowSelection).length > 0 ? (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

                    <DateInput
                        required
                        label={t('codeListDetail.modal.form.validFrom')}
                        id={RequestItemFormEnum.VALIDDATE}
                        {...register(RequestItemFormEnum.VALIDDATE)}
                        error={formState.errors[RequestItemFormEnum.VALIDDATE]?.message}
                        control={control}
                        handleDateChange={handleDateChange}
                        setValue={setValue}
                    />

                    <DateInput
                        required
                        label={t('codeListDetail.modal.form.effectiveFrom')}
                        id={RequestItemFormEnum.STARTDATE}
                        {...register(RequestItemFormEnum.STARTDATE)}
                        error={formState.errors[RequestItemFormEnum.STARTDATE]?.message}
                        control={control}
                        handleDateChange={handleDateChange}
                        setValue={setValue}
                    />
                    <ButtonGroupRow>
                        <Button type="submit" disabled={!formState.isValid} label={t('codeListDetail.modal.button.confirm')} />
                    </ButtonGroupRow>
                    <ModalButtons
                        submitButtonLabel={t('codeListDetail.modal.button.confirm')}
                        closeButtonLabel={t('evaluation.cancelBtn')}
                        onClose={close}
                        disabled={!formState.isValid}
                    />
                </form>
            ) : (
                <>
                    <TextWarning>{t('codeListDetail.modal.text.nothingSelected')}</TextWarning>
                    <ModalButtons onClose={close} />
                </>
            )}
        </BaseModal>
    )
}
