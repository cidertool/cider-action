<p align="center">
  <!-- <img alt="Cider logo" src="assets/go.png" height="150" /> -->
  <h3 align="center">Cider Action</h3>
  <p align="center">A Github Action for Cider, the App Store submission tool for Apple apps</p>
</p>

---

[![Release](https://img.shields.io/github/release/cidertool/cider-action.svg)](https://github.com/cidertool/cider-action/releases/latest)
[![GitHub Marketplace](https://img.shields.io/badge/marketplace-cider--action-blue?logo=github)](https://github.com/marketplace/actions/cider-action)
![test](https://github.com/cidertool/cider-action/workflows/test/badge.svg)
[![codecov](https://codecov.io/gh/cidertool/cider-action/branch/main/graph/badge.svg)](https://codecov.io/gh/cidertool/cider-action)

This action makes it easy to use [Cider](https://cidertool.github.io/cider) in your Github Actions workflows.

## Usage

```yaml
- uses: actions/checkout@v2
- uses: cidertool/cider-action@v0
  with:
      # Version of Cider to use. For example, 'v0.0.2'
      # Default: latest
      version: 'latest'
      # Arguments to pass to Cider. See the Command Reference for guidance on what's supported. This field is required because otherwise Cider won't do anything of consequence.
      #
      # https://cidertool.github.io/cider/commands/
      args: ''
      # Workdir is the current directory to run Cider from, relative to the repository root.
      # Default: '.'
      workdir: '.'
  env:
      # The auto-generated GitHub token is required in order to download release assets from the GitHub API.
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Run this in any context you see fit to use Cider to update app metadata or submit new versions of your apps to the App Store.

## Contributing

Contributions are always welcome. If you want to get involved or you just want to offer feedback, please see [`CONTRIBUTING.md`](./.github/CONTRIBUTING.md) for details.

## License

This library is licensed under the [MIT License](./LICENSE)
