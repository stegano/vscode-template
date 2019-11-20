# Lite Template

This extension templates the file folder structure, making it easy to reuse.

> On first run, the configuration file and sample template are created in the working path.
> If you want to add template, copy to `.template` folder your templates.

```bash
# `lite-template.config.js` file and `.templates` folder in workspace

├── .templates
│   └── lite-template-sample
│     └── index.js
├── lite-template.config.js
```

```javascript
// lite-template.config.js
// You can share configuration files to use in other projects.

module.exports = {
  // You can change the template path to another path
  templatePath: "./.templates",
  // Copy the template file and the `replaceFileTextFn` function is executed.
  // When this function is executed, you can change the text in the file.
  replaceFileTextFn: (fileText, templateName, utils) => {
    // @see https://www.npmjs.com/package/change-case
    const { changeCase } = utils;
    return fileText
      .replace(/__\$templateName__/gm, templateName)
      .replace(
        /__\$templateNameToPascalCase__/gm,
        changeCase.pascalCase(templateName)
      )
      .replace(
        /__\$templateNameToParamCase__/gm,
        changeCase.paramCase(templateName)
      );
  }
};
```

## Pallet Command

```bash
# Shorcut: (MacOS) Cmd + Alt + T, (Windows) Ctrl + Alt + T
Lite-Template: Copy a template
```

```bash
# Shorcut: (MacOS) Cmd + Shift + T, (Windows) Ctrl + Shift + T
Lite-Template: Copy a template (with rename)
```
