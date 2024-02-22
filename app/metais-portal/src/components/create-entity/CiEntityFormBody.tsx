import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@isdd/idsk-ui-kit/index'
import { Stepper } from '@isdd/idsk-ui-kit/stepper/Stepper'
import { SubmitWithFeedback } from '@isdd/metais-common/index'
import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AttributeProfile, CiCode, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { GidRoleData } from '@isdd/metais-common/api/generated/iam-swagger'
import { ISection } from '@isdd/idsk-ui-kit/stepper/StepperSection'
import { ConfigurationItemUiAttributes, HierarchyRightsUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ENTITY_PROJECT } from '@isdd/metais-common/constants'

import { getFilteredAttributeProfilesBasedOnRole, getValidAndVisibleAttributes } from './createEntityHelpers'
import { generateFormSchema } from './createCiEntityFormSchema'
import styles from './createEntity.module.scss'

import { AttributesConfigTechNames } from '@/components/attribute-input/attributeDisplaySettings'
import { filterFormValuesBasedOnCurrentRole, formatForFormDefaultValues } from '@/componentHelpers/ci'

type Props = {
    entityName: string
    generatedEntityId: CiCode
    ciTypeData: CiType | undefined
    onSubmit: (formData: FieldValues) => void
    isProcessing?: boolean
    selectedRole?: GidRoleData | null
    stepperList: ISection[]
    formDefaultValues: ConfigurationItemUiAttributes
    isUpdate: boolean
    setHasReset: Dispatch<SetStateAction<boolean>>
    isSubmitDisabled: boolean
    selectedOrg?: HierarchyRightsUi | null
}

export const CiEntityFormBody: React.FC<Props> = ({
    entityName,
    formDefaultValues,
    onSubmit,
    stepperList,
    selectedRole,
    isUpdate,
    generatedEntityId,
    setHasReset,
    isProcessing,
    isSubmitDisabled,
    ciTypeData,
    selectedOrg,
}) => {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const combinedProfiles = useMemo(() => [ciTypeData as AttributeProfile, ...(ciTypeData?.attributeProfiles ?? [])], [ciTypeData])

    const formSchema = useMemo(() => {
        return generateFormSchema(
            isUpdate ? combinedProfiles : getFilteredAttributeProfilesBasedOnRole(combinedProfiles, selectedRole?.roleName ?? ''),
            t,
            i18n.language,
            null,
            ciTypeData?.technicalName,
            formDefaultValues,
        )
    }, [isUpdate, combinedProfiles, selectedRole?.roleName, t, i18n.language, ciTypeData?.technicalName, formDefaultValues])

    const methods = useForm({
        defaultValues: formDefaultValues,
        mode: 'onChange',
        resolver: yupResolver(formSchema),
    })
    const { handleSubmit, reset, formState, getValues, setValue } = methods

    useEffect(() => {
        if (!isUpdate) {
            const currentValues = getValues()
            const currentRole = selectedRole
            const attributes = getValidAndVisibleAttributes(ciTypeData)

            const filteredFormValuesWithoutPermission = filterFormValuesBasedOnCurrentRole(
                combinedProfiles,
                currentRole?.roleName ?? '',
                currentValues,
            )

            reset(formatForFormDefaultValues(filteredFormValuesWithoutPermission, attributes))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRole])

    useEffect(() => {
        const referenceIdValue = generatedEntityId?.ciurl?.split('/').pop()
        const metaIsCodeValue = generatedEntityId?.cicode
        setValue(AttributesConfigTechNames.REFERENCE_ID, referenceIdValue)
        setValue(AttributesConfigTechNames.METAIS_CODE, metaIsCodeValue)
        Object.entries(formDefaultValues).forEach((item) => {
            const element = formState.defaultValues?.[item[0]]
            if (element == '' || element == undefined) {
                setValue(item[0], item[1])
            }
        })
    }, [formState.defaultValues, formDefaultValues, setValue, generatedEntityId?.ciurl, generatedEntityId?.cicode])

    useEffect(() => {
        if (entityName === ENTITY_PROJECT) setValue(AttributesConfigTechNames.EA_Profil_Projekt_prijimatel, selectedOrg?.poName)
    }, [selectedOrg, setValue, entityName])

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stepper subtitleTitle="" stepperList={stepperList} />
                <SubmitWithFeedback
                    className={styles.buttonGroup}
                    additionalButtons={[
                        <Button
                            key={1}
                            label={t('button.cancel')}
                            type="reset"
                            variant="secondary"
                            onClick={() => {
                                reset()
                                setHasReset(true)
                                navigate(-1)
                            }}
                        />,
                    ]}
                    submitButtonLabel={t('button.saveChanges')}
                    loading={isProcessing || formState.isValidating || formState.isSubmitting}
                    disabled={isSubmitDisabled}
                />
            </form>
        </FormProvider>
    )
}
