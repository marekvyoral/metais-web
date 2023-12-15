import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { ENTITY_KRIS } from '@isdd/metais-common/constants'
import { IFilterParams, OPERATOR_OPTIONS } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { KrisListView } from '@/components/views/ci/kris/KrisListView'

interface Props {
    importantEntityName?: string
    noSideMenu?: boolean
}

export interface KRISFilterType extends IFilterParams {
    owner?: string
    Profil_KRIS_stav_kris?: string
}

const KRISListPage: React.FC<Props> = ({ importantEntityName, noSideMenu }) => {
    const ciType = ENTITY_KRIS
    const { t } = useTranslation()
    document.title = `${t('titles.ciList', { ci: ciType })} | MetaIS`

    const defaultFilterValues: KRISFilterType = { owner: '', Profil_KRIS_stav_kris: '' }
    const defaultFilterOperators: KRISFilterType = { Profil_KRIS_stav_kris: OPERATOR_OPTIONS.EQUAL, owner: OPERATOR_OPTIONS.EQUAL }

    const entityName = importantEntityName ? importantEntityName : ciType ?? ''

    return (
        <>
            {!importantEntityName && (
                <BreadCrumbs
                    withWidthContainer
                    links={[
                        { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                        { label: ciType ?? '', href: `/ci/${ciType}` },
                    ]}
                />
            )}
            <MainContentWrapper noSideMenu={noSideMenu}>
                <CiListContainer<KRISFilterType>
                    entityName={entityName}
                    ciType={ciType}
                    defaultFilterValues={defaultFilterValues}
                    defaultFilterOperators={defaultFilterOperators}
                    ListComponent={(props) => <KrisListView {...props} />}
                />
            </MainContentWrapper>
        </>
    )
}

export default KRISListPage
