import { ApiError } from '@isdd/metais-common/api/generated/types-repo-swagger'

export type ErrorTranslateKeyType = string | undefined

// Object key is error message from  api error , value is translate key
export const ERROR_MAPPER: { [key: string]: string } = {
    'cl.missing.header.name': 'errors.cl.missing.header.name',
    'cl.missing.header.master.manager': 'errors.cl.missing.header.master.manager',
    'cl.missing.header.validity': 'errors.cl.missing.header.validity',
    'cl.missing.header.legislative': 'errors.cl.missing.header.legislative',
    'cl.missing.item.language': 'errors.cl.missing.item.language',
    'cl.required.item': 'errors.cl.required.item',
    'cl.missing.date.from': 'errors.cl.missing.date.from',
    'cl.missing.item': 'errors.cl.missing.item',
    'cl.missing.value': 'errors.cl.missing.value',
    'cl.missingdate.value': 'errors.cl.missingdate.value',
    'cl.invalid.same.languages': 'errors.cl.invalid.same.languages',
    'cl.invalid.date.from.before.to': 'errors.cl.invalid.date.from.before.to',
    'cl.invalid.date.same.fromto': 'errors.cl.invalid.date.same.fromto',
    'cl.invalid.date.same.from': 'errors.cl.invalid.date.same.from',
    'cl.invalid.date.same.to': 'errors.cl.invalid.date.same.to',
    'cl.invalid.date.overlap': 'errors.cl.invalid.date.overlap',
    'cl.xml.managertype.notexists': 'errors.cl.xml.managertype.notexists',
    'cl.request.isnot.base': 'errors.cl.request.isnot.base',
    'cl.request.is.base': 'errors.cl.request.is.base',
    'cl.header.inappropriate.wfstate': 'errors.cl.header.inappropriate.wfstate',
    'cl.item.inappropriate.wfstate': 'errors.cl.item.inappropriate.wfstate',
    'cl.request.not.reject.wsstate': 'errors.cl.request.not.reject.wsstate',
    'cl.request.notexists': 'errors.cl.request.notexists',
    'cl.header.`': 'errors.cl.header.`',
    'cl.item.notexists': 'errors.cl.item.notexists',
    'cl.header.locked': 'errors.cl.header.locked',
    'cl.header.not.locked': 'errors.cl.header.not.locked',
    'cl.item.locked': 'errors.cl.item.locked',
    'cl.item.not.locked': 'errors.cl.item.not.locked',
    'cl.header.temporal.notexists': 'errors.cl.header.temporal.notexists',
    'cl.header.original.notexists': 'errors.cl.header.original.notexists',
    'cl.item.temporal.notexists': 'errors.cl.item.temporal.notexists',
    'cl.item.original.notexists': 'errors.cl.item.original.notexists',
    'cl.item.already.exists': 'errors.cl.item.already.exists',
    'cl.consistency.request.more.thanone': 'errors.cl.consistency.request.more.thanone',
    'cl.consistency.temporal.exists.without.origin': 'errors.cl.consistency.temporal.exists.without.origin',
    'cl.permissiondenied': 'errors.cl.permissiondenied',
    'cl.request.codelist.exists': 'errors.cl.request.codelist.exists',
    'cl.language.version.alreadyexists': 'errors.cl.language.version.alreadyexists',
    'cl.language.version.notexist': 'errors.cl.language.version.notexist',
    'cl.language.version.default.changing': 'errors.cl.language.version.default.changing',
    'cl.header.temporal.exists': 'errors.cl.header.temporal.exists',
    'cl.request.request.code.invalid.value': 'errors.cl.request.request.code.invalid.value',
    'cl.wrong.date.format': 'errors.cl.wrong.date.format',
    'cl.missing.item.name': 'errors.cl.missing.item.name',
    'cl.missing.item.code': 'errors.cl.missing.item.code',
    'cl.missing.item.date.validation': 'errors.cl.missing.item.date.validation',
    'Check historizable lists - two FromDates in one list are equals.': 'errors.errors.checkFromDateEquals',
    'vote.closed': 'errors.vote.closed',
    "Can't change the vote. Voting is already in progress": 'errors.vote.progress',
}

// Object key is translate key , value is regex
const ERROR_REGEX_MAPPER = {
    'errors.test': /This is example of regex/,
    'errors.meeting.checkDates': /\[meeting_requests_check_dates\]/,
}

export const getErrorTranslateKeys = (errors: { message: string }[]): (string | undefined)[] => {
    return errors
        .filter((error) => !!error && error.message)
        .map((error) => {
            try {
                const message = JSON.parse(error.message ?? '').message
                const translateKey = ERROR_MAPPER[message]

                if (translateKey) return translateKey

                let keyFromRegex

                Object.entries(ERROR_REGEX_MAPPER).forEach(([locale, regex]) => {
                    new RegExp(regex).test(message)
                    if (regex.test(message)) keyFromRegex = locale
                })

                return keyFromRegex
            } catch (e) {
                return undefined
            }
        })
}

export const getErrorTranslateKey = (error: ApiError | null | undefined): string | undefined => {
    if (!error) return undefined
    try {
        const message = JSON.parse(error.message ?? '').message
        const translateKey = ERROR_MAPPER[message]

        if (translateKey) return translateKey

        let keyFromRegex

        Object.entries(ERROR_REGEX_MAPPER).forEach(([locale, regex]) => {
            new RegExp(regex).test(message)
            if (regex.test(message)) keyFromRegex = locale
        })

        return keyFromRegex
    } catch (e) {
        return undefined
    }
}
