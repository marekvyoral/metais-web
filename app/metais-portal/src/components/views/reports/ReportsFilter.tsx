import { CheckBox, Input, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { Parameter, ParameterType } from '@isdd/metais-common/api/generated/report-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import React from 'react'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { FormProps } from '@isdd/idsk-ui-kit/filter/Filter'
import { SelectFilterCMDBParams } from '@isdd/metais-common/src/components/select-cmdb-params/SelectFilterCMDBParams'

import { loadEnumerateOptions, loadEnumsRepoOptions } from '@/componentHelpers'

interface IReportsFilterProps {
    parameters?: Parameter[]
    filterEnumData?: (EnumType | undefined)[]
    formProps: FormProps<
        IFilterParams & {
            [key: string]: string
        }
    >
}

export const ReportsFilter: React.FC<IReportsFilterProps> = ({ parameters, filterEnumData, formProps }) => {
    const { register, control, setValue, clearErrors, filter } = formProps

    return (
        <>
            {parameters?.map((parameter) => {
                if (parameter.type === ParameterType.ENUMS_CMDB)
                    return (
                        <div key={parameter.key}>
                            <SelectFilterCMDBParams
                                label={parameter.name ?? ''}
                                name={parameter.key ?? ''}
                                id={parameter.key}
                                key={parameter.key}
                                getOptionValue={(item) => item?.value}
                                getOptionLabel={(item) => item?.label}
                                setValue={setValue}
                                error={control._formState.errors?.[parameter.key ?? 0]?.message}
                                clearErrors={clearErrors}
                                type={parameter.metaData}
                                defaultValueKey={[filter?.[parameter.key ?? 0] ?? parameter.defaultValue]}
                            />
                        </div>
                    )
                if (parameter.type === ParameterType.ENUMS_REPO)
                    return (
                        <SimpleSelect
                            id={parameter?.key}
                            name={parameter?.key ?? ''}
                            label={parameter?.name ?? ''}
                            options={loadEnumsRepoOptions(filterEnumData ?? [], parameter?.metaData)}
                            defaultValue={filter?.[parameter?.key ?? 0] ?? parameter?.defaultValue}
                            error={control._formState.errors?.[parameter?.key ?? 0]?.message}
                            setValue={setValue}
                            clearErrors={clearErrors}
                        />
                    )
                if (parameter.type && (parameter?.type === ParameterType.NUMBER || parameter.type === ParameterType.STRING))
                    return (
                        <Input
                            label={parameter?.name}
                            defaultValue={parameter?.defaultValue}
                            {...register(parameter?.key ?? '')}
                            error={control._formState.errors?.[parameter?.key ?? 0]?.message}
                        />
                    )
                if (parameter.type === ParameterType.BOOLEAN)
                    return (
                        <div className="govuk-form-group">
                            <div className="govuk-checkboxes govuk-checkboxes--small">
                                <CheckBox
                                    label={parameter.name ?? ''}
                                    id={parameter?.key ?? ''}
                                    {...register(parameter?.key ?? '')}
                                    checked={parameter?.defaultValue === 'true'}
                                    error={control._formState.errors?.[parameter?.key ?? 0]?.message}
                                />
                            </div>
                        </div>
                    )
                if (parameter.type === ParameterType.ENUMERATE)
                    return (
                        <SimpleSelect
                            id={parameter?.key}
                            name={parameter?.key ?? ''}
                            label={parameter?.name ?? ''}
                            options={loadEnumerateOptions(parameter?.metaData)}
                            defaultValue={filter?.[parameter?.key ?? 0] ?? parameter?.defaultValue}
                            error={control._formState.errors?.[parameter?.key ?? 0]?.message}
                            setValue={setValue}
                            clearErrors={clearErrors}
                        />
                    )
            })}
        </>
    )
}
