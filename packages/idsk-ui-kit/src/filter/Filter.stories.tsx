import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { DynamicFilterAttributes } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'

import { Filter } from './Filter'

import { SearchInput } from '@isdd/idsk-ui-kit/searchInput/SearchInput'
import { Input } from '@/input/Input'

interface FilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    Gen_Profil_kod_metais?: string
}

const meta: Meta<typeof Filter> = {
    title: 'Components/Filter',
    component: Filter<FilterData>,
    decorators: [
        (StoryComponent) => (
            <BrowserRouter>
                <StoryComponent />
            </BrowserRouter>
        ),
    ],
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Filter>

export const Basic: Story = {
    args: {
        form: () => <div>Test</div>,
    },
}

export const Advanced: Story = {
    args: {
        heading: <SearchInput name="search" id="test" style={{ margin: 0, width: '100%' }} />,
        form: (register, control, filter, setValue) => (
            <div>
                <Input id="name" label={'Nazov'} placeholder={'Nazov'} {...register('Gen_Profil_nazov')} />
                <Input id="metais-code" label={'Metais Kod'} placeholder={'Metais Kod'} {...register('Gen_Profil_kod_metais')} />
                <DynamicFilterAttributes
                    setValue={setValue}
                    data={filter.attributeFilters}
                    availableAttributes={[{ name: 'Option1' }, { name: 'Option2' }]}
                />
            </div>
        ),
    },
}
