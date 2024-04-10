import { GridCol, GridRow, Input, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiReferenceRegister } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { IOptions } from '@isdd/metais-common/components/select-cmdb-params/SelectFilterCMDBParamsOptions'
import React from 'react'
import { FormState, UseFormClearErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { isRRFieldEditable } from '@/componentHelpers/refregisters/helpers'
import { IRefRegisterCreateFormData } from '@/components/views/refregisters/schema'

interface IProps {
    defaultData?: ApiReferenceRegister
    renamedAttributes?: Attribute[]
    userGroupOptions?: IOptions[]
    setValue: UseFormSetValue<IRefRegisterCreateFormData>
    clearErrors: UseFormClearErrors<IRefRegisterCreateFormData>
    formState: FormState<IRefRegisterCreateFormData>
    register: UseFormRegister<IRefRegisterCreateFormData>
    isContact: boolean
    creatorNotSet: boolean
    creatorUuid?: string
}

export const RefRegisterCreateManagerContactSection: React.FC<IProps> = ({
    defaultData,
    userGroupOptions,
    formState,
    register,
    isContact,
    creatorNotSet,
    creatorUuid,
}) => {
    const { t } = useTranslation()

    const creatorName = userGroupOptions?.find((option) => option.value === creatorUuid)?.label
    return (
        <>
            <TextHeading size="L">{t('refRegisters.create.managerContact')}</TextHeading>
            <TextHeading size="S">{creatorName}</TextHeading>
            <GridRow>
                <GridCol setWidth="one-half">
                    <Input
                        label={t('refRegisters.create.lastName')}
                        {...register('refRegisters.manager.lastName')}
                        error={formState.errors?.refRegisters?.manager?.lastName?.message}
                        disabled={!isRRFieldEditable(defaultData?.state, isContact) || creatorNotSet}
                        required
                    />
                </GridCol>
                <GridCol setWidth="one-half">
                    <Input
                        label={t('refRegisters.create.firstName')}
                        {...register('refRegisters.manager.firstName')}
                        error={formState.errors?.refRegisters?.manager?.firstName?.message}
                        disabled={!isRRFieldEditable(defaultData?.state, isContact) || creatorNotSet}
                        required
                    />
                </GridCol>
            </GridRow>
            <GridRow>
                <GridCol setWidth="one-half">
                    <Input
                        label={t('refRegisters.create.phoneNumber')}
                        {...register('refRegisters.manager.phoneNumber')}
                        error={formState.errors?.refRegisters?.manager?.phoneNumber?.message}
                        type="tel"
                        disabled={!isRRFieldEditable(defaultData?.state, isContact) || creatorNotSet}
                        required
                    />
                </GridCol>
                <GridCol setWidth="one-half">
                    <Input
                        label={t('refRegisters.create.email')}
                        {...register('refRegisters.manager.email')}
                        error={formState.errors?.refRegisters?.manager?.email?.message}
                        type="email"
                        disabled={!isRRFieldEditable(defaultData?.state, isContact) || creatorNotSet}
                        required
                    />
                </GridCol>
            </GridRow>
        </>
    )
}
