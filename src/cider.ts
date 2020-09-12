import * as os from 'os'
import * as path from 'path'
import * as cache from '@actions/tool-cache'
import * as github from '@actions/github'
import * as semver from 'semver'

const octokit = github.getOctokit('', { auth: {} })

export async function install(version: string): Promise<string> {
    const platform = os.platform()
    const arch = os.arch()

    // identify release corresponding to version
    const release = await releaseForVersion(version)
    if (!release) {
        throw new Error(`no release found matching ${version}`)
    }
    const asset = await assetForRelease(release, platform, arch)
    if (!asset) {
        throw new Error(
            `no compatible version of Cider for ${platform} and ${arch}`
        )
    }
    const downloadURL = asset.browser_download_url

    // download binary archive to file
    const downloadPath = await cache.downloadTool(downloadURL)

    // extract binary from archive
    const extractionPath = await extractArchive(downloadPath)

    // cache binary
    const cacheDir = await cache.cacheDir(
        extractionPath,
        'cider-action',
        release.tag_name
    )

    // return path to binary in cache
    const binaryName = ''
    const executable = path.join(cacheDir, binaryName)
    return executable
}

async function releaseForVersion(version: string) {
    const options = {
        owner: 'cidertool',
        repo: 'cider',
    }
    if (version === 'latest') {
        const release = await octokit.repos.getLatestRelease(options)
        return release.data
    }
    const semVersion = semver.parse(version)
    if (!semVersion) {
        return null
    }
    const release = await octokit.repos.getReleaseByTag({
        ...options,
        tag: semVersion.format(),
    })
    return release.data
}

async function assetForRelease(
    release: { id: number },
    platform: string,
    arch: string
) {
    const response = await octokit.repos.listReleaseAssets({
        owner: 'cidertool',
        repo: 'cider',
        release_id: release.id,
    })
    const assets = response.data

    const name = assetName(platform, arch)

    return assets.find(asset => asset.name === name)
}

const assetName = (platform: string, arch: string) => {
    let ext: string
    switch (platform) {
        case 'win32':
            platform = 'windows'
            ext = 'zip'
        default:
            // 'darwin', 'linux', 'openbsd', 'freebsd'
            // platform = platform
            ext = 'tar.gz'
    }
    switch (arch) {
        case 'x64':
            arch = 'x86_64'
        default:
            // 'arm64'
            // arch = arch
            break
    }
    return `cider_${platform}_${arch}.${ext}`
}

async function extractArchive(file: string): Promise<string> {
    const ext = path.extname(file)
    switch (ext) {
        case '.gz':
            return await cache.extractTar(file)
        case '.zip':
            return await cache.extractZip(file)
        case '.7z':
            return await cache.extract7z(file)
        case '.xar':
            return await cache.extractXar(file)
        default:
            throw new Error(`unsupported archive extension: ${ext}`)
    }
}
