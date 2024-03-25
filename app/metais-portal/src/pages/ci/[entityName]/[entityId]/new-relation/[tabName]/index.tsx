import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { shouldEntityNameBePO } from '@isdd/metais-common/componentHelpers/ci/entityNameHelpers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { META_IS_TITLE } from '@isdd/metais-common/constants'
import { useGetCiTypeWrapper } from '@isdd/metais-common/hooks/useCiType.hook'

import { getCiHowToBreadCrumb, useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RelationTypePermissionWrapper } from '@/components/permissions/CreateRelationPermissionWrapper'
import { NewRelationView } from '@/components/views/new-relation/NewRelationView'
import { useCiRelationHook } from '@/hooks/useCiRelation.hook'

const NewCiRelationPage: React.FC = () => {
    const { tabName } = useParams()
    const { entityId } = useGetEntityParamsFromUrl()
    let { entityName } = useGetEntityParamsFromUrl()
    entityName = shouldEntityNameBePO(entityName ?? '')
    const { t } = useTranslation()
    const { data: ciTypeData } = useGetCiTypeWrapper(entityName)

    const props = useCiRelationHook({ entityName, tabName: tabName ?? '', configurationItemId: entityId })
    document.title = `${t('breadcrumbs.newRelation', { itemName: props.ciName })} ${META_IS_TITLE}`

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    ...getCiHowToBreadCrumb(entityName ?? '', t),
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
}

export default NewCiRelationPage
