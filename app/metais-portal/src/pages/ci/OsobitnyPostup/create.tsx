import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'
import { PublicAuthorityAndRoleContainer } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { ITVSExceptionsCreateContainer } from '@/components/containers/ITVS-exceptions/ITVSExceptionsCreateContainer'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

const CreateITVSExceptionsPage: React.FC = () => {
    const { t } = useTranslation()
    const { entityName } = useGetEntityParamsFromUrl()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: entityName ?? '', href: `/ci/${entityName}` },
                    { label: `${t('breadcrumbs.ciCreate', { entityName: t('ITVSExceptions.vynimky_ITVS') })}`, href: `/ci/create` },
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
                                        <ITVSExceptionsCreateContainer
                                            entityName={entityName ?? ''}
                                            data={{ attributesData, generatedEntityId }}
                                            ownerId={groupData?.gid ?? ''}
                                            isLoading={[attLoading, generatedIdLoading, publicAuthAndRoleLoading].some((item) => item)}
                                            isError={[attError, generatedIdError, publicAuthAndRoleError].some((item) => item)}
                                            roleState={roleState}
                                            publicAuthorityState={publicAuthorityState}
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
}

export default CreateITVSExceptionsPage
