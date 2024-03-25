import React from 'react'
import { OptionProps } from 'react-select'
import { Control, Controller } from 'react-hook-form'
import { Option } from '@isdd/idsk-ui-kit/common/SelectCommon'

import { ATTRIBUTE_NAME, RefIdentifierTypeEnum } from '@isdd/metais-common/api'
import { CiFilterUi, ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { isConfigurationItemUi } from '@isdd/metais-common/utils/utils'
import { CiLazySelectCreatable, CreatableOptionType } from '@isdd/metais-common/components/ci-lazy-select-creatable/CiLazySelectCreatable'
import { C_STAV_REGISTRACIE, DRAFT } from '@isdd/metais-common/constants'
import { OPERATOR_OPTIONS } from '@isdd/metais-common/hooks/useFilter'

type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>
    label: string
    name: string
    error?: string
    disabled?: boolean
    info?: string
    hint?: string
}

export const AsyncUriSelect: React.FC<Props> = ({ control, label, name, error, disabled, info, hint }) => {
    const getUriAttributeName = (type: string): string => {
        switch (type) {
            case RefIdentifierTypeEnum.DatovyPrvok: {
                return ATTRIBUTE_NAME.Gen_Profil_ref_id
            }
            case RefIdentifierTypeEnum.URIDataset: {
                return ATTRIBUTE_NAME.Profil_URIDataset_uri_datasetu
            }
            case RefIdentifierTypeEnum.URIKatalog: {
                return ATTRIBUTE_NAME.Profil_URIKatalog_uri
            }
            case RefIdentifierTypeEnum.Individuum: {
                return ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri
            }
            default: {
                return ''
            }
        }
    }

    const renderCustomUriOption = (props: OptionProps<ConfigurationItemUi | CreatableOptionType>) => {
        if (isConfigurationItemUi(props.data)) {
            const { attributes, type } = props.data
            const renderURI = () => {
                return attributes?.[getUriAttributeName(type ?? '')]
            }
            return (
                <Option {...props}>
                    <div>{renderURI()}</div>
                    <span>
                        <small>{attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}</small>
                    </span>
                </Option>
            )
        } else {
            return (
                <Option {...props}>
                    <div>{props.data.label}</div>
                </Option>
            )
        }
    }

    const uriDefaultFilter: CiFilterUi = {
        attributes: [
            {
                name: ATTRIBUTE_NAME.Gen_Profil_RefID_stav_registracie,
                filterValue: [
                    {
                        value: C_STAV_REGISTRACIE.c_stav_registracie_2,
                        equality: OPERATOR_OPTIONS.EQUAL,
                    },
                ],
            },
        ],
        metaAttributes: {
            state: [DRAFT],
        },
    }

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                return (
                    <CiLazySelectCreatable
                        customOptionRender={(props) => renderCustomUriOption(props)}
                        label={label}
                        ciTypes={[
                            RefIdentifierTypeEnum.DatovyPrvok,
                            RefIdentifierTypeEnum.URIDataset,
                            RefIdentifierTypeEnum.URIKatalog,
                            RefIdentifierTypeEnum.Individuum,
                        ]}
                        additionalData={uriDefaultFilter}
                        {...field}
                        fieldValue={{ label: field.value, value: field.value }}
                        onChange={(val) => {
                            const firstValue = val[0]
                            if (firstValue) {
                                if (isConfigurationItemUi(firstValue)) {
                                    return field.onChange(firstValue?.attributes?.[getUriAttributeName(firstValue?.type ?? '')])
                                } else {
                                    return field.onChange(firstValue?.value)
                                }
                            } else {
                                field.onChange('')
                            }
                        }}
                        searchAttributeNames={[
                            ATTRIBUTE_NAME.Gen_Profil_ref_id,
                            ATTRIBUTE_NAME.Profil_URIDataset_uri_datasetu,
                            ATTRIBUTE_NAME.Profil_URIKatalog_uri,
                            ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri,
                        ]}
                        error={error}
                        disabled={disabled}
                        info={info}
                        hint={hint}
                    />
                )
            }}
        />
    )
}
