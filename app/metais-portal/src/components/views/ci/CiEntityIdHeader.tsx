import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { ButtonGroupRow, ButtonPopup, LoadingIndicator, TextHeading } from '@isdd/idsk-ui-kit'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { APPROVAL_PROCESS, ATTRIBUTE_NAME, PROJECT_STATE_ENUM, TYPE_OF_APPROVAL_PROCESS_DEFAULT } from '@isdd/metais-common/api/constants'
import { ApiError, ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useIsOwnerByGid } from '@isdd/metais-common/api/generated/iam-swagger'
import { useNextStates } from '@isdd/metais-common/api/generated/kris-swagger'
import { ENTITY_AS, ENTITY_KS, ENTITY_MIGRATION, ENTITY_PROJECT, RoleEnum } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { IBulkActionResult, useBulkAction } from '@isdd/metais-common/hooks/useBulkAction'
import { ChangeOwnerBulkModal, InvalidateBulkModal, MutationFeedback, ReInvalidateBulkModal } from '@isdd/metais-common/index'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from '@isdd/metais-common/components/entity-header/ciEntityHeader.module.scss'
import classNames from 'classnames'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'

interface Props {
    entityName: string
    entityId: string
    entityItemName: string
    entityData?: ConfigurationItemUi
    ciRoles: string[]
    isInvalidated: boolean
    refetchCi: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
    ) => Promise<QueryObserverResult<ConfigurationItemUi, ApiError>>
    isRelation?: boolean
    editButton: React.ReactNode
}

export const CiEntityIdHeader: React.FC<Props> = ({
    entityData,
    entityName,
    entityId,
    entityItemName,
    ciRoles,
    isInvalidated,
    refetchCi,
    isRelation,
    editButton,
}) => {
    const { t } = useTranslation()

    const {
        state: { token, user },
    } = useAuth()

    const isLoggedIn = !!user?.uuid

    const { data: isOwnerByGid } = useIsOwnerByGid(
        {
            gids: [entityData?.metaAttributes?.owner ?? ''],
            login: user?.login,
        },
        { query: { enabled: entityData && token !== null && isLoggedIn } },
    )
    const isOwnerOfCi = isOwnerByGid?.isOwner?.[0]?.owner
    const typeOfApprovalProcess = entityData?.attributes?.[ATTRIBUTE_NAME.EA_Profil_Projekt_schvalovaci_proces] ?? TYPE_OF_APPROVAL_PROCESS_DEFAULT

    const projectStatus = entityData?.attributes?.[ATTRIBUTE_NAME.EA_Profil_Projekt_status]

    const userHasRoleByName = (role: string) => {
        return user?.roles.includes(role)
    }

    const { data: nexStates } = useNextStates(projectStatus, {
        query: { enabled: entityName === ENTITY_PROJECT },
    })

    const { handleReInvalidate, handleInvalidate, errorMessage, isBulkLoading, handleConfirmProject, handleProjectReturn } = useBulkAction(isRelation)
    const [showInvalidate, setShowInvalidate] = useState<boolean>(false)
    const [showReInvalidate, setShowReInvalidate] = useState<boolean>(false)
    const [showChangeOwner, setShowChangeOwner] = useState<boolean>(false)
    const [bulkActionResult, setBulkActionResult] = useState<IBulkActionResult>()

    const handleBulkAction = (actionResult: IBulkActionResult) => {
        setBulkActionResult(actionResult)
        refetchCi()
    }

    const handleCloseBulkModal = (actionResult: IBulkActionResult, closeFunction: (value: React.SetStateAction<boolean>) => void) => {
        closeFunction(false)
        handleBulkAction(actionResult)
    }

    const entityListData = entityData ? [entityData] : []

    const isMigration = entityName === ENTITY_MIGRATION
    const migrationState = useMemo(() => {
        let currentState = null
        if (isMigration) {
            currentState = entityData?.attributes?.[ATTRIBUTE_NAME.IKT_Profil_Schvalenie_stav_migracie]
        }

        return currentState
    }, [entityData, isMigration])

    const canProjectReturn =
        entityName === ENTITY_PROJECT &&
        !(!entityData || entityData?.metaAttributes?.state === 'INVALIDATED') &&
        userHasRoleByName(RoleEnum.PROJEKT_SCHVALOVATEL)

    const canProjectConfirm = entityName === ENTITY_PROJECT && !(!entityData || entityData?.metaAttributes?.state === 'INVALIDATED' || !isOwnerOfCi)

    const canSendForApproval = isMigration && (migrationState === 'c_stav_mig.1' || migrationState == 'c_stav_mig.3')
    const canMigrationAction = isMigration && migrationState == 'c_stav_mig.2'

    const canClone = entityName === ENTITY_KS || entityItemName === ENTITY_AS
    const cloneButtonLabel = entityName === ENTITY_KS ? t('ciType.cloneKS') : entityName === ENTITY_AS ? t('ciType.cloneAS') : ''

    const shouldBeRealization = typeOfApprovalProcess === APPROVAL_PROCESS.WITHOUT_APPROVAL && projectStatus === PROJECT_STATE_ENUM.c_stav_projektu_3

    return (
        <>
            {(bulkActionResult?.isError || bulkActionResult?.isSuccess) && (
                <MutationFeedback
                    success={bulkActionResult?.isSuccess}
                    successMessage={bulkActionResult?.successMessage}
                    error={bulkActionResult?.isError ? t('feedback.mutationErrorMessage') : ''}
                />
            )}
            <div className={styles.headerDiv}>
                {isBulkLoading && <LoadingIndicator fullscreen />}
                <TextHeading size="XL" className={classNames({ [styles.invalidated]: isInvalidated })}>
                    {entityItemName}
                </TextHeading>
                <ButtonGroupRow>
                    <Can I={Actions.EDIT} a={`ci.${entityId}`}>
                        {editButton}
                    </Can>
                    <ButtonPopup
                        buttonClassName={styles.noWrap}
                        buttonLabel={t('ciType.moreButton')}
                        popupPosition="right"
                        popupContent={() => {
                            return (
                                <div className={styles.buttonLinksDiv}>
                                    <Tooltip
                                        key={'invalidateItem'}
                                        descriptionElement={errorMessage}
                                        position={'top center'}
                                        on={'right-click'}
                                        tooltipContent={(open) => (
                                            <div>
                                                <ButtonLink
                                                    disabled={isInvalidated}
                                                    onClick={() => handleInvalidate(entityListData, () => setShowInvalidate(true), open)}
                                                    label={t('ciType.invalidateItem')}
                                                />
                                            </div>
                                        )}
                                    />

                                    <Tooltip
                                        key={'revalidateItem'}
                                        descriptionElement={errorMessage}
                                        position={'top center'}
                                        tooltipContent={(open) => (
                                            <div>
                                                <ButtonLink
                                                    onClick={() => handleReInvalidate(entityListData, () => setShowReInvalidate(true), open)}
                                                    label={t('ciType.revalidateItem')}
                                                />
                                            </div>
                                        )}
                                    />

                                    <Can I={Actions.CHANGE_OWNER} a={`ci.${entityId}`}>
                                        <ButtonLink onClick={() => setShowChangeOwner(true)} label={t('ciType.changeOfOwner')} />
                                    </Can>
                                    {canSendForApproval && <ButtonLink label={t('ciType.sendForApproval')} />}

                                    {canMigrationAction && (
                                        <>
                                            <ButtonLink label={t('ciType.approve')} />
                                            <ButtonLink label={t('ciType.return')} />
                                            <ButtonLink label={t('ciType.reject')} />
                                        </>
                                    )}

                                    {/* <ButtonLink onClick={() => undefined} label={t('ciType.changeBDA')} /> */}

                                    {canClone && (
                                        <Tooltip
                                            key={'cloneCI'}
                                            descriptionElement={errorMessage}
                                            position={'top center'}
                                            tooltipContent={() => (
                                                <div>
                                                    <ButtonLink label={cloneButtonLabel} />
                                                </div>
                                            )}
                                        />
                                    )}
                                    {canProjectConfirm &&
                                        nexStates &&
                                        nexStates.map((state, index) => (
                                            <Tooltip
                                                key={index}
                                                descriptionElement={errorMessage}
                                                position={'top center'}
                                                tooltipContent={(open) => (
                                                    <div>
                                                        <ButtonLink
                                                            key={state}
                                                            onClick={() => handleConfirmProject(index, entityData, handleBulkAction, open)}
                                                            label={
                                                                shouldBeRealization
                                                                    ? t(`ciType.actions.next.${projectStatus}_${index}_REALIZATION`)
                                                                    : t(`ciType.actions.next.${projectStatus}_${index}`)
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            />
                                        ))}

                                    {canProjectReturn && (
                                        <ButtonLink
                                            onClick={() => handleProjectReturn(entityId, handleBulkAction)}
                                            label={t('ciType.actions.return.return')}
                                        />
                                    )}
                                </div>
                            )
                        }}
                    />
                </ButtonGroupRow>
                {isBulkLoading && <LoadingIndicator fullscreen />}

                <InvalidateBulkModal
                    items={entityListData}
                    open={showInvalidate}
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowInvalidate)}
                    onClose={() => setShowInvalidate(false)}
                    isRelation={isRelation}
                />
                <ReInvalidateBulkModal
                    items={entityListData}
                    open={showReInvalidate}
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowReInvalidate)}
                    onClose={() => setShowReInvalidate(false)}
                    isRelation={isRelation}
                />
                <ChangeOwnerBulkModal
                    items={entityListData}
                    open={showChangeOwner}
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowChangeOwner)}
                    onClose={() => setShowChangeOwner(false)}
                    ciRoles={ciRoles}
                    isRelation={isRelation}
                />
            </div>
        </>
    )
}
