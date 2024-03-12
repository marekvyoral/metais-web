import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiAttachment, ApiLink } from '@isdd/metais-common/api/generated/standards-swagger'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { DraftsListAttachmentCard } from '@/components/entities/draftslist/DraftsListAttachmentCard'

interface IDraftsListAttachmentsZone {
    links: ApiLink[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any>
    errors: FieldErrors<{
        attachments: ApiAttachment[] | undefined
        links:
            | {
                  name?: string | undefined
                  id?: number | undefined
                  type?: string | undefined
                  linkType?: string | undefined
                  linkSize?: string | undefined
                  url?: string | undefined
                  linkDescription?: string | undefined
              }[]
            | undefined
    }>
    addNewLink: () => void
    onDelete: (index: number) => void
}

export const DraftsListAttachmentsZone = ({ register, addNewLink, onDelete, links, errors }: IDraftsListAttachmentsZone) => {
    const { t } = useTranslation()

    return (
        <div>
            <TextHeading size="L">{t('DraftsList.createForm.links.heading')}</TextHeading>

            <TextHeading size="M">{t('DraftsList.createForm.links.subHeading')}</TextHeading>
            {links?.map((_, index) => (
                <DraftsListAttachmentCard key={index} register={register} index={index} onDelete={onDelete} errors={errors} />
            ))}

            <Button label={t('DraftsList.createForm.links.addNewAttachment')} onClick={() => addNewLink()} />
        </div>
    )
}
