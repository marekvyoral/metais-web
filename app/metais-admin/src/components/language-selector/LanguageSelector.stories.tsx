import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { I18nextProvider } from 'react-i18next'

import { i18nInstance } from '@/localization/i18next'
import { LanguageSelector } from '@/components/language-selector/LanguageSelector'

const meta: Meta<typeof LanguageSelector> = {
    title: 'Components/LanguageSelectorAdmin',
    component: LanguageSelector,
}

export default meta
type Story = StoryObj<typeof LanguageSelector>

export const Basic: Story = {
    decorators: [
        (StoryComponent) => (
            <I18nextProvider i18n={i18nInstance}>
                <header className="idsk-header-web " data-module="idsk-header-web">
                    <div className="idsk-header-web__scrolling-wrapper">
                        <div className="idsk-header-web__brand ">
                            <div className="govuk-width-container">
                                <div className="govuk-grid-row">
                                    <div className="govuk-grid-column-full">
                                        <div />
                                        <StoryComponent />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </I18nextProvider>
        ),
    ],
}
