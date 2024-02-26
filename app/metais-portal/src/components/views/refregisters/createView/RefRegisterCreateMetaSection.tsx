import { Input, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemSetUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import React from 'react'
import { Control, FormState, UseFormClearErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ApiReferenceRegister } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'

import { IRefRegisterCreateFormData } from '@/components/views/refregisters/schema'
import { RefRegisterSourceRegisterSection } from '@/components/views/refregisters/createView/RefRegisterSourceRegisterSection'
import { getInfoRR, getLabelRR, getUserGroupOptions, isRRFieldEditable, showCreatorForm } from '@/componentHelpers/refregisters/helpers'
import { RefRegisterViewItems } from '@/types/views'

interface IProps {
    defaultData?: ApiReferenceRegister

    renamedAttributes?: Attribute[]
    setUserGroupId: React.Dispatch<React.SetStateAction<string | undefined>>
    userGroupId?: string
    userGroupData?: ConfigurationItemSetUi
    setValue: UseFormSetValue<IRefRegisterCreateFormData>
    clearErrors: UseFormClearErrors<IRefRegisterCreateFormData>
    formState: FormState<IRefRegisterCreateFormData>
    register: UseFormRegister<IRefRegisterCreateFormData>
    isContact: boolean
    creatorNotSet: boolean
    control: Control<IRefRegisterCreateFormData>
}

export const RefRegisterCreateMetaSection: React.FC<IProps> = ({
    defaultData,
    renamedAttributes,
    userGroupData,
    userGroupId,
    setUserGroupId,
    setValue,
    clearErrors,
    formState,
    register,
    isContact,
    creatorNotSet,
    control,
}) => {
    const { t } = useTranslation()
    const userGroupOptions = getUserGroupOptions(userGroupData)
    const defaultUserGroup = userGroupOptions?.length === 1 ? userGroupOptions[0] : undefined

    return (
        <>
            {showCreatorForm(defaultUserGroup, defaultData) && (
                <SimpleSelect
                    id={'refRegisters.creator'}
                    name={'refRegisters.creator'}
                    label={getLabelRR(RefRegisterViewItems.CREATOR, renamedAttributes) ?? ''}
                    options={userGroupOptions ?? []}
                    defaultValue={defaultData?.creatorUuid}
                    onChange={(value?: string) => {
                        setValue(`refRegisters.creator`, value)
                        setUserGroupId?.(value)
                    }}
                    clearErrors={clearErrors}
                    error={formState.errors?.refRegisters?.creator?.message}
                    required
                    isClearable={false}
                />
            )}
            <Input
                label={t('refRegisters.create.name')}
                {...register('refRegisters.name')}
                error={formState.errors?.refRegisters?.name?.message}
                required
                disabled={!isRRFieldEditable(defaultData?.state) || isContact || creatorNotSet}
            />

            <RefRegisterSourceRegisterSection
                defaultData={defaultData}
                userGroupId={userGroupId}
                renamedAttributes={renamedAttributes}
                setValue={setValue}
                clearErrors={clearErrors}
                formState={formState}
                register={register}
                creatorNotSet={creatorNotSet}
            />

            <DateInput
                label={getLabelRR(RefRegisterViewItems.EFFECTIVE_FROM, renamedAttributes) ?? ''}
                info={getInfoRR(RefRegisterViewItems.EFFECTIVE_FROM, renamedAttributes)}
                {...register('refRegisters.effectiveFrom')}
                error={formState.errors?.refRegisters?.effectiveFrom?.message}
                disabled={!isRRFieldEditable(defaultData?.state) || isContact || creatorNotSet}
                required
                control={control}
                setValue={setValue}
            />

            <DateInput
                label={getLabelRR(RefRegisterViewItems.EFFECTIVE_TO, renamedAttributes) ?? ''}
                info={getInfoRR(RefRegisterViewItems.EFFECTIVE_TO, renamedAttributes)}
                {...register('refRegisters.effectiveTo')}
                error={formState.errors?.refRegisters?.effectiveTo?.message}
                disabled={!isRRFieldEditable(defaultData?.state) || isContact || creatorNotSet}
                control={control}
                setValue={setValue}
            />
        </>
    )
}
