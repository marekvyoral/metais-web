import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { getCiHowToBreadCrumb, useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiListContainer } from '@/components/containers/CiListContainer'
import { ListWrapper } from '@/components/list-wrapper/ListWrapper'
import { CiListWizard } from '@/components/wizards/CiListWizard'

export interface CIFilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    Gen_Profil_kod_metais?: string
}
const ZCListPage: React.FC = () => {
    const { entityName: ciType } = useGetEntityParamsFromUrl()
    const { t } = useTranslation()

    const defaultFilterValues: CIFilterData = { Gen_Profil_nazov: '', Gen_Profil_kod_metais: '' }

    return (
        <>
            <CiListContainer<CIFilterData>
                entityName={ciType ?? ''}
                defaultFilterValues={defaultFilterValues}
                ListComponent={(props) => (
                    <>
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                ...getCiHowToBreadCrumb(props.entityName, t),
                                {
                                    label: t('titles.ciList', { ci: props.ciTypeData?.name }) ?? '',
                                    href: `/ci/${ciType}`,
                                },
                            ]}
                        />
                        {!props.isLoading && <CiListWizard />}
                        <MainContentWrapper>
                            <ListWrapper
                                {...props}
                                hiddenButtons={{ BULK_ACTIONS: true, EXPORT: true, IMPORT: true }}
                                rowSelection={{}}
                                hideRowSelection
                            />
                        </MainContentWrapper>
                    </>
                )}
            />
        </>
    )
}

export default ZCListPage
