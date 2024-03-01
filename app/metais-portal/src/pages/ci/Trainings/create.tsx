import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { META_IS_TITLE } from '@isdd/metais-common/constants'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { useCiCreateEntityHook } from '@/hooks/useCiCreateEntity.hook'
import { CreateTrainingEntityView } from '@/components/views/ci/create/CreateTrainingEntityView'

const CreateTrainingEntityPage: React.FC = () => {
    const { t } = useTranslation()
    const { entityName } = useGetEntityParamsFromUrl()
    const ciCreateData = useCiCreateEntityHook({ entityName: entityName ?? '' })
    document.title = `${t('titles.ciCreateEntity', { ci: ciCreateData.ciTypeName })} ${META_IS_TITLE}`

    return (
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
                <CreateTrainingEntityView {...ciCreateData} />
            </MainContentWrapper>
        </>
    )
}

export default CreateTrainingEntityPage
