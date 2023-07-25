import { FieldErrors, FieldValues } from 'react-hook-form'

export const findInputError = (errors: FieldErrors<FieldValues>, name: string): FieldErrors<FieldValues> => {
    const filtered = Object.keys(errors)
        .filter((key) => key.includes(name))
        .reduce((cur, key) => {
            return Object.assign(cur, { error: errors[key] })
        }, {})
    return filtered
}
