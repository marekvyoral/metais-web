import React from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { CreateRelationContainer } from '@/components/containers/Egov/Relation/CreateRelationContainer'
import { CreateEntityView, EntityType } from '@/components/views/egov/entity-detail-views/CreateEntityView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const CreateRelation = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('egov.routing.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
                    { label: t('navMenu.egov.relations'), href: AdminRouteNames.EGOV_RELATION },
                    { label: t('egov.relation.createHeader'), href: AdminRouteNames.EGOV_RELATION + '/create' },
                ]}
            />
            <MainContentWrapper>
                <CreateRelationContainer
                    View={(props) => (
                        <CreateEntityView
                            isError={props.isError}
                            isLoading={props.isLoading}
                            data={props?.data}
                            mutate={props?.mutate}
                            hiddenInputs={props?.hiddenInputs}
                            type={EntityType.RELATION}
                        />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default CreateRelation
