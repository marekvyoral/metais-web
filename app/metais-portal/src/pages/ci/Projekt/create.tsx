import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { ENTITY_PROJECT, META_IS_TITLE } from '@isdd/metais-common/constants'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CreateProjectView } from '@/components/views/ci/project/CreateProjectView'
import { useCiCreateEntityHook } from '@/hooks/useCiCreateEntity.hook'
import { getCiHowToBreadCrumb } from '@/componentHelpers/ci'

const CreateProjectPage: React.FC = () => {
    const { t } = useTranslation()
    const entityName = ENTITY_PROJECT
    const ciCreateData = useCiCreateEntityHook({ entityName: entityName ?? '' })
    document.title = `${t('titles.ciCreateEntity', { ci: ciCreateData.ciTypeName })} ${META_IS_TITLE}`

    return (
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
                <CreateProjectView {...ciCreateData} />
            </MainContentWrapper>
        </>
    )
}

export default CreateProjectPage
