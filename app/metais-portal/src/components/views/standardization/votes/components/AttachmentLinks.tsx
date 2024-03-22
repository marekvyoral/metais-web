import { TextLinkExternal } from '@isdd/idsk-ui-kit/index'
import { ApiAttachment } from '@isdd/metais-common/api/generated/standards-swagger'

import styles from '@/components/views/standardization/votes/vote.module.scss'
const DMS_DOWNLOAD_FILE = `${import.meta.env.VITE_REST_CLIENT_DMS_TARGET_URL}/file/`

interface IAttachmentLink {
    attachments: ApiAttachment[] | undefined
}

export const AttachmentLinks: React.FC<IAttachmentLink> = ({ attachments }) => {
    return (
        <>
            {attachments?.map((attachment) => {
                return (
                    <div key={attachment.id} className={styles.linkAlign}>
                        <TextLinkExternal
                            key={attachment?.id}
                            title={`${attachment?.attachmentName}`}
                            href={`${DMS_DOWNLOAD_FILE}${attachment?.attachmentId}`}
                            textLink={attachment?.attachmentName ?? ''}
                            newTab
                        />{' '}
                    </div>
                )
            })}
        </>
    )
}
