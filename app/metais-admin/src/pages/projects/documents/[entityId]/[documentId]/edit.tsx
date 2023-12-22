import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CreateDocumentContainer } from '@/components/containers/documents-management/CreateDocumentContainer'
import { EditDocumentView } from '@/components/views/documents-management/EditDocumentView'

const CreateDocument = () => {
    const { entityId, documentId } = useParams()
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('documentsManagement.heading'), href: `${AdminRouteNames.DOCUMENTS_MANAGEMENT}/${entityId}/` },
                    { label: t('documentsManagement.editDocument'), href: `${AdminRouteNames.DOCUMENTS_MANAGEMENT}/${entityId}/${documentId}/edit` },
                ]}
            />
            <MainContentWrapper>
                <CreateDocumentContainer View={(props) => <EditDocumentView {...props} />} />
            </MainContentWrapper>
        </>
    )
}

export default CreateDocument
