import React, { useState } from "react";
import {
  MultiValue,
  OptionProps,
  components
} from "react-select";
import "./app.scss";
import Footer from "./components/Footer";
import Input from "./components/Input";
import Navbar from "./components/Navbar";
import RadioButton from "./components/RadioButton";
import Table from "./components/Table";
import SelectLazyLoading from "./components/select-lazy-loading/SelectLazyLoading";

type OptionType = {
  region: number;
  name: string;
};

const App: React.FC = () => {
  const [name, setName] = useState<string>("Janko");
  const [lastName, setLastName] = useState<string>("Hraško");
  const [country, setCountry] = useState<
    OptionType | MultiValue<OptionType> | null
  >(null);

  const selectLazyLoadingOption = (props: OptionProps<any>) => {
    return (
      <components.Option {...props} className="select-option">
        <div>{props.data.name}</div>
        <span>{props.data.region}</span>
      </components.Option>
    );
  };

  const loadOptions = async (
    searchQuery: string,
    additional: { page: number } | undefined
  ) => {
    const response = await fetch(
      `https://www.anapioficeandfire.com/api/houses?region=${searchQuery}&page=${
        additional?.page || 1
      }&pageSize=10`
    );
    const responseJSON = await response.json();

    return {
      options: responseJSON,
      hasMore: responseJSON.length >= 1,
      additional: {
        page:
          searchQuery && !additional?.page ? 2 : (additional?.page || 1) + 1,
      },
    };
  };

  return (
    <>
      <Navbar />
      <div className="govuk-width-container" id="main-content">
        <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing">
          <Table />
          <div>
            <form action="/" method="post">
              <Input
                name="name"
                value={name}
                label="Meno použivateľa"
                onChange={(value) => setName(value)}
              />
              <Input
                name="lastName"
                value={lastName}
                label="Priezvisko použivateľa"
                onChange={(value) => setLastName(value)}
              />
              <RadioButton
                name="account"
                value="Hraško"
                label="Máte už vytvorený osobný účet?"
              />
              <SelectLazyLoading<OptionType>
                name="account"
                label="Vyber krajiny"
                onChange={setCountry}
                value={country}
                optionValue="name"
                optionLabel="name"
                option={(props) => selectLazyLoadingOption(props)}
                loadOptions={(searchQuery, _, additional) =>
                  loadOptions(searchQuery, additional)
                }
              />
              <div style={{ textAlign: "center" }}>
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
