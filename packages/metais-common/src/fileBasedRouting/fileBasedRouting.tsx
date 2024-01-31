import React from 'react'
import { Route } from 'react-router-dom'

import {
    reduceAllFilePathsByNumberOfSlash,
    getIndexFilePaths,
    getIndexRouteComponents,
    globImportedComponent,
    parseSlugFromFilePath,
    RouteConstructOptions,
    ConstructRouteWithParentInputs,
    RouteLevelConstruction,
    FileBasedPages,
    getIndexRouteComponent,
    ModuleExport,
    checkIfExportOnFilePathIsReactComponent,
    calcNestedPath,
    INDEX_ROUTE,
} from './fileBasedRoutesHelpers'
import ProtectedRoute from './ProtectedRoute'

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
            if (constructedRouteObject?.key !== path)
                constructedRouteObject = (
                    <Route path={path} key={path} element={<Component />}>
                        {constructedRouteObject}
                    </Route>
                )
        }
    }
    return constructedRouteObject
}

export const constructRouteObject = ({ slug, Component, ParentComponent, parentFilePath }: RouteConstructOptions) => {
    if (ParentComponent) {
        const parentSlug = parseSlugFromFilePath(parentFilePath ?? '')
        return (
            <Route path={parentSlug} key={parentSlug} element={<ParentComponent />}>
                <Route element={<ProtectedRoute element={<Component />} slug={slug} isAdmin />} key={slug} index />
            </Route>
        )
    } else {
        return <Route path={slug === '' ? INDEX_ROUTE : slug} element={<ProtectedRoute element={<Component />} slug={slug} isAdmin />} key={slug} />
    }
}

const constructAllRoutesPerSlashLevel = ({ pathsGroupedByLevel, globExports, level }: RouteLevelConstruction) => {
    const filePathsOnLevel = pathsGroupedByLevel.get(level) ?? []
    const indexFilePathsOnLevel = getIndexFilePaths(filePathsOnLevel, globExports)

    const indexRouteComponentsOnLevel = getIndexRouteComponents(globExports, indexFilePathsOnLevel)

    return filePathsOnLevel?.map((filePath: string) => {
        const slug = parseSlugFromFilePath(filePath)
        const parentFilePathsOnUpperLevels = pathsGroupedByLevel?.get(level - 1)
        const routePath = calcNestedPath(slug, parentFilePathsOnUpperLevels ?? [])

        const Component = globExports[filePath].Component
        const indexOfParentComponent = indexRouteComponentsOnLevel?.indexOf(Component)
        const ParentComponent = globExports[indexFilePathsOnLevel[indexOfParentComponent]]?.Component
        const parentFilePath = indexFilePathsOnLevel[indexOfParentComponent]

        const constructedRouteObject = constructRouteObject({
            slug: routePath,
            Component,
            ParentComponent,
            parentFilePath,
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
    const levels = Array.from(pathsGroupedByLevel.keys())?.sort((a, b) => a - b)

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
