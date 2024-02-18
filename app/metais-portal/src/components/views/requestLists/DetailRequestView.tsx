import {
    BreadCrumbs,
    Button,
    ButtonGroupRow,
    ButtonLink,
    ButtonPopup,
    ExpandableRowCellWrapper,
    HomeIcon,
    InfoIconWithText,
    LoadingIndicator,
    PaginatorWrapper,
    Table,
    TextBody,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import { ActionsOverTable, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { ExpandedState, Row } from '@tanstack/react-table'
import { Actions, Subjects } from '@isdd/metais-common/hooks/permissions/useRequestPermissions'
import { Can, useAbilityContextWithFeedback } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { ApiCodelistItem } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS, META_IS_TITLE, RequestListState } from '@isdd/metais-common/constants'
import { Spacer } from '@isdd/metais-common/components/spacer/Spacer'
import headerStyles from '@isdd/metais-common/src/components/entity-header/ciEntityHeader.module.scss'

import { BasicInfoTabView } from '@/components/views/codeLists/components/tabs/BasicInfoTabView'
import { GestorTabView } from '@/components/views/codeLists/components/tabs/GestorTabView'
import { selectBasedOnLanguageAndDate } from '@/components/views/codeLists/CodeListDetailUtils'
import { ImportCodeListModal } from '@/components/views/codeLists/components/modals/ImportCodeListModal/ImportCodeListModal'
import { ExportCodeListModal } from '@/components/views/codeLists/components/modals/ExportCodeListModal/ExportCodeListModal'
import { ConfirmModal } from '@/components/views/requestLists/components/modalItem/ConfirmModal'
import { RequestDetailItemsTableExpandedRow } from '@/components/views/requestLists/components/RequestDetailItemsTableExpandedRow'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { DetailRequestViewProps, ApiRequestAction } from '@/components/containers/DetailRequestContainer'

export const DetailRequestView: React.FC<DetailRequestViewProps> = ({
    data,
    workingLanguage,
    isError,
    isLoading,
    isLoadingMutation,
    actionsErrorMessages,
    requestId,
    filter,
    onAccept,
    handleFilterChange,
}) => {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const {
        isActionSuccess: { value: isSuccess, additionalInfo },
    } = useActionSuccess()
    const { isLoading: isAbilityLoading, isError: isAbilityError } = useAbilityContextWithFeedback()

    const [confirmationModal, setConfirmationModal] = useState<{
        action?: ApiRequestAction
        isOpen: boolean
        title: string
        description: string
    }>({
        action: undefined,
        isOpen: false,
        title: '',
        description: '',
    })
    const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false)
    const [expanded, setExpanded] = useState<ExpandedState>({})

    const breadcrumbs = (
        <BreadCrumbs
            withWidthContainer
            links={[
                { label: t('codeList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                { label: t('codeList.breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                { label: t('codeList.breadcrumbs.codeLists'), href: RouteNames.HOW_TO_CODELIST },
                { label: t('codeList.breadcrumbs.requestList'), href: NavigationSubRoutes.REQUESTLIST },
                { label: data?.detail.code ?? '', href: `${NavigationSubRoutes.REQUESTLIST}/${data?.detail.code}` },
            ]}
        />
    )

    const requestRejectedMsg = useMemo(() => {
        return t('codeListDetail.feedback.requestRejected', {
            day: t('date', { date: data.detail.commentDate }),
            cause: data.detail.comment,
        })
    }, [data.detail.comment, data.detail.commentDate, t])

    const requestSentToKSISVSMsg = useMemo(() => {
        return t('codeListDetail.feedback.requestSentToKSISVS', {
            day: t('date', { date: data.detail.commentDate }),
        })
    }, [data.detail.commentDate, t])

    document.title = `${t('titles.codeListRequestsDetail')} ${data?.detail.code ?? ''} ${META_IS_TITLE}`

    if (!data?.detail.code && isError) {
        return (
            <>
                {breadcrumbs}
                <MainContentWrapper>
                    <QueryFeedback error={isError} loading={false} />
                </MainContentWrapper>
            </>
        )
    }

    return (
        <>
            {breadcrumbs}
            <Can I={Actions.SHOW} a={Subjects.DETAIL}>
                <MainContentWrapper>
                    {isSuccess && (
                        <MutationFeedback
                            success
                            error={false}
                            successMessage={t([additionalInfo?.messageKey ?? '', 'mutationFeedback.successfulUpdated'])}
                        />
                    )}
                    <QueryFeedback loading={isLoading || !!isAbilityLoading} error={isError || isAbilityError} withChildren>
                        {isLoadingMutation && <LoadingIndicator label={t('feedback.saving')} />}
                        <div className={headerStyles.headerDiv}>
                            <TextHeading size="XL">{t('codeListList.requestTitle')}</TextHeading>
                            <Can I={Actions.SEE_ACTIONS} a={Subjects.DETAIL}>
                                <ButtonGroupRow>
                                    <Can I={Actions.EDIT} a={Subjects.DETAIL}>
                                        <Button
                                            label={t('codeListList.buttons.EDIT')}
                                            onClick={() =>
                                                navigate(`${NavigationSubRoutes.REQUESTLIST}/${requestId}/edit`, { state: location.state })
                                            }
                                        />
                                    </Can>
                                    <ButtonPopup
                                        buttonLabel={t('codeListDetail.button.more')}
                                        popupPosition="right"
                                        popupContent={() => {
                                            return (
                                                <div className={headerStyles.buttonLinksDiv}>
                                                    <Can I={Actions.ACCEPT} a={Subjects.DETAIL}>
                                                        <ButtonLink
                                                            onClick={() => {
                                                                setConfirmationModal({
                                                                    action: ApiRequestAction.ACCEPT,
                                                                    isOpen: true,
                                                                    title: t('codeListList.requestModal.acceptTitle'),
                                                                    description: t('codeListList.requestModal.acceptDesc'),
                                                                })
                                                            }}
                                                            label={t('codeListList.buttons.ACCEPT')}
                                                        />
                                                    </Can>
                                                    <Can I={Actions.ACCEPT_SZZC} a={Subjects.DETAIL}>
                                                        <ButtonLink
                                                            onClick={() => {
                                                                setConfirmationModal({
                                                                    action: ApiRequestAction.ACCEPTSZZC,
                                                                    isOpen: true,
                                                                    title: t('codeListList.requestModal.acceptSzzcTitle'),
                                                                    description: t('codeListList.requestModal.acceptSzzcDesc'),
                                                                })
                                                            }}
                                                            label={t('codeListList.buttons.ACCEPT_SZZC')}
                                                        />
                                                    </Can>
                                                    <Can I={Actions.CANCEL_REQUEST} a={Subjects.DETAIL}>
                                                        <ButtonLink
                                                            onClick={() => {
                                                                setConfirmationModal({
                                                                    action: ApiRequestAction.CANCEL,
                                                                    isOpen: true,
                                                                    title: t('codeListList.requestModal.cancelReqTitle'),
                                                                    description: t('codeListList.requestModal.cancelReqDesc'),
                                                                })
                                                            }}
                                                            label={t('codeListList.buttons.CANCEL_REQUEST')}
                                                        />
                                                    </Can>
                                                    <Can I={Actions.REJECT} a={Subjects.DETAIL}>
                                                        <ButtonLink
                                                            onClick={() => {
                                                                setConfirmationModal({
                                                                    action: ApiRequestAction.REJECT,
                                                                    isOpen: true,
                                                                    title: t('codeListList.requestModal.rejectRequestTitle'),
                                                                    description: t('codeListList.requestModal.rejectRequestDesc'),
                                                                })
                                                            }}
                                                            label={t('codeListList.buttons.REJECT')}
                                                        />
                                                    </Can>
                                                    <Can I={Actions.MOVE_TO_KSISVS} a={Subjects.DETAIL}>
                                                        <ButtonLink
                                                            onClick={() => {
                                                                setConfirmationModal({
                                                                    action: ApiRequestAction.ACCEPTKSISVS,
                                                                    isOpen: true,
                                                                    title: t('codeListList.requestModal.acceptTitle'),
                                                                    description: t('codeListList.requestModal.acceptDesc'),
                                                                })
                                                            }}
                                                            label={t('codeListList.buttons.MOVE_TO_KSISVS')}
                                                        />
                                                    </Can>
                                                    <Can I={Actions.SEND} a={Subjects.DETAIL}>
                                                        <ButtonLink
                                                            onClick={() => {
                                                                setConfirmationModal({
                                                                    action: ApiRequestAction.SEND,
                                                                    isOpen: true,
                                                                    title: t('codeListList.requestModal.sendTitle'),
                                                                    description: t('codeListList.requestModal.sendDesc'),
                                                                })
                                                            }}
                                                            label={t('codeListList.buttons.SEND')}
                                                        />
                                                    </Can>
                                                    <ButtonLink onClick={() => setIsExportModalOpen(true)} label={t('codeListList.buttons.EXPORT')} />
                                                    <ButtonLink onClick={() => setIsImportModalOpen(true)} label={t('codeListList.buttons.IMPORT')} />
                                                </div>
                                            )
                                        }}
                                    />
                                </ButtonGroupRow>
                            </Can>
                        </div>
                        {actionsErrorMessages.map((errorMessage, index) => (
                            <MutationFeedback
                                success={false}
                                key={index}
                                showSupportEmail
                                error={t([errorMessage, 'feedback.mutationErrorMessage'])}
                            />
                        ))}
                        <BasicInfoTabView
                            codeList={data.detail}
                            attributeProfile={data.attributeProfile}
                            gestorList={data.gestors}
                            workingLanguage={workingLanguage}
                            showState
                        />
                        <Spacer vertical />
                        <TextHeading size="L">{t('codeListList.requestTitleContact')}</TextHeading>
                        <GestorTabView codeList={data.detail} attributeProfile={data.attributeProfile} />
                        <TextBody>
                            {data.detail.codelistState === RequestListState.REJECTED && (
                                <InfoIconWithText label={requestRejectedMsg}>{requestRejectedMsg}</InfoIconWithText>
                            )}
                            {data.detail.codelistState === RequestListState.ISVS_PROCESSING && (
                                <InfoIconWithText label={requestSentToKSISVSMsg}>{requestSentToKSISVSMsg}</InfoIconWithText>
                            )}
                        </TextBody>
                        <TextHeading size="L">{t('codeListList.requestCreate.codeListTableTitle')}</TextHeading>
                        <ActionsOverTable
                            pagination={{
                                pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
                                pageSize: filter.pageSize ?? BASE_PAGE_SIZE,
                                dataLength: data?.items.codelistsItemCount ?? 0,
                            }}
                            hiddenButtons={{ SELECT_COLUMNS: true }}
                            entityName=""
                            pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                            handleFilterChange={handleFilterChange}
                        />
                        <Table
                            data={data.items.codelistsItems}
                            expandedRowsState={expanded}
                            onExpandedChange={setExpanded}
                            columns={[
                                {
                                    header: t('codeListList.requestCreate.codeId'),
                                    accessorFn: (row) => row?.itemCode,
                                    id: 'code',
                                    size: 80,
                                    cell: ({ row, getValue }) => (
                                        <ExpandableRowCellWrapper row={row}>
                                            <span>{getValue() as string}</span>
                                        </ExpandableRowCellWrapper>
                                    ),
                                },
                                {
                                    header: t('codeListList.requestCreate.codeName'),
                                    accessorFn: (row) => selectBasedOnLanguageAndDate(row?.codelistItemNames, workingLanguage),
                                    id: 'name',
                                    cell: (ctx) => <span>{ctx.getValue() as string}</span>,
                                },
                            ]}
                            getExpandedRow={(row: Row<ApiCodelistItem>) => {
                                return (
                                    <RequestDetailItemsTableExpandedRow
                                        workingLanguage={workingLanguage}
                                        codelistItem={data.items.codelistsItems?.find((item) => item.itemCode === row.original.itemCode)}
                                        attributeProfile={data.attributeProfile}
                                    />
                                )
                            }}
                        />
                        <PaginatorWrapper
                            pageNumber={filter.pageNumber ?? BASE_PAGE_NUMBER}
                            pageSize={filter.pageSize ?? BASE_PAGE_SIZE}
                            dataLength={data?.items.codelistsItemCount ?? 0}
                            handlePageChange={handleFilterChange}
                        />
                        <ExportCodeListModal
                            code={data?.detail.code ?? ''}
                            isRequest
                            isOpen={isExportModalOpen}
                            onClose={() => setIsExportModalOpen(false)}
                        />
                        <ImportCodeListModal
                            code={data?.detail.code ?? ''}
                            id={Number(data?.detail.id)}
                            isRequest
                            isOpen={isImportModalOpen}
                            onClose={() => setIsImportModalOpen(false)}
                        />
                        <ConfirmModal
                            action={confirmationModal.action}
                            isOpen={confirmationModal.isOpen}
                            title={confirmationModal.title}
                            description={confirmationModal.description}
                            close={() => setConfirmationModal({ action: undefined, isOpen: false, title: '', description: '' })}
                            onSubmit={(action, note) => {
                                onAccept(action, note)
                                setConfirmationModal({ action: undefined, isOpen: false, title: '', description: '' })
                            }}
                        />
                    </QueryFeedback>
                </MainContentWrapper>
            </Can>
        </>
    )
}

export default DetailRequestView
