# Template

This extension makes file and folder structures easier to reuse by templating them.

## Usage

When you run the command, the default configuration file and sample templates are automatically created in the current working path.

### Palette Commands

- Shorcut: (MacOS) Cmd + Shift + T, (Windows) Ctrl + Shift + T

```bash
Template: Create New (with rename)
```

- Shorcut: (MacOS) Cmd + Alt + T, (Windows) Ctrl + Alt + T

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
