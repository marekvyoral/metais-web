import React, { useCallback } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button, Input, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit'
import { yupResolver } from '@hookform/resolvers/yup'

import { generateSchemaForCreateAttribute } from '../entity-detail-views/createViewHelpers'

import { IAddAttributeView } from './AddAttributeContainer'

const AddAttributeView = ({ data: { measureUnit, allEnumsData, entityName }, storeAttribute }: IAddAttributeView) => {
    const { t } = useTranslation()
    const { handleSubmit, formState, register, watch } = useForm({
        shouldUnregister: true,
        resolver: yupResolver(generateSchemaForCreateAttribute(t)),
    })

    const attributeTypes = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        { label: 'Integer', value: 'INTEGER' },
        { label: 'Long', value: 'LONG' },
        { label: 'Double', value: 'DOUBLE' },
        { label: 'String', value: 'STRING' },
        { label: 'Boolean', value: 'BOOLEAN' },
        { label: 'Date', value: 'DATE' },
    ]

    const measureUnits = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        ...(measureUnit?.enumItems?.map((enumItem) => ({
            label: [enumItem?.description, `(${enumItem?.value})`].join(' '),
            value: enumItem?.code ?? '',
        })) ?? []),
    ]

    const allEnumsSelectOptions = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        ...(allEnumsData?.results?.map((allEnumsEnumItem) => ({
            label: allEnumsEnumItem?.name ?? '',
            value: allEnumsEnumItem?.code ?? '',
        })) ?? []),
    ]

    const stringConstraints = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        { label: 'Interný čiselník', value: 'enum' },
        { label: 'Regularny vyraz', value: 'regex' },
        { label: 'Intervalove rozlozenie', value: 'interval' },
    ]

    const integerConstraints = [
        { label: t('egov.detail.selectOption'), value: '', disabled: true },
        { label: 'Intervalove rozlozenie', value: 'interval' },
    ]

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

    const selectedType = watch('type') ?? ''
    const isSelectedTypeNumber = (newSelectedType: string) =>
        newSelectedType === 'INTEGER' || newSelectedType === 'LONG' || newSelectedType === 'DOUBLE'
    const showUnit = isSelectedTypeNumber(selectedType)
    const showConstaint = selectedType === 'INTEGER' || selectedType === 'STRING'
    const getTypeForDefaultValue = (newSelectedType: string) => {
        if (isSelectedTypeNumber(newSelectedType)) return 'number'
        else if (newSelectedType === 'DATE') return 'date'
    }

    const selectedConstraint = watch('constraints.[0].type')

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
            {selectedConstraint === 'regex' && (
                <Input
                    label={t('egov.clarification')}
                    id="regex"
                    {...register('constraints.[0].regex')}
                    error={formState?.errors?.technicalName?.message}
                />
            )}
            {selectedConstraint === 'interval' && (
                <>
                    <Input
                        label={t('egov.minValue')}
                        type="number"
                        id="order"
                        {...register('constraints.[0].minValue')}
                        error={formState?.errors?.order?.message}
                    />
                    <Input
                        label={t('egov.maxValue')}
                        type="number"
                        id="order"
                        {...register('constraints.[0].maxValue')}
                        error={formState?.errors?.order?.message}
                    />
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
