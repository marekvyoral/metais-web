import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RequestListContainer, RequestListType } from '@/components/containers/ManagementList/RequestListContainer'
import { RequestListView } from '@/components/views/userManagement/request-list-view/RequestListView'

const RequestListPage = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('requestList.title'), href: AdminRouteNames.REQUEST_LIST },
                ]}
            />
            <MainContentWrapper>
                <RequestListContainer
                    listType={RequestListType.REQUESTS}
                    View={(props) => (
                        <RequestListView
                            listType={props.listType}
                            route={props.route}
                            data={props.data}
                            defaultFilterParams={props.defaultFilterParams}
                            handleFilterChange={props.handleFilterChange}
                            isError={props.isError}
                            isLoading={props.isLoading}
                        />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default RequestListPage
