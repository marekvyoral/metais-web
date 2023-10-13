import { BreadCrumbs, Filter, HomeIcon, Input, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { QueryFeedback } from '@isdd/metais-common/index'

import { CodeListDetailTable } from '@/components/codelists/codelistsTable/CodeListDetailTable'
import {
    CodelistDetailContainer,
    CodelistDetailFilterData,
    CodelistDetailFilterInputs,
} from '@/components/containers/Codelist/CodelistDetailContainer'
import { CodelistDetailFeedback } from '@/components/codelists/CodelistDetailFeedback'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const CodelistDetail: React.FC = () => {
    const { enumCode } = useParams()
    const { t } = useTranslation()
    const defaultFilterValues = {
        [CodelistDetailFilterInputs.CODE]: '',
        [CodelistDetailFilterInputs.VALUE]: '',
        [CodelistDetailFilterInputs.DESCRIPTION]: '',
        [CodelistDetailFilterInputs.ENG_DESCRIPTION]: '',
        [CodelistDetailFilterInputs.ENG_VALUE]: '',
    }
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('codelists.heading') ?? '', href: AdminRouteNames.CODELISTS },
                    { label: `${enumCode}` ?? '', href: AdminRouteNames.CODELISTS + `/${enumCode}` },
                ]}
            />
            <CodelistDetailContainer
                defaults={defaultFilterValues}
                enumCode={enumCode as string}
                View={({ filteredData, mutations, isError, isLoading, refetch }) => {
                    return (
                        <MainContentWrapper>
                            <TextHeading size="L">{enumCode}</TextHeading>
                            <TextHeading size="L">{t('codelists.heading')}</TextHeading>
                            <QueryFeedback loading={isError} error={isLoading} withChildren>
                                <CodelistDetailFeedback mutations={mutations} />
                                <Filter<CodelistDetailFilterData>
                                    defaultFilterValues={defaultFilterValues}
                                    form={({ register }) => (
                                        <div>
                                            <Input
                                                label={t('codelists.code')}
                                                id={CodelistDetailFilterInputs.CODE}
                                                {...register(CodelistDetailFilterInputs.CODE)}
                                            />
                                            <Input
                                                label={t('codelists.value')}
                                                id={CodelistDetailFilterInputs.VALUE}
                                                {...register(CodelistDetailFilterInputs.VALUE)}
                                            />
                                            <Input
                                                label={t('codelists.engValue')}
                                                id={CodelistDetailFilterInputs.ENG_VALUE}
                                                {...register(CodelistDetailFilterInputs.ENG_VALUE)}
                                            />
                                            <Input
                                                label={t('codelists.description')}
                                                id={CodelistDetailFilterInputs.DESCRIPTION}
                                                {...register(CodelistDetailFilterInputs.DESCRIPTION)}
                                            />
                                            <Input
                                                label={t('codelists.engDescription')}
                                                id={CodelistDetailFilterInputs.ENG_DESCRIPTION}
                                                {...register(CodelistDetailFilterInputs.ENG_DESCRIPTION)}
                                            />
                                        </div>
                                    )}
                                />

                                {filteredData.enumItems && (
                                    <CodeListDetailTable
                                        filteredData={filteredData}
                                        mutations={mutations}
                                        isLoading={isLoading}
                                        isError={isError}
                                        enumCode={enumCode as string}
                                        refetch={refetch}
                                    />
                                )}
                            </QueryFeedback>
                        </MainContentWrapper>
                    )
                }}
            />
        </>
    )
}

export default CodelistDetail
