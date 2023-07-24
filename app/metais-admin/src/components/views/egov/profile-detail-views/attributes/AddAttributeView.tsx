import React, { useCallback } from 'react'
import { FieldValues } from 'react-hook-form'
import { Button, Input, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit'

import { IAddAttributeView } from './AddAttributeContainer'
import { useCreateAttribute } from './useCreateAttribute'

const AddAttributeView = ({ data: { measureUnit, allEnumsData, entityName }, storeAttribute }: IAddAttributeView) => {
    const {
        formMethods,
        t,
        attributeTypes,
        showUnit,
        measureUnits,
        selectedConstraint,
        selectedType,
        showConstaint,
        stringConstraints,
        integerConstraints,
        allEnumsSelectOptions,
        getTypeForDefaultValue,
    } = useCreateAttribute({
        measureUnit,
        allEnumsData,
    })

    const { register, formState, handleSubmit } = formMethods

    const onSubmit = useCallback(
        async (formValues: FieldValues) => {
            await storeAttribute({
                atrProfTechnicalName: entityName ?? '',
                data: {
                    ...formValues,
                },
            })
        },
        [entityName, storeAttribute],
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

            <SimpleSelect id="type" label={t('egov.type')} options={attributeTypes} {...register('type')} defaultValue={attributeTypes?.[0]?.value} />
            {showUnit && (
                <SimpleSelect
                    id="units"
                    label={t('egov.units')}
                    options={measureUnits}
                    {...register('units')}
                    defaultValue={measureUnits?.[0]?.value}
                />
            )}

            {selectedType === 'BOOLEAN' && (
                <SimpleSelect
                    label={t('egov.defaultValue')}
                    id="defaultValue"
                    {...register('defaultValue')}
                    options={[
                        { label: 'Ano', value: 'true' },
                        { label: 'Nie', value: 'false' },
                    ]}
                />
            )}
            {showConstaint && (
                <SimpleSelect
                    label={t('egov.constraints')}
                    id="constraints"
                    {...register('constraints.[0].type')}
                    options={selectedType === 'INTEGER' ? integerConstraints : stringConstraints}
                    defaultValue={stringConstraints?.[0].value}
                />
            )}
            {selectedConstraint === 'enum' && (
                <SimpleSelect
                    label={t('egov.clarification')}
                    id="constraints"
                    {...register('constraints.[0].enumCode')}
                    options={allEnumsSelectOptions}
                    defaultValue={stringConstraints?.[0].value}
                />
            )}
            {selectedConstraint === 'regex' && <Input label={t('egov.clarification')} id="regex" {...register('constraints.[0].regex')} />}
            {selectedConstraint === 'interval' && (
                <>
                    <Input label={t('egov.minValue')} type="number" id="order" {...register('constraints.[0].minValue')} />
                    <Input label={t('egov.maxValue')} type="number" id="order" {...register('constraints.[0].maxValue')} />
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
