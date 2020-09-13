import fs = require('fs')
import { Cider } from '../src/cider'

describe('cider', () => {
    test('acquires v0.0.2 version of Cider', async () => {
        const cider = new Cider('v0.0.2')
        const path = await cider.install()
        expect(fs.existsSync(path)).toBe(true)
    }, 100000)

    test('acquires latest version of Cider', async () => {
        const cider = new Cider('latest')
        const path = await cider.install()
        expect(fs.existsSync(path)).toBe(true)
    }, 100000)
})
