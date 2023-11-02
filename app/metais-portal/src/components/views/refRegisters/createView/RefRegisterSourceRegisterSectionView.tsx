import { Input, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { NeighbourPairUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import React from 'react'
import { FormState, UseFormClearErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { ApiReferenceRegister } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { IRefRegisterCreateFormData } from '@/components/views/refRegisters/schema'
import { getInfoRR, getLabelRR, getSourceRegisterOptions, showSourceRegisterForm } from '@/componentHelpers/refRegisters/helpers'
import { RefRegisterViewItems } from '@/types/views'

interface IProps {
    defaultData?: ApiReferenceRegister
    sourceRegisters?: NeighbourPairUi[]
    renamedAttributes?: Attribute[]
    setValue: UseFormSetValue<IRefRegisterCreateFormData>
    clearErrors: UseFormClearErrors<IRefRegisterCreateFormData>
    formState: FormState<IRefRegisterCreateFormData>
    register: UseFormRegister<IRefRegisterCreateFormData>
    setSourceRegister: React.Dispatch<React.SetStateAction<NeighbourPairUi | undefined>>
    creatorNotSet: boolean
}

export const RefRegisterSourceRegisterSectionView: React.FC<IProps> = ({
    defaultData,
    renamedAttributes,
    setValue,
    clearErrors,
    formState,
    register,
    sourceRegisters,
    setSourceRegister,
    creatorNotSet,
}) => {
    return (
        <>
            {showSourceRegisterForm(defaultData) && (
                <SimpleSelect
                    id={'refRegisters.sourceRegister'}
                    name={'refRegisters.sourceRegister'}
                    label={getLabelRR(RefRegisterViewItems.ISVS_SOURCE, renamedAttributes) ?? ''}
                    info={getInfoRR(RefRegisterViewItems.ISVS_SOURCE, renamedAttributes)}
                    options={getSourceRegisterOptions(sourceRegisters) ?? []}
                    onChange={(value?: string) => {
                        setSourceRegister(sourceRegisters?.find((sR) => sR.configurationItem?.uuid === value))
                        setValue(`refRegisters.sourceRegister`, value)
                    }}
                    clearErrors={clearErrors}
                    error={formState.errors?.refRegisters?.sourceRegister?.message}
                    disabled={creatorNotSet}
                    required
                />
            )}

            <Input
                label={getLabelRR(RefRegisterViewItems.ISVS_CODE, renamedAttributes) ?? ''}
                info={getInfoRR(RefRegisterViewItems.ISVS_CODE, renamedAttributes)}
                {...register('refRegisters.codeMetaIS')}
                error={formState.errors?.refRegisters?.codeMetaIS?.message}
                disabled
                required
            />
            <Input
                label={getLabelRR(RefRegisterViewItems.ISVS_REF_ID, renamedAttributes) ?? ''}
                info={getInfoRR(RefRegisterViewItems.ISVS_REF_ID, renamedAttributes)}
                {...register('refRegisters.refId')}
                error={formState.errors?.refRegisters?.refId?.message}
                disabled
                required
            />
        </>
    )
}
