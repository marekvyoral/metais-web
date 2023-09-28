import { ApiAttachment, ApiLink, ApiVoteActorResult } from '@isdd/metais-common/api'
import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'
import { Link } from 'react-router-dom'
import { TextLink } from '@isdd/idsk-ui-kit/index'

import styles from './voteDetail.module.scss'

export enum VotesListColumnsEnum {
    name = 'name',
    userOrgName = 'userOrgName',
    role = 'role',
}

export const voteDetailColumns = (t: TFunction): Array<ColumnDef<ApiVoteActorResult>> => {
    const columns: Array<ColumnDef<ApiVoteActorResult>> = [
        {
            header: t('votes.voteDetail.table.name'),
            accessorFn: (row) => row?.userName,
            enableSorting: true,
            id: VotesListColumnsEnum.name,
            size: 200,
            cell: (ctx) => {
                const contentText = ctx.getValue() as string
                return <span>{contentText}</span>
            },
        },
        {
            header: t('votes.voteDetail.table.organization'),
            accessorFn: (row) => row?.userOrgName,
            enableSorting: true,
            id: VotesListColumnsEnum.userOrgName,
            size: 300,
            cell: (ctx) => {
                const contentText = ctx.getValue() as string
                return <span>{contentText}</span>
            },
        },
        {
            header: t('votes.voteDetail.table.role'),
            accessorFn: (row) => row?.userRoleDesc,
            enableSorting: true,
            id: VotesListColumnsEnum.role,
            size: 150,
            cell: (ctx) => {
                const contentText = ctx.getValue() as string
                return <span>{contentText}</span>
            },
        },
    ]

    return columns
}

interface IAttachmentLink {
    attachments: ApiAttachment[] | undefined
    downloadFile: (attachment: ApiAttachment) => Promise<void>
}

export const AttachmentLinks: React.FC<IAttachmentLink> = ({ attachments, downloadFile }) => {
    return (
        <>
            {attachments?.map((attachment) => {
                return (
                    <Link key={attachment.id} to="#" onClick={() => downloadFile(attachment)} className={styles.linkAlign}>
                        {attachment.attachmentName}
                    </Link>
                )
            })}
        </>
    )
}

interface IWebLink {
    links: ApiLink[] | undefined
}

export const WebLinks: React.FC<IWebLink> = ({ links }) => {
    return (
        <>
            {links?.map((link) => {
                return (
                    <TextLink key={link.id} to={link.url ?? ''} className={styles.linkAlign}>
                        {link.linkDescription}
                    </TextLink>
                )
            })}
        </>
    )
}
