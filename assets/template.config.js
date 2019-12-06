module.exports = {
  // You can change the template path to another path
  templateRootPath: "./.templates",
  // After copying the template file the `replaceFileTextFn` function is executed.
  replaceFileTextFn: (fileText, templateName, utils) => {
    // @see https://www.npmjs.com/package/change-case
    const { changeCase } = utils;
    // You can change the text in the file.
    return fileText
      .replace(/__templateName__/gm, templateName)
      .replace(
        /__templateNameToPascalCase__/gm,
        changeCase.pascalCase(templateName)
      )
      .replace(
        /__templateNameToParamCase__/gm,
        changeCase.paramCase(templateName)
      );
  }
};
