import React from 'react'
import { useTranslation } from 'react-i18next'

import { PublicAuthoritiesHierarchyContainer } from '@/components/containers/public-authorities-hierarchy/PublicAuthoritiesHierarchyContainer'

const PublicAuthoritiesHierarchyPage: React.FC = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.publicAuthoritiesHierarchy')} | MetaIS`

    return <PublicAuthoritiesHierarchyContainer />
}

export default PublicAuthoritiesHierarchyPage
