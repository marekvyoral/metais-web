import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { RelationCard } from './RelationCard'

import { TextLinkExternal } from 'idsk-ui-kit/typography/TextLinkExternal'

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
        relations: 'ISVS modul patrí pod materský ISVS : Vytvorené',
        label: <TextLinkExternal title={'ISVS Matka'} href={'#'} textLink={'ISVS Matka'} />,
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
        relations: (
            <TextLinkExternal
                title={'ISVS modul patrí pod materský ISVS : Vytvorené'}
                href={'#'}
                textLink={'ISVS modul patrí pod materský ISVS : Vytvorené'}
            />
        ),
        label: <TextLinkExternal title={'ISVS Matka'} href={'#'} textLink={'ISVS Matka'} />,
    },
}

export const ErrorRelationCard: Story = {
    args: {
        status: 'Zneplatnené',
        codeMetaIS: 'as_97125',
        name: 'Administračné služby API',
        admin: 'Univerzita Pavla Jozefa Šafárika v Košiciach',
        relations: 'ISVS modul patrí pod materský ISVS : Vytvorené',
        label: <TextLinkExternal title={'ISVS Matka'} href={'#'} textLink={'ISVS Matka'} />,
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
        relations: (
            <TextLinkExternal
                title={'ISVS modul patrí pod materský ISVS : Vytvorené'}
                href={'#'}
                textLink={'ISVS modul patrí pod materský ISVS : Vytvorené'}
            />
        ),
        label: <TextLinkExternal title={'ISVS Matka'} href={'#'} textLink={'ISVS Matka'} />,
    },
}
