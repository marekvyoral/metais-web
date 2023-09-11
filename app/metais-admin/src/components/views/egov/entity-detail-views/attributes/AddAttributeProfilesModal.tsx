import { BaseModal, MultiSelect } from '@isdd/idsk-ui-kit'
import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ProfileListContainer } from '@/components/containers/Egov/Profile/ProfileListContainer'
import { CreateEntityForm } from '@/types/form'

interface AttributesModal {
    open: boolean
    onClose: () => void
}

export const AddAttributeProfilesModal = ({ open, onClose }: AttributesModal) => {
    const { t } = useTranslation()
    const { setValue, getValues } = useFormContext<CreateEntityForm, unknown, undefined>()
    const handleOnAttributeProfilesChange = useCallback(
        (values?: string[]) => {
            let attributeProfiles
            try {
                attributeProfiles = values?.map((value) => JSON.parse(value))
            } catch (e) {
                // eslint-disable-next-line no-console
                console.log('Could not add attribute profile: ', e)
                return
            }
            setValue('attributeProfiles', attributeProfiles)
            onClose()
        },
        [onClose, setValue],
    )

    return (
        <BaseModal isOpen={open} close={onClose}>
            <ProfileListContainer
                View={(props) => {
                    const listData = props?.data
                    const listOptions =
                        listData?.map((data) => {
                            return {
                                value: JSON.stringify(data) ?? '',
                                label: data?.name ?? '',
                            }
                        }) ?? []
                    return (
                        <div>
                            <MultiSelect
                                id="attributeProfiles"
                                name="attributeProfiles"
                                label={t('egov.detail.profiles')}
                                options={[{ label: t('egov.detail.selectOption'), value: '', disabled: true }, ...listOptions]}
                                defaultValue={getValues('attributeProfiles')?.map((profile) => JSON.stringify(profile))}
                                onChange={handleOnAttributeProfilesChange}
                            />
                        </div>
                    )
                }}
            />
        </BaseModal>
    )
}
