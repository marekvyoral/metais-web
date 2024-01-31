import { LoadingIndicator, TextArea, TextHeading } from '@isdd/idsk-ui-kit'
import React, { useState } from 'react'
import { FieldValues, FormState, UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { UppyFile } from '@uppy/core'

import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { FileUpload, FileUploadData, IFileUploadRef } from '@isdd/metais-common/components/FileUpload/FileUpload'
import { MutationFeedback } from '@isdd/metais-common/components/mutation-feedback/MutationFeedback'
import { ModalButtons } from '@isdd/metais-common/components/modal-buttons/ModalButtons'

interface IProjectUploadFileViewProps {
    items?: ConfigurationItemUi[]
    register: UseFormRegister<FieldValues>
    onClose: () => void
    onSubmit: () => void
    formState: FormState<FieldValues>
    fileMetaAttributes: Record<string, unknown>
    isLoading: boolean
    fileUploadRef: React.RefObject<IFileUploadRef>
    onFileUploadSuccess: (data: FileUploadData[]) => void
    duplicateDocNames?: string[]
}

export const ProjectUploadFileView: React.FC<IProjectUploadFileViewProps> = ({
    register,
    onSubmit,
    onClose,
    formState,
    isLoading,
    fileUploadRef,
    fileMetaAttributes,
    onFileUploadSuccess,
    duplicateDocNames,
}) => {
    const { t } = useTranslation()
    const [currentFiles, setCurrentFiles] = useState<UppyFile[]>()

    return (
        <>
            {isLoading && <LoadingIndicator label={t('form.waitSending')} className={classNames({ [styles.marginTopIndicator]: isLoading })} />}
            <div>
                <TextHeading size="L">{t('bulkActions.addFile.title')}</TextHeading>
            </div>

            <form onSubmit={onSubmit} className={classNames({ [styles.positionRelative]: isLoading })}>
                <TextArea {...register('note')} label={t('bulkActions.updateFile.reason')} rows={3} />
                <FileUpload
                    ref={fileUploadRef}
                    allowedFileTypes={['.txt', '.rtf', '.pdf', '.doc', '.docx', '.xcl', '.xclx', '.jpg', '.png', '.gif', '.csv']}
                    multiple
                    fileMetaAttributes={fileMetaAttributes}
                    isUsingUuidInFilePath
                    onUploadSuccess={onFileUploadSuccess}
                    setCurrentFiles={setCurrentFiles}
                />
                {duplicateDocNames && duplicateDocNames.length > 0 && (
                    <MutationFeedback
                        success={false}
                        error={t(`duplicateFile${duplicateDocNames.length > 1 ? 's' : ''}`, {
                            docs: duplicateDocNames.join(', '),
                        })}
                    />
                )}

                <ModalButtons
                    submitButtonLabel={t('bulkActions.addFile.upload')}
                    disabled={!formState.isValid || (currentFiles && currentFiles.length < 1)}
                    closeButtonLabel={t('button.cancel')}
                    onClose={onClose}
                />
            </form>
        </>
    )
}
