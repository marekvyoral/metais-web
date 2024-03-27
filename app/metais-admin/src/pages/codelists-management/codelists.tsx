import { BreadCrumbs, Filter, HomeIcon, Input, TextHeading } from '@isdd/idsk-ui-kit/index'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, QueryFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { CodelistsFeedback } from '@/components/codelists/CodelistsFeedback'
import { CodelistsTable } from '@/components/codelists/codelistsTable/CodelistsTable'
import { CodelistContainer, CodelistFilterInputs } from '@/components/containers/Codelist/CodelistContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Codelists = () => {
    const { t } = useTranslation()
    const defaultFilterValues = {
        [CodelistFilterInputs.NAME]: '',
        [CodelistFilterInputs.VALUE]: '',
        [CodelistFilterInputs.VALUE_DESCRIPTION]: '',
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
        dataLength: 0,
    }
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('codelists.heading') ?? '', href: AdminRouteNames.CODELISTS },
                ]}
            />
            <CodelistContainer
                defaults={defaultFilterValues}
                View={({ filteredData, mutations, isError, isLoading, setSort, sort, handleFilterChange, filter }) => {
                    return (
                        <MainContentWrapper>
                            <QueryFeedback loading={isLoading} error={false} withChildren>
                                <CodelistsFeedback mutations={mutations} isFetchError={isError} />
                                <TextHeading size="L">{t('codelists.heading')}</TextHeading>
                                <Filter
                                    defaultFilterValues={defaultFilterValues}
                                    form={({ register }) => (
                                        <div>
                                            <Input
                                                label={t('codelists.name')}
                                                id={CodelistFilterInputs.NAME}
                                                {...register(CodelistFilterInputs.NAME)}
                                            />
                                            <Input
                                                label={t('codelists.value')}
                                                id={CodelistFilterInputs.VALUE}
                                                {...register(CodelistFilterInputs.VALUE)}
                                            />
                                            <Input
                                                label={t('codelists.valueDescription')}
                                                id={CodelistFilterInputs.VALUE_DESCRIPTION}
                                                {...register(CodelistFilterInputs.VALUE_DESCRIPTION)}
                                            />
                                        </div>
                                    )}
                                />
                                {filteredData.results && (
                                    <CodelistsTable
                                        filteredData={filteredData}
                                        mutations={mutations}
                                        isLoading={isLoading}
                                        isError={isError}
                                        setSort={setSort}
                                        sort={sort}
                                        handleFilterChange={handleFilterChange}
                                        filter={filter}
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

export default Codelists
