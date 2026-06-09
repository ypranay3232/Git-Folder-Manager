import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {

	const addGitKeepCommand = vscode.commands.registerCommand(
		"git-folder-manager.addGitKeep",
		() => {
			const workspaceFolders = vscode.workspace.workspaceFolders;

			if (!workspaceFolders) {
				vscode.window.showErrorMessage("No workspace opened");
				return;
			}

			const rootPath = workspaceFolders[0].uri.fsPath;

			const count = scanFolders(rootPath);

			vscode.window.showInformationMessage(
				`${count} .gitkeep file(s) created`
			);
		}
	);

	const removeGitKeepCommand = vscode.commands.registerCommand(
		"git-folder-manager.removeGitKeep",
		() => {
			const workspaceFolders = vscode.workspace.workspaceFolders;

			if (!workspaceFolders) {
				vscode.window.showErrorMessage(
					"No workspace opened"
				);
				return;
			}

			const rootPath = workspaceFolders[0].uri.fsPath;

			const removedCount = removeUnusedGitKeep(rootPath);

			vscode.window.showInformationMessage(
				`${removedCount} .gitkeep file(s) removed`
			);
		}
	);
	const generateGitIgnoreCommand = vscode.commands.registerCommand(
		"git-folder-manager.generateGitIgnore",
		() => {

			const workspaceFolders =
				vscode.workspace.workspaceFolders;

			if (!workspaceFolders) {
				vscode.window.showErrorMessage(
					"No workspace opened"
				);
				return;
			}

			const rootPath =
				workspaceFolders[0].uri.fsPath;

			createGitIgnore(rootPath);

			vscode.window.showInformationMessage(
				".gitignore created successfully"
			);
		}
	);


	context.subscriptions.push(addGitKeepCommand);
	context.subscriptions.push(removeGitKeepCommand);
	context.subscriptions.push(generateGitIgnoreCommand);
}

function scanFolders(folderPath: string): number {

	const ignoredFolders = [
		".git",
		"node_modules",
		"dist",
		"out"
	];

	let createdCount = 0;

	const items = fs.readdirSync(folderPath);

	if (items.length === 0) {

		const gitkeepPath = path.join(folderPath, ".gitkeep");

		if (!fs.existsSync(gitkeepPath)) {
			fs.writeFileSync(gitkeepPath, "");
			createdCount++;
		}

		return createdCount;
	}

	for (const item of items) {

		if (ignoredFolders.includes(item)) {
			continue;
		}

		const fullPath = path.join(folderPath, item);

		if (fs.statSync(fullPath).isDirectory()) {
			// Accumulate counts from subfolders
			createdCount += scanFolders(fullPath);
		}
	}

	return createdCount;
}
function removeUnusedGitKeep(
	folderPath: string
): number {

	const ignoredFolders = [
		".git",
		"node_modules",
		"dist",
		"out"
	];

	let removedCount = 0;

	const items =
		fs.readdirSync(folderPath);

	for (const item of items) {

		if (ignoredFolders.includes(item)) {
			continue;
		}

		const fullPath =
			path.join(folderPath, item);

		if (
			fs.statSync(fullPath).isDirectory()
		) {

			removedCount +=
				removeUnusedGitKeep(fullPath);
		}
	}

	const currentItems =
		fs.readdirSync(folderPath);

	if (
		currentItems.includes(".gitkeep")
	) {

		const realItems =
			currentItems.filter(
				item => item !== ".gitkeep"
			);

		if (realItems.length > 0) {

			fs.unlinkSync(
				path.join(
					folderPath,
					".gitkeep"
				)
			);

			removedCount++;
		}
	}

	return removedCount;
}

function createGitIgnore(
	rootPath: string
) {

	const gitIgnorePath =
		path.join(rootPath, ".gitignore");

	if (fs.existsSync(gitIgnorePath)) {

		vscode.window.showWarningMessage(
			".gitignore already exists"
		);

		return;
	}

	const content = `node_modules/
dist/
out/
build/
.env
`;

	fs.writeFileSync(
		gitIgnorePath,
		content
	);
}

export function deactivate() { }