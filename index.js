import parseDiff from "parse-diff";
import { LANGUAGE_EXT_TO_COMMENT_MAP } from "./constants.js";
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
export default (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on(
    [
      "pull_request.opened",
      "pull_request.reopened",
      "pull_request.synchronize",
    ],
    async (context) => {
      const pr = context.payload.pull_request;
      const { owner, repo } = context.repo();

      const sourceBranch = pr.head.ref;
      const targetBranch = pr.base.ref;

      context.log.info(`Source branch: ${sourceBranch}`);
      context.log.info(`Target branch: ${targetBranch}`);

      // Fetch the diff of the pull request
      const diffUrl = pr.diff_url;
      const diffResponse = await context.octokit.request(`GET ${diffUrl}`);
      const diffText = diffResponse.data;
      const files = parseDiff(diffText);

      const fileNames = files.map((file) => file.to);

      if (
        fileNames.length === 1 &&
        fileNames[0].toLowerCase() === "readme.md"
      ) {
        await context.octokit.issues.createComment({
          owner,
          repo,
          issue_number: pr.number,
          body: "This pull request has been closed because it only updates the README file. If this was unintentional, please update the PR with additional changes and reopen it.",
        });

        await context.octokit.pulls.update({
          owner,
          repo,
          pull_number: pr.number,
          state: "closed",
        });
        return;
      }

      // Check if all changes are comment updates
      let onlyCommentChanges = true;

      files.forEach((file) => {
        const commentSymbol = LANGUAGE_EXT_TO_COMMENT_MAP[file.to.split(".").pop()];

        if (!commentSymbol) {
          // Skip files where comments cannot be detected
          context.log.info(
            `Skipping file ${file.to} as its language is unsupported for comment detection.`
          );
          onlyCommentChanges = false;
          return;
        }

        file.chunks.forEach((chunk) => {
          chunk.changes.forEach((change) => {
            if (
              change.add &&
              !change.content.trim().startsWith(commentSymbol)
            ) {
              onlyCommentChanges = false;
            }
          });
        });
      });

      if (onlyCommentChanges) {
        // Add a comment explaining why the PR is being closed
        await context.octokit.issues.createComment({
          owner,
          repo,
          issue_number: pr.number,
          body: "This pull request has been closed because all the changes it contains are updates to comments only. If this was unintentional, please update the PR with additional changes and reopen it.",
        });

        // Close the pull request if all changes are comment updates
        await context.octokit.pulls.update({
          owner,
          repo,
          pull_number: pr.number,
          state: "closed",
        });

        context.log.info(
          `PR #${pr.number} has been closed because it only contains comment updates.`
        );
      }
    }
  );
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
