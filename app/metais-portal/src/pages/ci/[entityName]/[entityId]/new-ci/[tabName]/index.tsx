import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { shouldEntityNameBePO } from '@isdd/metais-common/componentHelpers/ci/entityNameHelpers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { Languages } from '@isdd/metais-common/localization/languages'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { findRelationType } from '@/componentHelpers/new-relation'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiCreateItemAndRelationContainer } from '@/components/containers/CiCreateItemAndRelationContainer'
import { RelationTypePermissionWrapper } from '@/components/permissions/CreateRelationPermissionWrapper'
import { NewCiWithRelationView } from '@/components/views/new-ci-with-relation/NewCiWithRelationView'

const CreateCiItemAndRelation: React.FC = () => {
    const { tabName } = useParams()
    const { entityId } = useGetEntityParamsFromUrl()
    let { entityName } = useGetEntityParamsFromUrl()
    entityName = shouldEntityNameBePO(entityName ?? '')
    const { t, i18n } = useTranslation()
    const { data: ciTypeData } = useGetCiType(entityName)
    const ciTypeName = i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName
    return (
        <>
            <CiCreateItemAndRelationContainer
                configurationItemId={entityId}
                entityName={entityName}
                tabName={tabName ?? ''}
                View={(props) => (
                    <>
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                { label: ciTypeName ?? '', href: `/ci/${entityName}` },
                                { label: props.ciName ? props.ciName : t('breadcrumbs.noName'), href: `/ci/${entityName}/${entityId}` },
                                {
                                    label: t('breadcrumbs.newCiAndRelation', { itemName: props.ciName }),
                                    href: `/ci/${entityName}/${entityId}/new-ci/${tabName}`,
                                },
                            ]}
                        />
                        <MainContentWrapper>
                            <RelationTypePermissionWrapper
                                selectedRoleName={props.data.groupData?.roleName ?? ''}
                                selectedCiRelationType={findRelationType(props.states.selectedRelationTypeState.selectedRelationTypeTechnicalName, [
                                    ...(props.data.relationData?.relatedListAsSources ?? []),
                                    ...(props.data.relationData?.relatedListAsTargets ?? []),
                                ])}
                            >
                                <NewCiWithRelationView {...props} />
                            </RelationTypePermissionWrapper>
                        </MainContentWrapper>
                    </>
                )}
            />
        </>
    )
}

export default CreateCiItemAndRelation
