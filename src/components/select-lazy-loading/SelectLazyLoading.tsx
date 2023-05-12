import React, { useState } from "react";
import {
  MenuProps,
  OptionProps,
  OptionsOrGroups,
  components,
} from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";
import "./selectLazyLoading.scss";

interface ISelectProps {
  label: string;
  name: string;
  onChange: (val: string | null) => void;
  value: string | null;
}

type OptionType = {
  value: number;
  name: string;
};

type test = {
  page: number;
};

const Select: React.FunctionComponent<ISelectProps> = ({ label, name }) => {
  const [value, onChange] = useState<OptionType | null>(null);
  console.log("value", value);

  const loadOptions = async (
    searchQuery: string,
    options: OptionsOrGroups<any, any>,
    additional: test | undefined
  ) => {
    console.log("options", options);
    console.log("page", additional?.page);
    console.log("searchQuery", searchQuery);

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

  const Option = (props: OptionProps<any>) => {
    return (
      <components.Option {...props} className="select-option">
        <div>{props.data.name}</div>
        <span>{props.data.region}</span>
      </components.Option>
    );
  };

  const Menu = (props: MenuProps<any | any, false, any>) => {
    return (
      <components.Menu {...props} className="menu">
        {props.children}
      </components.Menu>
    );
  };

  return (
    <div className="govuk-form-group">
      <label className="govuk-label">{label}</label>
      <AsyncPaginate
        value={value}
        loadOptions={loadOptions}
        onChange={onChange}
        getOptionValue={(option) => option.name}
        getOptionLabel={(option) => option.name}
        placeholder=""
        components={{ Option, Menu }}
        isMulti={false}
        className="govuk-select select-lazy-loading"
        unstyled
        name={name}
        id={name}
        onFocus={() => null}
      />
    </div>
  );
};

export default Select;
