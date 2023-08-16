export const getCurrentMultiSelectValue = (
    values: string[],
    options: {
        label: string | undefined
        value: string | undefined
    }[],
) => {
    const currentValue = values.map((value) => options.filter((option) => option.value === value)).flat()

    return currentValue
}
