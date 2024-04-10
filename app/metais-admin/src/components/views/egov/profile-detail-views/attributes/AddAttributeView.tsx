import { Input, SimpleSelect, TextArea, CheckBox, RadioGroup, RadioButton } from '@isdd/idsk-ui-kit'
import { DateInput, DateTypeEnum } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { AttributeAttributeTypeEnum, AttributeConstraintCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CiLazySelect } from '@isdd/metais-common/components/ci-lazy-select/CiLazySelect'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import { HTML_TYPE } from '@isdd/metais-common/constants'
import { isConstraintCiType } from '@isdd/metais-common/hooks/useGetCiTypeConstraintsData'
import { ModalButtons, QueryFeedback } from '@isdd/metais-common/index'
import { CiTypeListSelect } from '@isdd/metais-common/src/components/ci-type-list-select/CiTypeListSelect'
import { useCallback, useEffect } from 'react'
import { Controller, FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { IAddAttributeView } from './AddAttributeContainer'
import { getTypeForDefaultValue } from './hooks/helpers'
import { useCreateAttributeForm } from './hooks/useCreateAttributeForm'
import { StringConstraints, useCreateAttributeSelectOptions } from './hooks/useCreateAttributeSelectOptions'

export const API_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS"

const AddAttributeView = ({
    data: { measureUnit, allEnumsData, entityName },
    storeNewAttribute,
    closeModal,
    isLoading,
    isCreateAttrError,
}: IAddAttributeView) => {
    const { t } = useTranslation()
    const { attributeTypes, measureUnits, stringConstraints, integerConstraints, allEnumsSelectOptions } = useCreateAttributeSelectOptions({
        measureUnit,
        allEnumsData,
    })

    const { formMethods, showUnit, showConstraint, selectedConstraint, selectedType } = useCreateAttributeForm()

    const { register, formState, handleSubmit, setValue, clearErrors, watch, control, getValues, setError } = formMethods

    const currentSelectedConstraints = watch('constraints')?.[0]

    const onSubmit = useCallback(
        async (formValues: FieldValues) => {
            await storeNewAttribute(entityName ?? '', formValues)
        },
        [entityName, storeNewAttribute],
    )

    const { defaultValue, constraints } = watch()

    //control interval
    useEffect(() => {
        const min = getValues('constraints.0.minValue') as number
        const max = getValues('constraints.0.maxValue') as number
        const isDefaultValueNumber = !!(defaultValue && !isNaN(defaultValue as number))
        if (selectedConstraint === StringConstraints.INTERVAL && isDefaultValueNumber) {
            const defaultValueAsNumber = Number(defaultValue)
            if (min > defaultValueAsNumber || max < defaultValueAsNumber) {
                setError('defaultValue', { message: t('egov.create.withinInterval') })
            } else {
                clearErrors('defaultValue')
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue])

    return (
        <QueryFeedback error={isCreateAttrError} loading={false}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Input label={t('egov.name')} id="name" {...register('name')} error={formState?.errors?.name?.message} required />
                <Input label={t('egov.engName')} id="engName" {...register('engName')} error={formState?.errors?.engName?.message} required />

                <Input
                    label={t('egov.technicalName')}
                    id="technicalName"
                    {...register('technicalName')}
                    error={formState?.errors?.technicalName?.message}
                    required
                />
                <Input label={t('egov.order')} type="number" id="order" {...register('order')} error={formState?.errors?.order?.message} required />

                <TextArea
                    label={t('egov.description')}
                    id="description"
                    rows={3}
                    {...register('description')}
                    error={formState?.errors?.description?.message}
                    required
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
                    required
                    onChange={() => {
                        setValue('defaultValue', undefined)
                        setValue('constraints.0.type', stringConstraints?.[0].value)
                    }}
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
                        render={({ field }) => {
                            return <RichTextQuill id={'html'} {...field} value={defaultValue as string} label={t('egov.defaultValue')} />
                        }}
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
                            disabled={!(constraints?.[0] as AttributeConstraintCiType)?.ciType}
                        />
                        <CheckBox {...register('array')} label={t('egov.array')} />
                    </>
                )}

                {selectedType === AttributeAttributeTypeEnum.DATE && (
                    <DateInput label={t('egov.defaultValue')} type={DateTypeEnum.DATE} control={control} name="defaultValue" setValue={setValue} />
                )}

                {selectedType === AttributeAttributeTypeEnum.DATETIME && (
                    <DateInput
                        label={t('egov.defaultValue')}
                        type={DateTypeEnum.DATETIME}
                        control={control}
                        name="defaultValue"
                        setValue={setValue}
                    />
                )}

                {(selectedType === AttributeAttributeTypeEnum.STRING || getTypeForDefaultValue(selectedType) === 'number') &&
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

                {selectedType === AttributeAttributeTypeEnum.STRING && !selectedConstraint && (
                    <RadioGroup>
                        <RadioButton defaultChecked {...register('displayAs')} value="" id="displayAsInput" label={t('egov.displayAsInput')} />
                        <RadioButton {...register('displayAs')} value="textarea" id="displayAsTextarea" label={t('egov.displayAsTextarea')} />
                    </RadioGroup>
                )}
                <ModalButtons
                    isLoading={isLoading}
                    submitButtonLabel={t('form.submit')}
                    closeButtonLabel={t('form.back')}
                    onClose={() => {
                        clearErrors()
                        closeModal()
                    }}
                />
            </form>
        </QueryFeedback>
    )
}

export default AddAttributeView
