import { IconWithText, TextArea, TextHeading, TextLinkExternal } from '@isdd/idsk-ui-kit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FieldValues, UseFormRegister } from 'react-hook-form'

import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ErrorTriangleIcon } from '@isdd/metais-common/assets/images'
import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { BulkList } from '@isdd/metais-common/components/actions-over-table/bulk-actions-popup/BulkList'
import { ModalButtons } from '@isdd/metais-common/components/modal-buttons/ModalButtons'

interface IDeleteFileBulkViewProps {
    items: ConfigurationItemUi[]
    register: UseFormRegister<FieldValues>
    onClose: () => void
    onSubmit: () => void
}

export const DeleteFileBulkView: React.FC<IDeleteFileBulkViewProps> = ({ items, register, onSubmit, onClose }) => {
    const { t } = useTranslation()

    return (
        <form onSubmit={onSubmit} noValidate>
            <div>
                <TextHeading size="L">{t('bulkActions.deleteFile.title')}</TextHeading>
            </div>

            <IconWithText className={styles.warningText} icon={ErrorTriangleIcon}>
                {t('bulkActions.deleteFile.warningText')}
            </IconWithText>

            <BulkList title={t('bulkActions.deleteFile.listText', { count: items.length })} items={items} />

            <TextLinkExternal
                title={t('bulkActions.deleteFile.newWindowText')}
                href={'#'}
                newTab
                textLink={t('bulkActions.deleteFile.newWindowText')}
            />
            <TextArea {...register('reason')} label={t('bulkActions.deleteFile.reason')} rows={3} />

            <ModalButtons submitButtonLabel={t('bulkActions.deleteFile.deleteFile')} closeButtonLabel={t('button.cancel')} onClose={onClose} />
        </form>
    )
}
