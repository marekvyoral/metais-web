import { yupResolver } from '@hookform/resolvers/yup'
import { SimpleSelect, Button } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { SubmitWithFeedback } from '@isdd/metais-common/index'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useMemo, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
    useResetDefaultValuesForCiEntity,
    findAttributeConstraint,
    getAttributeInputErrorMessage,
    getHint,
    getAttributeUnits,
} from '@/components/create-entity/createEntityHelpers'
import { generateFormSchema } from '@/components/create-entity/createCiEntityFormSchema'
import { ICreateIntegrationLinkContainerView } from '@/components/containers/CreateIntegrationLinkContainer'
import { AttributeInput } from '@/components/attribute-input/AttributeInput'
import { getAttributeValue } from '@/componentHelpers/ci'

type Props = ICreateIntegrationLinkContainerView & {
    onSubmit: (formData: FieldValues) => void
}

export const IntegrationLinkFormBody: React.FC<Props> = ({
    data: {
        formDefaultValues,
        generatedEntityId,
        ciTypeData,
        constraintsData,
        unitsData,
        providingProjectAttribute,
        consumingProjectAttribute,
        providingProjectData,
        consumingProjectData,
    },
    isUpdate,
    onSubmit,
    candidatesState,
}) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const [hasReset, setHasReset] = useState(false)
    const { provProjOptions, consProjOptions, setSelectedConsProj, setSelectedProvProj } = candidatesState

    const schema = useMemo(() => {
        const integrationLinkProfile: AttributeProfile = {
            ...ciTypeData,
            attributes: [
                ...(ciTypeData?.attributes ?? []),
                { ...providingProjectAttribute, mandatory: { type: 'critical' } },
                { ...consumingProjectAttribute, mandatory: { type: 'critical' } },
            ],
        }

        const generatedSchema = generateFormSchema([integrationLinkProfile], t, i18n.language)
        return generatedSchema
    }, [providingProjectAttribute, consumingProjectAttribute, i18n.language, ciTypeData, t])

    const methods = useForm({
        defaultValues: formDefaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema),
    })

    const {
        register,
        control,
        trigger,
        formState: { errors, isSubmitted, isSubmitting, isValidating, defaultValues },
        clearErrors,
        setValue,
        reset,
        handleSubmit,
    } = methods

    useResetDefaultValuesForCiEntity({ defaultValues, setValue, formDefaultValues, generatedEntityId, isUpdate })

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {ciTypeData?.attributes?.map?.((attribute) => {
                return (
                    <React.Fragment key={attribute.technicalName}>
                        {!attribute.invisible && attribute.valid && (
                            <AttributeInput
                                control={control}
                                trigger={trigger}
                                setValue={setValue}
                                attribute={attribute}
                                constraints={findAttributeConstraint(
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    //@ts-ignore
                                    attribute?.constraints?.map((item: AttributeConstraintEnumAllOf) => item.enumCode ?? '') ?? [],
                                    constraintsData,
                                )}
                                clearErrors={clearErrors}
                                register={register}
                                error={getAttributeInputErrorMessage(attribute, errors)}
                                isSubmitted={isSubmitted}
                                hint={getHint(attribute, generatedEntityId ?? {})}
                                unitsData={attribute.units ? getAttributeUnits(attribute.units ?? '', unitsData) : undefined}
                                hasResetState={{ hasReset, setHasReset }}
                            />
                        )}
                    </React.Fragment>
                )
            })}

            {isUpdate ? (
                <DefinitionList>
                    <InformationGridRow
                        hideIcon
                        label={providingProjectAttribute.name}
                        value={getAttributeValue(providingProjectData, ATTRIBUTE_NAME.Gen_Profil_nazov)}
                    />
                    <InformationGridRow
                        hideIcon
                        label={consumingProjectAttribute.name}
                        value={getAttributeValue(consumingProjectData, ATTRIBUTE_NAME.Gen_Profil_nazov)}
                    />
                </DefinitionList>
            ) : (
                <>
                    <SimpleSelect
                        name={providingProjectAttribute.technicalName ?? ''}
                        label={providingProjectAttribute.name ?? ''}
                        options={provProjOptions}
                        setValue={setValue}
                        error={getAttributeInputErrorMessage(providingProjectAttribute, errors)?.message?.toString()}
                        clearErrors={clearErrors}
                        onChange={(newValue) => setSelectedProvProj(newValue ?? '')}
                        required
                    />

                    <SimpleSelect
                        name={consumingProjectAttribute.technicalName ?? ''}
                        label={consumingProjectAttribute.name ?? ''}
                        options={consProjOptions}
                        setValue={setValue}
                        error={getAttributeInputErrorMessage(consumingProjectAttribute, errors)?.message?.toString()}
                        clearErrors={clearErrors}
                        onChange={(newValue) => setSelectedConsProj(newValue ?? '')}
                        required
                    />
                </>
            )}

            <SubmitWithFeedback
                additionalButtons={[
                    <Button
                        key={1}
                        label={t('button.cancel')}
                        type="reset"
                        variant="secondary"
                        onClick={() => {
                            reset()
                            setHasReset(true)
                            navigate(RouterRoutes.INTEGRATION_LIST)
                        }}
                    />,
                ]}
                submitButtonLabel={t('button.saveChanges')}
                loading={isValidating || isSubmitting}
            />
        </form>
    )
}
