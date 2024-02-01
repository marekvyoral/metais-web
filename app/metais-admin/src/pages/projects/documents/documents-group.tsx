import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { DocumentsGroupContainer } from '@/components/containers/documents-management/DocumentsGroupContainer'
import { DocumentsGroupView } from '@/components/views/documents-management/DocumentsGroupView'

const DocumentsGroupPage = () => {
    const { t } = useTranslation()
    const { entityId } = useParams()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('documentsManagement.heading'), href: AdminRouteNames.DOCUMENTS_MANAGEMENT },
                    { label: t('documentsManagement.heading'), href: `${AdminRouteNames.DOCUMENTS_MANAGEMENT}/${entityId}/` },
                ]}
            />
            <MainContentWrapper>
                <DocumentsGroupContainer
                    View={(props) => {
                        return <DocumentsGroupView {...props} />
                    }}
                />
            </MainContentWrapper>
        </>
    )
}

export default DocumentsGroupPage
