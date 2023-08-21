import React from 'react'
import { BaseModal, SimpleSelect } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'

import { ProfileListContainer } from '@/components/containers/Egov/Profile/ProfileListContainer'

interface AttributesModal {
    open: boolean
    onClose: () => void
}

export const AddAttributeProfilesModal = ({ open, onClose }: AttributesModal) => {
    const { t } = useTranslation()
    const { setValue } = useFormContext()
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
                        <SimpleSelect
                            id="attributeProfiles"
                            name="attributeProfiles"
                            label={t('egov.detail.profiles')}
                            options={[{ label: t('egov.detail.selectOption'), value: '', disabled: true }, ...listOptions]}
                            defaultValue={''}
                            setValue={setValue}
                        />
                    )
                }}
            />
        </BaseModal>
    )
}
