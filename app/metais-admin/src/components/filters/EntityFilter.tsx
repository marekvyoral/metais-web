import { Filter } from '@isdd/idsk-ui-kit/filter'
import { IOption, Input, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { EntityFilterData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { useTranslation } from 'react-i18next'

type Props = {
    defaultFilterValues: EntityFilterData
}

export const EntityFilter = ({ defaultFilterValues }: Props) => {
    const { t } = useTranslation()

    const typeOptions: IOption<string>[] = [
        { label: t('tooltips.type.application'), value: 'application' },
        { label: t('tooltips.type.system'), value: 'system' },
        { label: t('tooltips.type.custom'), value: 'custom' },
    ]

    const validOption: IOption<string>[] = [
        {
            label: t('validity.true'),
            value: 'true',
        },
        {
            label: t('validity.false'),
            value: 'false',
        },
    ]
    return (
        <Filter<EntityFilterData>
            defaultFilterValues={defaultFilterValues}
            form={({ register, filter, setValue }) => (
                <div>
                    <Input label={t(`filter.egov.name`)} placeholder={t(`filter.namePlaceholder`)} {...register('name')} />
                    <Input label={t('filter.egov.technicalName')} {...register('technicalName')} placeholder={t(`filter.namePlaceholder`)} />
                    <SimpleSelect setValue={setValue} name="type" options={typeOptions} label={t('filter.egov.type')} defaultValue={filter?.type} />
                    <SimpleSelect
                        setValue={setValue}
                        name="valid"
                        options={validOption}
                        label={t('filter.egov.valid')}
                        defaultValue={filter?.valid}
                    />
                </div>
            )}
        />
    )
}
