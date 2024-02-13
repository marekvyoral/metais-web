import {
    BreadCrumbs,
    Button,
    ButtonGroupRow,
    ButtonLink,
    ButtonPopup,
    ConfirmationModal,
    HomeIcon,
    TextWarning,
    LoadingIndicator,
    Tab,
    Tabs,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import { Can, useAbilityContextWithFeedback } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, Subjects } from '@isdd/metais-common/hooks/permissions/useCodeListPermissions'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'

import { CodeListDetailItemsWrapper } from './CodeListDetailItemsWrapper'
import { getAllWorkingLanguages, selectBasedOnLanguageAndDate } from './CodeListDetailUtils'
import styles from './codeList.module.scss'
import { ExportCodeListModal } from './components/modals/ExportCodeListModal/ExportCodeListModal'
import { ImportCodeListModal } from './components/modals/ImportCodeListModal/ImportCodeListModal'
import { NewLanguageVersionModal } from './components/modals/NewLanguageVersionModal/NewLanguageVersionModal'
import { BasicInfoTabView } from './components/tabs/BasicInfoTabView'
import { GestorTabView } from './components/tabs/GestorTabView'
import { HistoryTabView } from './components/tabs/HistoryTabView'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CodeListDetailWrapperProps } from '@/components/containers/CodeListDetailContainer'
import { CodeListDetailHistoryContainer } from '@/components/containers/CodeListDetailHistoryContainer'
import { CodeListDetailItemsContainer } from '@/components/containers/CodeListDetailItemsContainer'

export enum IsSuccessActions {
    IMPORT = 'import',
}

export const CodeListDetailWrapper: React.FC<CodeListDetailWrapperProps> = ({
    data,
    isLoading,
    isLoadingMutation,
    isError,
    actionsErrorMessages,
    isSuccessMutation,
    successMessage,
    workingLanguage,
    setWorkingLanguage,
    invalidateCodeListDetailCache,
    handleAllItemsReadyToPublish,
    handleSendToIsvs,
    handlePublishCodeList,
    handleReturnToMainGestor,
    handleSendToSzzc,
    handleDiscardChanges,
    handleRemoveLock,
    handleEdit,
}) => {
    const { t } = useTranslation()
    const { isLoading: isAbilityLoading, isError: isAbilityError } = useAbilityContextWithFeedback()

    const {
        isActionSuccess: { value: isSuccessEdit, additionalInfo: isSuccessAdditionalInfo },
    } = useActionSuccess()

    const [isExportModalOpen, setIsExportModalOpen] = useState(false)
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)
    const [isNewLanguageVersionModalOpen, setIsNewLanguageVersionModalOpen] = useState(false)
    const [isMarkForPublishItemsModalOpen, setIsMarkForPublishItemsModalOpen] = useState(false)
    const [isSendToIsvsOpen, setIsSendToIsvsOpen] = useState(false)
    const [isPublishCodeListOpen, setIsPublishCodeListOpen] = useState(false)
    const [isReturnToMainGestorOpen, setIsReturnToMainGestorOpen] = useState(false)
    const [isSendToSzzcOpen, setIsSendToSzzcOpen] = useState(false)
    const [isDiscardOpened, setIsDiscardOpen] = useState(false)
    const [isRemoveLockOpened, setIsRemoveLockOpened] = useState(false)
    const [isMutationSuccess, setIsMutationSuccess] = useState(false)

    const code = data.codeList?.code ?? ''
    const mainSuccessMessage = isSuccessAdditionalInfo?.action === IsSuccessActions.IMPORT ? t('codeListDetail.feedback.importDone') : successMessage

    const tabs: Tab[] = [
        {
            id: 'basic-info',
            title: t('codeListDetail.title.tab.info'),
            content: (
                <BasicInfoTabView
                    codeList={data.codeList ?? {}}
                    gestorList={data.gestors}
                    attributeProfile={data.attributeProfile ?? {}}
                    workingLanguage={workingLanguage}
                    showDateIntervals
                />
            ),
        },
        {
            id: 'gestor',
            title: t('codeListDetail.title.tab.gestor'),
            content: <GestorTabView codeList={data.codeList ?? {}} attributeProfile={data.attributeProfile ?? {}} />,
        },
    ]
    const tabsWithHistory: Tab[] = [
        ...tabs,
        {
            id: 'history',
            title: t('codeListDetail.title.tab.history'),
            content: (
                <CodeListDetailHistoryContainer
                    code={code}
                    View={(props) => (
                        <HistoryTabView
                            isError={props.isError}
                            isLoading={props.isLoading}
                            data={props.data}
                            filter={props.filter}
                            handleFilterChange={props.handleFilterChange}
                        />
                    )}
                />
            ),
        },
    ]

    const title = selectBasedOnLanguageAndDate(data.codeList?.codelistNames, workingLanguage) ?? ''
    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (isSuccessMutation || isSuccessEdit || actionsErrorMessages.length > 0) {
            scrollToMutationFeedback()
        }
    }, [actionsErrorMessages.length, isSuccessEdit, isSuccessMutation, scrollToMutationFeedback])

    const breadcrumbs = (
        <BreadCrumbs
            withWidthContainer
            links={[
                { label: t('codeList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                { label: t('codeList.breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                { label: t('codeList.breadcrumbs.codeLists'), href: RouteNames.HOW_TO_CODELIST },
                { label: t('codeList.breadcrumbs.codeListsList'), href: NavigationSubRoutes.CODELIST },
                { label: String(title), href: `${NavigationSubRoutes.CODELIST}/${data.codeList?.id}` },
            ]}
        />
    )

    if (isError && !code) {
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
            <MainContentWrapper>
                <MutationFeedback
                    success={isMutationSuccess}
                    successMessage={t('codeListDetail.feedback.translationCreated')}
                    error={undefined}
                    onMessageClose={() => setIsMutationSuccess(false)}
                />
                {isMutationSuccess && <TextWarning>{t('codeListDetail.feedback.translationWarning')}</TextWarning>}
                <QueryFeedback loading={isLoading || !!isAbilityLoading} error={false} withChildren>
                    {isLoadingMutation && <LoadingIndicator label={t('feedback.saving')} />}
                    <div className={styles.headerDiv}>
                        <TextHeading size="XL">{title}</TextHeading>
                        <ButtonGroupRow>
                            <ButtonPopup
                                buttonLabel={t('codeListDetail.button.language')}
                                popupPosition="left"
                                popupContent={() => {
                                    return (
                                        <div className={styles.buttonLinksDiv}>
                                            {getAllWorkingLanguages(data.codeListOriginal).map((language) => (
                                                <ButtonLink
                                                    key={language}
                                                    label={
                                                        t(`codeListDetail.languages.${language}`) +
                                                        (language === workingLanguage ? t('codeListDetail.selectedSuffix') : '')
                                                    }
                                                    onClick={() => {
                                                        setWorkingLanguage(language)
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )
                                }}
                            />
                            <Can I={Actions.EDIT} a={Subjects.DETAIL}>
                                <Button label={t('codeListDetail.button.edit')} onClick={handleEdit} />
                            </Can>
                            <ButtonPopup
                                buttonLabel={t('codeListDetail.button.more')}
                                popupPosition="right"
                                popupContent={() => {
                                    return (
                                        <div className={styles.buttonLinksDiv}>
                                            <Can I={Actions.EXPORT} a={Subjects.DETAIL}>
                                                <ButtonLink
                                                    key={'export'}
                                                    label={t('codeListDetail.button.exportCodelist')}
                                                    onClick={() => setIsExportModalOpen(true)}
                                                />
                                            </Can>
                                            <Can I={Actions.IMPORT} a={Subjects.DETAIL}>
                                                <ButtonLink
                                                    key={'import'}
                                                    label={t('codeListDetail.button.importCodelist')}
                                                    onClick={() => setIsImportModalOpen(true)}
                                                />
                                            </Can>
                                            <Can I={Actions.SEND_TO} a={Subjects.DETAIL} field="isvs">
                                                <ButtonLink
                                                    key={'sendToIsvs'}
                                                    label={t('codeListDetail.button.sendToIsvs')}
                                                    onClick={() => setIsSendToIsvsOpen(true)}
                                                />
                                            </Can>
                                            <Can I={Actions.PUBLISH} a={Subjects.DETAIL}>
                                                <ButtonLink
                                                    key={'publishCodelist'}
                                                    label={t('codeListDetail.button.publishCodelist')}
                                                    onClick={() => setIsPublishCodeListOpen(true)}
                                                />
                                            </Can>
                                            <Can I={Actions.PUBLISH} a={Subjects.ITEM} field="all">
                                                <ButtonLink
                                                    key={'publishCodelistItems'}
                                                    label={t('codeListDetail.button.publishCodelistItems')}
                                                    onClick={() => setIsMarkForPublishItemsModalOpen(true)}
                                                />
                                            </Can>
                                            <Can I={Actions.SEND_TO} a={Subjects.DETAIL} field="szzc">
                                                <ButtonLink
                                                    key={'sendToSzzc'}
                                                    label={t('codeListDetail.button.sendToSzzc')}
                                                    onClick={() => setIsSendToSzzcOpen(true)}
                                                />
                                            </Can>
                                            <Can I={Actions.SEND_TO} a={Subjects.DETAIL} field="mainGestor">
                                                <ButtonLink
                                                    key={'returnToMainGestor'}
                                                    label={t('codeListDetail.button.returnToMainGestor')}
                                                    onClick={() => setIsReturnToMainGestorOpen(true)}
                                                />
                                            </Can>
                                            <Can I={Actions.CREATE} a={Subjects.DETAIL} field="languageVersion">
                                                <ButtonLink
                                                    key={'addLanguage'}
                                                    label={t('codeListDetail.button.addLanguage')}
                                                    onClick={() => setIsNewLanguageVersionModalOpen(true)}
                                                />
                                            </Can>
                                            <Can I={Actions.UNLOCK} a={Subjects.DETAIL}>
                                                <ButtonLink
                                                    key={'removeLock'}
                                                    label={t('codeListDetail.button.removeLock')}
                                                    onClick={() => setIsRemoveLockOpened(true)}
                                                />
                                            </Can>
                                            <Can I={Actions.DISCARD} a={Subjects.DETAIL}>
                                                <ButtonLink
                                                    key={'discardUpdating'}
                                                    label={t('codeListDetail.button.discardUpdating')}
                                                    onClick={() => setIsDiscardOpen(true)}
                                                />
                                            </Can>
                                        </div>
                                    )
                                }}
                            />
                        </ButtonGroupRow>
                    </div>

                    <QueryFeedback error={isError || isAbilityError} loading={false} />
                    <div ref={wrapperRef}>
                        <MutationFeedback success={isSuccessMutation || isSuccessEdit} successMessage={mainSuccessMessage} error={null} />
                        {actionsErrorMessages.map((errorMessage, index) => (
                            <MutationFeedback
                                success={false}
                                key={index}
                                showSupportEmail
                                error={t([errorMessage, 'feedback.mutationErrorMessage'])}
                            />
                        ))}
                    </div>
                    {data.codeList?.temporal && data.codeList.locked && (
                        <TextWarning>
                            {t('codeListDetail.warning.itemLocked', {
                                user: data.codeList.lockedBy,
                                date: t('date', { date: data.codeList.lockedFrom }),
                            })}
                        </TextWarning>
                    )}
                    {data.codeList?.temporal && !data.codeList.locked && <TextWarning>{t('codeListDetail.warning.workVersion')}</TextWarning>}
                    <Can not I={Actions.READ} a={Subjects.DETAIL} field="history">
                        <Tabs tabList={tabs} />
                    </Can>
                    <Can I={Actions.READ} a={Subjects.DETAIL} field="history">
                        <Tabs tabList={tabsWithHistory} />
                    </Can>
                    <CodeListDetailItemsContainer
                        workingLanguage={workingLanguage}
                        code={code}
                        invalidateCodeListDetailCache={invalidateCodeListDetailCache}
                        View={(props) => <CodeListDetailItemsWrapper {...props} />}
                    />
                    <ExportCodeListModal code={code} isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
                    <ImportCodeListModal
                        code={code}
                        id={Number(data.codeList?.id)}
                        isOpen={isImportModalOpen}
                        onClose={() => setIsImportModalOpen(false)}
                    />
                    <ConfirmationModal
                        isOpen={isMarkForPublishItemsModalOpen}
                        onClose={() => setIsMarkForPublishItemsModalOpen(false)}
                        onConfirm={() => handleAllItemsReadyToPublish(() => setIsMarkForPublishItemsModalOpen(false))}
                        title={t('codeListDetail.modal.title.markForPublishAllItems')}
                        okButtonLabel={t('codeListDetail.modal.button.confirm')}
                    />
                    <ConfirmationModal
                        isOpen={isSendToIsvsOpen}
                        onClose={() => setIsSendToIsvsOpen(false)}
                        onConfirm={() => handleSendToIsvs(() => setIsSendToIsvsOpen(false))}
                        title={t('codeListDetail.modal.title.sendToIsvs')}
                        okButtonLabel={t('codeListDetail.modal.button.confirm')}
                    />
                    <ConfirmationModal
                        isOpen={isPublishCodeListOpen}
                        onClose={() => setIsPublishCodeListOpen(false)}
                        onConfirm={() => handlePublishCodeList(() => setIsPublishCodeListOpen(false))}
                        title={t('codeListDetail.modal.title.publishCodeList')}
                        okButtonLabel={t('codeListDetail.modal.button.confirm')}
                    />
                    <ConfirmationModal
                        isOpen={isReturnToMainGestorOpen}
                        onClose={() => setIsReturnToMainGestorOpen(false)}
                        onConfirm={() => {
                            handleReturnToMainGestor(() => setIsReturnToMainGestorOpen(false))
                        }}
                        title={t('codeListDetail.modal.title.returnToMainGestor')}
                        okButtonLabel={t('codeListDetail.modal.button.confirm')}
                    />
                    <ConfirmationModal
                        isOpen={isSendToSzzcOpen}
                        onClose={() => setIsSendToSzzcOpen(false)}
                        onConfirm={() => {
                            handleSendToSzzc(() => setIsSendToSzzcOpen(false))
                        }}
                        title={t('codeListDetail.modal.title.sendToSzzc')}
                        okButtonLabel={t('codeListDetail.modal.button.confirm')}
                    />
                    <ConfirmationModal
                        isOpen={isDiscardOpened}
                        onClose={() => setIsDiscardOpen(false)}
                        onConfirm={() => {
                            handleDiscardChanges(() => setIsDiscardOpen(false))
                        }}
                        title={t('codeListDetail.modal.title.discardUpdating')}
                        okButtonLabel={t('codeListDetail.modal.button.confirm')}
                    />
                    <ConfirmationModal
                        isOpen={isRemoveLockOpened}
                        onClose={() => setIsRemoveLockOpened(false)}
                        onConfirm={() => {
                            handleRemoveLock(() => setIsRemoveLockOpened(false))
                        }}
                        title={t('codeListDetail.modal.title.removeLock')}
                        okButtonLabel={t('codeListDetail.modal.button.confirm')}
                    />
                    <NewLanguageVersionModal
                        code={code}
                        isOpen={isNewLanguageVersionModalOpen}
                        onClose={() => setIsNewLanguageVersionModalOpen(false)}
                        onSuccess={() => {
                            setIsMutationSuccess(true)
                            setIsNewLanguageVersionModalOpen(false)
                            invalidateCodeListDetailCache()
                        }}
                    />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
