import React from 'react'
import { useParams } from 'react-router-dom'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { Languages } from '@isdd/metais-common/localization/languages'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'

import { CiContainer } from '@/components/containers/CiContainer'
import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'
import { NewCiRelationContainer } from '@/components/containers/NewCiRelationContainer'
import { PublicAuthorityAndRoleContainer } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { NewCiWithRelationView } from '@/components/views/new-ci-with-relation/NewCiWithRelationView'
import { RelationTypePermissionWrapper } from '@/components/permissions/CreateRelationPermissionWrapper'
import { findRelationType } from '@/componentHelpers/new-relation'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const CreateCiItemAndRelation: React.FC = () => {
    const { entityName, entityId, tabName } = useParams()
    const { t, i18n } = useTranslation()

    return (
        <>
            <CiContainer
                configurationItemId={entityId}
                View={({ data: ciData, isError: isCiItemError, isLoading: isCiItemLoading }) => {
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
                                        label: t('breadcrumbs.newCiAndRelation', { itemName: currentName }),
                                        href: `/ci/${entityName}/${entityId}/new-ci/${tabName}`,
                                    },
                                ]}
                            />
                            <MainContentWrapper>
                                <AttributesContainer
                                    entityName={tabName ?? ''}
                                    View={({ data: attributesData, isError: attError, isLoading: attLoading }) => (
                                        <CiCreateEntityContainer
                                            entityName={tabName ?? ''}
                                            View={({
                                                data: generatedEntityId,
                                                isError: isGeneratedEntityIdError,
                                                isLoading: isGeneratedEntityIdLoading,
                                            }) => (
                                                <NewCiRelationContainer
                                                    entityName={entityName ?? ''}
                                                    configurationItemId={entityId ?? ''}
                                                    tabName={tabName ?? ''}
                                                    View={({
                                                        data: relationData,
                                                        selectedRelationTypeState,
                                                        isError: isNewCiRelError,
                                                        isLoading: isNewRelCiLoading,
                                                    }) => (
                                                        <PublicAuthorityAndRoleContainer
                                                            View={({
                                                                data: groupData,
                                                                publicAuthorityState,
                                                                roleState,
                                                                isError: isPublicAuthAndRoleError,
                                                                isLoading: isPublicAuthAndRoleLoading,
                                                            }) => (
                                                                <RelationTypePermissionWrapper
                                                                    selectedOrgId={publicAuthorityState.selectedPublicAuthority?.poUUID ?? ''}
                                                                    selectedRoleName={groupData?.roleName ?? ''}
                                                                    selectedCiRelationType={findRelationType(
                                                                        selectedRelationTypeState.selectedRelationTypeTechnicalName,
                                                                        [
                                                                            ...(relationData?.relatedListAsSources ?? []),
                                                                            ...(relationData?.relatedListAsTargets ?? []),
                                                                        ],
                                                                    )}
                                                                >
                                                                    <NewCiWithRelationView
                                                                        entityName={entityName ?? ''}
                                                                        entityId={entityId ?? ''}
                                                                        tabName={tabName ?? ''}
                                                                        data={{
                                                                            attributesData,
                                                                            generatedEntityId,
                                                                            relationData,
                                                                            groupData,
                                                                            ciItemData: ciData?.ciItemData,
                                                                        }}
                                                                        states={{ selectedRelationTypeState, publicAuthorityState, roleState }}
                                                                        isError={[
                                                                            isGeneratedEntityIdError,
                                                                            isNewCiRelError,
                                                                            isPublicAuthAndRoleError,
                                                                            attError,
                                                                            isCiItemError,
                                                                        ].some((item) => item)}
                                                                        isLoading={[
                                                                            isGeneratedEntityIdLoading,
                                                                            isNewRelCiLoading,
                                                                            isPublicAuthAndRoleLoading,
                                                                            attLoading,
                                                                            isCiItemLoading,
                                                                        ].some((item) => item)}
                                                                    />
                                                                </RelationTypePermissionWrapper>
                                                            )}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </MainContentWrapper>
                        </>
                    )
                }}
            />
        </>
    )
}

export default CreateCiItemAndRelation
