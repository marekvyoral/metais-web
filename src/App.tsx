import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { MultiValue, OptionProps, components } from 'react-select';
import './app.scss';
import HomeIcon from './assets/images/header-web/home.png';
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

    const selectLazyLoadingOption = (props: OptionProps<any>) => {
        return (
            <components.Option {...props} className="select-option">
                <div>{props.data.name}</div>
                <span>{props.data.region}</span>
            </components.Option>
        );
    };

    const getOptions = useMutation<OptionType[], unknown, { searchQuery: string; page: number }>(({ searchQuery, page }) =>
        fetch(`https://www.anapioficeandfire.com/api/houses?region=${searchQuery}&page=${page}&pageSize=10`).then((response) => response.json()),
    );

    // const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
    //     const page = searchQuery && !additional?.page ? 1 : (additional?.page || 0) + 1;
    //     const options = await getOptions.mutateAsync({ searchQuery, page });
    //     const response = await fetch(
    //       `https://www.anapioficeandfire.com/api/houses?region=${searchQuery}&page=${page}&pageSize=10`
    //     );
    //     const responseJSON = await response.json();

    //     return {
    //         options: responseJSON,
    //         hasMore: options?.length ? true : false,
    //         additional: {
    //             page: page,
    //         },
    //     };
    // };

    // const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
    //     const response = await fetch(`https://www.anapioficeandfire.com/api/houses?region=${searchQuery}&page=${additional?.page || 1}&pageSize=10`);
    //     const responseJSON = await response.json();
    //     console.log('responseJSON', responseJSON);
    //     return {
    //         options: responseJSON,
    //         hasMore: responseJSON.length >= 1,
    //         additional: {
    //             page: searchQuery && !additional?.page ? 2 : (additional?.page || 1) + 1,
    //         },
    //     };
    // };

    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = searchQuery && !additional?.page ? 1 : (additional?.page || 0) + 1;
        // const response = await fetch(`https://www.anapioficeandfire.com/api/houses?region=${searchQuery}&page=${page}&pageSize=10`);
        // const responseJSON = await response.json();

        const responseJSON = await getOptions.mutateAsync({ searchQuery, page });
        console.log('responseJSON', responseJSON);
        
        return {
            options: responseJSON,
            hasMore: responseJSON.length >= 1,
            additional: {
                page: page,
            },
        };
    };

    return (
        <>
            <Navbar />
            <div className="govuk-width-container" id="main-content">
                <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing">
                    <BreadCrumbs
                        links={[
                            { label: 'Home', href: '/', icon: HomeIcon },
                            { label: 'Second', href: '/second' },
                        ]}
                    />
                    <Table />
                    <div>
                        <form action="/" method="post">
                            <Input name="name" value={name} label="Meno použivateľa" onChange={(value) => setName(value)} />
                            <Input name="lastName" value={lastName} label="Priezvisko použivateľa" onChange={(value) => setLastName(value)} />
                            <RadioButton name="account" value="Hraško" label="Máte už vytvorený osobný účet?" />
                            <SelectLazyLoading<OptionType>
                                name="account"
                                label="Vyber krajiny"
                                onChange={setCountry}
                                value={country}
                                optionValue="name"
                                optionLabel="name"
                                option={(props) => selectLazyLoadingOption(props)}
                                loadOptions={(searchQuery, _, additional) => loadOptions(searchQuery, additional)}
                            />
                            <div style={{ textAlign: 'center' }}>
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
