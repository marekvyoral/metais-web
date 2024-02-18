import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { shouldEntityNameBePO } from '@isdd/metais-common/componentHelpers/ci/entityNameHelpers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
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
    const { data: ciTypeData } = useGetCiType(entityName)

    return (
        <NewCiRelationContainer
            configurationItemId={entityId}
            entityName={entityName}
            tabName={tabName ?? ''}
            View={(props) => {
                document.title = `${t('breadcrumbs.newRelation', { itemName: props.ciName })} ${META_IS_TITLE}`

                return (
                    <>
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                { label: t('titles.ciList', { ci: ciTypeData?.name }) ?? '', href: `/ci/${entityName}` },
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
                                rolesToCompareWith={props.relationData?.relationTypeData?.roleList ?? []}
                            >
                                <NewRelationView {...props} />
                            </RelationTypePermissionWrapper>
                        </MainContentWrapper>
                    </>
                )
            }}
        />
    )
}

export default NewCiRelationPage
