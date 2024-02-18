import React from 'react'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { RelationListContainer } from '@/components/containers/relation-list/RelationListContainer'
import { RelationListView } from '@/components/views/relation-list/RelationListView'

const RelationListPage: React.FC = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.relationsSearch')} ${META_IS_TITLE}`
    return <RelationListContainer View={(props) => <RelationListView {...props} />} />
}

export default RelationListPage
