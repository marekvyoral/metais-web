import React from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit'
import { QueryFeedback } from '@isdd/metais-common'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useParams } from 'react-router-dom'

import { DraftsListFormContainer } from '@/components/entities/draftsList/DraftsListFormContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { DraftsListEditForm } from '@/components/entities/draftsList/DraftsListEditForm'
const DraftsListEditPage = () => {
    const { t } = useTranslation()
    const { entityId } = useParams()
    return (
        <DraftsListFormContainer
            View={(props) => {
                return (
                    <>
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                                { label: t('breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                                { label: t('breadcrumbs.draftsList'), href: NavigationSubRoutes.ZOZNAM_NAVRHOV },
                                {
                                    label: props?.data?.srName ?? t('breadcrumbs.noName'),
                                    href: `${NavigationSubRoutes.ZOZNAM_NAVRHOV}/${entityId}`,
                                },
                            ]}
                        />
                        <MainContentWrapper>
                            <QueryFeedback loading={props.isLoading} error={false} withChildren>
                                <DraftsListEditForm defaultData={props?.data} />
                            </QueryFeedback>
                        </MainContentWrapper>
                    </>
                )
            }}
        />
    )
}
export default DraftsListEditPage
