import React from 'react'
import { BaseModal, SimpleSelect } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { Controller, useFormContext } from 'react-hook-form'

import { ProfileListContainer } from '@/components/containers/Egov/Profile/ProfileListContainer'

interface AttributesModal {
    open: boolean
    onClose: () => void
}

export const AddAttributeProfilesModal = ({ open, onClose }: AttributesModal) => {
    const { t } = useTranslation()
    const { setValue, control } = useFormContext()
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
                                    options={[{ label: t('egov.detail.selectOption'), value: '', disabled: true }, ...listOptions]}
                                    defaultValue={''}
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
