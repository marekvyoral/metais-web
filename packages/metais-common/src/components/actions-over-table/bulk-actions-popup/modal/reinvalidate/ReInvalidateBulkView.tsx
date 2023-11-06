import { IconWithText, TextHeading, TextLinkExternal } from '@isdd/idsk-ui-kit'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ErrorTriangleIcon } from '@isdd/metais-common/assets/images'
import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { BulkList } from '@isdd/metais-common/components/actions-over-table/bulk-actions-popup/BulkList'

interface IReInvalidateBulkView {
    items: ConfigurationItemUi[]
    multiple?: boolean
    onClose: () => void
    onSubmit: () => void
}

export const ReInvalidateView: React.FC<IReInvalidateBulkView> = ({ items, multiple, onSubmit, onClose }) => {
    const { t } = useTranslation()

    const title = multiple ? t('bulkActions.reInvalidate.titleList') : t('bulkActions.reInvalidate.title')

    return (
        <>
            <div>
                <TextHeading size="L">{title}</TextHeading>
            </div>

            <IconWithText className={styles.warningText} icon={ErrorTriangleIcon}>
                {t('bulkActions.reInvalidate.warningText')}
            </IconWithText>

            {multiple && <BulkList title={t('bulkActions.reInvalidate.listText', { count: items.length })} items={items} />}

            <TextLinkExternal
                title={t('bulkActions.reInvalidate.newWindowText')}
                href={'#'}
                newTab
                textLink={t('bulkActions.reInvalidate.newWindowText')}
            />

            <div className={styles.buttonGroupEnd}>
                <Button onClick={() => onClose()} label={t('button.cancel')} variant="secondary" />
                <Button onClick={() => onSubmit()} label={t('bulkActions.reInvalidate.reInvalidate')} />
            </div>
        </>
    )
}
