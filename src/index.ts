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
    "This is quite delightful, but a sprinkle more waves would elevate it 🌊",
    "This is rather charming, yet a splash more waves could really make it pop 🌊",
    "This is lovely, but a surge of waves would truly amplify its beauty 🌊",
    "This is nice, yet a ripple of waves would add an enchanting touch 🌊",
    "This is quite appealing, but a wave of waves would bring it to life 🌊",
    "This is pretty good, but a tide of waves would bring out its brilliance 🌊",
    "This is really nice, yet a cascade of waves... imagine the magic 🌊",
    "This is quite good, though more waves could turn it into a masterpiece 🌊",
    "This is awesome, but it craves more waves to reach its full potential 🌊",
    "This is cool, but a swell of waves would set it apart 🌊",
    "This is amazing, yet yearns for more waves to showcase its splendor 🌊",
    "This is wonderful, yet a surge of waves, now that's a vision 🌊",
    "This is splendid, yet a flourish of waves would add a touch of grandeur 🌊",
    "This is superb, but a crescendo of waves could turn heads 🌊",
  ];

  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  const randomVariation =
    variations[Math.floor(Math.random() * variations.length)];

  return randomVariation + randomEmoji;
};

console.log(generateRandomSentence());

export async function run() {
  const userToCommentOn = getInput("user-to-comment-on");
  const userToken = getInput("user-gh-token");

  console.log("USER:", userToCommentOn);

  const octokit = getOctokit(userToken);
  const pullRequest = context.payload.pull_request;

  try {
    if (!pullRequest) {
      throw new Error("This action can only be run on Pull Requests");
    }

    // If only comment on specific user
    if (userToCommentOn) {
      const pr = await octokit.rest.pulls.get({
        pull_number: pullRequest.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
      });

      const creator = pr.data.user.login;
      if (creator !== userToCommentOn) {
        console.log("Creator not the same", creator, userToCommentOn);
        return;
      }
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
