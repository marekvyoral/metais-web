import React from 'react'
import { useParams } from 'react-router-dom'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { EntityDetailContainer } from '@/components/containers/Egov/Entity/EntityDetailContainer'
import { CreateEntityView } from '@/components/views/egov/entity-detail-views/CreateEntityView'
import CreateEntityContainer from '@/components/containers/Egov/Entity/CreateEntityContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const EditEntity = () => {
    const { entityId } = useParams()
    const { t } = useTranslation()
    return (
        <EntityDetailContainer
            entityName={entityId ?? ''}
            View={(props) => (
                <>
                    <BreadCrumbs
                        withWidthContainer
                        links={[
                            { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                            { label: t('navMenu.egov.entity'), href: AdminRouteNames.EGOV_ENTITY },
                            {
                                label: t('egov.entity.detailHeading') + ` - ${props.data.ciTypeData?.name}`,
                                href: `${AdminRouteNames.EGOV_ENTITY}/${entityId}`,
                            },
                            {
                                label: t('egov.entity.editHeader') + ` - ${props.data.ciTypeData?.name}`,
                                href: `${AdminRouteNames.EGOV_ENTITY}/${entityId}/edit`,
                            },
                        ]}
                    />
                    <MainContentWrapper>
                        <CreateEntityContainer
                            View={(createProps) => (
                                <CreateEntityView
                                    data={{
                                        roles: createProps?.data?.roles,
                                        existingEntityData: props?.data?.ciTypeData,
                                    }}
                                    mutate={createProps?.mutate}
                                    hiddenInputs={createProps?.hiddenInputs}
                                    disabledInputs={createProps?.disabledInputs}
                                    isError={props.isError || createProps.isError}
                                    isLoading={createProps.isLoading || props.isLoading}
                                    isEdit
                                    type="entity"
                                    refetch={props.refetch}
                                    entityId={entityId}
                                />
                            )}
                            entityId={entityId}
                        />
                    </MainContentWrapper>
                </>
            )}
        />
    )
}

export default EditEntity
