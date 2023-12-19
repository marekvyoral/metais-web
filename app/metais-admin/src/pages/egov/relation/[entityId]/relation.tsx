import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { RelationDetailContainer } from '@/components/containers/Egov/Relation/RelationsDetailContainer'
import { RelationDetailView } from '@/components/views/egov/relation-detail-views/RelationDetailView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Profile = () => {
    const { entityId } = useParams()
    const { t } = useTranslation()
    return (
        <RelationDetailContainer
            entityName={entityId ?? ''}
            View={(props) => (
                <>
                    <BreadCrumbs
                        withWidthContainer
                        links={[
                            { label: t('egov.routing.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
                            { label: t('navMenu.egov.relations'), href: AdminRouteNames.EGOV_RELATION },
                            {
                                label: t('egov.relation.detailHeading') + ` - ${props.data.ciTypeData?.name}`,
                                href: `${AdminRouteNames.EGOV_RELATION}/${entityId}`,
                            },
                        ]}
                    />
                    <MainContentWrapper>
                        <RelationDetailView
                            data={props?.data}
                            unValidRelationShipTypeMutation={props?.unValidRelationShipTypeMutation}
                            addNewConnectionToExistingRelation={props?.addNewConnectionToExistingRelation}
                            saveExistingAttribute={props?.saveExistingAttribute}
                            resetExistingAttribute={props?.resetExistingAttribute}
                            isLoading={props.isLoading}
                            isError={props.isError}
                            roles={props.roles}
                        />
                    </MainContentWrapper>
                </>
            )}
        />
    )
}

export default Profile
