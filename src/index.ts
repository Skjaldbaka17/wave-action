import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";

export async function run() {
  const token = getInput("gh-token");
  const label = getInput("label");
  const userToken = getInput("user-gh-token");

  const octokit = getOctokit(userToken);
  const pullRequest = context.payload.pull_request;

  const userName = await octokit.rest.users.getAuthenticated();
  console.log("USERNAME:", userName.data);

  try {
    if (!pullRequest) {
      throw new Error("This action can only be run on Pull Requests");
    }

    await octokit.rest.issues.createComment({
      //   owner: context.repo.owner,
      //   repo: context.repo.repo,
      //   issue_number: pullRequest.number,
      //   labels: [label],
      body: "Testing this new thing",
      issue_number: pullRequest.number,
      owner: userName.data.login!,
      repo: context.repo.repo,
    });
  } catch (error) {
    setFailed((error as Error)?.message ?? "Unknown error");
  }
}

run();
