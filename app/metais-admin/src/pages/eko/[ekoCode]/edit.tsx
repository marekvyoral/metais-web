import { useParams } from 'react-router-dom'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { EkoEditContainer } from '@/components/containers/Eko/EkoEditContainer'
import { EkoCreateView } from '@/components/views/eko/eko-create-views/EkoCreateView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const EditEko = () => {
    const { ekoCode } = useParams()
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('navMenu.eko'), href: AdminRouteNames.EKO },
                    { label: t('eko.editCode'), href: `${AdminRouteNames.EKO}/${ekoCode}/edit` },
                ]}
            />
            <MainContentWrapper>
                <EkoEditContainer
                    ekoCode={ekoCode ?? ''}
                    View={(props) => (
                        <EkoCreateView editData={props.data} mutate={props?.mutate} data={[]} isError={props.isError} isLoading={props.isLoading} />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default EditEko
