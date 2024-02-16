import { Filter } from '@isdd/idsk-ui-kit/filter'
import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { TemplatesManagementContainer } from '@/components/containers/TemplatesManagement/TemplatesManagementContainer'
import { TemplatesManagementTable } from '@/components/views/templates-management/TemplatesManagementTable'

export const defaultFilterValues = {
    fullTextSearch: '',
}

const TemplatesManagementPage: React.FC = () => {
    const { t } = useTranslation()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
                    { label: t('navMenu.templatesManagement'), href: `${AdminRouteNames.TEMPLATES_MANAGEMENT}` },
                ]}
            />
            <MainContentWrapper>
                <TextHeading size="XL">{t('templatesManagement.heading')}</TextHeading>
                <TemplatesManagementContainer
                    View={(props) => {
                        return (
                            <>
                                <Filter form={() => <></>} defaultFilterValues={defaultFilterValues} onlySearch />
                                <TemplatesManagementTable data={props?.data} editTemplate={props.mutate} />
                            </>
                        )
                    }}
                />
            </MainContentWrapper>
        </>
    )
}

export default TemplatesManagementPage
