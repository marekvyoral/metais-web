import { IconWithText, TextArea, TextHeading, TextLinkExternal } from '@isdd/idsk-ui-kit'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ConfigurationItemUi } from '@isdd/metais-common/api'
import { ErrorTriangleIcon } from '@isdd/metais-common/assets/images'
import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { BulkList } from '@isdd/metais-common/components/actions-over-table/bulk-actions-popup/BulkList'

interface IInvalidateBulkView {
    items: ConfigurationItemUi[]
    register: UseFormRegister<FieldValues>
    onSubmit: () => void
    onClose: () => void
}

export const InvalidateBulkView: React.FC<IInvalidateBulkView> = ({ items, register, onSubmit, onClose }) => {
    const { t } = useTranslation()
    return (
        <form onSubmit={onSubmit}>
            <TextHeading size="L">{t('bulkActions.invalidate.title')}</TextHeading>

            <IconWithText className={styles.warningText} icon={ErrorTriangleIcon}>
                {t('bulkActions.invalidate.warningText')}
            </IconWithText>

            <BulkList title={t('bulkActions.invalidate.listText', { count: items.length })} items={items} />

            <TextLinkExternal
                title={t('bulkActions.invalidate.newWindowText')}
                href={'#'}
                newTab
                textLink={t('bulkActions.invalidate.newWindowText')}
            />

            <TextArea {...register('reason')} label={t('bulkActions.invalidate.reason')} rows={3} />

            <div className={styles.buttonGroupEnd}>
                <Button onClick={() => onClose()} label={t('button.cancel')} variant="secondary" />
                <Button label={t('bulkActions.invalidate.invalidate')} type="submit" />
            </div>
        </form>
    )
}
