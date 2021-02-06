// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const fs = require("fs-extra");
const changeCase = require("change-case");

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

async function replaceTextInFiles(
  filePath,
  templateName,
  replaceFileTextFn,
  renameFileFn,
  renameSubDirectoriesFn
) {
  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      const files = await fs.readdir(filePath);
      await Promise.all(
        files.map(async entryFilePath => {
          return replaceTextInFiles(
            path.resolve(filePath, entryFilePath),
            templateName,
            replaceFileTextFn,
            renameFileFn,
            renameSubDirectoriesFn
          )
        })
      );
      if (typeof renameSubDirectoriesFn === 'function') {
        const currDirectoryName = path.basename(filePath);
        const newDirectoryName = renameSubDirectoriesFn(currDirectoryName, templateName, {
          changeCase,
          path
        });
        const newPath = path.resolve(filePath, '../', newDirectoryName);
        fs.renameSync(filePath, newPath);
      }
    } else {
      const fileText = (await fs.readFile(filePath)).toString("utf8");
      if (typeof replaceFileTextFn === "function") {
        await fs.writeFile(
          filePath,
          replaceFileTextFn(fileText, templateName, { changeCase, path })
        );
        /**
         * Rename file
         * @ref https://github.com/stegano/vscode-template/issues/4
         */
        if (typeof renameFileFn === "function") {
          const filePathInfo = path.parse(filePath);
          const { base: originalFilename } = filePathInfo;
          const filename = renameFileFn(originalFilename, templateName, {
            changeCase,
            path
          });
          const _filePath = path.resolve(filePathInfo.dir, filename);
          filename && fs.renameSync(filePath, _filePath);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}

// Make a default configuration file
async function makeTemplateConfigJs(configFilePath) {
  const defaultConfigFile = (
    await fs.readFile(path.resolve(__dirname, "./assets", "template.config.js"))
  ).toString("utf8");
  await fs.writeFile(configFilePath, defaultConfigFile);
}

// Make a `.templates` folder in workspace and make sample templates in `.templates` folder
async function makeSampleTemplate(templateRootPath) {
  const defaultSampleTemplatesPath = path.resolve(
    __dirname,
    "./assets/.templates"
  );

  // Make template path and subfolders
  await fs.mkdirs(templateRootPath);
  await fs.copy(defaultSampleTemplatesPath, templateRootPath);
}

async function createNew(_context, isRenameTemplate) {
  try {
    const workspaceRootPath = vscode.workspace.rootPath;
    const configFilePath = path.resolve(
      workspaceRootPath,
      "template.config.js"
    );

    // If not exist configuration file, make a default configuration file at workspace.
    if (!(await fs.pathExists(configFilePath))) {
      await makeTemplateConfigJs(configFilePath);
    }

    /**
     * Clear the `template.config.js` cache from `require`
     */
    delete require.cache[configFilePath];
    const config = require(configFilePath);
    const templateRootPath = path.resolve(
      workspaceRootPath,
      config.templateRootPath || config.templatePath // deprecated `config.templatePath`
    );

    // If not exist `config.templateRootPath`, make `.templates` folder and make sample templates in `.templates`
    if (!(await fs.pathExists(templateRootPath))) {
      await makeSampleTemplate(templateRootPath);
    }

    const workingPathDir = getWorkingPathDir(
      _context,
      vscode.window.activeTextEditor,
      vscode.workspace
    );

    const templatePaths = await fs.readdir(templateRootPath);

    const templateName = await vscode.window.showQuickPick(templatePaths, {
      placeHolder: "Choose a template"
    });

    // If no input data, do nothing
    if (templateName === undefined) {
      return;
    }

    // Copy a template to path
    const srcPath = path.resolve(templateRootPath, templateName);

    // Input template name from user
    const dstTemplateName = isRenameTemplate
      ? await vscode.window.showInputBox({
        prompt: "Input a template name",
        value: templateName
      })
      : templateName;

    const dstPath = path.resolve(workingPathDir, dstTemplateName);
    await fs.copy(srcPath, dstPath);
    replaceTextInFiles(
      dstPath,
      dstTemplateName,
      config.replaceFileTextFn,
      /**
       * @deprecated `replaceFileNameFn` is deprecated, using `renameFileFn`
       */
      config.replaceFileNameFn && config.renameFileFn,
      config.renameSubDirectoriesFn
    );
    vscode.window.showInformationMessage("Template: copied!");
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
    vscode.commands.registerCommand("extension.createNew", context =>
      createNew(context, false)
    ),
    vscode.commands.registerCommand("extension.createNewWithRename", context =>
      createNew(context, true)
    )
  );
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
  activate,
  deactivate
};
