import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { useParams } from 'react-router-dom'
import { OrgPermissionsWrapper } from '@isdd/metais-common/components/permissions/OrgPermissionsWrapper'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'
import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { PublicAuthorityAndRoleContainer } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { ITVSExceptionsCreateView } from '@/components/views/ci/vynimkyITVS/ITVSExceptionsCreateView'
import { ITVSExceptionsCreateContainer } from '@/components/containers/ITVS-exceptions/ITVSExceptionsCreateContainer'

const CreateEntityPage: React.FC = () => {
    const { t } = useTranslation()
    const entityName = 'vynimky_ITVS'
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
                                            <ITVSExceptionsCreateContainer data={{ attributesData, generatedEntityId }} />
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
