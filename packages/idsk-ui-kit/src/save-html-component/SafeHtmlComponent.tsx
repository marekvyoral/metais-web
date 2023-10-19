import React from 'react'
import sanitizeHtml from 'sanitize-html'

type SafeHtmlProps = {
    dirtyHtml: string
}

export const SafeHtmlComponent: React.FC<SafeHtmlProps> = ({ dirtyHtml }) => {
    const sanitizedHtml = sanitizeHtml(dirtyHtml)

    return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}
