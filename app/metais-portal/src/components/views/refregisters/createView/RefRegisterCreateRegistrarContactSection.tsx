import { GridCol, GridRow, Input, SelectLazyLoading, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemSetUi, useReadCiList1Hook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import React from 'react'
import { FormState, UseFormClearErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ApiReferenceRegister } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { IOptions, SelectFilterCMDBParamsOption } from '@isdd/metais-common/components/select-cmdb-params/SelectFilterCMDBParamsOptions'

import { IRefRegisterCreateFormData } from '@/components/views/refregisters/schema'
import { getInfoRR, getLabelRR, isRRFieldEditable, loadPOOptions } from '@/componentHelpers/refregisters/helpers'
import { RefRegisterViewItems } from '@/types/views'

interface IProps {
    defaultData?: ApiReferenceRegister
    renamedAttributes?: Attribute[]
    setValue: UseFormSetValue<IRefRegisterCreateFormData>
    clearErrors: UseFormClearErrors<IRefRegisterCreateFormData>
    formState: FormState<IRefRegisterCreateFormData>
    register: UseFormRegister<IRefRegisterCreateFormData>
    isContact: boolean
    POData?: ConfigurationItemSetUi
    creatorNotSet: boolean
}

export const RefRegisterCreateRegistrarContactSection: React.FC<IProps> = ({
    defaultData,
    renamedAttributes,
    setValue,
    clearErrors,
    formState,
    register,
    isContact,
    POData,
    creatorNotSet,
}) => {
    const { t } = useTranslation()
    const readCiList1 = useReadCiList1Hook()

    return (
        <>
            <TextHeading size="L">{t('refRegisters.create.registratorContact')}</TextHeading>

            <SelectLazyLoading<IOptions>
                label={getLabelRR(RefRegisterViewItems.REGISTRATOR_NAME, renamedAttributes) ?? ''}
                info={getInfoRR(RefRegisterViewItems.REGISTRATOR_NAME, renamedAttributes)}
                name={'refRegisters.registrar.PO'}
                id={'refRegisters.registrar.PO'}
                loadOptions={(searchTerm, _, additional) => loadPOOptions(additional, readCiList1, POData)}
                option={(optionProps) => SelectFilterCMDBParamsOption(optionProps)}
                getOptionValue={(item) => item?.value}
                getOptionLabel={(item) => item?.label}
                setValue={setValue}
                defaultValue={{ value: defaultData?.registratorUuid ?? '', label: defaultData?.registratorName ?? '' }}
                error={formState.errors?.refRegisters?.registrar?.PO?.message}
                clearErrors={clearErrors}
                disabled={!isRRFieldEditable(defaultData?.state) || isContact || creatorNotSet}
                required
                tooltipPosition={'top center'}
            />
            <GridRow>
                <GridCol setWidth="one-half">
                    <Input
                        label={t('refRegisters.create.lastName')}
                        {...register('refRegisters.registrar.lastName')}
                        error={formState.errors?.refRegisters?.registrar?.lastName?.message}
                        disabled={!isRRFieldEditable(defaultData?.state, isContact) || creatorNotSet}
                        required
                    />
                </GridCol>
                <GridCol setWidth="one-half">
                    <Input
                        label={t('refRegisters.create.firstName')}
                        {...register('refRegisters.registrar.firstName')}
                        error={formState.errors?.refRegisters?.registrar?.firstName?.message}
                        disabled={!isRRFieldEditable(defaultData?.state, isContact) || creatorNotSet}
                        required
                    />
                </GridCol>
            </GridRow>
            <GridRow>
                <GridCol setWidth="one-half">
                    <Input
                        label={t('refRegisters.create.phoneNumber')}
                        {...register('refRegisters.registrar.phoneNumber')}
                        error={formState.errors?.refRegisters?.registrar?.phoneNumber?.message}
                        type="tel"
                        disabled={!isRRFieldEditable(defaultData?.state, isContact) || creatorNotSet}
                        required
                    />
                </GridCol>
                <GridCol setWidth="one-half">
                    <Input
                        label={t('refRegisters.create.email')}
                        {...register('refRegisters.registrar.email')}
                        error={formState.errors?.refRegisters?.registrar?.email?.message}
                        type="email"
                        disabled={!isRRFieldEditable(defaultData?.state, isContact) || creatorNotSet}
                        required
                    />
                </GridCol>
            </GridRow>
        </>
    )
}
