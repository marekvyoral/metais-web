import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { DocumentsManagementContainer } from '@/components/containers/documents-management/DocumentsManagementContaiter'
import { DocumentsManagementView } from '@/components/views/documents-management/DocumentsManagementView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const DocumentsManagementPage = () => {
    const { t } = useTranslation()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('documentsManagement.heading') ?? '', href: AdminRouteNames.DOCUMENTS_MANAGEMENT },
                ]}
            />
            <MainContentWrapper>
                <DocumentsManagementContainer
                    View={(props) => {
                        return (
                            <DocumentsManagementView
                                filterMap={props.filterMap}
                                filter={props.filter}
                                data={props.data}
                                statuses={props.statuses}
                                setData={props.setData}
                                saveOrder={props.saveOrder}
                                resetOrder={props.resetOrder}
                                selectedColumns={props.selectedColumns}
                                setSelectedColumns={props.setSelectedColumns}
                                handleFilterChange={props.handleFilterChange}
                            />
                        )
                    }}
                />
            </MainContentWrapper>
        </>
    )
}

export default DocumentsManagementPage
