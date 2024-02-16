import React from 'react'
import sanitizeHtml from 'sanitize-html'

import styles from './informationBar.module.scss'

interface ITextListProps {
    text: string
    status: string
    color?: string
}

export const InformationBar: React.FC<ITextListProps> = ({ color, text, status }) => {
    return (
        <div className="idsk-warning-text idsk-warning-text--info" style={{ backgroundColor: color }}>
            <div className="govuk-width-container">
                <div className="idsk-warning-text__text">
                    <span className={styles.paragraphMarginBottom0} dangerouslySetInnerHTML={{ __html: sanitizeHtml(status + text) }} />
                </div>
            </div>
        </div>
    )
}
