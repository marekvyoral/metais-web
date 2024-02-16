import React from 'react'
import { useParams } from 'react-router-dom'
import { formatTitleString } from '@isdd/metais-common/utils/utils'
import { useTranslation } from 'react-i18next'

import { RelationDetailContainer } from '@/components/containers/RelationDetailContainer'
import { RelationDetailView } from '@/components/views/relationships/detail/RelationDetailView'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'

const RelationDetailPage = () => {
    const { relationshipId, entityName, entityId } = useParams()
    const { t } = useTranslation()

    return (
        <CiPermissionsWrapper entityId={entityId ?? ''} entityName={entityName ?? ''}>
            <RelationDetailContainer
                relationshipId={relationshipId ?? ''}
                View={(props) => {
                    document.title = formatTitleString(t('relationDetail.heading', { item: props.data?.relationTypeData?.name }))
                    return (
                        <RelationDetailView
                            relationshipId={relationshipId ?? ''}
                            entityId={entityId ?? ''}
                            entityName={entityName ?? ''}
                            {...props}
                        />
                    )
                }}
            />
        </CiPermissionsWrapper>
    )
}

export default RelationDetailPage
