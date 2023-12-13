import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'
import React from 'react'
import { Uppy } from '@uppy/core'
import { DragDrop as DragDropComponent, FileInput } from '@uppy/react'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { useTranslation } from 'react-i18next'

import styles from './FileImport.module.scss'

interface IFileImportDragDrop {
    uppy: Uppy
    hideNoSelectedFileToImport?: boolean
}

export const FileImportDragDrop: React.FC<IFileImportDragDrop> = ({ uppy, hideNoSelectedFileToImport }) => {
    const { t } = useTranslation()

    return (
        <div className={styles.uppyContainer} style={{ position: 'relative' }} id="dragdropContainer">
            <div className={styles.absoluteDiv}>
                <TextBody>
                    <strong>{t('fileImport.dropHere')}</strong>
                </TextBody>

                <TextBody size="S">
                    <i>{t('fileImport.or')}</i>
                </TextBody>
                <div>
                    <div className={styles.fileInputButtonDiv}>
                        <Button label={t('fileImport.chooseFile')} variant="secondary" />
                        <FileInput uppy={uppy} />
                    </div>

                    {!hideNoSelectedFileToImport && <TextBody size="S">{t('fileImport.browse')}</TextBody>}
                </div>
            </div>
            <DragDropComponent className={styles.dragdrop} uppy={uppy} width="100%" height="240px" note="" />
        </div>
    )
}
