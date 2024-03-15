import { RadioButton, RadioGroup, TextArea, TextHeading, TextLinkExternal } from '@isdd/idsk-ui-kit'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { BulkList } from '@isdd/metais-common/components/actions-over-table/bulk-actions-popup/BulkList'
import { ChangeOwnerDataUi, ChangeOwnerDataUiChangeType, ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ISelectPublicAuthorityAndRole, SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { CHANGE_OWNER_CHANGE_REASON, CHANGE_OWNER_CHANGE_TYPE } from '@isdd/metais-common/constants'
import { ModalButtons } from '@isdd/metais-common/components/modal-buttons/ModalButtons'

interface IChangeOwnerBulkView extends ISelectPublicAuthorityAndRole {
    items: ConfigurationItemUi[]
    multiple?: boolean
    onSubmit: (data: ChangeOwnerDataUi) => void
    onClose: () => void
}

export const ChangeOwnerBulkView: React.FC<IChangeOwnerBulkView> = ({
    items,
    selectedOrg,
    selectedRole,
    multiple,
    onChangeAuthority,
    onChangeRole,
    onSubmit,
    onClose,
    ciRoles,
}) => {
    const { t } = useTranslation()

    const title = multiple ? t('bulkActions.changeOwner.titleList') : t('bulkActions.changeOwner.title')

    const { register, handleSubmit } = useForm<ChangeOwnerDataUi>({
        defaultValues: {
            changeReason: CHANGE_OWNER_CHANGE_REASON[0],
            changeType: ChangeOwnerDataUiChangeType.changeCmdbItemAndRelatedCmdbItemsWithSameOwner,
        },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextHeading size="L">{title}</TextHeading>

            <SelectPublicAuthorityAndRole
                onChangeAuthority={onChangeAuthority}
                onChangeRole={onChangeRole}
                selectedOrg={selectedOrg}
                selectedRole={selectedRole}
                ciRoles={ciRoles}
            />
            <RadioGroup label={t('bulkActions.changeOwner.reason')}>
                {CHANGE_OWNER_CHANGE_REASON.map((item) => (
                    <RadioButton
                        key={item}
                        value={item}
                        label={t(`bulkActions.changeOwner.reasonType.${item}`)}
                        id={item}
                        {...register('changeReason')}
                    />
                ))}
            </RadioGroup>

            <TextArea {...register('changeDescription')} label={t('bulkActions.changeOwner.changeDescription')} rows={3} />

            <RadioGroup label={t('bulkActions.changeOwner.changeType')}>
                {CHANGE_OWNER_CHANGE_TYPE.map((item) => (
                    <RadioButton key={item} value={item} label={t(`bulkActions.changeOwner.types.${item}`)} id={item} {...register('changeType')} />
                ))}
            </RadioGroup>

            {multiple && <BulkList title={t('bulkActions.changeOwner.listText', { count: items.length })} items={items} />}

            <TextLinkExternal
                title={t('bulkActions.changeOwner.newWindowText')}
                href={'#'}
                newTab
                textLink={t('bulkActions.changeOwner.newWindowText')}
            />

            <ModalButtons submitButtonLabel={t('bulkActions.changeOwner.button')} closeButtonLabel={t('button.cancel')} onClose={onClose} />
        </form>
    )
}
