import React from 'react'
import { useTranslation } from 'react-i18next'

import { TextLinkExternal } from '@isdd/idsk-ui-kit/typography/TextLinkExternal'

interface ITableMetaBlockProps {
    source?: { value: string; href: string }
    showResetColumnOrderButton?: boolean
    resetColumnOrder?: () => void
    isOrderModified?: boolean
}

export const TableMetaBlock = ({
    source,
    showResetColumnOrderButton = false,
    isOrderModified = false,
    resetColumnOrder,
}: ITableMetaBlockProps): JSX.Element => {
    const { t } = useTranslation()
    return (
        <div className="idsk-table__meta">
            <div className="idsk-button-group idsk-table__meta-buttons">
                {isOrderModified && showResetColumnOrderButton && (
                    <button type="button" className="idsk-button idsk-table__meta-button" onClick={resetColumnOrder}>
                        {t(`table.resetOrder`)}
                    </button>
                )}
            </div>
            {source && (
                <div className="govuk-body idsk-table__meta-source">
                    {t(`table.source`)} <TextLinkExternal href={source.href} title={source.value} textLink={source.value} newTab />
                </div>
            )}
        </div>
    )
}
