import { useMutation } from '@tanstack/react-query'
import React, { useCallback, useMemo, useState } from 'react'
import { MultiValue, OptionProps, components } from 'react-select'
import { Link } from 'react-router-dom'

import HomeIcon from '../assets/images/home.svg'
import { Input } from '../components/Input'
import { RadioButton } from '../components/RadioButton'
import { Table } from '../components/Table'
import { BreadCrumbs } from '../components/bread-crumbs/BreadCrumbs'
import { SelectLazyLoading } from '../components/select-lazy-loading/SelectLazyLoading'
import { RouteNames } from '../navigation/routeNames'

type OptionType = {
    url: string
    name: string
    region: string
    coatOfArms: string
    words: string
    titles?: string[] | null
    seats?: string[] | null
    currentLord: string
    heir: string
    overlord: string
    founded: string
    founder: string
    diedOut: string
    ancestralWeapons?: string[] | null
    cadetBranches?: null[] | null
    swornMembers?: null[] | null
}

export const Home: React.FC = () => {
    const [name, setName] = useState<string>('Janko')
    const [lastName, setLastName] = useState<string>('Hraško')
    const [country, setCountry] = useState<OptionType | MultiValue<OptionType> | null>(null)

    const selectLazyLoadingOption = (props: OptionProps<OptionType>) => {
        return (
            <components.Option {...props} className="select-option">
                <div>{props.data.name}</div>
                <span>
                    <small>{props.data.region}</small>
                </span>
            </components.Option>
        )
    }

    const getOptions = useMutation<OptionType[] | null, unknown, { searchQuery: string; page: number }>(({ searchQuery, page }) =>
        fetch(`https://www.anapioficeandfire.com/api/houses?region=${searchQuery}&page=${page}&pageSize=10`).then((response) => response.json()),
    )

    const loadOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined) => {
            const page = searchQuery && !additional?.page ? 1 : (additional?.page || 0) + 1
            const options = await getOptions.mutateAsync({ searchQuery, page })

            return {
                options: options || [],
                hasMore: options?.length ? true : false,
                additional: {
                    page: page,
                },
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    const lazyLoadingSelect = useMemo(
        () => (
            <SelectLazyLoading<OptionType>
                name="account"
                label="Vyber krajiny"
                onChange={setCountry}
                value={country}
                getOptionValue={(item) => item.name}
                getOptionLabel={(item) => item.name}
                option={(props) => selectLazyLoadingOption(props)}
                loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, additional)}
            />
        ),
        [country, loadOptions],
    )

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: 'Home', href: '/', icon: HomeIcon },
                    { label: 'Second', href: '/second' },
                ]}
            />
            <Link to={RouteNames.DEV_TEST_SCREEN}>Testovacia obrazovka</Link>
            <Table />
            <div>
                <form action="/" method="post">
                    <Input name="name" value={name} label="Meno použivateľa" onChange={(value) => setName(value)} />
                    <Input name="lastName" value={lastName} label="Priezvisko použivateľa" onChange={(value) => setLastName(value)} />
                    <RadioButton name="account" value="Hraško" label="Máte už vytvorený osobný účet?" />
                    {lazyLoadingSelect}
                    <div>
                        <button className="govuk-button">Odoslať formulár</button>
                    </div>
                </form>
            </div>
        </>
    )
}
