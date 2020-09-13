import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { Cider } from './cider'

async function run() {
    try {
        const version = core.getInput('version') || 'latest'
        const args = core.getInput('args', { required: true })
        const workdir = core.getInput('workdir')

        if (workdir && workdir !== '.') {
            core.info(`📂 Using ${workdir} as working directory...`)
        }

        const cider = new Cider(version)

        const ciderPath = await cider.install()

        core.info('🍻 Running Cider...')
        await exec.exec(ciderPath, args.split(' '), { cwd: workdir })
    } catch (error) {
        core.setFailed(error)
    }
}

run()
