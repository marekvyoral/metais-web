import React from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import CreateEntityContainer from '@/components/containers/Egov/Entity/CreateEntityContainer'
import { CreateEntityView } from '@/components/views/egov/entity-detail-views/CreateEntityView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const CreateEntity = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('navMenu.egov.entity'), href: AdminRouteNames.EGOV_ENTITY },
                    { label: t('egov.entity.createHeader'), href: AdminRouteNames.EGOV_ENTITY + '/create' },
                ]}
            />
            <MainContentWrapper>
                <CreateEntityContainer
                    View={(props) => (
                        <CreateEntityView
                            data={props?.data}
                            mutate={props?.mutate}
                            hiddenInputs={props?.hiddenInputs}
                            isError={props.isError}
                            isLoading={props.isLoading}
                            type="entity"
                        />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default CreateEntity
