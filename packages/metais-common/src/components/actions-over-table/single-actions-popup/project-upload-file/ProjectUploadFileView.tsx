import { Input, TextArea, TextHeading } from '@isdd/idsk-ui-kit'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import React from 'react'
import { FieldValues, FormState, UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ConfigurationItemUi } from '@isdd/metais-common/api'
import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'

interface IProjectUploadFileViewProps {
    items?: ConfigurationItemUi[]
    register: UseFormRegister<FieldValues>
    onClose: () => void
    onSubmit: () => void
    formState: FormState<FieldValues>
}

export const ProjectUploadFileView: React.FC<IProjectUploadFileViewProps> = ({ register, onSubmit, onClose, formState }) => {
    const { t } = useTranslation()
    return (
        <form onSubmit={onSubmit}>
            <div>
                <TextHeading size="L">{t('bulkActions.addFile.title')}</TextHeading>
            </div>

            <TextArea {...register('note')} label={t('bulkActions.updateFile.reason')} rows={3} />

            <Input type="file" {...register('file')} />

            <div className={styles.buttonGroupEnd}>
                <Button onClick={() => onClose()} label={t('button.cancel')} variant="secondary" />
                <Button label={t('bulkActions.addFile.upload')} disabled={!formState.isDirty} type="submit" />
            </div>
        </form>
    )
}