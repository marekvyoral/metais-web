import { IconWithText, TextArea, TextHeading, TextLinkExternal } from '@isdd/idsk-ui-kit'
import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ErrorTriangleIcon } from '@isdd/metais-common/assets/images'
import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { BulkList } from '@isdd/metais-common/components/actions-over-table/bulk-actions-popup/BulkList'
import { ModalButtons } from '@isdd/metais-common/components/modal-buttons/ModalButtons'

interface IInvalidateBulkView {
    items: ConfigurationItemUi[]
    multiple?: boolean
    register: UseFormRegister<FieldValues>
    onSubmit: () => void
    onClose: () => void
    deleteFile?: boolean
}

export const InvalidateBulkView: React.FC<IInvalidateBulkView> = ({ items, multiple, register, onSubmit, onClose, deleteFile }) => {
    const { t } = useTranslation()

    const title = multiple ? t('bulkActions.invalidate.titleList') : t('bulkActions.invalidate.title')
    const deleteFileTitle = multiple ? t('bulkActions.deleteFile.titleList') : t('bulkActions.deleteFile.title')

    return (
        <form onSubmit={onSubmit}>
            <TextHeading size="L">{deleteFile ? deleteFileTitle : title}</TextHeading>

            <IconWithText className={styles.warningText} icon={ErrorTriangleIcon}>
                {t(deleteFile ? 'bulkActions.deleteFile.warningText' : 'bulkActions.invalidate.warningText')}
            </IconWithText>

            {multiple && (
                <BulkList
                    title={t(deleteFile ? 'bulkActions.deleteFile.listText' : 'bulkActions.invalidate.listText', { count: items.length })}
                    items={items}
                />
            )}

            <TextLinkExternal
                title={t(deleteFile ? 'bulkActions.deleteFile.newWindowText' : 'bulkActions.invalidate.newWindowText')}
                href={'#'}
                newTab
                textLink={t(deleteFile ? 'bulkActions.deleteFile.newWindowText' : 'bulkActions.invalidate.newWindowText')}
            />

            <TextArea {...register('reason')} label={t(deleteFile ? 'bulkActions.deleteFile.reason' : 'bulkActions.invalidate.reason')} rows={3} />

            <ModalButtons
                submitButtonLabel={t(deleteFile ? 'bulkActions.deleteFile.deleteFile' : 'bulkActions.invalidate.invalidate')}
                closeButtonLabel={t('button.cancel')}
                onClose={onClose}
            />
        </form>
    )
}
