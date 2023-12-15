import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { ENTITY_PROJECT } from '@isdd/metais-common/constants'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'
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
                View={(props) => (
                    <>
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                { label: entityName ?? '', href: `/ci/${entityName}` },
                                {
                                    label: t('breadcrumbs.ciCreateEntity', { entityName: props.data.attributesData.ciTypeData?.name }),
                                    href: `/ci/create`,
                                },
                            ]}
                        />
                        <MainContentWrapper>
                            <CreateProjectView {...props} />
                        </MainContentWrapper>
                    </>
                )}
            />
        </>
    )
}

export default CreateProjectPage
