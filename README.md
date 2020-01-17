# Template

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

This extension makes file and folder structures easier to reuse by templating them.

## Installation

Install through VS Code extensions. Search for `yongwoo.template`

[Visual Studio Code Market Place: Template](https://marketplace.visualstudio.com/items?itemName=yongwoo.template)

Can also be installed in VS Code: Launch VS Code Quick Open (Ctrl+P), paste the following command, and press enter.

```
ext install yongwoo.template
```

## Usage

When you run the command, the default configuration file and sample templates are automatically created in the current working path.

### Palette Commands

- Shorcut: Ctrl + Shift + T

```bash
Template: Create New (with rename)
```

- Shorcut: Ctrl + Alt + T

```bash
Template: Create New
```

## Customization Template and Configuration

The first time you run the command, it will create a `.templates` folder and a`template.conf.js` configuration file containing the default templates in your working path.

### Make customization template

> Regardless of the framework or file extension, you can create and reuse the desired template in advance.

1. Create a template folder in `.template (default path)` and rename it (the folder name will be the template name)
2. Create a file and folder structure in the your template folder.
3. Running the Template command from the Palette command displays the template you just created.

### Configuration Settings

- See the `template.conf.js` file created in the working path.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/stegano"><img src="https://avatars2.githubusercontent.com/u/11916476?v=4" width="100px;" alt=""/><br /><sub><b>JUNG YONG WOO</b></sub></a><br /><a href="https://github.com/stegano/vscode-template/commits?author=stegano" title="Code">💻</a></td>
    <td align="center"><a href="http://pwrwave.blogspot.com"><img src="https://avatars3.githubusercontent.com/u/5355987?v=4" width="100px;" alt=""/><br /><sub><b>Brian Kim</b></sub></a><br /><a href="https://github.com/stegano/vscode-template/issues?q=author%3Akeiches" title="Bug reports">🐛</a> <a href="https://github.com/stegano/vscode-template/commits?author=keiches" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/arnogues"><img src="https://avatars1.githubusercontent.com/u/2287663?v=4" width="100px;" alt=""/><br /><sub><b>Arnaud gueras</b></sub></a><br /><a href="#ideas-arnogues" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
