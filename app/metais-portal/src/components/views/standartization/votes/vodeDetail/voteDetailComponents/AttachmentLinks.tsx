import { ApiAttachment, useGetContentHook } from '@isdd/metais-common/api'
import { downloadBlobAsFile } from '@isdd/metais-common/componentHelpers/download/downloadHelper'
import { QueryFeedback } from '@isdd/metais-common/index'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import styles from '@/components/views/standartization/votes/vodeDetail/voteDetail.module.scss'

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
            const blobData = await downloadAttachmentFile(attachment.attachmentId ?? '')
            downloadBlobAsFile(new Blob([blobData]), attachment.attachmentName ?? '')
        } catch {
            setFileError(true)
        } finally {
            // setFileLoading(false)
            // console.log('Neloadujem')
            // isFileLoading.current = false
        }
    }

    const onAttachmentClickHandler = (attachment: ApiAttachment) => {
        downloadAttachment(attachment)
        console.log('loadujem')
        setIsLoading(true)
    }

    return (
        <QueryFeedback
            loading={isLoading}
            error={isFileError}
            withChildren
            indicatorProps={{ layer: 'parent', transparentMask: true, label: t('votes.voteDetail.downloadingFile') }}
        >
            {attachments?.map((attachment) => {
                return (
                    <Link key={attachment.id} to="#" onClick={() => onAttachmentClickHandler(attachment)} className={styles.linkAlign}>
                        {attachment.attachmentName}
                    </Link>
                )
            })}
        </QueryFeedback>
    )
}
