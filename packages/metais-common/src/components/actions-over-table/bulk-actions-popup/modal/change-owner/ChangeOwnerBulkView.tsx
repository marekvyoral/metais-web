import { RadioButton, RadioGroupWithLabel, TextArea, TextHeading, TextLinkExternal } from '@isdd/idsk-ui-kit'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { BulkList } from '@isdd/metais-common/components/actions-over-table/bulk-actions-popup/BulkList'
import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { ChangeOwnerDataUi, ChangeOwnerDataUiChangeType, ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ISelectPublicAuthorityAndRole, SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { CHANGE_OWNER_CHANGE_REASON, CHANGE_OWNER_CHANGE_TYPE } from '@isdd/metais-common/constants'

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
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextHeading size="L">{title}</TextHeading>

            <SelectPublicAuthorityAndRole
                onChangeAuthority={onChangeAuthority}
                onChangeRole={onChangeRole}
                selectedOrg={selectedOrg}
                selectedRole={selectedRole}
                ciRoles={ciRoles}
            />
            <RadioGroupWithLabel label={t('bulkActions.changeOwner.reason')}>
                {CHANGE_OWNER_CHANGE_REASON.map((item) => (
                    <RadioButton
                        key={item}
                        value={item}
                        label={t(`bulkActions.changeOwner.reasonType.${item}`)}
                        id={item}
                        {...register('changeReason')}
                    />
                ))}
            </RadioGroupWithLabel>

            <TextArea {...register('changeDescription')} label={t('bulkActions.changeOwner.changeDescription')} rows={3} />

            <RadioGroupWithLabel label={t('bulkActions.changeOwner.changeType')}>
                {CHANGE_OWNER_CHANGE_TYPE.map((item) => (
                    <RadioButton key={item} value={item} label={t(`bulkActions.changeOwner.types.${item}`)} id={item} {...register('changeType')} />
                ))}
            </RadioGroupWithLabel>

            <div className={styles.buttonGroup}>
                <Button onClick={() => onClose()} label={t('button.cancel')} variant="secondary" />
                <Button type="submit" label={t('bulkActions.changeOwner.button')} />
            </div>

            {multiple && <BulkList title={t('bulkActions.changeOwner.listText', { count: items.length })} items={items} />}

            <TextLinkExternal
                title={t('bulkActions.changeOwner.newWindowText')}
                href={'#'}
                newTab
                textLink={t('bulkActions.changeOwner.newWindowText')}
            />
        </form>
    )
}
