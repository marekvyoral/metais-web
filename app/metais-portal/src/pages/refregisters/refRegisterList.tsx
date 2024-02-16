import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { REFERENCE_REGISTER } from '@isdd/metais-common/constants'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { formatTitleString } from '@isdd/metais-common/utils/utils'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RefRegisterListContainer } from '@/components/containers/refregisters/RefRegisterListContainer'
import { RefRegisterListView } from '@/components/views/refregisters/RefRegisterListView'

const ReferenceRegisters = () => {
    const { t } = useTranslation()

    const entityName = REFERENCE_REGISTER
    document.title = formatTitleString(t('breadcrumbs.refRegisters'))

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('breadcrumbs.refRegisters'), href: RouteNames.REFERENCE_REGISTERS },
                ]}
            />
            <MainContentWrapper>
                <RefRegisterListContainer entityName={entityName} View={(props) => <RefRegisterListView {...props} />} />
            </MainContentWrapper>
        </>
    )
}

export default ReferenceRegisters
