import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { DynamicFilterAttributes } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { AttributeAttributeTypeEnum, AttributeProfileType } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { Filter } from '.'

import { SearchInput } from '@isdd/idsk-ui-kit/searchInput/SearchInput'
import { Input } from '@/input/Input'

interface FilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    Gen_Profil_kod_metais?: string
}

const attributes = [
    {
        id: 209,
        name: 'Názov informačného systému',
        description: 'Stručný, výstižný a jednoznačný názov konfiguračnej položky bez skratiek.',
        type: 'STRING',
        displayAs: '',
        units: '',
        defaultValue: '',
        technicalName: 'Gen_Profil_nazov',
        order: 1,
        valid: true,
        readOnly: false,
        mandatory: {
            type: 'critical',
            processIds: [],
        },
        invisible: false,
        constraints: [],
        attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
        engName: 'Name of information system',
        engDescription: 'Brief, clear and accurate name of configuration item without abbreviations.',
        array: false,
    },
]

const attributeProfiles = [
    {
        id: 97,
        name: 'EA profil ISVS',
        description: 'Špecifické informácie',
        technicalName: 'EA_Profil_ISVS',
        roleList: ['EA_GARPO', 'R_EGOV'],
        type: AttributeProfileType.application,
        valid: true,
        isGeneric: false,
        engDescription: 'Special information',
        attributes: [
            {
                id: 850,
                name: 'Doby odozvy v čase',
                description: 'Doby odozvy v čase',
                type: 'IMAGE',
                displayAs: '',
                units: '',
                defaultValue: '',
                technicalName: 'EA_Profil_ISVS_EA_Profil_ISVS_Grafana_Graph',
                order: 0,
                valid: true,
                readOnly: true,
                mandatory: {
                    type: 'none',
                    processIds: [],
                },
                invisible: false,
                constraints: [],
                attributeTypeEnum: AttributeAttributeTypeEnum.IMAGE,
                engName: 'Doby odozvy v čase',
                engDescription: 'Doby odozvy v čase',
                array: false,
            },
        ],
    },
]

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
        form: ({ register, filter, setValue }) => (
            <div>
                <Input id="name" label={'Nazov'} placeholder={'Nazov'} {...register('Gen_Profil_nazov')} />
                <Input id="metais-code" label={'Metais Kod'} placeholder={'Metais Kod'} {...register('Gen_Profil_kod_metais')} />
                <DynamicFilterAttributes
                    defaults={{
                        Gen_Profil_nazov: '',
                        Gen_Profil_kod_metais: '',
                    }}
                    setValue={setValue}
                    filterData={{ attributeFilters: filter.attributeFilters ?? {}, metaAttributeFilters: filter.metaAttributeFilters ?? {} }}
                    attributes={attributes}
                    attributeProfiles={attributeProfiles}
                    constraintsData={[]}
                />
            </div>
        ),
    },
}
