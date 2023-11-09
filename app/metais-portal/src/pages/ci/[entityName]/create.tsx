import React from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'
import { shouldEntityNameBePO } from '@isdd/metais-common/componentHelpers/ci/entityNameHelpers'

import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'
import { PublicAuthorityAndRoleContainer } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { CreateCiEntityView } from '@/components/views/ci/create/CreateCiEntityView'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

const CreateEntityPage: React.FC = () => {
    const { t } = useTranslation()

    let { entityName } = useGetEntityParamsFromUrl()
    entityName = shouldEntityNameBePO(entityName ?? '')
    document.title = `${t('titles.ciCreateEntity', { ci: entityName })} | MetaIS`
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: entityName ?? '', href: `/ci/${entityName}` },
                    { label: t('breadcrumbs.ciCreateEntity', { entityName: entityName }), href: `/ci/create` },
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
                                        <CreateCiEntityView
                                            data={{ attributesData, generatedEntityId }}
                                            ownerId={groupData?.gid ?? ''}
                                            roleState={roleState}
                                            publicAuthorityState={publicAuthorityState}
                                            entityName={entityName ?? ''}
                                            isLoading={[attLoading, generatedIdLoading, publicAuthAndRoleLoading].some((item) => item)}
                                            isError={[attError, generatedIdError, publicAuthAndRoleError].some((item) => item)}
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

export default CreateEntityPage
