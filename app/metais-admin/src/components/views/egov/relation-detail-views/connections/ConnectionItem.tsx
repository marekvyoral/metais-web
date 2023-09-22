import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { CiTypePreview } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'

interface ConnectionItem {
    item?: CiTypePreview
    type?: 'source' | 'target'
}

const ConnectionItem = ({ item, type }: ConnectionItem) => {
    const { t } = useTranslation()
    const location = useLocation()
    return (
        <DefinitionList>
            <InformationGridRow
                key={`${type}.${item?.id}`}
                label={t(`egov.detail.${type}`)}
                value={
                    item && (
                        <Link to={'/egov/entity/' + item?.technicalName} state={{ from: location }} target="_blank">
                            {item?.name}
                        </Link>
                    )
                }
            />
        </DefinitionList>
    )
}

export default ConnectionItem
