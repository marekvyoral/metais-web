/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'
import * as path from 'path'

import * as csv from 'fast-csv'
import _ from 'lodash'

enum Language {
    EN = 'en',
    SK = 'sk',
}

const mainInputDirectoryName = 'locale_Input'
const portalDirectoryName = 'portal_Input'
const adminDirectoryName = 'admin_Input'
const commonDirectoryName = 'common_Input'
const idskDirectoryName = 'idsk_Input'

const columnNumberForTranslationPath = 0
const columnNumberForSkTranslation = 1
const columnNumberForSkTranslationCorrection = 2
const columnNumberForEnTranslation = 3
const columnNumberForEnTranslationCorrection = 4

const onlyTranslationCorrection = true

const delimiterChar = ';'
const escapeChar = '\\"'
const formatOutputJson = false
const temporaryFileName = 'temp_output.json'

function getValue(obj: any, pathString: string) {
    try {
        if (!pathString) return obj
        const properties = pathString.split('.')
        return getValue(obj[properties.shift() ?? ''], properties.join('.'))
    } catch {
        return undefined
    }
}

function saveToFile(pathString: string, localeJsonObj: object) {
    const localeObjJsonString = JSON.stringify(localeJsonObj, null, formatOutputJson ? '\t' : undefined)
    const fileDescriptor = fs.openSync(pathString, 'w')
    fs.writeFileSync(fileDescriptor, localeObjJsonString, { mode: 'a', encoding: 'utf8' })
    fs.closeSync(fileDescriptor)
}

function deleteTempFile(workDirectoryName: string) {
    fs.unlinkSync(path.resolve(__dirname, mainInputDirectoryName, workDirectoryName, temporaryFileName))
}

function copyTempFileTo(workDirectoryName: string, pathString: string) {
    fs.copyFileSync(path.resolve(__dirname, mainInputDirectoryName, workDirectoryName, temporaryFileName), path.resolve(__dirname, pathString))
}

function handleEndOfReading(workDirectoryName: string, localeJsonObj: object, localeJsonFilePath: string, nextImportCallBack?: () => void) {
    saveToFile(path.resolve(__dirname, mainInputDirectoryName, workDirectoryName, temporaryFileName), localeJsonObj)
    copyTempFileTo(workDirectoryName, path.resolve(__dirname, localeJsonFilePath))
    deleteTempFile(workDirectoryName)
    console.log(`...DONE: ${localeJsonFilePath}`)
    nextImportCallBack?.()
}

function modifyChangeString(changeString: string) {
    if (!changeString) {
        return changeString
    }

    let modifiedChangeString = changeString
    modifiedChangeString = modifiedChangeString.replaceAll('\r', '')
    modifiedChangeString = modifiedChangeString.replaceAll('\n', '')
    modifiedChangeString = modifiedChangeString?.replaceAll('""', '"')
    modifiedChangeString =
        modifiedChangeString.indexOf('"', 0) === 0 && modifiedChangeString.lastIndexOf('"') === modifiedChangeString.length - 1
            ? modifiedChangeString.substring(1, modifiedChangeString.length - 1)
            : modifiedChangeString

    return modifiedChangeString
}

function changeLocaleJsonPropertyRow(pathString: string, changeString: string, localeJsonObj: object) {
    if (onlyTranslationCorrection && changeString == '') {
        return
    }
    _.set(localeJsonObj, pathString, modifyChangeString(changeString))
}

function getChangeENValue(rowData: string[]) {
    const enValueWithOriginalTranslationColumn =
        rowData[columnNumberForEnTranslationCorrection]?.length === 0
            ? rowData[columnNumberForEnTranslation]
            : rowData[columnNumberForEnTranslationCorrection]
    const enValueTranslationCorrectionColumn = rowData[columnNumberForEnTranslationCorrection]
    return onlyTranslationCorrection ? enValueTranslationCorrectionColumn : enValueWithOriginalTranslationColumn
}

function getChangeSKValue(rowData: string[]) {
    const skValueWithOriginalTranslationColumn =
        rowData[columnNumberForSkTranslationCorrection]?.length === 0
            ? rowData[columnNumberForSkTranslation]
            : rowData[columnNumberForSkTranslationCorrection]
    const skValueTranslationCorrectionColumn = rowData[columnNumberForSkTranslationCorrection]
    return onlyTranslationCorrection ? skValueTranslationCorrectionColumn : skValueWithOriginalTranslationColumn
}

function getChangeStringValue(rowData: string[], language: Language) {
    return language == Language.SK ? getChangeSKValue(rowData) : getChangeENValue(rowData)
}

function importCsvRowToJsonLocale(row: string[], localeJsonObj: object, language: Language) {
    const localeItemVal = getValue(localeJsonObj, row[columnNumberForTranslationPath])
    if (!localeItemVal) {
        return
    }
    const trimmedRow = row.map((r) => r.trim())

    changeLocaleJsonPropertyRow(row[columnNumberForTranslationPath], getChangeStringValue(trimmedRow, language), localeJsonObj)
}

async function importDataFromCsvToLocale(
    language: Language,
    workDirectoryName: string,
    localeJsonFilePath: string,
    csvFilePath?: string,
    nextImportCallBack?: () => void,
) {
    if (csvFilePath === undefined) {
        return
    }
    console.log(`Processing: ${localeJsonFilePath}`)
    const { default: localeJsonObj } = await import(localeJsonFilePath, { assert: { type: 'json' } })
    function importCsv() {
        fs.createReadStream(path.resolve(__dirname, mainInputDirectoryName, csvFilePath ?? ''))
            .pipe(csv.parse({ headers: false, skipLines: 1, delimiter: delimiterChar, escape: escapeChar, quote: null /*"'"*/ }))
            .on('error', (error: any) => console.error(error))
            .on('data', (row: string[]) => importCsvRowToJsonLocale(row, localeJsonObj, language))
            .on('end', (rowCount: number) => handleEndOfReading(workDirectoryName, localeJsonObj, localeJsonFilePath, nextImportCallBack))
    }

    importCsv()
}

function getCsvFilePath(subdirName: string) {
    const dir = fs.readdirSync(path.resolve(__dirname, mainInputDirectoryName, subdirName))
    const fileList = dir.filter((file) => file.endsWith('.csv'))

    if (fileList.length === 0) {
        return undefined
    }

    if (fileList.length > 1) {
        throw Error(`more than one '*.csv' file in folder!`)
    }
    console.log(`CSV file found at Path: ${mainInputDirectoryName}/${subdirName}/${fileList[0]}`)
    return `${subdirName}/${fileList[0]}`
}

async function run() {
    const portalCsvFilePath = getCsvFilePath(portalDirectoryName)
    await importDataFromCsvToLocale(
        Language.SK,
        portalDirectoryName,
        'app/metais-portal/public/translations/sk.json',
        portalCsvFilePath,
        async () => {
            await importDataFromCsvToLocale(Language.EN, portalDirectoryName, 'app/metais-portal/public/translations/en.json', portalCsvFilePath)
        },
    )

    const adminCsvFilePath = getCsvFilePath(adminDirectoryName)
    await importDataFromCsvToLocale(Language.SK, adminDirectoryName, 'app/metais-admin/public/translations/sk.json', adminCsvFilePath, async () => {
        await importDataFromCsvToLocale(Language.EN, adminDirectoryName, 'app/metais-admin/public/translations/en.json', adminCsvFilePath)
    })

    const commonCsvFilePath = getCsvFilePath(commonDirectoryName)
    await importDataFromCsvToLocale(
        Language.SK,
        commonDirectoryName,
        'packages/metais-common/src/localization/sk.json',
        commonCsvFilePath,
        async () => {
            await importDataFromCsvToLocale(Language.EN, commonDirectoryName, 'packages/metais-common/src/localization/en.json', commonCsvFilePath)
        },
    )

    const idskCsvFilePath = getCsvFilePath(idskDirectoryName)
    await importDataFromCsvToLocale(Language.SK, idskDirectoryName, 'packages/idsk-ui-kit/localization/sk.json', idskCsvFilePath, async () => {
        await importDataFromCsvToLocale(Language.EN, idskDirectoryName, 'packages/idsk-ui-kit/localization/en.json', idskCsvFilePath)
    })
}

run()
