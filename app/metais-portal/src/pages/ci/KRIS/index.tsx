import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { ENTITY_KRIS } from '@isdd/metais-common/constants'
import { IFilterParams, OPERATOR_OPTIONS } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { KrisListView } from '@/components/views/ci/kris/KrisListView'

export interface KRISFilterType extends IFilterParams {
    owner?: string
    Profil_KRIS_stav_kris?: string
}

const KRISListPage: React.FC = () => {
    const ciType = ENTITY_KRIS
    const { t, i18n } = useTranslation()
    document.title = `${t('titles.ciList', { ci: 'KRIT' })} | MetaIS`

    const defaultFilterValues: KRISFilterType = { owner: '', Profil_KRIS_stav_kris: '' }
    const defaultFilterOperators: KRISFilterType = { Profil_KRIS_stav_kris: OPERATOR_OPTIONS.EQUAL, owner: OPERATOR_OPTIONS.EQUAL }
    const {
        data: ciTypeData,
        isLoading: isCiTypeDataLoading,
        isError: isCiTypeDataError,
    } = useGetCiType(ciType, { query: { queryKey: [i18n.language, ciType] } })
    const entityName = ciTypeData?.name

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: entityName ?? '', href: `/ci/${ciType}` },
                ]}
            />

            <MainContentWrapper>
                <CiListContainer<KRISFilterType>
                    entityName={ciType}
                    defaultFilterValues={defaultFilterValues}
                    defaultFilterOperators={defaultFilterOperators}
                    ListComponent={(props) => (
                        <KrisListView {...props} isLoading={props.isLoading || isCiTypeDataLoading} isError={props.isError || isCiTypeDataError} />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default KRISListPage
