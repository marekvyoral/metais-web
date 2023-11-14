import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ClaimUi } from '@isdd/metais-common/api/generated/claim-manager-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { MutationFeedback } from '@isdd/metais-common/components/mutation-feedback/MutationFeedback'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'

import styles from './requestDetail.module.scss'
import { RequestRolesForm, RoleItem } from './RequestRolesForm'

import { IRequestRoleData } from '@/components/containers/ManagementList/RequestList/RequestDetailContainer'

interface IRequestDetailProps {
    request: ClaimUi | undefined
    roleData: IRequestRoleData
    isRegistration?: boolean
    successesMutation: boolean
    errorMessage: string
    root: AdminRouteNames
    handleAnonymizeClick?: (selectedRoles: RoleItem[], request?: ClaimUi) => void
    handleDeleteClick?: (request?: ClaimUi) => void
    handleApproveClick: (selectedRoles: RoleItem[], request?: ClaimUi) => void
    handleRefuseClick: () => void
}

export const RequestDetailView: React.FC<IRequestDetailProps> = ({
    request,
    roleData,
    handleApproveClick,
    successesMutation,
    errorMessage,
    handleRefuseClick,
    handleAnonymizeClick,
    handleDeleteClick,
    root,
    isRegistration,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [canApoprve, setCanApprove] = useState(false)
    const [selectedRoles, setSelectedRoles] = useState<RoleItem[]>([])
    const detailRows = [
        { label: t('managementList.firstName'), value: request?.identityFirstName },
        { label: t('managementList.lastName'), value: request?.identityLastName },
        { label: t('managementList.displayName'), value: request?.name },
        { label: t('managementList.email'), value: request?.email },
        { label: t('managementList.position'), value: request?.position },
        { label: t('managementList.phone'), value: request?.telephone },
        { label: t('managementList.mobile'), value: request?.mobile },
        { label: t('managementList.login'), value: request?.identityLogin },
    ]

    const detailRequestRows = [
        { label: t('requestList.poName'), value: request?.poName },
        { label: t('requestList.claimState'), value: request?.claimState },
        { label: t('requestList.description'), value: request?.description },
        { label: t('requestList.decisionReason'), value: request?.decisionReason },
    ]

    const handleCanApprove = (rows: Record<string, RoleItem>) => {
        const can = rows && Object.keys(rows).length > 0
        if (can) {
            setSelectedRoles(Object.values(rows))
        }

        setCanApprove(can)
    }

    return (
        <>
            {(successesMutation || errorMessage) && <MutationFeedback success={successesMutation} error={errorMessage} />}
            <div className={styles.basicInformationSpace}>
                <TextHeading size="M">{t('requestList.identityDetail')}</TextHeading>
                <DefinitionList>
                    {detailRows.map((item, index) => (
                        <InformationGridRow key={index} label={item.label} value={item.value} hideIcon />
                    ))}
                </DefinitionList>
            </div>
            <div className={styles.basicInformationSpace}>
                <TextHeading size="M">{t('requestList.requestDetail')}</TextHeading>
                <DefinitionList>
                    {detailRequestRows.map((item, index) => (
                        <InformationGridRow key={index} label={item.label} value={item.value} hideIcon />
                    ))}
                </DefinitionList>
            </div>
            <div className={styles.basicInformationSpace}>
                <div className={styles.formButtonsWrapper}>
                    {request?.claimState === 'WAITING' && (
                        <>
                            {handleAnonymizeClick && (
                                <Button
                                    className={styles.btnRightMargin}
                                    label={t('requestList.anonymizeBtn')}
                                    variant="secondary"
                                    onClick={() => handleAnonymizeClick(selectedRoles, request)}
                                />
                            )}
                            {handleDeleteClick && (
                                <Button
                                    className={styles.btnRightMargin}
                                    label={t('requestList.deleteBtn')}
                                    variant="secondary"
                                    onClick={() => handleDeleteClick(request)}
                                />
                            )}
                            {!handleAnonymizeClick && (
                                <Button
                                    className={styles.btnRightMargin}
                                    label={t('requestList.approve')}
                                    variant="secondary"
                                    disabled={!canApoprve}
                                    onClick={() => handleApproveClick(selectedRoles, request)}
                                />
                            )}
                            <Button
                                className={styles.cancelButton}
                                variant="secondary"
                                label={t('requestList.decline')}
                                type="reset"
                                onClick={handleRefuseClick}
                            />
                        </>
                    )}
                    <Button className={styles.backButton} label={t('requestList.backBtn')} variant="secondary" onClick={() => navigate(`${root}`)} />
                </div>
            </div>
            {request?.claimState === 'WAITING' && (
                <RequestRolesForm isRegistration={isRegistration} roleData={roleData} request={request} handleCanApprove={handleCanApprove} />
            )}
        </>
    )
}
