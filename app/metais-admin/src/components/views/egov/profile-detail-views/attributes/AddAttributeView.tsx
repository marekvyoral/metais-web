import React, { useCallback } from 'react'
import { Controller, FieldValues } from 'react-hook-form'
import { Input, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import { HTML_TYPE } from '@isdd/metais-common/constants'
import { CiTypeListSelect } from '@isdd/metais-common/src/components/ci-type-list-select/CiTypeListSelect'
import { AttributeAttributeTypeEnum } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CiLazySelect } from '@isdd/metais-common/components/ci-lazy-select/CiLazySelect'
import { isConstraintCiType } from '@isdd/metais-common/hooks/useGetCiTypeConstraintsData'
import { SubmitWithFeedback } from '@isdd/metais-common/index'

import { IAddAttributeView } from './AddAttributeContainer'
import { StringConstraints, useCreateAttributeSelectOptions } from './hooks/useCreateAttributeSelectOptions'
import { useCreateAttributeForm } from './hooks/useCreateAttributeForm'
import { getTypeForDefaultValue } from './hooks/helpers'

const AddAttributeView = ({ data: { measureUnit, allEnumsData, entityName }, storeNewAttribute, isLoading }: IAddAttributeView) => {
    const { t } = useTranslation()
    const { attributeTypes, measureUnits, stringConstraints, integerConstraints, allEnumsSelectOptions } = useCreateAttributeSelectOptions({
        measureUnit,
        allEnumsData,
    })

    const { formMethods, showUnit, showConstraint, selectedConstraint, selectedType } = useCreateAttributeForm()

    const { register, formState, handleSubmit, setValue, clearErrors, watch, control } = formMethods

    const currentSelectedConstraints = watch('constraints')?.[0]

    const onSubmit = useCallback(
        async (formValues: FieldValues) => {
            await storeNewAttribute(entityName ?? '', formValues)
        },
        [entityName, storeNewAttribute],
    )

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input label={t('egov.name')} id="name" {...register('name')} error={formState?.errors?.name?.message} />
            <Input label={t('egov.engName')} id="engName" {...register('engName')} error={formState?.errors?.engName?.message} />

            <Input
                label={t('egov.technicalName')}
                id="technicalName"
                {...register('technicalName')}
                error={formState?.errors?.technicalName?.message}
            />
            <Input label={t('egov.order')} type="number" id="order" {...register('order')} error={formState?.errors?.order?.message} />

            <TextArea
                label={t('egov.description')}
                id="description"
                rows={3}
                {...register('description')}
                error={formState?.errors?.description?.message}
            />

            <TextArea
                label={t('egov.engDescription')}
                id="engDescription"
                rows={3}
                {...register('engDescription')}
                error={formState?.errors?.engDescription?.message}
            />

            <SimpleSelect
                id="type"
                label={t('egov.type')}
                options={attributeTypes}
                setValue={setValue}
                name="type"
                defaultValue={null}
                error={formState.errors.type?.message}
            />
            {showUnit && (
                <SimpleSelect
                    id="units"
                    label={t('egov.units')}
                    options={measureUnits}
                    name="units"
                    setValue={setValue}
                    defaultValue={measureUnits?.[0]?.value}
                    error={formState.errors.units?.message}
                />
            )}

            {selectedType === AttributeAttributeTypeEnum.BOOLEAN && (
                <SimpleSelect
                    label={t('egov.defaultValue')}
                    id="defaultValue"
                    setValue={setValue}
                    name="defaultValue"
                    options={[
                        { label: t('yes'), value: 'true' },
                        { label: t('no'), value: 'false' },
                    ]}
                    error={formState.errors.defaultValue?.message}
                />
            )}
            {showConstraint && (
                <SimpleSelect
                    label={t('egov.constraints')}
                    id="constraints"
                    name="constraints.0.type"
                    setValue={setValue}
                    options={selectedType === AttributeAttributeTypeEnum.INTEGER ? integerConstraints : stringConstraints}
                    defaultValue={stringConstraints?.[0].value}
                />
            )}
            {selectedConstraint === StringConstraints.ENUM && (
                <SimpleSelect
                    label={t('egov.clarification')}
                    id="constraints"
                    name="constraints.0.enumCode"
                    setValue={setValue}
                    options={allEnumsSelectOptions}
                    defaultValue={stringConstraints?.[0].value}
                />
            )}
            {selectedConstraint === StringConstraints.REGEX && (
                <Input label={t('egov.clarification')} id="regex" {...register('constraints.0.regex')} />
            )}
            {selectedConstraint === StringConstraints.INTERVAL && (
                <>
                    <Input label={t('egov.minValue')} type="number" id="order" {...register('constraints.0.minValue')} />
                    <Input label={t('egov.maxValue')} type="number" id="order" {...register('constraints.0.maxValue')} />
                </>
            )}
            {selectedType === HTML_TYPE && (
                <Controller
                    name="defaultValue"
                    control={control}
                    render={({ field }) => <RichTextQuill {...field} value={field.value?.toString()} id={field?.name} />}
                />
            )}
            {selectedConstraint === StringConstraints.CI_TYPE && (
                <>
                    <CiTypeListSelect
                        error={formState.errors.constraints?.[0]?.message ?? ''}
                        label={t('egov.ciTypeSelect')}
                        name={'constraints.0.ciType'}
                        setValue={setValue}
                        clearErrors={clearErrors}
                    />
                    <CiLazySelect
                        error={formState?.errors?.defaultValue?.message}
                        name="defaultValue"
                        label={t('egov.defaultValue')}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        ciType={isConstraintCiType(currentSelectedConstraints) ? currentSelectedConstraints.ciType : ''}
                    />
                </>
            )}

            {selectedType !== '' &&
                selectedType !== AttributeAttributeTypeEnum.BOOLEAN &&
                selectedType !== HTML_TYPE &&
                selectedConstraint !== StringConstraints.ENUM &&
                selectedConstraint !== StringConstraints.CI_TYPE && (
                    <Input
                        label={t('egov.defaultValue')}
                        id="defaultValue"
                        type={getTypeForDefaultValue(selectedType)}
                        {...register('defaultValue')}
                        error={formState?.errors?.defaultValue?.message}
                    />
                )}
            <SubmitWithFeedback submitButtonLabel={t('form.submit')} loading={isLoading} />
        </form>
    )
}

export default AddAttributeView
