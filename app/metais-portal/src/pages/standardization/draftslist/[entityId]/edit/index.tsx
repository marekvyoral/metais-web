import React from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit'
import { QueryFeedback } from '@isdd/metais-common'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useParams } from 'react-router-dom'
import { formatTitleString } from '@isdd/metais-common/utils/utils'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { DraftsListEditForm } from '@/components/entities/draftslist/DraftsListEditForm'
import { DraftsListFormContainer } from '@/components/containers/draftslist/DraftsListFormContainer'
const DraftsListEditPage = () => {
    const { t } = useTranslation()
    const { entityId } = useParams()

    return (
        <DraftsListFormContainer
            entityId={entityId}
            View={({ data, handleUploadSuccess, fileUploadRef, onSubmit, isError, isLoading, onFileUploadFailed }) => {
                document.title = formatTitleString(data?.requestData?.name ?? '')
                return (
                    <>
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                                { label: t('breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                                { label: t('breadcrumbs.draftsList'), href: NavigationSubRoutes.ZOZNAM_NAVRHOV },
                                {
                                    label: data?.requestData?.name ?? t('breadcrumbs.noName'),
                                    href: `${NavigationSubRoutes.ZOZNAM_NAVRHOV}/${entityId}`,
                                },
                            ]}
                        />
                        <MainContentWrapper>
                            <QueryFeedback loading={isLoading} error={false} withChildren>
                                <DraftsListEditForm
                                    onFileUploadFailed={onFileUploadFailed}
                                    defaultData={data?.requestData}
                                    handleUploadSuccess={handleUploadSuccess}
                                    fileUploadRef={fileUploadRef}
                                    onSubmit={onSubmit}
                                    isError={isError}
                                    isLoading={isLoading}
                                />
                            </QueryFeedback>
                        </MainContentWrapper>
                    </>
                )
            }}
        />
    )
}
export default DraftsListEditPage
