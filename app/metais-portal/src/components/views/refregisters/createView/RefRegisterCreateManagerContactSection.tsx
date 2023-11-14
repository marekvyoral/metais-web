import { GridCol, GridRow, Input, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { FormState, UseFormClearErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ApiReferenceRegister } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { useParams } from 'react-router-dom'
import { IOptions } from '@isdd/metais-common/components/select-cmdb-params/SelectFilterCMDBParamsOptions'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { IRefRegisterCreateFormData } from '@/components/views/refregisters/schema'
import { getInfoRR, getLabelRR, isRRFieldEditable } from '@/componentHelpers/refregisters/helpers'
import { RefRegisterViewItems } from '@/types/views'

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
}

export const RefRegisterCreateManagerContactSection: React.FC<IProps> = ({
    defaultData,
    renamedAttributes,
    userGroupOptions,
    setValue,
    clearErrors,
    formState,
    register,
    isContact,
    creatorNotSet,
}) => {
    const { t } = useTranslation()
    const { entityId } = useParams()

    const optionsPO = entityId ? [{ label: defaultData?.managerName ?? '', value: defaultData?.managerUuid ?? '' }] : userGroupOptions
    return (
        <>
            <TextHeading size="L">{t('refRegisters.create.managerContact')}</TextHeading>

            <SimpleSelect
                label={getLabelRR(RefRegisterViewItems.MANAGER_NAME, renamedAttributes) ?? ''}
                info={getInfoRR(RefRegisterViewItems.MANAGER_NAME, renamedAttributes)}
                name={'refRegisters.manager.PO'}
                id={'refRegisters.manager.PO'}
                options={optionsPO ?? []}
                setValue={setValue}
                defaultValue={defaultData?.managerUuid ?? ''}
                clearErrors={clearErrors}
                error={formState.errors?.refRegisters?.manager?.PO?.message}
                disabled={!isRRFieldEditable(defaultData?.state) || isContact || creatorNotSet || !!entityId}
                required
            />

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
