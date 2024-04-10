import { FileExtensionEnum } from '@isdd/metais-common/components/actions-over-table/actions-default/ExportButton'
export const downloadBlobAsFile = (blob: Blob, filename: string, inNewWindow: boolean) => {
    const blobURL = URL.createObjectURL(blob)

    if (!inNewWindow) {
        const a = document.createElement('a')
        a.href = blobURL
        a.download = filename
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(blobURL)
        return
    }

    const tab = window.open()
    if (tab) {
        tab.location.href = blobURL
    }
}

export const generateExportFileName = (entityName: string, extension: FileExtensionEnum, isCi = true) => {
    const date = new Date().toISOString()
    return `${isCi ? 'CI-' : ''}${entityName}-${date}.${extension.toLocaleLowerCase()}`
}
