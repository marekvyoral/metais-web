import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { QueryFeedback } from '@isdd/metais-common/index'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'

import { CreateRefRegisterContainer } from '@/components/containers/refregisters/CreateRefRegisterContainer'
import { RefRegisterContainer } from '@/components/containers/refregisters/RefRegisterContainer'
import { RefRegisterCreateView } from '@/components/views/refregisters/createView/RefRegisterCreateView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Create = () => {
    const entityName = 'ReferenceRegister'
    const { t } = useTranslation()

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
                    View={({ userGroupData, isLoading: userGroupDataIsLoading, isError: userGroupDataIsError, POData, saveRefRegister }) => (
                        <AttributesContainer
                            entityName={entityName}
                            View={({ data: { renamedAttributes } }) => (
                                <RefRegisterContainer
                                    entityId={''}
                                    View={({ data: { guiAttributes } }) => (
                                        <>
                                            <TextHeading size="XL">{t('refRegisters.create.title')}</TextHeading>
                                            <QueryFeedback
                                                loading={userGroupDataIsLoading}
                                                error={userGroupDataIsError}
                                                errorProps={{ errorMessage: t('feedback.failedFetch') }}
                                            >
                                                <RefRegisterCreateView
                                                    userGroupData={userGroupData}
                                                    POData={POData}
                                                    saveRefRegister={saveRefRegister}
                                                    renamedAttributes={[...(renamedAttributes ?? []), ...(guiAttributes ?? [])]}
                                                />
                                            </QueryFeedback>
                                        </>
                                    )}
                                />
                            )}
                        />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default Create
