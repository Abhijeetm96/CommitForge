export interface KidMetaphor {
  id: string;
  term: string;
  kidTitle: string;
  emoji: string;
  oneLiner: string;
  funStory: string;
  commandSnippet?: string;
}

export const KID_METAPHORS: Record<string, KidMetaphor> = {
  git: {
    id: 'git',
    term: 'Git',
    kidTitle: 'The Magic Time Machine Camera',
    emoji: '⏳',
    oneLiner: 'A magic camera that takes snapshots of your project so you can travel back in time whenever you want!',
    funStory: 'Imagine you are building a giant Lego castle. If your cat knocks down a tower, normally you would cry. But with Git, you can press a button and BAM! Your castle jumps back to how it looked 5 minutes ago!',
  },
  'working-tree': {
    id: 'working-tree',
    term: 'Working Tree / Directory',
    kidTitle: 'My Lego Craft Desk',
    emoji: '🎨',
    oneLiner: 'Your messy play desk where you draw, edit code, and build new things right now.',
    funStory: 'This is your actual workspace. Crayons are out, Lego blocks are on the floor. Everything you are playing with right now sits on this desk. If you want to keep something forever, you pack it up next!',
    commandSnippet: 'git status  # See what toys and drawings are on your desk',
  },
  'staging-area': {
    id: 'staging-area',
    term: 'Staging Area / Index',
    kidTitle: 'The Adventure Backpack',
    emoji: '🎒',
    oneLiner: 'The backpack where you pick and choose which toys or drawings are ready for the next photo.',
    funStory: 'Before you go to a friend’s house, you don’t bring every single toy in your bedroom. You pick your favorite 2 toys and put them inside your backpack. That is what `git add` does!',
    commandSnippet: 'git add <file>  # Pack a file into your adventure backpack',
  },
  commit: {
    id: 'commit',
    term: 'Commit',
    kidTitle: 'Polaroid Photo / Game Save Point',
    emoji: '📸',
    oneLiner: 'A permanent photograph and game save checkpoint frozen in time forever.',
    funStory: 'Like beating a boss in Mario or Minecraft and hearing that lovely "Checkpoint Reached!" chime. Once you take a Polaroid photo of your backpack, it is saved forever in your photo album!',
    commandSnippet: 'git commit -m "Added castle towers"  # Snap and label your photo',
  },
  repository: {
    id: 'repository',
    term: 'Repository',
    kidTitle: 'The Magic Photo Album',
    emoji: '📚',
    oneLiner: 'The unbreakable binder holding every Polaroid photo you ever took since day one.',
    funStory: 'A huge, glowing memory book. Even if you make a 100-page comic book, every single draft you ever saved is safely stored inside this album.',
    commandSnippet: 'git log --oneline  # Flip through the pages of your photo album',
  },
  branch: {
    id: 'branch',
    term: 'Branch',
    kidTitle: 'Choose-Your-Own-Adventure Story Path',
    emoji: '🌳',
    oneLiner: 'A parallel timeline where you can test wild, crazy ideas without breaking your main story.',
    funStory: 'Want to see if your castle looks cooler with purple lasers or dinosaur guards? Make a new story branch! If the lasers look silly, just toss that branch away. Your original castle on `main` is 100% safe!',
    commandSnippet: 'git switch -c feature/lasers  # Jump into your new adventure timeline',
  },
  head: {
    id: 'head',
    term: 'HEAD',
    kidTitle: 'The "You Are Here" Sticker',
    emoji: '📍',
    oneLiner: 'The bright glowing bookmark that shows which photo or story page you are looking at right now.',
    funStory: 'Just like the red "You Are Here!" pin on a theme park map, HEAD tells your computer which moment in time your eyes are currently on.',
    commandSnippet: 'git status  # Look at where your sticker is pointing',
  },
  merge: {
    id: 'merge',
    term: 'Merge',
    kidTitle: 'Superpower High-Five',
    emoji: '🤝',
    oneLiner: 'Combining your cool drawings with your friend’s cool drawings into one master adventure.',
    funStory: 'You drew the spaceship, your friend drew the alien pilot. When you do a Superpower High-Five (merge), both drawings combine into one epic poster!',
    commandSnippet: 'git merge feature/pilot  # Combine your friend\'s branch into main',
  },
  conflict: {
    id: 'conflict',
    term: 'Merge Conflict',
    kidTitle: 'The Coloring Book Mix-Up',
    emoji: '🧩',
    oneLiner: 'Two people colored the exact same spot on the page with different colors. You decide which color stays!',
    funStory: 'You colored the dragon blue, and your best friend colored the same dragon red. Git asks: "Hey team! Do you want the dragon to be blue, red, or both?" You pick the winner, and peace is restored!',
    commandSnippet: 'Choose your favorite version in the editor, then git add and git commit!',
  },
  remote: {
    id: 'remote',
    term: 'Remote / GitHub',
    kidTitle: 'The Cloud Castle in the Sky',
    emoji: '☁️',
    oneLiner: 'A secret treehouse in the cloud where all your friends share their photo albums.',
    funStory: 'Even if your computer turns off or your dog steps on the keyboard, your project is safely locked in the Cloud Castle so you never lose it.',
    commandSnippet: 'git push origin main  # Send your latest photo to the Cloud Castle',
  },
  push: {
    id: 'push',
    term: 'Push',
    kidTitle: 'Rocket Launch to the Cloud',
    emoji: '🚀',
    oneLiner: 'Launching your new Polaroid photos up into the Cloud Castle for friends to see.',
    funStory: '3... 2... 1... Blastoff! All the save points you made on your computer shoot up to GitHub.',
    commandSnippet: 'git push -u origin main',
  },
  pull: {
    id: 'pull',
    term: 'Pull',
    kidTitle: 'Parachute Delivery from Friends',
    emoji: '🪂',
    oneLiner: 'Catching new updates and photos dropped down from your friends in the Cloud Castle.',
    funStory: 'Your friend just added a rocket booster to your game. `git pull` parachutes their new code right onto your Lego desk!',
    commandSnippet: 'git pull origin main',
  },
  restore: {
    id: 'restore',
    term: 'Restore / Undo',
    kidTitle: 'The Magic Eraser',
    emoji: '🧽',
    oneLiner: 'Wipe away accidental scribbles on your desk and get your clean drawing back.',
    funStory: 'Spilled juice on your paper? The magic eraser wipes the paper clean and restores it to how it looked in your last photo!',
    commandSnippet: 'git restore <file>  # Erase unsaved mistakes on your desk',
  },
  diff: {
    id: 'diff',
    term: 'Diff',
    kidTitle: 'Magic Highlighter',
    emoji: '🖍️',
    oneLiner: 'Green highlighter = brand new things you added! Red highlighter = things you erased!',
    funStory: 'Ever played "Spot the Difference" in a puzzle book? Git highlights every changed word so you can see exactly what is new.',
    commandSnippet: 'git diff  # Turn on the magic highlighter',
  },
};

/**
 * Returns a friendly 1-sentence kid translation for repository status
 */
export function getKidStatusSummary(workingCount: number, stagedCount: number, commitCount: number): string {
  if (stagedCount > 0) {
    return `🎒 Backpack has ${stagedCount} item${stagedCount === 1 ? '' : 's'} ready! Snap your photo with git commit!`;
  }
  if (workingCount > 0) {
    return `🎨 You made changes to ${workingCount} file${workingCount === 1 ? '' : 's'} on your desk. Pack them with git add!`;
  }
  if (commitCount === 0) {
    return `🌱 Fresh new project! Type your first command to start your adventure.`;
  }
  return `✨ All clean and tidy! Your desk is organized and all photos are safely saved.`;
}

/**
 * Quick plain English explanations for specific commands
 */
export const KID_COMMAND_CHIPS = [
  {
    cmd: 'git status',
    label: '🔍 Check Desk',
    hint: 'Look at what you drew or changed on your desk',
    color: '#38bdf8',
  },
  {
    cmd: 'git add .',
    label: '🎒 Pack All',
    hint: 'Put all your new drawings into your adventure backpack',
    color: '#fb923c',
  },
  {
    cmd: 'git commit -m "Save my progress"',
    label: '📸 Snap Photo',
    hint: 'Freeze this moment forever with a game save point',
    color: '#4ade80',
  },
  {
    cmd: 'git log --oneline',
    label: '📜 Photo Album',
    hint: 'Flip through your saved Polaroid photos',
    color: '#a855f7',
  },
  {
    cmd: 'git diff',
    label: '🖍️ Spot Differences',
    hint: 'See what lines you added (green) or removed (red)',
    color: '#f43f5e',
  },
];
