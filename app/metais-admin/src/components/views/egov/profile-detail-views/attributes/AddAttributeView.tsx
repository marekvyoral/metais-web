import React, { useCallback } from 'react'
import { FieldValues } from 'react-hook-form'
import { Button, Input, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'

import { IAddAttributeView } from './AddAttributeContainer'
import { useCreateAttributeSelectOptions } from './hooks/useCreateAttributeSelectOptions'
import { useCreateAttributeForm } from './hooks/useCreateAttributeForm'
import { getTypeForDefaultValue } from './hooks/helpers'

const AddAttributeView = ({ data: { measureUnit, allEnumsData, entityName }, storeNewAttribute }: IAddAttributeView) => {
    const { t } = useTranslation()
    const { attributeTypes, measureUnits, stringConstraints, integerConstraints, allEnumsSelectOptions } = useCreateAttributeSelectOptions({
        measureUnit,
        allEnumsData,
    })

    const { formMethods, showUnit, showConstraint, selectedConstraint, selectedType } = useCreateAttributeForm()

    const { register, formState, handleSubmit, setValue } = formMethods

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
                defaultValue={attributeTypes?.[0]?.value}
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

            {selectedType === 'BOOLEAN' && (
                <SimpleSelect
                    label={t('egov.defaultValue')}
                    id="defaultValue"
                    setValue={setValue}
                    name="defaultValue"
                    options={[
                        { label: 'Ano', value: 'true' },
                        { label: 'Nie', value: 'false' },
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
                    options={selectedType === 'INTEGER' ? integerConstraints : stringConstraints}
                    defaultValue={stringConstraints?.[0].value}
                />
            )}
            {selectedConstraint === 'enum' && (
                <SimpleSelect
                    label={t('egov.clarification')}
                    id="constraints"
                    name="constraints.0.enumCode"
                    setValue={setValue}
                    options={allEnumsSelectOptions}
                    defaultValue={stringConstraints?.[0].value}
                />
            )}
            {selectedConstraint === 'regex' && <Input label={t('egov.clarification')} id="regex" {...register('constraints.0.regex')} />}
            {selectedConstraint === 'interval' && (
                <>
                    <Input label={t('egov.minValue')} type="number" id="order" {...register('constraints.0.minValue')} />
                    <Input label={t('egov.maxValue')} type="number" id="order" {...register('constraints.0.maxValue')} />
                </>
            )}
            {selectedType !== '' && selectedType !== 'BOOLEAN' && selectedConstraint !== 'enum' && (
                <Input
                    label={t('egov.defaultValue')}
                    id="defaultValue"
                    type={getTypeForDefaultValue(selectedType)}
                    {...register('defaultValue')}
                    error={formState?.errors?.defaultValue?.message}
                />
            )}
            <Button type="submit" label={t('form.submit')} />
        </form>
    )
}

export default AddAttributeView
