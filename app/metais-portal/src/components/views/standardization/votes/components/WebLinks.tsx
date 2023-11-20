import { TextLink } from '@isdd/idsk-ui-kit/index'
import { ApiLink } from '@isdd/metais-common/api/generated/standards-swagger'

import styles from '@/components/views/standardization/votes/vote.module.scss'

interface IWebLink {
    links: ApiLink[] | undefined
}

export const WebLinks: React.FC<IWebLink> = ({ links }) => {
    return (
        <>
            {links?.map((link) => {
                return (
                    <TextLink key={link.id} to={link.url ?? ''} className={styles.linkAlign} newTab>
                        {link.linkDescription}
                    </TextLink>
                )
            })}
        </>
    )
}
