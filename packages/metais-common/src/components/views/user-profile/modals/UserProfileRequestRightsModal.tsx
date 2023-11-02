import { BaseModal, Button, Input, SelectLazyLoading, TextArea, TextHeading } from '@isdd/idsk-ui-kit'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { mixed, object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { SortType } from '@isdd/idsk-ui-kit/src/types'

import styles from './modals.module.scss'

import { ConfigurationItemUi, useReadCiList1Hook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { SubmitWithFeedback } from '@isdd/metais-common/components/submit-with-feedback/SubmitWithFeedback'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { ClaimEvent } from '@isdd/metais-common/api/generated/claim-manager-swagger'

enum RequestFormFields {
    PO = 'po',
    PHONE = 'phone',
    EMAIL = 'email',
    DESCRIPTION = 'description',
}

type UserRequestRightsForm = {
    [RequestFormFields.PO]: ConfigurationItemUi
    [RequestFormFields.PHONE]: string
    [RequestFormFields.EMAIL]: string
    [RequestFormFields.DESCRIPTION]: string
}

type Props = {
    isOpen: boolean
    onClose: () => void
    mutateCallback: (data: ClaimEvent) => void
    isLoading: boolean
}

export const UserProfileRequestRightsModal: React.FC<Props> = ({ isOpen, onClose, mutateCallback, isLoading }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()

    const requiredString = ` (${t('userProfile.requests.required')})`

    const schema = object().shape({
        [RequestFormFields.PO]: mixed().required(),
        [RequestFormFields.PHONE]: string().required(),
        [RequestFormFields.EMAIL]: string().required(),
        [RequestFormFields.DESCRIPTION]: string().required(),
    })

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors, isSubmitting, isValidating },
    } = useForm<UserRequestRightsForm>({
        resolver: yupResolver(schema),
    })

    useEffect(() => {
        if (user?.uuid) {
            setValue(RequestFormFields.EMAIL, user?.email ?? '')
            setValue(RequestFormFields.PHONE, user?.phone ?? '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.uuid])

    const onSubmit = (formData: UserRequestRightsForm) => {
        mutateCallback({
            type: 'CREATE_EVENT',
            claimUi: {
                createdBy: user?.uuid,
                ...formData,
                po: formData[RequestFormFields.PO].uuid,
            },
        })
    }

    const ciOptionsHook = useReadCiList1Hook()

    const loadCiOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined) => {
            const userPoUuids = user?.groupData.map((po) => po.orgId) ?? []

            const page = !additional?.page ? 1 : (additional?.page || 0) + 1

            const ciResponse = await ciOptionsHook({
                page,
                perpage: 20,
                sortBy: 'Gen_Profil_nazov',
                sortType: SortType.ASC,
                filter: { type: ['PO'], searchFields: ['Gen_Profil_nazov'], fullTextSearch: searchQuery, uuid: [...userPoUuids] },
            })

            return {
                options: ciResponse.configurationItemSet || [],
                hasMore: page < (ciResponse.pagination?.totalPages ?? 0),
                additional: {
                    page,
                },
            }
        },
        [ciOptionsHook, user?.groupData],
    )

    return (
        <BaseModal widthInPx={640} isOpen={isOpen} close={onClose}>
            <div className={styles.div}>
                <TextHeading size="L">{t('userProfile.requests.rightsSettings')}</TextHeading>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <SelectLazyLoading<ConfigurationItemUi>
                        label={t('userProfile.requests.po') + requiredString}
                        placeholder={t('userProfile.requests.placeholderPO')}
                        name={RequestFormFields.PO}
                        getOptionValue={(item) => item.uuid?.toString() || ''}
                        getOptionLabel={(item) => (item.attributes ? item.attributes?.Gen_Profil_nazov : '')}
                        loadOptions={(searchTerm, _, additional) => loadCiOptions(searchTerm, additional)}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        error={errors[RequestFormFields.PO]?.message}
                    />
                    <Input
                        label={t('userProfile.requests.phone') + requiredString}
                        placeholder={t('userProfile.requests.placeholder')}
                        defaultValue={user?.phone}
                        error={errors[RequestFormFields.PHONE]?.message}
                        {...register(RequestFormFields.PHONE)}
                        type="tel"
                    />
                    <Input
                        label={t('userProfile.requests.email') + requiredString}
                        placeholder={t('userProfile.requests.placeholder')}
                        defaultValue={user?.email}
                        error={errors[RequestFormFields.EMAIL]?.message}
                        {...register(RequestFormFields.EMAIL)}
                        type="email"
                    />
                    <TextArea
                        rows={3}
                        label={t('userProfile.requests.description') + requiredString}
                        placeholder={t('userProfile.requests.placeholder')}
                        error={errors[RequestFormFields.DESCRIPTION]?.message}
                        {...register(RequestFormFields.DESCRIPTION)}
                    />

                    <SubmitWithFeedback
                        className={styles.noMarginButtons}
                        loading={isSubmitting || isValidating || isLoading}
                        submitButtonLabel={t('userProfile.requests.submit')}
                        additionalButtons={[
                            <Button key="cancelButton" variant="secondary" type="reset" label={t('userProfile.requests.cancel')} onClick={onClose} />,
                        ]}
                    />
                </form>
            </div>
        </BaseModal>
    )
}
