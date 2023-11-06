import {
    TextHeading,
    Tab,
    Tabs,
    BreadCrumbs,
    HomeIcon,
    IconWithText,
    InfoIcon,
    ButtonGroupRow,
    Button,
    ButtonPopup,
    ButtonLink,
    ConfirmationModal,
} from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ApiCodelistPreview } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { useState } from 'react'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, Subjects } from '@isdd/metais-common/hooks/permissions/useCodeListPermissions'

import { BasicInfoTabView } from './components/tabs/BasicInfoTabView'
import { GestorTabView } from './components/tabs/GestorTabView'
import { HistoryTabView } from './components/tabs/HistoryTabView'
import { selectBasedOnLanguageAndDate } from './CodeListDetailUtils'
import styles from './codeList.module.scss'
import { ExportCodeListModal } from './components/modals/ExportCodeListModal/ExportCodeListModal'
import { ImportCodeListModal } from './components/modals/ImportCodeListModal/ImportCodeListModal'
import { CodeListDetailItemsWrapper } from './CodeListDetailItemsWrapper'
import { NewLanguageVersionModal } from './components/modals/NewLanguageVersionModal/NewLanguageVersionModal'

import { CodeListDetailWrapperProps } from '@/components/containers/CodeListDetailContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CodeListDetailHistoryContainer } from '@/components/containers/CodeListDetailHistoryContainer'
import { CodeListDetailItemsContainer } from '@/components/containers/CodeListDetailItemsContainer'

const getAllWorkingLanguages = (codelist?: ApiCodelistPreview): string[] => {
    const languages = codelist?.codelistNames?.map((name) => name.language || '') ?? []
    return languages.filter((item, index) => languages.indexOf(item) === index)
}

export const CodeListDetailWrapper: React.FC<CodeListDetailWrapperProps> = ({
    data,
    isLoading,
    isError,
    isErrorMutation,
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
}) => {
    const { t } = useTranslation()

    const [isExportModalOpen, setIsExportModalOpen] = useState(false)
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)
    const [isNewLanguageVersionModalOpen, setIsNewLanguageVersionModalOpen] = useState(false)
    const [isMarkForPublishItemsModalOpen, setIsMarkForPublishItemsModalOpen] = useState(false)
    const [isSendToIsvsOpen, setIsSendToIsvsOpen] = useState(false)
    const [isPublishCodeListOpen, setIsPublishCodeListOpen] = useState(false)
    const [isReturnToMainGestorOpen, setIsReturnToMainGestorOpen] = useState(false)
    const [isSendToSzzcOpen, setIsSendToSzzcOpen] = useState(false)

    const code = data.codeList?.code ?? ''

    const tabs: Tab[] = [
        {
            id: 'basic-info',
            title: t('codeListDetail.title.tab.info'),
            content: <BasicInfoTabView data={data} workingLanguage={workingLanguage} />,
        },
        { id: 'gestor', title: t('codeListDetail.title.tab.gestor'), content: <GestorTabView data={data} /> },
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

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('codeList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('codeList.breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('codeList.breadcrumbs.codeLists'), href: RouteNames.CODELISTS },
                    { label: t('codeList.breadcrumbs.codeListsList'), href: NavigationSubRoutes.CISELNIKY },
                ]}
            />
            <MainContentWrapper>
                {isError && !code && <QueryFeedback error={isError} loading={false} />}

                <QueryFeedback loading={isLoading} error={false} withChildren>
                    <div className={styles.headerDiv}>
                        <TextHeading size="XL">{selectBasedOnLanguageAndDate(data.codeList?.codelistNames, workingLanguage)}</TextHeading>
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
                                                        language.toLocaleUpperCase() +
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
                                <Button
                                    label={t('codeListDetail.button.edit')}
                                    onClick={() => {
                                        return // add edit
                                    }}
                                />
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
                                        </div>
                                    )
                                }}
                            />
                        </ButtonGroupRow>
                    </div>

                    {isError && <QueryFeedback error={isError} loading={false} />}
                    <MutationFeedback
                        success={isSuccessMutation}
                        successMessage={successMessage}
                        error={isErrorMutation ? t('feedback.mutationErrorMessage') : undefined}
                    />
                    {data.codeList?.temporal && data.codeList.locked && (
                        <IconWithText icon={InfoIcon}>
                            {t('codeListDetail.warning.itemLocked', {
                                user: data.codeList.lockedBy,
                                date: t('date', { date: data.codeList.lockedFrom }),
                            })}
                        </IconWithText>
                    )}
                    {data.codeList?.temporal && !data.codeList.locked && (
                        <IconWithText icon={InfoIcon}>{t('codeListDetail.warning.workVersion')}</IconWithText>
                    )}
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
                        View={(props) => (
                            <CodeListDetailItemsWrapper
                                items={props.items}
                                filter={props.filter}
                                workingLanguage={props.workingLanguage}
                                attributeProfile={props.attributeProfile}
                                isLoading={props.isLoading}
                                isError={props.isError}
                                // errorItemAction={props.errorItemAction}
                                isLoadingEditItemSubmit={props.isLoadingEditItemSubmit}
                                isErrorEditItemSubmit={props.isErrorEditItemSubmit}
                                isSuccessEditItemSubmit={props.isSuccessEditItemSubmit}
                                isSuccessMutation={props.isSuccessMutation}
                                invalidateCodeListDetailCache={props.invalidateCodeListDetailCache}
                                handleFilterChange={props.handleFilterChange}
                                handleMarkForPublish={props.handleMarkForPublish}
                                handleSetDates={props.handleSetDates}
                                handleStartItemEdit={props.handleStartItemEdit}
                                handleSubmitItem={props.handleSubmitItem}
                            />
                        )}
                    />
                    <ExportCodeListModal code={code} isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
                    <ImportCodeListModal code={code} isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
                    <ConfirmationModal
                        isOpen={isMarkForPublishItemsModalOpen}
                        onClose={() => setIsMarkForPublishItemsModalOpen(false)}
                        onConfirm={() => {
                            handleAllItemsReadyToPublish()
                            setIsMarkForPublishItemsModalOpen(false)
                        }}
                        title={t('codeListDetail.modal.title.markForPublishAllItems')}
                        okButtonLabel={t('codeListDetail.modal.button.confirm')}
                    />
                    <ConfirmationModal
                        isOpen={isSendToIsvsOpen}
                        onClose={() => setIsSendToIsvsOpen(false)}
                        onConfirm={() => {
                            handleSendToIsvs()
                            setIsSendToIsvsOpen(false)
                        }}
                        title={t('codeListDetail.modal.title.sendToIsvs')}
                        okButtonLabel={t('codeListDetail.modal.button.confirm')}
                    />
                    <ConfirmationModal
                        isOpen={isPublishCodeListOpen}
                        onClose={() => setIsPublishCodeListOpen(false)}
                        onConfirm={() => {
                            handlePublishCodeList()
                            setIsPublishCodeListOpen(false)
                        }}
                        title={t('codeListDetail.modal.title.publishCodeList')}
                        okButtonLabel={t('codeListDetail.modal.button.confirm')}
                    />
                    <ConfirmationModal
                        isOpen={isReturnToMainGestorOpen}
                        onClose={() => setIsReturnToMainGestorOpen(false)}
                        onConfirm={() => {
                            handleReturnToMainGestor()
                            setIsReturnToMainGestorOpen(false)
                        }}
                        title={t('codeListDetail.modal.title.returnToMainGestor')}
                        okButtonLabel={t('codeListDetail.modal.button.confirm')}
                    />
                    <ConfirmationModal
                        isOpen={isSendToSzzcOpen}
                        onClose={() => setIsSendToSzzcOpen(false)}
                        onConfirm={() => {
                            handleSendToSzzc()
                            setIsSendToSzzcOpen(false)
                        }}
                        title={t('codeListDetail.modal.title.sendToSzzc')}
                        okButtonLabel={t('codeListDetail.modal.button.confirm')}
                    />
                    <NewLanguageVersionModal
                        code={code}
                        isOpen={isNewLanguageVersionModalOpen}
                        onClose={() => setIsNewLanguageVersionModalOpen(false)}
                    />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
