import * as http from '@actions/http-client'
import * as process from 'process'

export interface Release {
    id: number
    tag_name: string
}

export interface Asset {
    name: string
    browser_download_url: string
}

export class GitHub {
    private readonly client = new http.HttpClient('cider-action', [], {
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN!}`,
        },
    })
    private readonly repo = {
        owner: 'cidertool',
        repo: 'cider',
    }

    async getLatestRelease(): Promise<Release | null> {
        const url = `https://api.github.com/repos/${this.repo.owner}/${this.repo.repo}/releases/latest`
        return (await this.client.getJson<Release>(url)).result
    }

    async getRelease(tag: string): Promise<Release | null> {
        const url = `https://api.github.com/repos/${this.repo.owner}/${this.repo.repo}/releases/tags/${tag}`
        return (await this.client.getJson<Release>(url)).result
    }

    async getReleaseAsset(
        releaseID: number,
        assetName: string
    ): Promise<Asset | null> {
        const url = `https://api.github.com/repos/${this.repo.owner}/${this.repo.repo}/releases/${releaseID}/assets`
        return (
            (await this.client.getJson<Asset[]>(url)).result?.find(
                asset => asset.name === assetName
            ) || null
        )
    }
}
