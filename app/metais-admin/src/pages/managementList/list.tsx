import React from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import UserManagementListContainer from '@/components/containers/ManagementList/UserManagementListContainer'
import { UserManagementListPageView } from '@/components/views/userManagement/userManagementListWrapper'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const UserManagementListPage = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('userManagement.title') ?? '', href: AdminRouteNames.USER_MANAGEMENT },
                ]}
            />
            <MainContentWrapper>
                <UserManagementListContainer
                    View={({
                        data,
                        filter,
                        handleFilterChange,
                        handleBlockRowsAction,
                        handleExport,
                        isError,
                        isErrorExport,
                        isLoading,
                        isLoadingExport,
                        isMutationError,
                        isMutationSuccess,
                        updateIdentityStateBatchMutation,
                    }) => (
                        <UserManagementListPageView
                            data={data}
                            filter={filter}
                            handleFilterChange={handleFilterChange}
                            handleBlockRowsAction={handleBlockRowsAction}
                            handleExport={handleExport}
                            isError={isError}
                            isErrorExport={isErrorExport}
                            isLoading={isLoading}
                            isLoadingExport={isLoadingExport}
                            isMutationError={isMutationError}
                            isMutationSuccess={isMutationSuccess}
                            updateIdentityStateBatchMutation={updateIdentityStateBatchMutation}
                        />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default UserManagementListPage
