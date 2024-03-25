import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { getCiHowToBreadCrumb, useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { useCiCreateEntityHook } from '@/hooks/useCiCreateEntity.hook'
import { CreateKrisEntityView } from '@/components/views/ci/kris/CreateKrisEntityView'

const CreateKrisEntityPage: React.FC = () => {
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
                        ...getCiHowToBreadCrumb(entityName ?? '', t),
                        { label: t('titles.ciList', { ci: ciCreateData.ciTypeName }), href: `/ci/${entityName}` },
                        {
                            label: t('breadcrumbs.ciCreateEntity', { entityName: ciCreateData.data.attributesData.ciTypeData?.name }),
                            href: `/ci/create`,
                        },
                    ]}
                />
                <MainContentWrapper>
                    <CreateKrisEntityView {...ciCreateData} />
                </MainContentWrapper>
            </>
        </>
    )
}

export default CreateKrisEntityPage
