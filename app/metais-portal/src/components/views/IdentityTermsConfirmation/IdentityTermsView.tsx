import { Button, CheckBox, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './identityTerms.module.scss'

import { Spacer } from '@/components/Spacer/Spacer'

export interface IIdentityTermsView {
    confirmIdentityTerms: () => Promise<void>
    isLoading: boolean
    isError: boolean
}

export const IdentityTermsView: React.FC<IIdentityTermsView> = ({ confirmIdentityTerms, isLoading, isError }) => {
    const { t } = useTranslation()
    const [agreementChecked, setAgreementChecked] = useState<boolean>(false)

    const handleConfirmButtonClick = () => {
        if (agreementChecked) {
            confirmIdentityTerms()
        }
    }

    return (
        <div className={styles.containerWrapper}>
            <QueryFeedback loading={isLoading} error={isError} indicatorProps={{ layer: 'parent', transparentMask: false }} withChildren>
                <TextHeading size="XL">{t('LicenseAgreement.Detail.Title')}</TextHeading>
                <TextBody>{t('LicenseAgreement.Detail.TitleText')}</TextBody>
                <TextHeading size="L">{t('LicenseAgreement.Detail.Usage')}</TextHeading>
                <TextBody>{t('LicenseAgreement.Detail.UsageText')}</TextBody>
                <TextHeading size="L">{t('LicenseAgreement.Detail.Range')}</TextHeading>

                <TextBody>{t('LicenseAgreement.Detail.RangeText')}</TextBody>
                <ul>
                    <TextBody>{t('LicenseAgreement.Detail.MustNot.Title')}</TextBody>
                    <li>
                        <TextBody>{t('LicenseAgreement.Detail.MustNot.First')}</TextBody>
                    </li>
                    <li>
                        <TextBody>{t('LicenseAgreement.Detail.MustNot.Second')}</TextBody>
                    </li>
                    <li>
                        <TextBody>{t('LicenseAgreement.Detail.MustNot.Third')}</TextBody>
                    </li>
                    <TextBody>{t('LicenseAgreement.Detail.MustNot.Change')}</TextBody>
                </ul>

                <TextHeading size="L">{t('LicenseAgreement.Detail.Account')}</TextHeading>
                <TextBody>{t('LicenseAgreement.Detail.AccountText')}</TextBody>
                <TextHeading size="L">{t('LicenseAgreement.Detail.Protection')}</TextHeading>
                <TextBody>{t('LicenseAgreement.Detail.ProtectionText')}</TextBody>
                <ul>
                    <li>
                        <TextBody>{t('LicenseAgreement.Detail.ProcessInformation.Name')}</TextBody>
                    </li>

                    <li>
                        <TextBody>{t('LicenseAgreement.Detail.ProcessInformation.Surname')}</TextBody>
                    </li>

                    <li>
                        <TextBody>{t('LicenseAgreement.Detail.ProcessInformation.Email')}</TextBody>
                    </li>

                    <li>
                        <TextBody>{t('LicenseAgreement.Detail.ProcessInformation.Phone')}</TextBody>
                    </li>

                    <li>
                        <TextBody>{t('LicenseAgreement.Detail.ProcessInformation.PO')}</TextBody>
                    </li>
                </ul>
                <Spacer vertical />
                <div className={styles.flexContainer}>
                    <CheckBox
                        label={t('LicenseAgreement.Agree')}
                        id="IdentityTermsAgree"
                        name={'IdentityTermsAgree'}
                        checked={agreementChecked}
                        onChange={(event) => setAgreementChecked(event.target.checked)}
                        className={styles.marginAuto}
                    />
                </div>
                <Spacer vertical />
                <div className={styles.flexContainer}>
                    <Button type="submit" label={t('LicenseAgreement.Confirm')} disabled={!agreementChecked} onClick={handleConfirmButtonClick} />
                </div>
            </QueryFeedback>
        </div>
    )
}
