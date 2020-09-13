import os from 'os'
import * as path from 'path'
import { SemVer, parse as parseSemver } from 'semver'
import { GitHub, Release } from './github'
import * as cache from '@actions/tool-cache'
import * as core from '@actions/core'

export class Cider {
    rawVersion: string
    semver: SemVer | null

    readonly os = os.platform()
    readonly arch = os.arch()
    readonly github = new GitHub()

    constructor(version: string) {
        this.rawVersion = version
        this.semver = parseSemver(version)
    }

    async install() {
        let release: Release | null = null
        if (this.rawVersion == 'latest') {
            release = await this.github.getLatestRelease()
        } else if (this.semver) {
            release = await this.github.getRelease(`v${this.semver.version}`)
        }
        if (!release) {
            throw new Error(`no release found matching ${this.rawVersion}`)
        }

        core.info(`✅ Cider version found: ${release.tag_name}`)

        const assetName = this.archiveName()
        const asset = await this.github.getReleaseAsset(release.id, assetName)
        if (!asset) {
            throw new Error(
                `no asset found on release ${release.tag_name} for ${assetName}`
            )
        }

        // download binary archive to file
        core.info(`⬇️ Downloading ${asset.browser_download_url}...`)
        const downloadPath = await cache.downloadTool(
            asset.browser_download_url
        )
        core.debug(`Downloaded to ${downloadPath}`)

        // extract binary from archive
        core.info('📦 Extracting Cider...')
        const extractionPath = await this.extractArchive(downloadPath)
        core.debug(`Extracted to ${extractionPath}`)

        // cache binary
        const cacheDir = await cache.cacheDir(
            extractionPath,
            'cider-action',
            release.tag_name
        )
        core.debug(`Cached to ${cacheDir}`)

        const executable = path.join(cacheDir, this.executableName())
        core.debug(`Exe path is ${executable}`)

        return executable
    }

    private archiveName() {
        let os: string, arch: string, ext: string
        if (this.os === 'win32') {
            os = 'windows'
            ext = 'zip'
        } else {
            // 'darwin', 'linux', 'openbsd', 'freebsd'
            os = this.os
            ext = 'tar.gz'
        }
        if (this.arch === 'x64') {
            arch = 'x86_64'
        } else {
            // 'arm64'
            arch = this.arch
        }
        return `cider_${os}_${arch}.${ext}`
    }

    private async extractArchive(file: string): Promise<string> {
        if (this.os === 'win32') {
            return await cache.extractZip(file)
        } else {
            // 'darwin', 'linux', 'openbsd', 'freebsd'
            return await cache.extractTar(file)
        }
    }

    private executableName() {
        switch (this.os) {
            case 'win32':
                return 'cider.exe'
            default:
                // 'darwin', 'linux', 'openbsd', 'freebsd'
                return 'cider'
        }
    }
}
