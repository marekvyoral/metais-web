import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { useStateMachine } from '@isdd/metais-common/components/state-machine/hooks/useStateMachine'
import { useContext, useMemo } from 'react'

import { IRefRegisterView, RefRegisterViewItems } from '@/types/views'
import styles from '@/components/entities/accordion/basicInformationSection.module.scss'
import { RefRegisterStateMachine } from '@/pages/refregisters/[entityId]'

export const RefRegisterView = ({ data: { referenceRegisterData, renamedAttributes }, isLoading, isError }: IRefRegisterView) => {
    const { t } = useTranslation()
    const refRegisterStateContext = useContext(RefRegisterStateMachine)
    const stateMachine = useStateMachine({ stateContext: refRegisterStateContext })

    const getLabelOfRow = (refRegisterAttribute: string) => {
        const label = renamedAttributes?.find((val) => val?.technicalName === refRegisterAttribute)?.name
        if (!label) {
            return t(`refRegisters.detail.${refRegisterAttribute}`)
        }
        return label
    }

    const getTooltipOfRow = (refRegisterAttribute: string) => {
        return renamedAttributes?.find((val) => val?.technicalName === refRegisterAttribute)?.description ?? ''
    }

    const currentRefRegisterState = useMemo(() => stateMachine.getCurrentState(), [stateMachine])

    const removeEndingComma = (testedString: string): string => {
        const lastCommaIndex = testedString.lastIndexOf(', ')
        if (lastCommaIndex !== -1 && lastCommaIndex === testedString.length - 2) {
            return testedString.slice(0, lastCommaIndex)
        }

        return testedString
    }

    const getContactItems = (): string => {
        const contactFirstName = referenceRegisterData?.contactFirstName ? `${referenceRegisterData?.contactFirstName} ` : ''
        const contactLastName = referenceRegisterData?.contactLastName ? `${referenceRegisterData?.contactLastName}, ` : ''
        const contactPhone = referenceRegisterData?.contactPhone ? `${referenceRegisterData?.contactPhone}, ` : ''
        const contactEmail = referenceRegisterData?.contactEmail ? `${referenceRegisterData?.contactEmail}` : ''
        const result = contactFirstName + contactLastName + contactPhone + contactEmail

        return removeEndingComma(result)
    }

    const getContactRegistratorItems = (): string => {
        const contactFirstName = referenceRegisterData?.contactRegistratorFirstName ? `${referenceRegisterData?.contactRegistratorFirstName} ` : ''
        const contactLastName = referenceRegisterData?.contactRegistratorLastName ? `${referenceRegisterData?.contactRegistratorLastName}, ` : ''
        const contactPhone = referenceRegisterData?.contactRegistratorPhone ? `${referenceRegisterData?.contactRegistratorPhone}, ` : ''
        const contactEmail = referenceRegisterData?.contactRegistratorEmail ? `${referenceRegisterData?.contactRegistratorEmail}` : ''
        const result = contactFirstName + contactLastName + contactPhone + contactEmail

        return removeEndingComma(result)
    }

    return (
        <QueryFeedback loading={isLoading} error={isError} errorProps={{ errorMessage: t('feedback.failedFetch') }}>
            <div className={styles.attributeGridRowBox}>
                <InformationGridRow
                    key={RefRegisterViewItems.ISVS_NAME}
                    label={getLabelOfRow(RefRegisterViewItems.ISVS_NAME)}
                    value={referenceRegisterData?.isvsName}
                    tooltip={getTooltipOfRow(RefRegisterViewItems.ISVS_NAME)}
                />
                <InformationGridRow
                    key={RefRegisterViewItems.ISVS_CODE}
                    label={getLabelOfRow(RefRegisterViewItems.ISVS_CODE)}
                    value={referenceRegisterData?.isvsCode}
                    tooltip={getTooltipOfRow(RefRegisterViewItems.ISVS_CODE)}
                />
                <InformationGridRow
                    key={RefRegisterViewItems.ISVS_REF_ID}
                    label={getLabelOfRow(RefRegisterViewItems.ISVS_REF_ID)}
                    value={referenceRegisterData?.isvsRefId}
                    tooltip={getTooltipOfRow(RefRegisterViewItems.ISVS_REF_ID)}
                />
                <InformationGridRow
                    key={RefRegisterViewItems.EFFECTIVE_FROM}
                    label={getLabelOfRow(RefRegisterViewItems.EFFECTIVE_FROM)}
                    value={referenceRegisterData?.effectiveFrom ? t('date', { date: referenceRegisterData?.effectiveFrom }) : null}
                    tooltip={getTooltipOfRow(RefRegisterViewItems.EFFECTIVE_FROM)}
                />
                <InformationGridRow
                    key={RefRegisterViewItems.EFFECTIVE_TO}
                    label={getLabelOfRow(RefRegisterViewItems.EFFECTIVE_TO)}
                    value={referenceRegisterData?.effectiveTo ? t('date', { date: referenceRegisterData?.effectiveTo }) : null}
                    tooltip={getTooltipOfRow(RefRegisterViewItems.EFFECTIVE_TO)}
                />
                <InformationGridRow
                    key={RefRegisterViewItems.MANAGER_NAME}
                    label={getLabelOfRow(RefRegisterViewItems.MANAGER_NAME)}
                    value={referenceRegisterData?.managerName}
                    tooltip={getTooltipOfRow(RefRegisterViewItems.MANAGER_NAME)}
                />
                <InformationGridRow
                    key={RefRegisterViewItems.CONTACT}
                    label={getLabelOfRow(RefRegisterViewItems.CONTACT)}
                    value={getContactItems()}
                    tooltip={getTooltipOfRow(RefRegisterViewItems.CONTACT)}
                />
                <InformationGridRow
                    key={RefRegisterViewItems.REGISTRATOR_NAME}
                    label={getLabelOfRow(RefRegisterViewItems.REGISTRATOR_NAME)}
                    value={referenceRegisterData?.registratorName}
                    tooltip={getTooltipOfRow(RefRegisterViewItems.REGISTRATOR_NAME)}
                />
                <InformationGridRow
                    key={RefRegisterViewItems.CONTACT_REGISTRATOR}
                    label={getLabelOfRow(RefRegisterViewItems.CONTACT_REGISTRATOR)}
                    value={getContactRegistratorItems()}
                    tooltip={getTooltipOfRow(RefRegisterViewItems.CONTACT_REGISTRATOR)}
                />
                <InformationGridRow
                    key={RefRegisterViewItems.ADDITIONAL_DATA}
                    label={getLabelOfRow(RefRegisterViewItems.ADDITIONAL_DATA)}
                    value={referenceRegisterData?.additionalData}
                    tooltip={getTooltipOfRow(RefRegisterViewItems.ADDITIONAL_DATA)}
                />
                <InformationGridRow
                    key={RefRegisterViewItems.STATE}
                    label={getLabelOfRow(RefRegisterViewItems.STATE)}
                    value={t(`refRegisters.table.state.${currentRefRegisterState}`)}
                    tooltip={getTooltipOfRow(RefRegisterViewItems.STATE)}
                />
            </div>
        </QueryFeedback>
    )
}
