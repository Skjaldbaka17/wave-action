import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";

const generateRandomSentence = (): string => {
  // DO IT!
  const wavesYT = [
    "https://youtu.be/pUjE9H8QlA4?si=FqKSxR6SOnH7orih",
    "https://youtu.be/bn9F19Hi1Lk?si=gW1dc24YX-H5KFA1",
    "https://youtu.be/vPhg6sc1Mk4?si=_7BMILSIwqQppM1Y",
    "https://youtu.be/dKlgCk3IGBg?si=aWHu9oZ64l1y9dhO",
    "https://youtu.be/nydwk87iEuM?si=22EhIOoCv7gGnDw3",
    "https://youtu.be/0a5WyAjL1MM?si=1dPtsJ8DHF8nW8m4",
    "https://youtu.be/zZqxPozl2Ec?si=BAm5JCxQUtGv4aaD",
    "https://youtu.be/JkMWoHjnaRw?si=Rakn8u285i3UGg5-",
    "https://youtu.be/mRD0-GxqHVo?si=IiBNuPF3iLqWvTzV",
    "https://youtu.be/UIevTTLB_3Q?si=fliBUG8Uz-miLhjr",
    "https://youtu.be/bjOGNVH3D4Y?si=bXwVFdq6eH_-CcoL",
    "https://youtu.be/o-llwv4pLrg?si=N8KNaJqypZxAxsql",
    "https://youtu.be/x-x-eyZf8Ko?si=_2DUfrv7tQnN_wCU",
    "https://youtu.be/6vVa6jiDQF8?si=lWBWxQEaoLyRXpKY",
    "https://youtu.be/ckWRHc85yBU?si=YVitxrhEdbKeFgFF",
    "https://youtu.be/vq24zYNUTpE?si=GDXX2aMfgK_YJ21l",
    "https://youtu.be/anLxLPzgIG4?si=b9QmYMx-ZOmv5kUQ",
    "https://youtu.be/JCLPMoT8FRY?si=cdOA4STNJuEJC1zy",
    "https://youtu.be/eNpqsJM-JLw?si=23NRgFheddn5MwHU",
    "https://youtu.be/p1iu_U4kYWs?si=tnuK48pmbJNE0OlD",
    "https://youtu.be/W6TpQ3JcYfE?si=WbrqyGDFOWcIA8BE",
    "https://youtu.be/p-4GefgMY5c?si=S3CMxKxZN1GfL6Dz",
    "https://youtu.be/CLk7A7HXhYQ?si=nhWqeEq8hcm4WXhZ",
    "https://youtu.be/t-E9PjjMY-U?si=gxCn7gJWvzWaNGYv",
  ];
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
  // Commit
  const randomYoutubeLink = wavesYT[Math.floor(Math.random() * wavesYT.length)];
  const variations = [
    `This is quite delightful, but a sprinkle more of [waves](${randomYoutubeLink}) would elevate it 🌊`,
    `This is rather charming, yet a splash more of [waves](${randomYoutubeLink}) could really make it pop 🌊`,
    `This is lovely, but a surge of [waves](${randomYoutubeLink}) would truly amplify its beauty 🌊`,
    `This is nice, yet a ripple of [waves](${randomYoutubeLink}) would add an enchanting touch 🌊`,
    `This is quite appealing, but a wave of [waves](${randomYoutubeLink}) would bring it to life 🌊`,
    `This is pretty good, but a tide of [waves](${randomYoutubeLink}) would bring out its brilliance 🌊`,
    `This is really nice, yet a cascade of [waves](${randomYoutubeLink})... imagine the magic 🌊`,
    `This is quite good, though more [waves](${randomYoutubeLink}) could turn it into a masterpiece 🌊`,
    `This is awesome, but it craves more [waves](${randomYoutubeLink}) to reach its full potential 🌊`,
    `This is cool, but a swell of [waves](${randomYoutubeLink}) would set it apart 🌊`,
    `This is amazing, yet yearns for more [waves](${randomYoutubeLink}) to showcase its splendor 🌊`,
    `This is wonderful, yet a surge of [waves](${randomYoutubeLink}), now that's a vision 🌊`,
    `This is splendid, yet a flourish of [waves](${randomYoutubeLink}) would add a touch of grandeur 🌊`,
    `This is superb, but a crescendo of [waves](${randomYoutubeLink}) could turn heads 🌊`,
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
