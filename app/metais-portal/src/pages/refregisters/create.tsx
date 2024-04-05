import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { REFERENCE_REGISTER } from '@isdd/metais-common/constants'
import { QueryFeedback } from '@isdd/metais-common/index'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { ElementToScrollTo } from '@isdd/metais-common/components/element-to-scroll-to/ElementToScrollTo'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CreateRefRegisterContainer } from '@/components/containers/refregisters/CreateRefRegisterContainer'
import { RefRegisterCreateView } from '@/components/views/refregisters/createView/RefRegisterCreateView'

const RefRegistersCreate = () => {
    const entityName = REFERENCE_REGISTER
    const { t } = useTranslation()
    document.title = t('refRegisters.create.title')

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('breadcrumbs.refRegisters'), href: RouteNames.REFERENCE_REGISTERS },
                    {
                        label: t('breadcrumbs.refRegistersCreate'),
                        href: `${RouteNames.REFERENCE_REGISTERS}/create`,
                    },
                ]}
            />
            <MainContentWrapper>
                <CreateRefRegisterContainer
                    entityName={entityName}
                    View={({
                        userGroupData,
                        renamedAttributes,
                        guiAttributes,
                        isLoading: userGroupDataIsLoading,
                        isError: userGroupDataIsError,
                        POData,
                        saveRefRegister,
                        updateContact,
                        updateAccessData,
                        updateRefRegister,
                    }) => (
                        <>
                            <TextHeading size="XL">{t('refRegisters.create.title')}</TextHeading>
                            <ElementToScrollTo trigger={userGroupDataIsError} manualScroll scrollOptions={{ block: 'start' }}>
                                <QueryFeedback loading={userGroupDataIsLoading} error={userGroupDataIsError} withChildren>
                                    <RefRegisterCreateView
                                        userGroupData={userGroupData}
                                        POData={POData}
                                        saveRefRegister={saveRefRegister}
                                        updateContact={updateContact}
                                        updateAccessData={updateAccessData}
                                        updateRefRegister={updateRefRegister}
                                        renamedAttributes={[...(renamedAttributes ?? []), ...(guiAttributes ?? [])]}
                                    />
                                </QueryFeedback>
                            </ElementToScrollTo>
                        </>
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default RefRegistersCreate
