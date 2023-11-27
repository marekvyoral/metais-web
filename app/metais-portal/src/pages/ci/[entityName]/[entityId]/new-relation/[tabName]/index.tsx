import React from 'react'
import { useParams } from 'react-router-dom'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { Languages } from '@isdd/metais-common/localization/languages'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { shouldEntityNameBePO } from '@isdd/metais-common/componentHelpers/ci/entityNameHelpers'

import { CiContainer } from '@/components/containers/CiContainer'
import { NewCiRelationContainer } from '@/components/containers/NewCiRelationContainer'
import { PublicAuthorityAndRoleContainer } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { NewRelationView } from '@/components/views/new-relation/NewRelationView'
import { RelationTypePermissionWrapper } from '@/components/permissions/CreateRelationPermissionWrapper'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

const NewCiRelationPage: React.FC = () => {
    const { tabName } = useParams()
    const { entityId } = useGetEntityParamsFromUrl()
    let { entityName } = useGetEntityParamsFromUrl()
    entityName = shouldEntityNameBePO(entityName ?? '')
    const { t, i18n } = useTranslation()

    return (
        <CiContainer
            configurationItemId={entityId}
            View={({ data: ciData, isLoading: isCiItemLoading, isError: isCiItemError }) => {
                const ciItemData = ciData?.ciItemData
                const currentName =
                    i18n.language == Languages.SLOVAK
                        ? ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
                        : ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]
                return (
                    <>
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                { label: entityName, href: `/ci/${entityName}` },
                                { label: currentName ? currentName : t('breadcrumbs.noName'), href: `/ci/${entityName}/${entityId}` },
                                {
                                    label: t('breadcrumbs.newRelation', { itemName: currentName }),
                                    href: `/ci/${entityName}/${entityId}/new-relation/${tabName}`,
                                },
                            ]}
                        />
                        <MainContentWrapper>
                            <NewCiRelationContainer
                                entityName={entityName ?? ''}
                                configurationItemId={entityId ?? ''}
                                tabName={tabName ?? ''}
                                View={({ data: relationData, selectedRelationTypeState, isError: newCiRelError, isLoading: newCiRelLoading }) => (
                                    <PublicAuthorityAndRoleContainer
                                        View={({
                                            data: groupData,
                                            publicAuthorityState,
                                            roleState,
                                            isError: publicAuthAndRoleError,
                                            isLoading: publicAuthAndRoleLoading,
                                        }) => (
                                            <RelationTypePermissionWrapper
                                                selectedRoleName={groupData?.roleName ?? ''}
                                                selectedCiRelationType={relationData?.relationTypeData}
                                            >
                                                <NewRelationView
                                                    roleState={roleState}
                                                    publicAuthorityState={publicAuthorityState}
                                                    ownerGid={groupData?.gid ?? ''}
                                                    ciItemData={ciData?.ciItemData}
                                                    relationData={relationData}
                                                    selectedRelationTypeState={selectedRelationTypeState}
                                                    tabName={tabName ?? ''}
                                                    entityId={entityId ?? ''}
                                                    entityName={entityName ?? ''}
                                                    isError={[newCiRelError, publicAuthAndRoleError, isCiItemError].some((item) => item)}
                                                    isLoading={[publicAuthAndRoleLoading, newCiRelLoading, isCiItemLoading].some((item) => item)}
                                                />
                                            </RelationTypePermissionWrapper>
                                        )}
                                    />
                                )}
                            />
                        </MainContentWrapper>
                    </>
                )
            }}
        />
    )
}

export default NewCiRelationPage
