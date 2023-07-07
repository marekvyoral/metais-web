import React from 'react'
import { BaseModal, SimpleSelect } from '@isdd/idsk-ui-kit'
import { AttributeProfile, Cardinality, CiTypePreview } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'
import { Control, Controller, UseFormSetValue } from 'react-hook-form'

import { ProfileListContainer } from '@/components/containers/Egov/Profile/ProfileListContainer'

interface AttributesModal {
    open: boolean
    onClose: () => void
    setValue: UseFormSetValue<{
        name: string
        engName: string
        technicalName: string
        codePrefix: string | undefined
        uriPrefix: string | undefined
        description: string
        engDescription: string | undefined
        attributeProfiles: AttributeProfile[] | undefined
        roleList: (string | undefined)[]
        type: string
        sources: CiTypePreview[] | undefined
        sourceCardinality: Cardinality | undefined
        targets: CiTypePreview[] | undefined
        targetCardinality: Cardinality | undefined
    }>
    control: Control<
        {
            name: string
            engName: string
            technicalName: string
            codePrefix: string | undefined
            uriPrefix: string | undefined
            description: string
            engDescription: string | undefined
            attributeProfiles: AttributeProfile[] | undefined
            roleList: (string | undefined)[]
            type: string
            sources: CiTypePreview[] | undefined
            sourceCardinality: Cardinality | undefined
            targets: CiTypePreview[] | undefined
            targetCardinality: Cardinality | undefined
        },
        unknown
    >
}

export const AddAttributeProfilesModal = ({ open, onClose, setValue, control }: AttributesModal) => {
    const { t } = useTranslation()

    return (
        <BaseModal isOpen={open} close={onClose}>
            <ProfileListContainer
                View={(props) => {
                    const listData = props?.data?.attributeProfileList
                    const listOptions =
                        listData?.map((data) => {
                            return {
                                value: JSON.stringify(data) ?? '',
                                label: data?.name ?? '',
                            }
                        }) ?? []
                    return (
                        <Controller
                            control={control}
                            name="attributeProfiles"
                            render={({ field: { onBlur, value, name, ref } }) => (
                                <SimpleSelect
                                    id="attributeProfiles"
                                    label={t('egov.detail.profiles')}
                                    options={listOptions}
                                    onChange={(event) => {
                                        if (value) {
                                            setValue('attributeProfiles', [...value, JSON.parse(event?.target?.value)])
                                        } else {
                                            setValue('attributeProfiles', [JSON.parse(event?.target?.value)])
                                        }
                                        onClose()
                                    }}
                                    onBlur={onBlur}
                                    name={name}
                                    ref={ref}
                                />
                            )}
                        />
                    )
                }}
            />
        </BaseModal>
    )
}
