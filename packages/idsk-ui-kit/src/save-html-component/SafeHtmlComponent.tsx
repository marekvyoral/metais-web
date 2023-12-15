import React from 'react'
import sanitizeHtml, { defaults } from 'sanitize-html'

import styles from './styles.module.scss'

type SafeHtmlProps = {
    dirtyHtml: string
}

export const SafeHtmlComponent: React.FC<SafeHtmlProps> = ({ dirtyHtml }) => {
    const sanitizedHtml = sanitizeHtml(dirtyHtml, {
        allowedTags: defaults.allowedTags.concat(['img']),
        allowedAttributes: {
            ...defaults.allowedAttributes,
            img: ['src', 'alt', 'title'],
        },
    })

    return <span className={styles.fontFamily} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}
