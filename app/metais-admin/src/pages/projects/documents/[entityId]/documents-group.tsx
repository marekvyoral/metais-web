import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { DocumentsGroupView } from '@/components/views/documents-management/DocumentsGroupView'
import { DocumentsGroupContainer } from '@/components/containers/documents-management/DocumentsGroupContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const DocumentsGroupPage = () => {
    const { t } = useTranslation()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('codelists.heading') ?? '', href: AdminRouteNames.CODELISTS },
                ]}
            />
            <MainContentWrapper>
                <DocumentsGroupContainer
                    View={(props) => {
                        return <DocumentsGroupView data={props.data} />
                    }}
                />
            </MainContentWrapper>
        </>
    )
}

export default DocumentsGroupPage
