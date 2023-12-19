import React from 'react'
import { useParams } from 'react-router-dom'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { CreateEntityView, EntityType } from '@/components/views/egov/entity-detail-views/CreateEntityView'
import { RelationDetailContainer } from '@/components/containers/Egov/Relation/RelationsDetailContainer'
import { CreateRelationContainer } from '@/components/containers/Egov/Relation/CreateRelationContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const EditRelation = () => {
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
                            {
                                label: t('egov.relation.editHeader') + ` - ${props.data.ciTypeData?.name}`,
                                href: `${AdminRouteNames.EGOV_RELATION}/${entityId}/edit`,
                            },
                        ]}
                    />
                    <MainContentWrapper>
                        <CreateRelationContainer
                            View={(createProps) => (
                                <CreateEntityView
                                    data={{
                                        roles: createProps?.data?.roles,
                                        existingEntityData: props?.data?.ciTypeData,
                                    }}
                                    mutate={createProps?.mutate}
                                    hiddenInputs={createProps?.hiddenInputs}
                                    disabledInputs={createProps?.disabledInputs}
                                    isError={props.isError || createProps.isError}
                                    isLoading={createProps.isLoading || props.isLoading}
                                    type={EntityType.RELATION}
                                    isEdit
                                    saveExistingAttribute={props.saveExistingAttribute}
                                    resetExistingAttribute={props.resetExistingAttribute}
                                    attributesOverridesData={props.data.attributeOverridesData}
                                />
                            )}
                            entityName={entityId}
                        />
                    </MainContentWrapper>
                </>
            )}
        />
    )
}

export default EditRelation
