/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    BreadCrumbs,
    Button,
    ButtonGroupRow,
    ButtonLink,
    ButtonPopup,
    ExpandableRowCellWrapper,
    HomeIcon,
    LoadingIndicator,
    Table,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { ExpandedState, Row } from '@tanstack/react-table'
import { Actions, Subjects } from '@isdd/metais-common/hooks/permissions/useRequestPermissions'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { ApiCodelistItem } from '@isdd/metais-common/api/generated/codelist-repo-swagger'

import { BasicInfoTabView } from '@/components/views/codeLists/components/tabs/BasicInfoTabView'
import { GestorTabView } from '@/components/views/codeLists/components/tabs/GestorTabView'
import { selectBasedOnLanguageAndDate } from '@/components/views/codeLists/CodeListDetailUtils'
import { ImportCodeListModal } from '@/components/views/codeLists/components/modals/ImportCodeListModal/ImportCodeListModal'
import { ExportCodeListModal } from '@/components/views/codeLists/components/modals/ExportCodeListModal/ExportCodeListModal'
import { ConfirmModal } from '@/components/views/requestLists/components/modalItem/ConfirmModal'
import { RequestDetailItemsTableExpandedRow } from '@/components/views/requestLists/components/RequestDetailItemsTableExpandedRow'
import styles from '@/components/views/requestLists/requestView.module.scss'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { DetailRequestViewProps, ApiRequestAction } from '@/components/containers/DetailRequestContainer'

export const DetailRequestView: React.FC<DetailRequestViewProps> = ({
    data,
    isError,
    isLoading,
    isLoadingMutation,
    actionsErrorMessages,
    requestId,
    onAccept,
}) => {
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const userAbility = useAbilityContext()

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

    return (
        <>
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
            {userAbility.can(Actions.SHOW, Subjects.DETAIL) && (
                <MainContentWrapper>
                    <QueryFeedback loading={isLoading} error={isError} withChildren>
                        {isLoadingMutation && <LoadingIndicator label={t('feedback.saving')} />}
                        <div className={styles.headerDiv}>
                            <TextHeading size="XL">{t('codeListList.requestTitle')}</TextHeading>
                            <ButtonGroupRow>
                                {userAbility.can(Actions.EDIT, Subjects.DETAIL) && (
                                    <Button
                                        label={t('codeListList.buttons.EDIT')}
                                        onClick={() => navigate(`${NavigationSubRoutes.REQUESTLIST}/${requestId}/edit`, { state: location.state })}
                                    />
                                )}

                                <ButtonPopup
                                    buttonLabel={t('ciType.moreButton')}
                                    popupPosition="right"
                                    popupContent={() => {
                                        return (
                                            <div className={styles.buttonLinksDiv}>
                                                {userAbility.can(Actions.ACCEPT, Subjects.DETAIL) && (
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
                                                )}
                                                {userAbility.can(Actions.ACCEPT_SZZC, Subjects.DETAIL) && (
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
                                                )}
                                                {userAbility.can(Actions.CANCEL_REQUEST, Subjects.DETAIL) && (
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
                                                )}
                                                {userAbility.can(Actions.REJECT, Subjects.DETAIL) && (
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
                                                )}
                                                {userAbility.can(Actions.MOVE_TO_KSISVS, Subjects.DETAIL) && (
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
                                                )}
                                                {userAbility.can(Actions.SEND, Subjects.DETAIL) && (
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
                                                )}
                                                <ButtonLink onClick={() => setIsExportModalOpen(true)} label={t('codeListList.buttons.EXPORT')} />
                                                <ButtonLink onClick={() => setIsImportModalOpen(true)} label={t('codeListList.buttons.IMPORT')} />
                                            </div>
                                        )
                                    }}
                                />
                            </ButtonGroupRow>
                        </div>
                        {actionsErrorMessages.map((errorMessage, index) => (
                            <MutationFeedback success={false} key={index} error={t([errorMessage, 'feedback.mutationErrorMessage'])} />
                        ))}
                        <BasicInfoTabView
                            codeList={data.detail}
                            attributeProfile={data.attributeProfile}
                            gestorList={data.gestors}
                            workingLanguage={i18n.language}
                            showState
                        />

                        <TextHeading size="L">{t('codeListList.requestTitleContact')}</TextHeading>
                        <GestorTabView codeList={data.detail} attributeProfile={data.attributeProfile} />

                        <TextHeading size="L">{t('codeListList.requestCreate.codeListTableTitle')}</TextHeading>
                        <Table
                            data={data.items.codelistsItems}
                            expandedRowsState={expanded}
                            onExpandedChange={setExpanded}
                            columns={[
                                {
                                    header: t('codeListList.requestCreate.codeId'),
                                    accessorFn: (row) => row?.itemCode,
                                    id: 'code',
                                    cell: ({ row, getValue }) => (
                                        <ExpandableRowCellWrapper row={row}>
                                            <span>{getValue() as string}</span>
                                        </ExpandableRowCellWrapper>
                                    ),
                                },
                                {
                                    header: t('codeListList.requestCreate.codeName'),
                                    accessorFn: (row) => selectBasedOnLanguageAndDate(row?.codelistItemNames, i18n.language),
                                    id: 'name',
                                    cell: (ctx) => <span>{ctx.getValue() as string}</span>,
                                },
                            ]}
                            getExpandedRow={(row: Row<ApiCodelistItem>) => {
                                return (
                                    <RequestDetailItemsTableExpandedRow
                                        workingLanguage={i18n.language}
                                        codelistItem={data.items.codelistsItems?.find((item) => item.itemCode === row.original.itemCode)}
                                        attributeProfile={data.attributeProfile}
                                    />
                                )
                            }}
                        />
                        <ExportCodeListModal
                            code={data?.detail.code ?? ''}
                            isRequest
                            isOpen={isExportModalOpen}
                            onClose={() => setIsExportModalOpen(false)}
                        />
                        <ImportCodeListModal code={data?.detail.code ?? ''} isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
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
            )}
        </>
    )
}

export default DetailRequestView
