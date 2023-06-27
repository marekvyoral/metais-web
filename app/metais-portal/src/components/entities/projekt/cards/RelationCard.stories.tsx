import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { TextLinkExternal } from '@isdd/idsk-ui-kit/typography/TextLinkExternal'

import { RelationCard } from './RelationCard'

const meta: Meta<typeof RelationCard> = {
    title: 'Components/metais/entity/Card/RelationCard',
    component: RelationCard,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RelationCard>

export const DefaultRelationCard: Story = {
    args: {
        status: 'Vytvorené',
        codeMetaIS: 'as_97125',
        name: 'Administračné služby API',
        admin: 'Univerzita Pavla Jozefa Šafárika v Košiciach',
        relations: [
            { title: 'ISVS modul patrí pod materský ISVS : Vytvorené', href: '#' },
            { title: 'ISVS modul patrí pod materský ISVS : Vytvorené', href: '#' },
        ],
        label: 'ISVS Matka',
        labelHref: '#',
    },
}

export const RelationCardWithLinks: Story = {
    args: {
        status: 'Vytvorené',
        codeMetaIS: 'as_97125',
        name: 'Administračné služby API',
        admin: (
            <TextLinkExternal
                title={'Univerzita Pavla Jozefa Šafárika v Košiciach'}
                href={'#'}
                textLink={'Univerzita Pavla Jozefa Šafárika v Košiciach'}
            />
        ),
        relations: [
            { title: 'ISVS modul patrí pod materský ISVS : Vytvorené', href: '#' },
            { title: 'ISVS modul patrí pod materský ISVS : Vytvorené', href: '#' },
        ],
        label: 'ISVS Matka',
        labelHref: '#',
    },
}

export const ErrorRelationCard: Story = {
    args: {
        status: 'Zneplatnené',
        codeMetaIS: 'as_97125',
        name: 'Administračné služby API',
        admin: 'Univerzita Pavla Jozefa Šafárika v Košiciach',
        relations: [
            { title: 'ISVS modul patrí pod materský ISVS : Vytvorené', href: '#' },
            { title: 'ISVS modul patrí pod materský ISVS : Vytvorené', href: '#' },
        ],
        label: 'ISVS Matka',
        labelHref: '#',
    },
}

export const ErrorRelationCardWithLinks: Story = {
    args: {
        status: 'Zneplatnené',
        codeMetaIS: 'as_97125',
        name: 'Administračné služby API',
        admin: (
            <TextLinkExternal
                title={'Univerzita Pavla Jozefa Šafárika v Košiciach'}
                href={'#'}
                textLink={'Univerzita Pavla Jozefa Šafárika v Košiciach'}
            />
        ),
        relations: [
            { title: 'ISVS modul patrí pod materský ISVS : Vytvorené', href: '#' },
            { title: 'ISVS modul patrí pod materský ISVS : Vytvorené', href: '#' },
        ],
        label: 'ISVS Matka',
        labelHref: '#',
    },
}
