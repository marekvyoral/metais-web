import { GroupBase, MenuProps, MultiValue, OptionProps, OptionsOrGroups, components } from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import './selectLazyLoading.scss';

export interface LoadOptionsResponse<T> {
    options: T[];
    hasMore: boolean;
    additional: {
        page: number;
    };
}

interface ISelectProps<T> {
    value: T | MultiValue<T> | null;
    onChange: (val: T | MultiValue<T> | null) => void;
    label: string;
    name: string;
    optionValue: keyof T;
    optionLabel: keyof T;
    option?: (props: OptionProps<T>) => JSX.Element;
    placeHolder?: string;
    isMulti?: boolean;
    loadOptions: (
        searchQuery: string,
        prevOptions: OptionsOrGroups<T, GroupBase<T>>,
        additional: { page: number } | undefined,
    ) => Promise<LoadOptionsResponse<T>>;
}

const SelectLazyLoading = <T,>({
    value,
    onChange,
    label,
    name,
    optionValue,
    optionLabel,
    option,
    placeHolder,
    isMulti = false,
    loadOptions,
}: ISelectProps<T>) => {
    const Menu = (props: MenuProps<T, true, GroupBase<T>>) => {
        return (
            <components.Menu {...props} className="menu">
                {props.children}
            </components.Menu>
        );
    };

    const Option = (props: OptionProps<T>) => {
        return option ? option(props) : <components.Option {...props} className="select-option" />;
    };

    return (
        <div className="govuk-form-group">
            <label className="govuk-label">{label}</label>
            <AsyncPaginate
                value={value}
                loadOptions={loadOptions}
                onChange={onChange}
                getOptionValue={(option) => option[optionValue] as string}
                getOptionLabel={(option) => option[optionLabel] as string}
                placeholder={placeHolder || ''}
                components={{ Option, Menu }}
                isMulti={isMulti}
                className="govuk-select select-lazy-loading"
                name={name}
                id={name}
                unstyled
            />
        </div>
    );
};

export default SelectLazyLoading;
