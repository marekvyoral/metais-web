import { ApiAttachment, useGetContentHook } from '@isdd/metais-common/api'
import { downloadBlobAsFile } from '@isdd/metais-common/componentHelpers/download/downloadHelper'
import { QueryFeedback } from '@isdd/metais-common/index'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonLink } from '@isdd/idsk-ui-kit/index'

import styles from '@/components/views/standartization/votes/voteDetail/voteDetail.module.scss'

interface IAttachmentLink {
    attachments: ApiAttachment[] | undefined
}

export const AttachmentLinks: React.FC<IAttachmentLink> = ({ attachments }) => {
    const { t } = useTranslation()
    const [isFileError, setFileError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const downloadAttachmentFile = useGetContentHook()
    const downloadAttachment = async (attachment: ApiAttachment) => {
        try {
            setFileError(false)
            setIsLoading(true)
            const blobData = await downloadAttachmentFile(attachment.attachmentId ?? '')
            downloadBlobAsFile(new Blob([blobData]), attachment.attachmentName ?? '')
        } catch {
            setFileError(true)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <QueryFeedback
            loading={isLoading}
            error={isFileError}
            withChildren
            indicatorProps={{ layer: 'dialog', transparentMask: true, label: t('votes.voteDetail.downloadingFile') }}
        >
            {attachments?.map((attachment) => {
                return (
                    <div key={attachment.id} className={styles.linkAlign}>
                        <ButtonLink type="button" onClick={() => downloadAttachment(attachment)} label={attachment.attachmentName} />
                    </div>
                )
            })}
        </QueryFeedback>
    )
}
