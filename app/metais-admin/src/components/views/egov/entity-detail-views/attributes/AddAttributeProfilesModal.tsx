import { BaseModal, MultiSelect } from '@isdd/idsk-ui-kit'
import { useCallback, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { ProfileListContainer } from '@/components/containers/Egov/Profile/ProfileListContainer'
import { CreateEntityForm } from '@/types/form'

interface AttributesModal {
    open: boolean
    onClose: () => void
    attrProfiles: AttributeProfile[]
}

export const AddAttributeProfilesModal = ({ open, onClose, attrProfiles }: AttributesModal) => {
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
    useEffect(() => {
        setValue('attributeProfiles', attrProfiles)
    }, [attrProfiles, setValue])

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
                            <QueryFeedback loading={props.isLoading} withChildren>
                                <MultiSelect
                                    id="attributeProfiles"
                                    name="attributeProfiles"
                                    label={t('egov.detail.profiles')}
                                    options={[{ label: t('egov.detail.selectOption'), value: '', disabled: true }, ...listOptions]}
                                    value={getValues('attributeProfiles')?.map((profile) => JSON.stringify(profile))}
                                    onChange={handleOnAttributeProfilesChange}
                                />
                            </QueryFeedback>
                        </div>
                    )
                }}
            />
        </BaseModal>
    )
}
