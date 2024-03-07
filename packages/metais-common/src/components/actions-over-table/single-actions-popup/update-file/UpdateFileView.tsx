import { IconWithText, Input, TextHeading, TextLinkExternal } from '@isdd/idsk-ui-kit'
import React from 'react'
import { FieldValues, FormState, UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ErrorTriangleIcon } from '@isdd/metais-common/assets/images'
import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { BulkList } from '@isdd/metais-common/components/actions-over-table/bulk-actions-popup/BulkList'
import { ModalButtons } from '@isdd/metais-common/components/modal-buttons/ModalButtons'

interface IUpdateFileViewProps {
    items: ConfigurationItemUi[]
    register: UseFormRegister<FieldValues>
    onClose: () => void
    onSubmit: () => void
    formState: FormState<FieldValues>
}

export const UpdateFileView: React.FC<IUpdateFileViewProps> = ({ items, register, onSubmit, onClose, formState }) => {
    const { t } = useTranslation()
    return (
        <form onSubmit={onSubmit} noValidate>
            <div>
                <TextHeading size="L">{t('bulkActions.updateFile.title')}</TextHeading>
            </div>

            <IconWithText className={styles.warningText} icon={ErrorTriangleIcon}>
                {t('bulkActions.updateFile.warningText')}
            </IconWithText>

            <BulkList title={t('bulkActions.updateFile.listText', { count: items.length })} items={items} />

            <TextLinkExternal
                title={t('bulkActions.updateFile.newWindowText')}
                href={'#'}
                newTab
                textLink={t('bulkActions.updateFile.newWindowText')}
            />
            <Input type="file" {...register('file')} />

            <ModalButtons
                submitButtonLabel={t('bulkActions.updateFile.updateFile')}
                disabled={!formState.isDirty}
                closeButtonLabel={t('button.cancel')}
                onClose={onClose}
            />
        </form>
    )
}
