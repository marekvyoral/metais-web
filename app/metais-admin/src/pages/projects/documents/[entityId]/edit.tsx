import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { DocumentsGroupContainer } from '@/components/containers/documents-management/DocumentsGroupContainer'
import { EditDocumentsGroupView } from '@/components/views/documents-management/EditDocumentsGroupView'

const EditDocumentsGroup = () => {
    const { entityId } = useParams()
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('documentsManagement.heading'), href: AdminRouteNames.DOCUMENTS_MANAGEMENT },
                    { label: t('documentsManagement.heading'), href: `${AdminRouteNames.DOCUMENTS_MANAGEMENT}/${entityId}/edit` },
                ]}
            />
            <MainContentWrapper>
                <DocumentsGroupContainer View={(props) => <EditDocumentsGroupView {...props} />} />
            </MainContentWrapper>
        </>
    )
}

export default EditDocumentsGroup
