import React, { useCallback } from 'react'
import { BaseModal, SimpleSelect } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { Controller, useFormContext } from 'react-hook-form'
import { AttributeProfile } from '@isdd/metais-common/api'

import { ProfileListContainer } from '@/components/containers/Egov/Profile/ProfileListContainer'
import { CreateEntityForm } from '@/types/form'

interface AttributesModal {
    open: boolean
    onClose: () => void
}

export const AddAttributeProfilesModal = ({ open, onClose }: AttributesModal) => {
    const { t } = useTranslation()
    const { setValue, control } = useFormContext<CreateEntityForm, unknown, undefined>()

    const handleOnAttributeProfilesChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>, value?: AttributeProfile[]) => {
            let newAttributeProfile
            try {
                newAttributeProfile = JSON.parse(event?.target?.value)
            } catch (e) {
                // eslint-disable-next-line no-console
                console.log('Could not add attribute profile: ', e)
                return
            }
            if (value) {
                setValue('attributeProfiles', [...value, newAttributeProfile])
            } else {
                setValue('attributeProfiles', [newAttributeProfile])
            }
            onClose()
        },
        [onClose, setValue],
    )

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
                                    onChange={(event) => handleOnAttributeProfilesChange(event, value)}
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
