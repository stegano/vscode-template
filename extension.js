// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const fs = require("fs-extra");
const changeCase = require("change-case");
const beautify = require("js-beautify");

function getWorkingPathDir(context, activeTextEditor, workspace) {
  if (context) {
    const { fsPath } = context;
    const stats = fs.statSync(context.fsPath);
    return stats.isDirectory() ? fsPath : path.dirname(fsPath);
  } else if (activeTextEditor) {
    return path.dirname(activeTextEditor.document.fileName);
  } else {
    return workspace.rootPath;
  }
}

async function replaceTextInFiles(filePath, templateName, replaceFileTextFn) {
  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      const files = await fs.readdir(filePath);
      await Promise.all(
        files.map(async entryFilePath =>
          replaceTextInFiles(
            path.resolve(filePath, entryFilePath),
            templateName,
            replaceFileTextFn
          )
        )
      );
    } else {
      const fileText = (await fs.readFile(filePath)).toString("utf8");
      if (typeof replaceFileTextFn === "function") {
        await fs.writeFile(
          filePath,
          replaceFileTextFn(fileText, templateName, { changeCase })
        );
      }
    }
  } catch (e) {
    console.error(e);
  }
}

// Make a default configuration file
async function makeLiteTemplateConfigJs(configFilePath) {
  await fs.writeFile(
    configFilePath,
    beautify(
      `
    module.exports = {
      // You can change the template path to another path
      templatePath: "./.templates",
      // Copy the template file and the \`replaceFileTextFn\` function is executed.
      // When this function is executed, you can change the text in the file.
      replaceFileTextFn: (fileText, templateName, utils) => {
        // @see https://www.npmjs.com/package/change-case
        const { changeCase } = utils;
        return fileText.replace(/__\\$templateName__/gm, templateName)
        .replace(
          /__\\$templateNameToPascalCase__/gm,
          changeCase.pascalCase(templateName)
        )
        .replace(
          /__\\$templateNameToParamCase__/gm,
          changeCase.paramCase(templateName)
        );
      }
    }
  `,
      { indent_size: 2, space_in_empty_paren: true }
    )
  );
}

// Make a `.templates` folder at workspace and make `SampleTemplate` in `.templates` folder
async function makeSampleTemplate(templatePath) {
  // Make template path and subfolders
  await fs.mkdirs(templatePath);
  await fs.writeFile(
    path.resolve(templatePath, "index.js"),
    beautify(
      `
    export default function __$templateName__() {
      console.log("Plain -> __$templateName__");
      console.log("ParamCase -> __$templateNameToParamCase__");
      console.log("PascalCase -> __$templateNameToPascalCase__");
    }
  `,
      { indent_size: 2, space_in_empty_paren: true }
    )
  );
}

async function copyTemplate(_context, isRenameTemplate) {
  try {
    const workspaceRootPath = vscode.workspace.rootPath;
    const configFilePath = path.resolve(
      workspaceRootPath,
      "lite-template.config.js"
    );

    // If not exist configuration file, make a default configuration file at workspace.
    if (!(await fs.pathExists(configFilePath))) {
      await makeLiteTemplateConfigJs(configFilePath);
    }

    const config = require(configFilePath);
    const templatePath = path.resolve(workspaceRootPath, config.templatePath);

    // If not exist `config.templatePath`, make `.templates` folder and  make `LiteTemplateSample` in `.templates`
    if (!(await fs.pathExists(templatePath))) {
      await makeSampleTemplate(
        path.resolve(templatePath, "lite-template-sample")
      );
    }

    const workingPathDir = getWorkingPathDir(
      _context,
      vscode.window.activeTextEditor,
      vscode.workspace
    );

    const templatePaths = await fs.readdir(templatePath);

    const templateName = await vscode.window.showQuickPick(templatePaths, {
      placeHolder: "Choose a template"
    });

    // If no input data, do nothing
    if (templateName === undefined) {
      return;
    }

    // Copy template to path
    const srcPath = path.resolve(templatePath, templateName);

    // Input template name from user
    const dstTemplateName = isRenameTemplate
      ? await vscode.window.showInputBox({
          prompt: "Input a template name",
          value: templateName
        })
      : templateName;

    const dstPath = path.resolve(workingPathDir, dstTemplateName);
    await fs.copy(srcPath, dstPath);
    replaceTextInFiles(dstPath, dstTemplateName, config.replaceFileTextFn);
    vscode.window.showInformationMessage("Lite-Template: copied!");
  } catch (e) {
    console.error(e.stack);
    vscode.window.showErrorMessage(e.message);
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // This line of code will only be executed once when your extension is activated
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.copyTemplate", context =>
      copyTemplate(context, false)
    ),

    vscode.commands.registerCommand(
      "extension.copyTemplateWithRename",
      context => copyTemplate(context, true)
    )
  );
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
