import { yupResolver } from '@hookform/resolvers/yup'
import { BreadCrumbs, Button, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { AttributeAttributeTypeEnum } from '@isdd/metais-common/api'
import { useFindByUuid3, useUpdateOrCreate2 } from '@isdd/metais-common/api/generated/iam-swagger'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { AttributeInput } from '@/components/attribute-input/AttributeInput'
import { generateFormSchema } from '@/components/create-entity/createCiEntityFormSchema'
import { hasAttributeInputError } from '@/components/views/standartization/standartizationUtils'

const textAttribute = {
    defaultValue: '',
    attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
    valid: true,
    readOnly: false,
    mandatory: { type: 'critical' },
}

const KSIVSPageEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: infoData } = useFindByUuid3(id ?? '')

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
    const goBack = () => {
        navigate(NavigationSubRoutes.KOMISIA_NA_STANDARDIZACIU)
    }
    const formMethods = useForm({})
    const { t } = useTranslation()
    const { handleSubmit, register, formState, setValue } = useForm({
        resolver: yupResolver(generateFormSchema([fullNameAttr, shortNameAttr, descriptionAttr], t)),
    })
    const { errors, isSubmitted } = formState
    const { mutate: updateGroup } = useUpdateOrCreate2({
        mutation: {
            onSuccess() {
                goBack()
            },
        },
    })

    useEffect(() => {
        setValue(fullNameAttr.technicalName, infoData?.name)
        setValue(shortNameAttr.technicalName, infoData?.shortName)
        setValue(descriptionAttr.technicalName, infoData?.description)
    }, [descriptionAttr.technicalName, fullNameAttr.technicalName, infoData, setValue, shortNameAttr.technicalName])

    const onSubmit = (formData: FieldValues) => {
        updateGroup({
            data: {
                uuid: infoData?.uuid,
                shortName: formData['shortName'],
                name: formData['fullName'],
                description: formData['description'],
            },
        })
    }

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
                        control={formMethods.control}
                        trigger={formMethods.trigger}
                        attribute={{ ...fullNameAttr, name: t('KSIVSPage.groupName') }}
                        register={register}
                        error={hasAttributeInputError(fullNameAttr, errors)}
                        isSubmitted={isSubmitted}
                    />
                    <AttributeInput
                        setValue={formMethods.setValue}
                        control={formMethods.control}
                        trigger={formMethods.trigger}
                        attribute={{ ...shortNameAttr, name: t('KSIVSPage.groupShortName') }}
                        register={register}
                        error={hasAttributeInputError(shortNameAttr, errors)}
                        isSubmitted={isSubmitted}
                    />
                    <AttributeInput
                        setValue={formMethods.setValue}
                        control={formMethods.control}
                        trigger={formMethods.trigger}
                        attribute={{ ...descriptionAttr, name: t('KSIVSPage.description') }}
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

export default KSIVSPageEdit
