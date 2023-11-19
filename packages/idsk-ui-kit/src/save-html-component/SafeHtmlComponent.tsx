import React from 'react'
import sanitizeHtml from 'sanitize-html'

import styles from './styles.module.scss'

type SafeHtmlProps = {
    dirtyHtml: string
}

export const SafeHtmlComponent: React.FC<SafeHtmlProps> = ({ dirtyHtml }) => {
    const sanitizedHtml = sanitizeHtml(dirtyHtml)

    return <span className={styles.fontFamily} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}
