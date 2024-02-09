import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { REFERENCE_REGISTER } from '@isdd/metais-common/constants'
import { QueryFeedback } from '@isdd/metais-common/index'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { EDIT_CONTACT } from '@isdd/metais-common/src/navigation/searchKeys'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router-dom'
import { formatTitleString } from '@isdd/metais-common/utils/utils'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CreateRefRegisterContainer } from '@/components/containers/refregisters/CreateRefRegisterContainer'
import { RefRegisterCreateView } from '@/components/views/refregisters/createView/RefRegisterCreateView'

const RefRegistersEdit = () => {
    const [urlParams] = useSearchParams()
    const isContact = urlParams.get(EDIT_CONTACT) === 'true' ? true : false

    const { entityId } = useParams()
    const entityName = REFERENCE_REGISTER
    const { t } = useTranslation()
    document.title = formatTitleString(t('breadcrumbs.refRegistersEdit'))

    return (
        <CreateRefRegisterContainer
            entityName={entityName}
            entityId={entityId}
            View={({
                userGroupData,
                isLoading: userGroupDataIsLoading,
                isError: userGroupDataIsError,
                POData,
                guiAttributes,
                referenceRegisterData,
                renamedAttributes,
                updateRefRegister,
                updateAccessData,
                updateContact,
            }) => (
                <>
                    <BreadCrumbs
                        withWidthContainer
                        links={[
                            { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                            { label: t('breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                            { label: t('breadcrumbs.refRegisters'), href: RouteNames.REFERENCE_REGISTERS },
                            {
                                label: referenceRegisterData?.isvsName ?? t('breadcrumbs.noName'),
                                href: `${RouteNames.REFERENCE_REGISTERS}/${entityId}`,
                            },
                            {
                                label: `${t('breadcrumbs.refRegistersEdit')}`,
                                href: isContact
                                    ? `${RouteNames.REFERENCE_REGISTERS}/${entityId}/edit?${EDIT_CONTACT}=true`
                                    : `${RouteNames.REFERENCE_REGISTERS}/${entityId}/edit`,
                            },
                        ]}
                    />
                    <MainContentWrapper>
                        <TextHeading size="XL">{t('refRegisters.edit.title')}</TextHeading>
                        <QueryFeedback
                            loading={userGroupDataIsLoading}
                            error={userGroupDataIsError}
                            errorProps={{ errorMessage: t('feedback.failedFetch') }}
                        >
                            <RefRegisterCreateView
                                defaultData={referenceRegisterData}
                                userGroupData={userGroupData}
                                POData={POData}
                                updateRefRegister={updateRefRegister}
                                updateAccessData={updateAccessData}
                                updateContact={updateContact}
                                renamedAttributes={[...(renamedAttributes ?? []), ...(guiAttributes ?? [])]}
                            />
                        </QueryFeedback>
                    </MainContentWrapper>
                </>
            )}
        />
    )
}

export default RefRegistersEdit
