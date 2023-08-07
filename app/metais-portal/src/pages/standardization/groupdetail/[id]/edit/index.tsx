import { yupResolver } from '@hookform/resolvers/yup'
import { BreadCrumbs, Button, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Attribute, AttributeAttributeTypeEnum } from '@isdd/metais-common/api'
import { useFindByUuid3, useUpdateOrCreate2 } from '@isdd/metais-common/api/generated/iam-swagger'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect } from 'react'
import { FieldErrors, FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { AttributeInput } from '@/components/attribute-input/AttributeInput'
import { generateFormSchema } from '@/components/create-entity/createCiEntityFormSchema.ts'

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
        name: 'Názov pracovnej skupiny',
        technicalName: 'fullName',
    }

    const shortNameAttr = {
        ...textAttribute,
        name: 'Skratka pracovnej skupiny',
        technicalName: 'shortName',
    }

    const descriptionAttribute = {
        ...textAttribute,
        displayAs: 'textarea',
        name: 'Popis',
        technicalName: 'description',
    }
    const goBack = () => {
        navigate(NavigationSubRoutes.KOMISIA_NA_STANDARDIZACIU)
    }
    const formMethods = useForm({})
    const { t } = useTranslation()
    const { handleSubmit, register, formState, setValue } = useForm({
        resolver: yupResolver(generateFormSchema([fullNameAttr, shortNameAttr, descriptionAttribute], t)),
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
        setValue(descriptionAttribute.technicalName, infoData?.description)
    }, [descriptionAttribute.technicalName, fullNameAttr.technicalName, infoData, setValue, shortNameAttr.technicalName])

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

    const hasAttributeInputError = (
        attribute: Attribute,
        errorList: FieldErrors<{
            [x: string]: string | number | boolean | Date | null | undefined
        }>,
    ) => {
        if (attribute.technicalName != null) {
            const error = Object.keys(errorList).includes(attribute.technicalName)
            return error ? errorList[attribute.technicalName]?.message?.toString() ?? '' : ''
        }
        return ''
    }

    return (
        <>
            <BreadCrumbs
                links={[
                    { href: '/', label: 'Domov', icon: HomeIcon },
                    { href: '/howto/STANDARD.PROCESS/STD_HOWTO', label: 'Štandardizácia' },
                    { href: NavigationSubRoutes.KOMISIA_NA_STANDARDIZACIU, label: 'Komisia pre štandardizáciu ITVS' },
                    {
                        href: NavigationSubRoutes.KOMISIA_NA_STANDARDIZACIU + '/edit',
                        label: 'Upraviť Komisiu pre štandardizáciu ITVS',
                    },
                ]}
            />
            <TextHeading size="XL">Upraviť Komisiu pre štandardizáciu ITVS</TextHeading>
            <FormProvider {...formMethods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <AttributeInput
                        attribute={fullNameAttr}
                        register={register}
                        error={hasAttributeInputError(fullNameAttr, errors)}
                        isSubmitted={isSubmitted}
                    />
                    <AttributeInput
                        attribute={shortNameAttr}
                        register={register}
                        error={hasAttributeInputError(shortNameAttr, errors)}
                        isSubmitted={isSubmitted}
                    />
                    <AttributeInput
                        attribute={descriptionAttribute}
                        register={register}
                        error={hasAttributeInputError(descriptionAttribute, errors)}
                        isSubmitted={isSubmitted}
                    />
                    <Button label="Cancel" type="reset" variant="secondary" onClick={goBack} />
                    <Button label="Submit" type="submit" />
                </form>
            </FormProvider>
        </>
    )
}

export default KSIVSPageEdit
