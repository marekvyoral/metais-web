import React from 'react'
import { BreadCrumbs, HomeIcon, TextHeading, TextWarning } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { formatTitleString } from '@isdd/metais-common/utils/utils'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

import { DraftsListCreateForm } from '@/components/entities/draftslist/DraftsListCreateForm'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { DraftsListCreateContainer } from '@/components/containers/draftslist/DraftsListCreateContainer'

const DraftsListCreatePage: React.FC = () => {
    const { t } = useTranslation()
    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

    document.title = formatTitleString(t('DraftsList.createForm.heading'))

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                    { label: t('breadcrumbs.draftsList'), href: NavigationSubRoutes.ZOZNAM_NAVRHOV },
                    { label: t('DraftsList.createForm.heading'), href: RouterRoutes.STANDARDIZATION_DRAFTS_CREATE },
                ]}
            />
            <MainContentWrapper>
                <TextHeading size="XL">{t('DraftsList.create.heading')}</TextHeading>
                <TextWarning>{t('DraftsList.create.warning')}</TextWarning>
                <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
                    <DraftsListCreateContainer
                        View={({
                            onSubmit,
                            guiAttributes,
                            isGuiDataError,
                            isGuiDataLoading,
                            isError,
                            isLoading,
                            sendData,
                            fileUploadRef,
                            handleUploadSuccess,
                            id,
                            handleUploadFailed,
                        }) => (
                            <QueryFeedback loading={isGuiDataLoading} error={isGuiDataError}>
                                <DraftsListCreateForm
                                    handleUploadFailed={handleUploadFailed}
                                    onSubmit={onSubmit}
                                    data={{
                                        defaultData: undefined,
                                        guiAttributes: guiAttributes,
                                    }}
                                    isError={isError}
                                    isLoading={isLoading}
                                    sendData={sendData}
                                    fileUploadRef={fileUploadRef}
                                    handleUploadSuccess={handleUploadSuccess}
                                    id={id}
                                />
                            </QueryFeedback>
                        )}
                    />
                </GoogleReCaptchaProvider>
            </MainContentWrapper>
        </>
    )
}
export default DraftsListCreatePage
