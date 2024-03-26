import { BaseModal, Button, ButtonGroupRow, TextHeading } from '@isdd/idsk-ui-kit/index'
import { MutationFeedback } from '@isdd/metais-common/index'
import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CiRefAttributes, RefAttributesRefType } from '@isdd/metais-common/api/generated/dms-swagger'
import { IFileUploadRef, FileUpload } from '@isdd/metais-common/components/FileUpload/FileUpload'

import styles from './integration-link/integration.module.scss'

type Props = {
    entityId: string
    entityName: string
    metaisCode: string
    isOpen: boolean
    onClose: () => void
    ownerGid: string
    onUploadSuccess: () => void
    header: string
}

export const ProvIntegrationUploadDocModal: React.FC<Props> = ({
    entityId,
    entityName,
    isOpen,
    onClose,
    metaisCode,
    ownerGid,
    onUploadSuccess,
    header,
}) => {
    const { t } = useTranslation()

    const [isError, setIsError] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const fileUploadRef = useRef<IFileUploadRef>(null)

    const handleUploadData = useCallback(() => {
        fileUploadRef.current?.startUploading()
    }, [])

    const refDmsObject: CiRefAttributes = {
        refType: RefAttributesRefType.CI,
        refCiTechnicalName: entityName,
        refCiId: entityId,
        refCiMetaisCode: metaisCode,
        refCiOwner: ownerGid,
    }
    const fileMetaAttributes = {
        refAttributes: new Blob([JSON.stringify(refDmsObject)], { type: 'application/json' }),
    }

    const handleUploadSuccess = async () => {
        setIsSuccess(true)
        onUploadSuccess()
    }

    const onSubmit = async () => {
        setIsSuccess(false)
        setIsError(false)
        if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
            handleUploadData()
        }
    }

    return (
        <BaseModal
            isOpen={isOpen}
            close={() => {
                onClose()
                fileUploadRef.current?.cancelImport()
            }}
        >
            <MutationFeedback error={isError} success={isSuccess} successMessage={t('upload.success')} />
            <TextHeading size="M">{header}</TextHeading>

            <FileUpload
                ref={fileUploadRef}
                allowedFileTypes={['.txt', '.rtf', '.pdf', '.doc', '.docx', '.xcl', '.xclx', '.jpg', '.png', '.gif']}
                multiple
                refType={RefAttributesRefType.CI}
                onUploadSuccess={handleUploadSuccess}
                refId={entityId}
                fileMetaAttributes={fileMetaAttributes}
                onFileUploadFailed={() => setIsError(true)}
            />
            <ButtonGroupRow className={styles.justifyEnd}>
                <Button label={t('button.saveChanges')} onClick={() => onSubmit()} />
                <Button
                    variant="secondary"
                    label={t('button.cancel')}
                    onClick={() => {
                        onClose()
                        fileUploadRef.current?.cancelImport()
                    }}
                />
            </ButtonGroupRow>
        </BaseModal>
    )
}
