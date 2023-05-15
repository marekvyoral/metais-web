import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useMemo, useState } from 'react';
import { MultiValue, OptionProps, components } from 'react-select';
import './app.scss';
import Footer from './components/Footer';
import Input from './components/Input';
import Navbar from './components/Navbar';
import RadioButton from './components/RadioButton';
import Table from './components/Table';
import { BreadCrumbs } from './components/bread-crumbs/BreadCrumbs';
import SelectLazyLoading from './components/select-lazy-loading/SelectLazyLoading';

type OptionType = {
    url: string;
    name: string;
    region: string;
    coatOfArms: string;
    words: string;
    titles?: string[] | null;
    seats?: string[] | null;
    currentLord: string;
    heir: string;
    overlord: string;
    founded: string;
    founder: string;
    diedOut: string;
    ancestralWeapons?: string[] | null;
    cadetBranches?: null[] | null;
    swornMembers?: null[] | null;
};

const App: React.FC = () => {
    const [name, setName] = useState<string>('Janko');
    const [lastName, setLastName] = useState<string>('Hraško');
    const [country, setCountry] = useState<OptionType | MultiValue<OptionType> | null>(null);

    const selectLazyLoadingOption = (props: OptionProps<OptionType>) => {
        return (
            <components.Option {...props} className="select-option">
                <div>{props.data.name}</div>
                <span>
                    <small>{props.data.region}</small>
                </span>
            </components.Option>
        );
    };

    const getOptions = useMutation<OptionType[] | null, unknown, { searchQuery: string; page: number }>(({ searchQuery, page }) =>
        fetch(`https://www.anapioficeandfire.com/api/houses?region=${searchQuery}&page=${page}&pageSize=10`).then((response) => response.json()),
    );

    const loadOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined) => {
            const page = searchQuery && !additional?.page ? 1 : (additional?.page || 0) + 1;
            const options = await getOptions.mutateAsync({ searchQuery, page });

            return {
                options: options || [],
                hasMore: options?.length ? true : false,
                additional: {
                    page: page,
                },
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const lazyLoadingSelect = useMemo(
        () => (
            <SelectLazyLoading<OptionType>
                name="account"
                label="Vyber krajiny"
                onChange={setCountry}
                value={country}
                optionValue="name"
                optionLabel="name"
                option={(props) => selectLazyLoadingOption(props)}
                loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, additional)}
            />
        ),
        [country, loadOptions],
    );

    return (
        <>
            <Navbar />
            <div className="govuk-width-container" id="main-content">
                <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing">
                    <BreadCrumbs
                        links={[
                            { label: 'Home', href: '/', icon: "/assets/images/header-web/home.png" },
                            { label: 'Second', href: '/second' },
                        ]}
                    />
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
                </main>
            </div>
            <Footer />
        </>
    );
};

export default App;
