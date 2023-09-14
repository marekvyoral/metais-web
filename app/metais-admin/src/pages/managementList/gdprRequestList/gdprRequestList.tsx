import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RequestListContainer, RequestListType } from '@/components/containers/ManagementList/RequestListContainer'
import { RequestListView } from '@/components/views/userManagement/request-list-view/RequestListView'

const GdprRequestListPage = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('requestList.gdprTitle'), href: AdminRouteNames.GDPR_REQUEST_LIST },
                ]}
            />
            <MainContentWrapper>
                <RequestListContainer
                    listType={RequestListType.GDPR}
                    View={(props) => (
                        <RequestListView
                            listType={props.listType}
                            route={props.route}
                            data={props.data}
                            defaultFilterParams={props.defaultFilterParams}
                            handleFilterChange={props.handleFilterChange}
                        />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default GdprRequestListPage
