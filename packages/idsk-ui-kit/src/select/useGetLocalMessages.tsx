import { useTranslation } from 'react-i18next'
import { AriaGuidanceProps, AriaOnChangeProps, AriaOnFilterProps, AriaOnFocusProps, GroupBase, OptionsOrGroups } from 'react-select'

// modified content mainly from https://github.com/JedWatson/react-select/blob/react-select%405.8.0/packages/react-select/src/accessibility/index.ts

export const useGetLocalMessages = () => {
    const { t } = useTranslation()

    const guidance = (props: AriaGuidanceProps) => {
        const { isSearchable, isMulti, isDisabled, tabSelectsValue, context } = props
        switch (context) {
            case 'menu':
                return t('select.guidance.menu', {
                    enterText: isDisabled ? '' : t('select.guidance.enterText'),
                    tabText: tabSelectsValue ? t('select.guidance.tabText') : '',
                })
            case 'input':
                return t('select.guidance.input', {
                    label: props['aria-label'] || 'Select',
                    searchText: isSearchable ? t('select.guidance.searchText') : '',
                    multiText: isMulti ? t('select.guidance.multiText') : '',
                })
            case 'value':
                return t('select.guidance.value')
            default:
                return ''
        }
    }

    const onChange = <Option, IsMulti extends boolean>(props: AriaOnChangeProps<Option, IsMulti>) => {
        const { action, label = '', labels, isDisabled } = props
        switch (action) {
            case 'deselect-option':
            case 'pop-value':
            case 'remove-value':
                return t('select.onChange.deselected', { label })
            case 'clear':
                return t('select.onChange.cleared')
            case 'initial-input-focus':
                return t('select.onChange.initial', { count: labels.length, labels: labels.join(',') })
            case 'select-option':
                return isDisabled ? t('select.onChange.selected.disabled', { label }) : t('select.onChange.selected.selected', { label })
            default:
                return ''
        }
    }

    const onFilter = (props: AriaOnFilterProps) => {
        const { inputValue, resultsMessage } = props
        return t('select.onFilter', { resultsMessage, inputValue })
    }

    const onFocus = <Option, Group extends GroupBase<Option>>(props: AriaOnFocusProps<Option, Group>) => {
        const { context, focused, options, label = '', selectValue, isDisabled, isSelected } = props

        const getArrayIndex = (arr: OptionsOrGroups<Option, Group>, item: Option) =>
            arr && arr.length ? t('select.onFocus.totalCount', { index: arr.indexOf(item) + 1, length: arr.length }) : ''

        if (context === 'value' && selectValue) {
            return t('select.onFocus.return.value', { label, index: getArrayIndex(selectValue, focused) })
        }

        if (context === 'menu') {
            const disabled = isDisabled ? t('select.onFocus.disabled') : ''
            const status = `${isSelected ? t('select.onFocus.selected') : t('select.onFocus.focused')} ${disabled}`
            return t('select.onFocus.return.menu', { label, status, index: getArrayIndex(options, focused) })
        }
        return ''
    }

    const screenReaderStatus = ({ count }: { count: number }) => t('select.availableResult', { count })
    const noOptionsMessage = () => t('select.noOptions')
    const loadingMessage = () => t('select.loading')

    return {
        ariaLiveMessages: {
            guidance,
            onChange,
            onFilter,
            onFocus,
        },
        screenReaderStatus,
        noOptionsMessage,
        loadingMessage,
    }
}
