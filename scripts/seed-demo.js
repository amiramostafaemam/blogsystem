// Fills Crema with demo content: the public demo writer plus two guest writers,
// their stories, and a few likes and responses between them.
// Safe to re-run: each writer's old stories are deleted first.
//
// Usage: npm run seed:demo   (reads VITE_SUPABASE_* from .env)

import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
// Guest writers are not public accounts, so their password stays out of the repo
const guestPassword = process.env.SEED_GUEST_PASSWORD;
if (!url || !key || !guestPassword) {
  console.error("Missing VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY or SEED_GUEST_PASSWORD in .env");
  process.exit(1);
}

const img = (id) => `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`;
const daysAgo = (n, hour = 9) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
};

const WRITERS = [
  {
    key: "nour",
    email: "demo@crema.app",
    password: "crema-demo",
    name: "Nour Adel",
    bio: "Slow mornings, strong coffee, and stories about the small things. This is the public demo account, so feel free to poke around.",
    posts: [
      {
        title: "The Slow Morning Ritual That Changed How I Write",
        image: img("1495474472287-4d71bcdd2085"),
        tags: ["writing", "coffee", "habits"],
        created_at: daysAgo(2, 7),
        content: `For years I wrote in the cracks of the day: five minutes on the bus, ten before a meeting. The words came out rushed, like coffee from a machine that never quite heats up.

Then I tried something different.

## Four minutes of nothing

Every morning, before opening a single notification, I brew one cup by hand. Grind, bloom, pour, wait. **Four minutes of doing nothing else.**

> The ritual isn't about the coffee. It's about telling your brain: *now we write.*

Something about that pause resets me. By the time the cup is ready, the first sentence usually is too.

## What you actually need

- A kettle
- Something you enjoy drinking
- A place where your phone isn't

You don't need a fancy setup. You need a small ritual that marks the start. Mine happens to smell like cardamom.`,
      },
      {
        title: "Journaling for People Who Hate Journaling",
        image: img("1455390582262-044cdead277a"),
        tags: ["habits", "writing"],
        created_at: daysAgo(9, 21),
        content: `I have abandoned more notebooks than I can count. Beautiful ones, with gold edges and good intentions.

What finally worked was lowering the bar until it was almost on the floor. **Three lines a night:**

1. One thing that happened
2. One thing I felt
3. One thing I want tomorrow

Some nights the lines are profound. Most nights they're about lunch. Both count.

Six months later, flipping back through those pages feels like talking to an old friend who remembers everything.`,
      },
      {
        title: "Why Every Neighborhood Needs a Third Place",
        image: img("1501339847302-ac426a4a7cbb"),
        tags: ["community", "coffee"],
        created_at: daysAgo(16, 15),
        content: `Sociologists call it the **third place**: not home, not work, but somewhere in between where you can simply exist among people.

For me it's a tiny café with mismatched chairs and a barista who remembers my order. I've written half my stories there, met two of my closest friends there, and cried there at least once.

> Third places are disappearing, replaced by delivery apps and home offices. We should protect the ones we have.

Go sit somewhere today. Order something. Stay a little longer than you need to.`,
      },
    ],
  },
  {
    key: "omar",
    email: "omar.writer@crema.app",
    name: "Omar Khaled",
    bio: "Frontend developer by day, weekend hiker by choice. Writes about code, mountains and the space between.",
    posts: [
      {
        title: "What Nobody Tells You About Your First 100 Days as a Developer",
        image: img("1498050108023-c5249f4df085"),
        tags: ["career", "tech"],
        created_at: daysAgo(4, 18),
        content: `Your first job in tech will not look like the tutorials. Nobody hands you a clean, empty folder and a clear spec.

Instead you'll inherit a codebase older than your degree, a Slack channel full of acronyms, and a bug that only happens on Tuesdays.

## What helped me

- **Keep a "today I learned" file.** Future you will search it constantly.
- **Ask the question**, even if it feels obvious. Someone else is wondering too.
- **Read code like a novel**: slowly, out of curiosity rather than fear.

\`\`\`js
// My favourite debugging tool, still
console.log("got here", { state });
\`\`\`

By day 100 you won't know everything. But you'll know where to look, and who to ask. That is the real skill.`,
      },
      {
        title: "A Weekend in the Mountains With No Signal",
        image: img("1506744038136-46273834b3fb"),
        tags: ["travel", "slow-living"],
        created_at: daysAgo(12, 10),
        content: `The last bar of signal disappeared somewhere around the third switchback. I panicked for about ten minutes. Then I noticed the quiet.

We hiked until our legs complained, cooked lentils on a tiny stove and watched the sky do things I had forgotten it could do.

Coming back, my phone had **214 notifications**. Exactly none of them mattered as much as that sunrise.

I'm not telling you to throw your phone into a lake. Just to find a place, once in a while, where it can't find you.`,
      },
    ],
  },
  {
    key: "lina",
    email: "lina.writer@crema.app",
    name: "Lina Farouk",
    bio: "Home barista, amateur baker, collector of good sentences.",
    posts: [
      {
        title: "Brewing Better Coffee at Home: A Beginner's Guide",
        image: img("1509042239860-f550ce710b93"),
        tags: ["coffee", "guide"],
        created_at: daysAgo(6, 8),
        content: `You don't need a €2,000 espresso machine to make a great cup. You need fresh beans, a little patience and three rules.

## The three rules

1. **Grind right before brewing.** Ground coffee goes stale in minutes, not days.
2. **Use water just off the boil**, around 93°C.
3. **Weigh, don't guess.** Start with a 1:16 ratio: 15 g coffee to 240 g water.

## My everyday pour-over

| Step | Time | Water |
| --- | --- | --- |
| Bloom | 0:00 | 40 g |
| First pour | 0:45 | up to 150 g |
| Final pour | 1:30 | up to 240 g |

> If it tastes sour, grind finer. If it tastes bitter, grind coarser. That's 80% of it.

Enjoy the process. The best cup is the one you had time to notice.`,
      },
      {
        title: "Notes From a Rainy Afternoon",
        image: img("1519681393784-d120267933ba"),
        tags: ["slow-living", "poetry"],
        created_at: daysAgo(20, 16),
        content: `The rain started at three and never really stopped.

I made tea instead of coffee, which felt like cheating. I read the same page of a novel four times. I watched a pigeon on the balcony take shelter with great dignity.

*Nothing happened, and it was lovely.*

Some afternoons are for doing. Some are just for being inside while the world gets washed.`,
      },
    ],
  },
];

// Who likes and responds to whom, to make the demo feel alive
const LIKES = [
  ["omar", "nour", 0], ["lina", "nour", 0], ["lina", "nour", 1], ["omar", "nour", 2],
  ["nour", "omar", 0], ["lina", "omar", 0], ["nour", "omar", 1],
  ["nour", "lina", 0], ["omar", "lina", 0], ["nour", "lina", 1],
];
const COMMENTS = [
  ["omar", "nour", 0, "The cardamom detail got me. Trying this tomorrow morning."],
  ["lina", "nour", 0, "Four minutes of nothing is harder than it sounds. Worth it though ☕"],
  ["nour", "omar", 0, "The Tuesday bug is too real. Saving this for every new hire I meet."],
  ["lina", "omar", 1, "214 notifications and not one sunrise. Beautifully put."],
  ["nour", "lina", 0, "Finally a guide that explains *why* sour means grind finer. Thank you!"],
  ["omar", "lina", 0, "Tried the 1:16 ratio this morning. Game changer."],
];

function clientFor() {
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function signInOrUp(writer) {
  const client = clientFor();
  const password = writer.password ?? `${writer.key}-${guestPassword}`;
  let { data, error } = await client.auth.signInWithPassword({ email: writer.email, password });
  if (error) {
    ({ data, error } = await client.auth.signUp({ email: writer.email, password, options: { data: { name: writer.name } } }));
    if (error || !data.session) throw new Error(`Could not sign in or sign up ${writer.email}: ${error?.message ?? "email confirmation is on"}`);
  }
  return { client, userId: data.user.id };
}

async function main() {
  const sessions = {};
  const postIds = {};

  for (const writer of WRITERS) {
    const { client, userId } = await signInOrUp(writer);
    sessions[writer.key] = client;

    const profile = await client.from("profiles").update({ name: writer.name, bio: writer.bio }).eq("id", userId);
    if (profile.error) throw profile.error;

    const removed = await client.from("posts").delete().eq("user_id", userId);
    if (removed.error) throw removed.error;

    const inserted = await client
      .from("posts")
      .insert(writer.posts.map((p) => ({ ...p, status: "published" })))
      .select("id, title");
    if (inserted.error) throw inserted.error;

    // keep the same order as the source list
    postIds[writer.key] = writer.posts.map((p) => inserted.data.find((row) => row.title === p.title).id);
    console.log(`✓ ${writer.name}: ${inserted.data.length} stories`);
  }

  for (const [who, author, index] of LIKES) {
    const { error } = await sessions[who].from("likes").insert({ post_id: postIds[author][index] });
    if (error) throw error;
  }
  console.log(`✓ ${LIKES.length} likes`);

  for (const [who, author, index, body] of COMMENTS) {
    const { error } = await sessions[who].from("comments").insert({ post_id: postIds[author][index], body });
    if (error) throw error;
  }
  console.log(`✓ ${COMMENTS.length} responses`);

  // A draft so the dashboard has something in the Drafts tab
  const draft = await sessions.nour.from("posts").insert({
    title: "Untitled thoughts on rainy cafés",
    content: "Started this one at the café on Tuesday…",
    status: "draft",
  });
  if (draft.error) throw draft.error;
  console.log("✓ 1 draft for the demo account");
}

main().catch((err) => {
  console.error("Seeding failed:", err.message ?? err);
  process.exit(1);
});
