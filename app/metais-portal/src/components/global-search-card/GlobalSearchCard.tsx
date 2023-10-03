import { Button, Card } from '@isdd/idsk-ui-kit/index'
import { CiElasticItem, DMSDocElasticItem, GeneralElasticItemSetGeneralElasticItemSetItem, RelElasticItem } from '@isdd/metais-common/api'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { GlobalCardDefinitionItem } from './GlobalCardDefinitionItem'

export const isCiElasticItem = (item: unknown): item is CiElasticItem => {
    const currentItem = item as CiElasticItem
    return !!currentItem && currentItem.name !== undefined
}

export const isDMSDocElasticItem = (item: unknown): item is DMSDocElasticItem => {
    const currentItem = item as DMSDocElasticItem
    return !!currentItem && currentItem.fileName !== undefined
}

export const isRelElasticItem = (item: unknown): item is RelElasticItem => {
    const currentItem = item as RelElasticItem
    return !!currentItem && (currentItem.startUuid || currentItem.endUuid) !== undefined
}

type GlobalSearchCardProps = {
    cardData: GeneralElasticItemSetGeneralElasticItemSetItem
}

export const GlobalSearchCard: React.FC<GlobalSearchCardProps> = ({ cardData }) => {
    const { t } = useTranslation()
    const [isExpanded, setIsExpanded] = useState(false)

    if (isCiElasticItem(cardData)) {
        return (
            <Card title={cardData.name ?? ''} cardHref={`/ci/${cardData.type}/${cardData.uuid}`}>
                <div>
                    <dl>
                        <GlobalCardDefinitionItem label={t('globalSearch.filter.owner') + ':'} value={cardData.PO ?? ''} />
                        <GlobalCardDefinitionItem label={t('globalSearch.code') + ':'} value={cardData.code ?? ''} />
                        <GlobalCardDefinitionItem label={t('globalSearch.state') + ':'} value={cardData.state ?? ''} />
                    </dl>
                    <Button variant="secondary" label={isExpanded ? '-' : '+'} onClick={() => setIsExpanded((prev) => !prev)} />
                </div>
                {isExpanded && (
                    <>
                        <dl>
                            {cardData.highlight?.metaAttributes?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <GlobalCardDefinitionItem label={item.field ?? ''} value={item.highlightText ?? []} setHtml />
                                </React.Fragment>
                            ))}
                        </dl>

                        <dl>
                            {cardData.highlight?.attributes?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <GlobalCardDefinitionItem label={item.field ?? ''} value={item.highlightText ?? []} setHtml />
                                </React.Fragment>
                            ))}
                        </dl>
                    </>
                )}
            </Card>
        )
    } else if (isDMSDocElasticItem(cardData)) {
        return <Card title={cardData.fileName ?? ''} cardHref={cardData.fileName ?? ''} />
    } else if (isRelElasticItem(cardData)) {
        return <Card title={cardData.startName ?? ''} cardHref={cardData.startType ?? ''} />
    }

    return <></>
}
