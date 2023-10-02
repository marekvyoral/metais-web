import React from 'react'
import { useParams } from 'react-router-dom'
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
    const { entityName } = useParams()
    document.title = `${t('titles.ciCreate', { ci: entityName })} | MetaIS`
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
                <CiCreateEntityContainer
                    entityName={entityName ?? ''}
                    View={({ data: generatedEntityId, isError: generatedIdError, isLoading: generatedIdLoading }) => (
                        <AttributesContainer
                            entityName={entityName ?? ''}
                            View={({ data: attributesData, isError: attError, isLoading: attLoading }) => (
                                <PublicAuthorityAndRoleContainer
                                    View={({
                                        data: groupData,
                                        roleState,
                                        publicAuthorityState,
                                        isError: publicAuthAndRoleError,
                                        isLoading: publicAuthAndRoleLoading,
                                    }) => (
                                        <OrgPermissionsWrapper selectedOrganizationId={publicAuthorityState?.selectedPublicAuthority?.poUUID ?? ''}>
                                            <CreateCiEntityView
                                                data={{ attributesData, generatedEntityId }}
                                                ownerId={groupData?.gid ?? ''}
                                                roleState={roleState}
                                                publicAuthorityState={publicAuthorityState}
                                                entityName={entityName ?? ''}
                                                isLoading={[attLoading, generatedIdLoading, publicAuthAndRoleLoading].some((item) => item)}
                                                isError={[attError, generatedIdError, publicAuthAndRoleError].some((item) => item)}
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
