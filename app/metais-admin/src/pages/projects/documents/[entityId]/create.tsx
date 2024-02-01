import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CreateDocumentContainer } from '@/components/containers/documents-management/CreateDocumentContainer'
import { CreateDocumentView } from '@/components/views/documents-management/CreateDocumentView'

const CreateDocument = () => {
    const { entityId } = useParams()
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('documentsManagement.heading'), href: `${AdminRouteNames.DOCUMENTS_MANAGEMENT}` },
                    { label: t('documentsManagement.heading'), href: `${AdminRouteNames.DOCUMENTS_MANAGEMENT}/${entityId}` },
                ]}
            />
            <MainContentWrapper>
                <CreateDocumentContainer View={(props) => <CreateDocumentView {...props} />} />
            </MainContentWrapper>
        </>
    )
}

export default CreateDocument
