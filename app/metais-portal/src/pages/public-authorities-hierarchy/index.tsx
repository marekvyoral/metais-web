import React from 'react'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { PublicAuthoritiesHierarchyContainer } from '@/components/containers/public-authorities-hierarchy/PublicAuthoritiesHierarchyContainer'

const PublicAuthoritiesHierarchyPage: React.FC = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.publicAuthoritiesHierarchy')} ${META_IS_TITLE}`

    return <PublicAuthoritiesHierarchyContainer />
}

export default PublicAuthoritiesHierarchyPage
