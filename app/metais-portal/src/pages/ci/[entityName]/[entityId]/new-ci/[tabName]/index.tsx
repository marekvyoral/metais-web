import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { shouldEntityNameBePO } from '@isdd/metais-common/componentHelpers/ci/entityNameHelpers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { findCommonStrings } from '@isdd/metais-common/utils/utils'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiCreateItemAndRelationContainer } from '@/components/containers/CiCreateItemAndRelationContainer'
import { RelationTypePermissionWrapper } from '@/components/permissions/CreateRelationPermissionWrapper'
import { NewCiWithRelationView } from '@/components/views/new-ci-with-relation/NewCiWithRelationView'

const CreateCiItemAndRelation: React.FC = () => {
    const { tabName } = useParams()
    const { entityId } = useGetEntityParamsFromUrl()
    let { entityName } = useGetEntityParamsFromUrl()
    entityName = shouldEntityNameBePO(entityName ?? '')
    const { t } = useTranslation()

    return (
        <>
            <CiCreateItemAndRelationContainer
                configurationItemId={entityId}
                entityName={entityName}
                tabName={tabName ?? ''}
                View={(props) => {
                    document.title = `${t('breadcrumbs.newCiAndRelation', { itemName: props.ciName })} | MetaIS`

                    return (
                        <>
                            <BreadCrumbs
                                withWidthContainer
                                links={[
                                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                    { label: t('titles.ciList', { ci: props.data.attributesData.ciTypeData?.name }), href: `/ci/${entityName}` },
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
                                    rolesToCompareWith={findCommonStrings(
                                        props.data.relationData?.relationTypeData?.roleList ?? [],
                                        props.data.attributesData?.ciTypeData?.roleList ?? [],
                                    )}
                                >
                                    <NewCiWithRelationView {...props} />
                                </RelationTypePermissionWrapper>
                            </MainContentWrapper>
                        </>
                    )
                }}
            />
        </>
    )
}

export default CreateCiItemAndRelation
