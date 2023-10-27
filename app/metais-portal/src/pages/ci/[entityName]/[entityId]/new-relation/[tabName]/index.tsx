import React from 'react'
import { useParams } from 'react-router-dom'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { Languages } from '@isdd/metais-common/localization/languages'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { shouldEntityNameBePO } from '@isdd/metais-common/componentHelpers/ci/entityNameHelpers'

import { CiContainer } from '@/components/containers/CiContainer'
import { NewCiRelationContainer } from '@/components/containers/NewCiRelationContainer'
import { PublicAuthorityAndRoleContainer } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { NewRelationView } from '@/components/views/new-relation/NewRelationView'
import { findRelationType } from '@/componentHelpers/new-relation'
import { RelationTypePermissionWrapper } from '@/components/permissions/CreateRelationPermissionWrapper'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const NewCiRelationPage: React.FC = () => {
    const { entityId, tabName } = useParams()
    let { entityName } = useParams()
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
                                                selectedOrgId={publicAuthorityState.selectedPublicAuthority?.poUUID ?? ''}
                                                selectedRoleName={groupData?.roleName ?? ''}
                                                selectedCiRelationType={findRelationType(
                                                    selectedRelationTypeState.selectedRelationTypeTechnicalName,
                                                    [...(relationData?.relatedListAsSources ?? []), ...(relationData?.relatedListAsTargets ?? [])],
                                                )}
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
