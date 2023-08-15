import { BreadCrumbs, Button, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { AttributeAttributeTypeEnum } from '@isdd/metais-common/api'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { AttributeInput } from '@/components/attribute-input/AttributeInput'
import { KSISVSEditViewParams } from '@/components/containers/KSISVSEditContainer'
import { hasAttributeInputError } from '@/components/views/standartization/standartizationUtils'

const textAttribute = {
    defaultValue: '',
    attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
    valid: true,
    readOnly: false,
    mandatory: { type: 'critical' },
}

const fullNameAttr = {
    ...textAttribute,
    technicalName: 'fullName',
}
const shortNameAttr = {
    ...textAttribute,
    technicalName: 'shortName',
}

const descriptionAttr = {
    ...textAttribute,
    displayAs: 'textarea',
    technicalName: 'description',
}

export const KSISVSEditView: React.FC<KSISVSEditViewParams> = ({ onSubmit, goBack, infoData }) => {
    const { t } = useTranslation()
    const formMethods = useForm({})
    const { handleSubmit, register, formState } = useForm({})

    const { errors, isSubmitted } = formState

    return (
        <>
            <BreadCrumbs
                links={[
                    { href: RouteNames.HOME, label: t('notifications.home'), icon: HomeIcon },
                    { href: RouteNames.HOW_TO_STANDARDIZATION, label: t('navMenu.standardization') },
                    { href: NavigationSubRoutes.KOMISIA_NA_STANDARDIZACIU, label: t('KSIVSPage.title') },
                    {
                        href: NavigationSubRoutes.KOMISIA_NA_STANDARDIZACIU_EDIT,
                        label: t('KSIVSPage.editCommission'),
                    },
                ]}
            />
            <TextHeading size="XL">{t('KSIVSPage.editCommission')}</TextHeading>
            <FormProvider {...formMethods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <AttributeInput
                        setValue={formMethods.setValue}
                        trigger={formMethods.trigger}
                        attribute={{ ...fullNameAttr, name: t('KSIVSPage.groupName'), defaultValue: infoData?.name }}
                        register={register}
                        error={hasAttributeInputError(fullNameAttr, errors)}
                        isSubmitted={isSubmitted}
                    />
                    <AttributeInput
                        setValue={formMethods.setValue}
                        trigger={formMethods.trigger}
                        attribute={{ ...shortNameAttr, name: t('KSIVSPage.groupShortName'), defaultValue: infoData?.shortName }}
                        register={register}
                        error={hasAttributeInputError(shortNameAttr, errors)}
                        isSubmitted={isSubmitted}
                    />
                    <AttributeInput
                        setValue={formMethods.setValue}
                        trigger={formMethods.trigger}
                        attribute={{ ...descriptionAttr, name: t('KSIVSPage.description'), defaultValue: infoData?.description }}
                        register={register}
                        error={hasAttributeInputError(descriptionAttr, errors)}
                        isSubmitted={isSubmitted}
                    />
                    <Button label={t('form.cancel')} type="reset" variant="secondary" onClick={goBack} />
                    <Button label={t('form.submit')} type="submit" />
                </form>
            </FormProvider>
        </>
    )
}
