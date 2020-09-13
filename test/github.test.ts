import { GitHub } from '../src/github'

describe('github', () => {
    test('returns latest Cider GitHub release', async () => {
        const github = new GitHub()
        const release = await github.getLatestRelease()
        expect(release).not.toBeNull()
        expect(release?.tag_name).not.toEqual('')
        console.log(`tag_name: ${release?.tag_name}`)
    })
    test('returns v0.0.2 Cider GitHub release', async () => {
        const github = new GitHub()
        const release = await github.getRelease('v0.0.2')
        expect(release).not.toBeNull()
        expect(release?.tag_name).toEqual('v0.0.2')
        console.log(`tag_name: ${release?.tag_name}`)
    })
    test('returns asset for latest Cider GitHub release', async () => {
        const github = new GitHub()
        const release = await github.getLatestRelease()
        if (!release) {
            fail()
            return
        }
        const asset = await github.getReleaseAsset(
            release.id,
            'cider_darwin_x86_64.tar.gz'
        )
        expect(asset).not.toBeNull()
        expect(asset?.browser_download_url).not.toEqual('')
        console.log(`asset_url: ${asset?.browser_download_url}`)
    })
})
