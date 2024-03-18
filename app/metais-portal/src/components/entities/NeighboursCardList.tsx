import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { ButtonGroupRow, TextHeading } from '@isdd/idsk-ui-kit/index'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { MutationFeedback, QueryFeedback, formatRelationAttributes } from '@isdd/metais-common'
import { CiWithRelsResultUi, ReadCiNeighboursWithAllRelsParams } from '@isdd/metais-common/api/generated/cmdb-swagger'
import React, { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, useCreateCiAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { PageSizeSelect } from '@isdd/idsk-ui-kit/page-size-select/PageSizeSelect'
import classNames from 'classnames'
import { CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { CAN_NOT_MANAGE_CI } from '@isdd/metais-common/constants'

import { CardColumnList } from './cards/CardColumnList'
import { RelationCard } from './cards/RelationCard'
import styles from './styles.module.scss'

import { CiRelationsWizard } from '@/components/wizards/CiRelationsWizard'
import { IRelationsView } from '@/components/containers/RelationsListContainer'

interface NeighboursCardListProps {
    areTypesLoading: boolean
    isLoading: boolean
    isDerivedLoading: boolean
    isError: boolean
    data: IRelationsView['data']
    relationsList: CiWithRelsResultUi | undefined
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    setPageConfig: (value: React.SetStateAction<ReadCiNeighboursWithAllRelsParams>) => void
    setIsDerived: (value: React.SetStateAction<boolean>) => void
    ciTypeData: CiType | undefined
    hideButtons: boolean
    hidePageSizeSelect: boolean
}

export const NeighboursCardList: React.FC<NeighboursCardListProps> = ({
    areTypesLoading,
    isLoading,
    isDerivedLoading,
    isError,
    relationsList,
    data,
    pagination,
    handleFilterChange,
    setPageConfig,
    setIsDerived,
    ciTypeData,
    hideButtons,
    hidePageSizeSelect,
}) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const { owners, relationTypes } = data

    const { isActionSuccess } = useActionSuccess()

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    const ability = useAbilityContext()
    const canCreateRelation = ability?.can(Actions.CREATE, `ci.create.newRelation`)
    const ciAbility = useCreateCiAbility(ciTypeData)
    const canCreateCi = ciAbility.can(Actions.CREATE, 'ci')
    const tabsKey = data.keysToDisplay.map((key) => key.count).reduce((count1, count2) => count1 + count2, 0)

    useEffect(() => {
        scrollToMutationFeedback(true)
    }, [isActionSuccess.value, scrollToMutationFeedback])

    const [selectedTab, setSelectedTab] = useState({ id: data?.keysToDisplay?.[0]?.technicalName })
    const disabledCreateCI = useMemo(() => {
        return CAN_NOT_MANAGE_CI.includes(selectedTab.id)
    }, [selectedTab.id])

    return (
        <>
            <TextHeading size="L">{t('neighboursCardList.heading')}</TextHeading>
            <div ref={wrapperRef}>
                <MutationFeedback
                    success={isActionSuccess.value && isActionSuccess.additionalInfo?.type === 'relationCreated'}
                    successMessage={t('mutationFeedback.successfulRelationCreated')}
                />
            </div>
            <QueryFeedback loading={areTypesLoading} withChildren>
                {!areTypesLoading && (
                    <>
                        <CiRelationsWizard />
                        <Tabs
                            id="relWizardRef1"
                            key={tabsKey}
                            tabList={data.keysToDisplay.map((key) => ({
                                id: key?.technicalName,
                                title: key?.tabName,
                                meta: { isDerived: key.isDerived },
                                content: (
                                    <QueryFeedback
                                        loading={(isLoading && !key.isDerived) || (isDerivedLoading && key.isDerived)}
                                        error={isError}
                                        errorProps={{ errorMessage: t('feedback.failedFetch') }}
                                        withChildren
                                    >
                                        <div className={classNames([styles.tableActionsWrapper, (key.isDerived || hideButtons) && styles.flexEnd])}>
                                            {!key.isDerived && !hideButtons && (
                                                <ButtonGroupRow>
                                                    <Button
                                                        id="relWizardRef2"
                                                        className={'marginBottom0'}
                                                        label={t('neighboursCardList.buttonAddNewRelation')}
                                                        variant="secondary"
                                                        disabled={!canCreateRelation}
                                                        onClick={() => navigate(`new-relation/${key.technicalName}`, { state: { from: location } })}
                                                    />
                                                    <Button
                                                        id="relWizardRef3"
                                                        className={'marginBottom0'}
                                                        onClick={() => navigate(`new-ci/${key.technicalName}`, { state: { from: location } })}
                                                        label={t('neighboursCardList.buttonAddNewRelationCard')}
                                                        variant="secondary"
                                                        disabled={!canCreateRelation || !canCreateCi || disabledCreateCI}
                                                    />
                                                </ButtonGroupRow>
                                            )}
                                            {!hidePageSizeSelect && (
                                                <PageSizeSelect
                                                    className={styles.perPageSelectWrapper}
                                                    handlePagingSelect={(page) => {
                                                        setPageConfig((pageConfig) => {
                                                            return {
                                                                ...pageConfig,
                                                                perPage: Number(page),
                                                            }
                                                        })
                                                    }}
                                                />
                                            )}
                                        </div>

                                        <CardColumnList>
                                            {relationsList?.ciWithRels?.map((ciWithRel) => {
                                                const formatedCiWithRel = formatRelationAttributes({
                                                    ciWithRel,
                                                    relationTypes,
                                                    owners,
                                                    t,
                                                    lng: i18n,
                                                })
                                                return <RelationCard {...formatedCiWithRel} key={formatedCiWithRel?.codeMetaIS} />
                                            })}
                                        </CardColumnList>
                                        <PaginatorWrapper
                                            pageNumber={pagination.pageNumber}
                                            pageSize={pagination.pageSize}
                                            dataLength={pagination.dataLength}
                                            handlePageChange={handleFilterChange}
                                        />
                                    </QueryFeedback>
                                ),
                            }))}
                            onSelect={(selected) => {
                                setSelectedTab(selected)
                                setIsDerived(selected.meta?.isDerived ? true : false)
                                setPageConfig((pageConfig) => {
                                    if (!selected.meta?.isDerived) {
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        const { relTypes, ...rest } = pageConfig
                                        return { ...rest, ciTypes: [selected.id], page: 1 }
                                    } else {
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        const { ciTypes, ...rest } = pageConfig
                                        return { ...rest, relTypes: [selected.id], page: 1 }
                                    }
                                })
                            }}
                        />
                    </>
                )}
            </QueryFeedback>
        </>
    )
}
