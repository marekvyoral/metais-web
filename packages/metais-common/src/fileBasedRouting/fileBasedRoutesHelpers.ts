export const PAGES_FOLDER = '../pages/'
export const REACT_FILE_EXTENSION = '.tsx'
export const INDEX_ROUTE = 'index'
export const PARAMS_REGEXP = /:.*\//gm
export const ARRAY_REGEXP = /\[([^[]+)\]/gm
export const SUBSTITUTE_ARRAY_REGEXP = ':$1'

export type ModuleExport = {
    [componentName: string]: React.FC
}

export type FileBasedPages = {
    [filePath: string]: {
        Component: React.FC
        indexComponent?: React.FC
    }
}

export interface RouteConstructOptions {
    slug: string
    Component: React.FC
    ParentComponent?: React.FC
    parentFilePath?: string
}

export interface ConstructRouteWithParentInputs {
    slug: string
    level: number
    constructedRouteObject: JSX.Element | undefined
    pathsGroupedByLevel: Map<number, string[]>
    globExports: FileBasedPages
}

export interface RouteLevelConstruction {
    pathsGroupedByLevel: Map<number, string[]>
    globExports: FileBasedPages
    level: number
}

export const globImportedComponent = (globExports: ModuleExport, slug: string) => {
    const namedExport = globExports?.[slug]
    const defaultExport = globExports?.default
    return namedExport ?? defaultExport
}

export const getIndexRouteComponents = (globExports: FileBasedPages, reactFilePaths: string[]) =>
    reactFilePaths.map((filePath) => globExports?.[filePath].indexComponent)?.filter((validModule) => validModule) ?? []

export const getIndexRouteComponent = (globExports: ModuleExport) => globExports?.INDEX_ROUTE

export const parseSlugFromFilePath = (reactFilePath: string): string | never => {
    if (reactFilePath.startsWith(PAGES_FOLDER) && reactFilePath.endsWith(REACT_FILE_EXTENSION)) {
        let parsedRoute = reactFilePath.substring(PAGES_FOLDER.length, reactFilePath.length - REACT_FILE_EXTENSION.length)
        if (parsedRoute?.includes(INDEX_ROUTE)) parsedRoute = parsedRoute?.replace(INDEX_ROUTE, '')
        // converts [abc] to :abc
        parsedRoute = parsedRoute?.replace(ARRAY_REGEXP, SUBSTITUTE_ARRAY_REGEXP)
        return parsedRoute
    }

    throw new Error('unexpected react file path')
}

export const reduceAllFilePathsByNumberOfSlash = (filePaths: string[]) => {
    const groupBySlashCount = filePaths.reduce((map, filePath) => {
        const numberOfSlash = filePath?.split('/')?.length
        let filePathsWithSlashCount = map.get(numberOfSlash) ?? []
        filePathsWithSlashCount = [...filePathsWithSlashCount, filePath]
        map.set(numberOfSlash, filePathsWithSlashCount)
        return map
    }, new Map<number, string[]>())

    return groupBySlashCount
}

export const getIndexFilePaths = (filePaths: string[], globExports?: FileBasedPages) => {
    const globExportsKeys = Object.keys(globExports ?? {})
    return globExportsKeys?.filter((globExportKey) => globExports?.[globExportKey].indexComponent !== undefined) ?? ''
}

// for ex. /ci/:entityName/:entityId, /ci/:entityName/:entityId/*, ...
export const calcNestedPath = (slug: string, filePathsOnLevelBefore: string[]) => {
    console.log('slug', slug)
    const splittedSlug = slug?.split('/')
    // console.log('splittedSlug', splittedSlug)
    const fileParent = splittedSlug?.[splittedSlug?.length - 2]
    // console.log('fileParent', fileParent)
    const fileExistsInLevelBefore = filePathsOnLevelBefore?.some((filePath) => parseSlugFromFilePath(filePath)?.endsWith(fileParent)) //TU JE CHYBA
    // console.log('fileExistsInLevelBefore', fileExistsInLevelBefore)
    const result = fileExistsInLevelBefore ? splittedSlug[splittedSlug?.length - 1] : slug
    console.log('RESULT', result)
    return result
}

const isModuleExportReactFC = (globExports: unknown, slug: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const globExportComponent = globImportedComponent(globExports, slug)
    return typeof globExportComponent === 'function'
}

export const checkIfExportOnFilePathIsReactComponent = (filePath: string, globExports: { [filePath: string]: unknown }) => {
    const slug = parseSlugFromFilePath(filePath)
    const globExport = globExports[filePath]
    return isModuleExportReactFC(globExport, slug)
}
