import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CreateCiEntityView } from '@/components/views/ci/create/CreateCiEntityView'
import { useCiCreateEntityHook } from '@/hooks/useCiCreateEntity.hook'

const CreateEntityPage: React.FC = () => {
    const { t } = useTranslation()
    const { entityName } = useGetEntityParamsFromUrl()
    const ciCreateData = useCiCreateEntityHook({ entityName: entityName ?? '' })
    return (
        <>
            <>
                <BreadCrumbs
                    withWidthContainer
                    links={[
                        { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                        { label: t('titles.ciList', { ci: ciCreateData.ciTypeName }), href: `/ci/${entityName}` },
                        {
                            label: t('breadcrumbs.ciCreateEntity', { entityName: ciCreateData.data.attributesData.ciTypeData?.name }),
                            href: `/ci/create`,
                        },
                    ]}
                />
                <MainContentWrapper>
                    <CreateCiEntityView {...ciCreateData} />
                </MainContentWrapper>
            </>
        </>
    )
}

export default CreateEntityPage
