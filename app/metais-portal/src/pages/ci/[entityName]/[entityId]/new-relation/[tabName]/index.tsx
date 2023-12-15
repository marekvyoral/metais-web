import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { shouldEntityNameBePO } from '@isdd/metais-common/componentHelpers/ci/entityNameHelpers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { findRelationType } from '@/componentHelpers/new-relation'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { NewCiRelationContainer } from '@/components/containers/NewCiRelationContainer'
import { RelationTypePermissionWrapper } from '@/components/permissions/CreateRelationPermissionWrapper'
import { NewRelationView } from '@/components/views/new-relation/NewRelationView'

const NewCiRelationPage: React.FC = () => {
    const { tabName } = useParams()
    const { entityId } = useGetEntityParamsFromUrl()
    let { entityName } = useGetEntityParamsFromUrl()
    entityName = shouldEntityNameBePO(entityName ?? '')
    const { t } = useTranslation()

    return (
        <NewCiRelationContainer
            configurationItemId={entityId}
            entityName={entityName}
            tabName={tabName ?? ''}
            View={(props) => (
                <>
                    <BreadCrumbs
                        withWidthContainer
                        links={[
                            { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                            { label: entityName ?? '', href: `/ci/${entityName}` },
                            { label: props.ciName ? props.ciName : t('breadcrumbs.noName'), href: `/ci/${entityName}/${entityId}` },
                            {
                                label: t('breadcrumbs.newRelation', { itemName: props.ciName }),
                                href: `/ci/${entityName}/${entityId}/new-relation/${tabName}`,
                            },
                        ]}
                    />
                    <MainContentWrapper>
                        <RelationTypePermissionWrapper
                            selectedRoleName={props.groupData?.roleName ?? ''}
                            selectedCiRelationType={findRelationType(props.selectedRelationTypeState.selectedRelationTypeTechnicalName, [
                                ...(props.relationData?.relatedListAsSources ?? []),
                                ...(props.relationData?.relatedListAsTargets ?? []),
                            ])}
                        >
                            <NewRelationView {...props} />
                        </RelationTypePermissionWrapper>
                    </MainContentWrapper>
                </>
            )}
        />
    )
}

export default NewCiRelationPage
