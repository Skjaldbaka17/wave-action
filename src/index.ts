import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";

const generateRandomSentence = (): string => {
  const emojis = [
    "🌊",
    "🔥",
    "🌟",
    "🍀",
    "🌸",
    "🌈",
    "🌞",
    "🌜",
    "🎉",
    "🎈",
    "✨",
    "💫",
    "🍕",
    "🎶",
    "🎨",
  ];
  const variations = [
    "This is quite nice, but it could use a bit more waves ",
    "This is fairly nice, but a bit more waves would be good ",
    "This is lovely, though a tad more waves would make it even better ",
    "This is nice, yet a bit more waves would knock it out the park! ",
    "This is rather nice, but a touch more waves I think would rock ",
    "This is pretty good, but needs a bit more waves ",
    "This is really nice, but a bit more waves... ",
    "This is quite good, although it could use more waves, or what? ",
    "This is awesome, but it could use more waves ",
    "This is cool, but a bit more waves ",
    "This is amazing, but needs a bit more waves ",
    "This is wonderful, yet a bit more waves, THAT would be cool ",
    "This is splendid, though a touch more waves ",
    "This is superb, but could use a bit more waves ",
  ];

  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  const randomVariation =
    variations[Math.floor(Math.random() * variations.length)];

  return randomVariation + randomEmoji;
};

console.log(generateRandomSentence());

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
      body: generateRandomSentence(),
      issue_number: pullRequest.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
    });
  } catch (error) {
    setFailed((error as Error)?.message ?? "Unknown error");
  }
}

run();
