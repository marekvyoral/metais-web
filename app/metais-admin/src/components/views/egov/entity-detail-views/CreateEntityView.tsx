import React, { useState } from 'react'
import { Button, Input, SimpleSelect, Tabs, TextArea } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { FieldValues, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AttributeProfile } from '@isdd/metais-common/api'

import { AddAttributeProfilesModal } from './AddAttributeProfilesModal'
import { EntityDetailViewAttributes } from './EntityDetailViewAttributes'

import { ICreateEntityView } from '@/components/containers/Egov/Entity/CreateEntityContainer'

export const CreateEntityView = ({ data, mutate }: ICreateEntityView) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState<boolean>(false)

    const onClose = () => {
        setOpen(false)
    }

    const schema = yup
        .object()
        .shape({
            name: yup.string().required(),
            engName: yup.string().required(),
            technicalName: yup.string().required().min(2),
            codePrefix: yup
                .string()
                .required()
                .matches(/[a-zA-Z_]+/g),
            uriPrefix: yup.string().required(),
            description: yup.string().required(),
            attributeProfiles: yup.array(),
        })
        .required()

    const { register, handleSubmit, reset, formState, watch, control, setValue } = useForm({ resolver: yupResolver(schema) })

    const rolesToSelect =
        data?.roles?.map((role) => {
            return {
                value: role?.name ?? '',
                label: role?.description ?? '',
            }
        }) ?? []

    const onSubmit = (formData: FieldValues) => {
        //sending data to BE
        try {
            // mutate({
            //     data: {
            //         ...formData,
            //     },
            // })
            // eslint-disable-next-line no-console
            console.log('sent data', formData)
        } catch (error) {
            console.error('CATCH ERROR:', error?.message, formState)
        }
    }
    const attributesProfiles = watch('attributeProfiles')
    const keysToDisplay = new Map<string, AttributeProfile | undefined>()
    if (attributesProfiles) {
        if (Array.isArray(attributesProfiles)) attributesProfiles?.map((attrProfile) => keysToDisplay.set(attrProfile?.name, attrProfile))
        else keysToDisplay?.set(attributesProfiles?.name, attributesProfiles)
    }

    const tabsNames = Array.from(keysToDisplay?.keys())

    const tabsFromApi = tabsNames?.map((key) => {
        const tabData = keysToDisplay?.get(key)
        return {
            id: key,
            title: key,
            content: <EntityDetailViewAttributes data={tabData} />,
        }
    })

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <>
                    <Input label={t('egov.name')} id="name" {...register('name')} error={formState?.errors?.name} />
                    <Input label={t('egov.engName')} id="engName" {...register('engName')} error={formState?.errors?.engName} />
                    <Input
                        label={t('egov.technicalName')}
                        id="technicalName"
                        {...register('technicalName')}
                        error={formState?.errors?.technicalName}
                    />
                    <Input label={t('egov.codePrefix')} id="codePrefix" {...register('codePrefix')} error={formState?.errors?.codePrefix} />
                    <Input label={t('egov.uriPrefix')} id="uriPrefix" {...register('uriPrefix')} error={formState?.errors?.uriPrefix} />
                    <TextArea
                        label={t('egov.description')}
                        id="description"
                        rows={3}
                        {...register('description')}
                        error={formState?.errors?.description}
                    />
                    <SimpleSelect id="roles" name="roles" label={t('egov.roles')} options={rolesToSelect} />
                    <Button type="submit" label={'submit'} />
                </>
                <div>
                    <h3 className="govuk-heading-m">{t('egov.detail.profiles')}</h3>
                    <AddAttributeProfilesModal open={open} onClose={onClose} control={control} setValue={setValue} />
                    <Button label={'add new profile'} onClick={() => setOpen(true)} />
                    {tabsFromApi?.length > 0 && <Tabs tabList={tabsFromApi} />}
                </div>
            </form>
        </>
    )
}
