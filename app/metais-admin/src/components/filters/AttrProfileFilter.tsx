import { Filter } from '@isdd/idsk-ui-kit/filter'
import { Input, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useTranslation } from 'react-i18next'

export enum EgovFilterInputs {
    NAME = 'name',
    TECHNICAL_NAME = 'technicalName',
    TYPE = 'type',
    VALID = 'valid',
}
export interface EgovFilterData extends IFilterParams, IFilter {
    [EgovFilterInputs.NAME]: string
    [EgovFilterInputs.TECHNICAL_NAME]: string
    [EgovFilterInputs.TYPE]: string
    [EgovFilterInputs.VALID]: string
}

type Props = {
    defaultFilterValues: EgovFilterData
}

const AttrProfileFilter = ({ defaultFilterValues }: Props) => {
    const { t } = useTranslation()

    return (
        <Filter<EgovFilterData>
            defaultFilterValues={defaultFilterValues}
            form={({ register, filter, setValue }) => (
                <div>
                    <Input label={t('table.name')} id={EgovFilterInputs.NAME} {...register(EgovFilterInputs.NAME)} />
                    <Input label={t('table.technicalName')} id={EgovFilterInputs.TECHNICAL_NAME} {...register(EgovFilterInputs.TECHNICAL_NAME)} />
                    <SimpleSelect
                        id="type"
                        label={t('tooltips.create.type')}
                        options={[
                            { value: 'application', label: t('tooltips.type.application') },
                            { value: 'system', label: t('tooltips.type.system') },
                            { value: 'custom', label: t('tooltips.type.custom') },
                        ]}
                        setValue={setValue}
                        defaultValue={filter.type || defaultFilterValues.type}
                        name="type"
                    />
                    <SimpleSelect
                        id="valid"
                        label={t('tooltips.create.valid')}
                        options={[
                            { value: 'true', label: t('tooltips.valid.true') },
                            { value: 'false', label: t('tooltips.valid.false') },
                        ]}
                        setValue={setValue}
                        defaultValue={filter.valid || defaultFilterValues.valid}
                        name="valid"
                    />
                </div>
            )}
        />
    )
}

export default AttrProfileFilter
