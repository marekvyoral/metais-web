import React from 'react'
import { Route } from 'react-router-dom'

import {
    INDEX_ROUTE,
    reduceAllFilePathsByNumberOfSlash,
    getIndexFilePaths,
    getIndexRouteComponents,
    globImportedComponent,
    parseSlugFromFilePath,
    RouteConstructOptions,
    isFilePathSubPageWithParamsRoute,
    computeNestedPathForNonIndexRoutes,
    ConstructRouteWithParentInputs,
    RouteLevelConstruction,
    FileBasedPages,
    getIndexRouteComponent,
    ModuleExport,
    checkIfExportOnFilePathIsReactComponent,
} from './fileBasedRoutesHelpers'

export const constructRouteWithParent = ({
    level,
    pathsGroupedByLevel,
    slug,
    globExports,
    constructedRouteObject,
}: ConstructRouteWithParentInputs) => {
    const minSlashCount = Math.min(...Array.from(pathsGroupedByLevel.keys()))
    while (level > minSlashCount) {
        level -= 1
        const parentPaths = pathsGroupedByLevel?.get(level)
        const removedFileNameFromRoutePath = slug?.substring(0, slug?.lastIndexOf('/'))
        const foundParentFilePath = parentPaths?.find((parentFilePath: string) => {
            const transformedParentFilePath = parseSlugFromFilePath(parentFilePath)
            return transformedParentFilePath.includes(removedFileNameFromRoutePath)
        })
        if (foundParentFilePath) {
            const path = parseSlugFromFilePath(foundParentFilePath)
            const Component = globImportedComponent(globExports[foundParentFilePath], 'Component')
            constructedRouteObject = (
                <Route path={path} key={path} element={<Component />}>
                    {constructedRouteObject}
                </Route>
            )
        }
    }
    return constructedRouteObject
}
export const constructRouteObject = ({ slug, Component, subPageWithParamsObject, ParentComponent, parentFilePath }: RouteConstructOptions) => {
    // for ex. /ci/:entityName/:entityId, /ci/:entityName/:entityId/*, ...
    const { isSubPageWithParams, paramsPatternMatch } = subPageWithParamsObject
    if (ParentComponent) {
        if (isSubPageWithParams) {
            return <Route element={<Component />} key={slug} index />
        } else {
            const parentSlug = parseSlugFromFilePath(parentFilePath ?? '')
            return (
                <Route path={parentSlug} key={parentSlug} element={<ParentComponent />}>
                    <Route element={<Component />} key={slug} index />
                </Route>
            )
        }
    } else {
        const nestedPath = computeNestedPathForNonIndexRoutes(isSubPageWithParams, slug, paramsPatternMatch ?? '')
        return <Route path={nestedPath === '' ? INDEX_ROUTE : nestedPath} element={<Component />} key={slug} />
    }
}

const constructAllRoutesPerSlashLevel = ({ pathsGroupedByLevel, globExports, level }: RouteLevelConstruction) => {
    const filePathsOnLevel = pathsGroupedByLevel.get(level) ?? []
    const indexFilePathsOnLevel = getIndexFilePaths(filePathsOnLevel)
    const indexRouteComponentsOnLevel = getIndexRouteComponents(globExports, indexFilePathsOnLevel)
    const tsxFilePaths = Object.keys(globExports)

    return filePathsOnLevel?.map((filePath: string) => {
        const slug = parseSlugFromFilePath(filePath)
        const Component = globExports[filePath].Component
        const subPageWithParamsObject = isFilePathSubPageWithParamsRoute(slug, tsxFilePaths)

        const indexOfParentComponent = indexRouteComponentsOnLevel?.indexOf(Component)
        const ParentComponent = globExports[indexFilePathsOnLevel[indexOfParentComponent]]?.Component
        const parentFilePath = indexFilePathsOnLevel[indexOfParentComponent]

        const constructedRouteObject = constructRouteObject({
            slug,
            Component,
            ParentComponent,
            parentFilePath,
            subPageWithParamsObject,
        })

        const constructedRouteWithParents = constructRouteWithParent({
            slug,
            level,
            constructedRouteObject,
            pathsGroupedByLevel,
            globExports,
        })
        return constructedRouteWithParents
    })
}

export const computeRoutes = (globExports: FileBasedPages) => {
    const tsxFilePaths = Object.keys(globExports)
    const pathsGroupedByLevel = reduceAllFilePathsByNumberOfSlash(tsxFilePaths)
    const levels = Array.from(pathsGroupedByLevel.keys())

    const routes =
        levels?.flatMap((level) => {
            const allConstructedRoutesInLevel = constructAllRoutesPerSlashLevel({
                pathsGroupedByLevel,
                globExports: globExports,
                level,
            })
            return allConstructedRoutesInLevel
        }) ?? []
    return routes
}

export const globRoutes = (globExports: { [filePath: string]: unknown }) => {
    const tsxFilePaths = Object.keys(globExports)?.filter((key) => key?.endsWith('.tsx'))
    const pages: FileBasedPages = {}
    tsxFilePaths
        ?.filter((tsxFilePath) => checkIfExportOnFilePathIsReactComponent(tsxFilePath, globExports))
        ?.forEach((filePath) => {
            const slug = parseSlugFromFilePath(filePath)
            const globExportOfFile = globExports[filePath] as ModuleExport
            const exportedComponent = globImportedComponent(globExportOfFile, slug)
            const indexChildComponent = getIndexRouteComponent(globExportOfFile)
            pages[filePath] = { Component: exportedComponent, indexComponent: indexChildComponent }
        })
    return computeRoutes(pages)
}
