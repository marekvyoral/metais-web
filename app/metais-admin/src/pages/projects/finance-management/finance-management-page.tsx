import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { ProjectFinanceManagementContainer } from '@/components/containers/ProjectFinanceManagement/ProjectFinanceManagementContainer'
import { ProjectFinanceManagementView } from '@/components/views/project-finance-management/ProjectFinanceManagementView'

const ProjectFinanceManagementPage = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('navMenu.projects.financeManagement'), href: AdminRouteNames.PROJECTS_FINANCE_MANAGEMENT },
                ]}
            />
            <MainContentWrapper>
                <ProjectFinanceManagementContainer
                    View={(props) => {
                        return <ProjectFinanceManagementView {...props} />
                    }}
                />
            </MainContentWrapper>
        </>
    )
}

export default ProjectFinanceManagementPage
