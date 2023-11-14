import { useState } from 'react'
import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'

import { EkoListContainer } from '@/components/containers/Eko/EkoListContainer'
import { EkoTable } from '@/components/views/eko/eko-list-views/EkoTable'
import { TEkoCodeDecorated } from '@/components/views/eko/ekoCodes'
import { enrichEkoDataMaper } from '@/components/views/eko/ekoHelpers'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Eko = () => {
    const [rowSelection, setRowSelection] = useState<Record<string, TEkoCodeDecorated>>({})
    const { t } = useTranslation()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('navMenu.eko'), href: AdminRouteNames.EKO },
                ]}
            />
            <MainContentWrapper>
                <EkoListContainer
                    View={(props) => {
                        return (
                            <QueryFeedback loading={props.isLoading} error={false} withChildren>
                                <FlexColumnReverseWrapper>
                                    <TextHeading size="XL">{t('navMenu.eko')}</TextHeading>
                                    {props.isError && <QueryFeedback error loading={false} />}
                                </FlexColumnReverseWrapper>
                                <EkoTable
                                    data={enrichEkoDataMaper(props?.data?.ekoCodes || [])}
                                    entityName={'eko'}
                                    rowSelectionState={{ rowSelection, setRowSelection }}
                                    deleteCodes={props.deleteCodes}
                                    invalidateCodes={props.invalidateCodes}
                                    defaultFilterParams={props.defaultFilterParams}
                                    handleFilterChange={props.handleFilterChange}
                                />
                            </QueryFeedback>
                        )
                    }}
                />
            </MainContentWrapper>
        </>
    )
}

export default Eko
