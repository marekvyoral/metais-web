import React from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'
import { ENTITY_PROJECT } from '@isdd/metais-common/constants'

import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'
import { PublicAuthorityAndRoleContainer } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CreateProjectView } from '@/components/views/ci/project/CreateProjectView'

const CreateProjectPage: React.FC = () => {
    const { t } = useTranslation()

    const entityName = ENTITY_PROJECT
    document.title = `${t('titles.ciCreateEntity', { ci: entityName })} | MetaIS`

    return (
        <>
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
                                    <>
                                        <BreadCrumbs
                                            withWidthContainer
                                            links={[
                                                { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                                { label: entityName ?? '', href: `/ci/${entityName}` },
                                                {
                                                    label: t('breadcrumbs.ciCreateEntity', { entityName: attributesData.ciTypeData?.name }),
                                                    href: `/ci/create`,
                                                },
                                            ]}
                                        />
                                        <MainContentWrapper>
                                            <CreateProjectView
                                                data={{
                                                    attributesData: {
                                                        ciTypeData: attributesData.ciTypeData,
                                                        unitsData: attributesData.unitsData,
                                                        constraintsData: attributesData.constraintsData,
                                                    },
                                                    generatedEntityId,
                                                }}
                                                ownerId={groupData?.gid ?? ''}
                                                roleState={roleState}
                                                publicAuthorityState={publicAuthorityState}
                                                entityName={entityName ?? ''}
                                                isLoading={[attLoading, generatedIdLoading, publicAuthAndRoleLoading].some((item) => item)}
                                                isError={[attError, generatedIdError, publicAuthAndRoleError].some((item) => item)}
                                            />
                                        </MainContentWrapper>
                                    </>
                                )}
                            />
                        )}
                    />
                )}
            />
        </>
    )
}

export default CreateProjectPage
