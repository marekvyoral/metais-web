import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CreateDocumentsGroupView } from '@/components/views/documents-management/CreateDocumentsGroupView'
import { CreateDocumentsGroupContainer } from '@/components/containers/documents-management/CreateDocumentsGroupContainer'

const CreateDocumentsGroup = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('documentsManagement.heading'), href: AdminRouteNames.DOCUMENTS_MANAGEMENT },
                    { label: t('documentsManagement.addNewGroup'), href: `${AdminRouteNames.DOCUMENTS_MANAGEMENT}/create` },
                ]}
            />
            <MainContentWrapper>
                <CreateDocumentsGroupContainer View={(props) => <CreateDocumentsGroupView {...props} />} />
            </MainContentWrapper>
        </>
    )
}

export default CreateDocumentsGroup
