import { TextBody } from '@isdd/idsk-ui-kit/index'
import { WizardState, Wizard } from '@isdd/metais-common/components/onboarding-wizard/Wizard'
import { WizardTypes, useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Step } from 'react-joyride'

export const CiRelationsWizard: React.FC = () => {
    const { currentPreferences } = useUserPreferences()
    const { t } = useTranslation()
    const steps: Step[] = useMemo(() => {
        {
            return [
                {
                    target: '#relWizardRef1',
                    content: (
                        <>
                            <TextBody>{t('wizard.relationContent.step1')}</TextBody>
                        </>
                    ),
                    title: t('wizard.relations'),
                    placement: 'top',
                    disableBeacon: true,
                },
                {
                    target: '#relWizardRef2',
                    content: (
                        <>
                            <TextBody>{t('wizard.relationContent.step2')}</TextBody>
                        </>
                    ),
                    title: t('wizard.relations'),
                },
                {
                    target: '#relWizardRef3',
                    content: (
                        <>
                            <TextBody>{t('wizard.relationContent.step3')}</TextBody>
                        </>
                    ),
                    title: t('wizard.relations'),
                },
            ]
        }
    }, [t])

    const [wizard, setWizard] = useState<WizardState>({
        run: false,
        steps: [],
    })

    useEffect(() => {
        if (currentPreferences[WizardTypes.RELATIONS]) {
            setWizard({ run: true, steps: steps })
        }
    }, [currentPreferences, steps])
    return (
        <>
            <Wizard state={wizard} setState={setWizard} type={WizardTypes.RELATIONS} />
        </>
    )
}
