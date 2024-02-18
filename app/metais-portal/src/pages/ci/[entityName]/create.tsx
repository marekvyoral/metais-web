import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'
import { CreateCiEntityView } from '@/components/views/ci/create/CreateCiEntityView'

const CreateEntityPage: React.FC = () => {
    const { t } = useTranslation()
    const { entityName } = useGetEntityParamsFromUrl()

    return (
        <>
            <CiCreateEntityContainer
                entityName={entityName ?? ''}
                View={(props) => {
                    document.title = `${t('titles.ciCreateEntity', { ci: props.ciTypeName })} ${META_IS_TITLE}`

                    return (
                        <>
                            <BreadCrumbs
                                withWidthContainer
                                links={[
                                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                    { label: t('titles.ciList', { ci: props.ciTypeName }), href: `/ci/${entityName}` },
                                    {
                                        label: t('breadcrumbs.ciCreateEntity', { entityName: props.data.attributesData.ciTypeData?.name }),
                                        href: `/ci/create`,
                                    },
                                ]}
                            />
                            <MainContentWrapper>
                                <CreateCiEntityView {...props} />
                            </MainContentWrapper>
                        </>
                    )
                }}
            />
        </>
    )
}

export default CreateEntityPage
