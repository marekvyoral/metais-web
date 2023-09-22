import React from 'react'
import { OrgPermissionsWrapper } from '@isdd/metais-common/components/permissions/OrgPermissionsWrapper'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'

import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'
import { PublicAuthorityAndRoleContainer } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { CreateCiEntityView } from '@/components/views/ci/create/CreateCiEntityView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const CreateEntityPage: React.FC = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.PO_IS_POCreate')}`
    const entityName = 'PO'

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: entityName ?? '', href: `/ci/${entityName}` },
                    { label: t('breadcrumbs.ciCreate'), href: `/ci/create` },
                ]}
            />
            <MainContentWrapper>
                <AttributesContainer
                    entityName={entityName ?? ''}
                    View={({ data: attributesData, isError: isAttError, isLoading: isAttLoading }) => (
                        <CiCreateEntityContainer
                            entityName={entityName ?? ''}
                            View={({ data: generatedEntityId, isError: isGeneratedEntityIdError, isLoading: isGeneratedEntityIdLoading }) => (
                                <PublicAuthorityAndRoleContainer
                                    View={({
                                        roleState,
                                        publicAuthorityState,
                                        data: groupData,
                                        isError: isPublicAuthAndRoleError,
                                        isLoading: isPublicAuthAndRoleLoading,
                                    }) => (
                                        <OrgPermissionsWrapper selectedOrganizationId={publicAuthorityState?.selectedPublicAuthority?.poUUID ?? ''}>
                                            <CreateCiEntityView
                                                data={{ attributesData, generatedEntityId }}
                                                ownerId={groupData?.gid ?? ''}
                                                roleState={roleState}
                                                publicAuthorityState={publicAuthorityState}
                                                entityName={entityName ?? ''}
                                                isError={[isAttError, isPublicAuthAndRoleError, isGeneratedEntityIdError].some((item) => item)}
                                                isLoading={[isAttLoading, isPublicAuthAndRoleLoading, isGeneratedEntityIdLoading].some(
                                                    (item) => item,
                                                )}
                                            />
                                        </OrgPermissionsWrapper>
                                    )}
                                />
                            )}
                        />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default CreateEntityPage
