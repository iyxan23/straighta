# Scheduling algorithm for StraightA

> Version 1.0
> Nur Ihsan Al Ghifari (iyxan23)

StraightA will generate a schedule for every week, based on the user's decline and growth of
specific subjects.

I think it's better to remove subjective scores, and focus on objective scores instead.

Before studying, do a test before and after, which will yield scores.

User has the ability to arbitrarily add scores each time. To increase the effectiveness of the
algorithm.

### Goals of scheduled study

Goal of a scheduled study session:

- Stop a material's score decline
- Increase a material's otherwise low score
- Keep a material's score at a safe range

### Variables

Variables per material:

- **Difference per week**

  Calculated based on the difference between the first day of the week, and the last day of the week.

- **Difference between study sessions**

  Calculated based on the per-day difference of the last study session, and the study session before it.

### Penetapan study session schedule

Algoritma akan membandingkan dari ketiga goal dari study session:

- Stop a material's score decline (Reviving)
- Increase a material's otherwise low score (Opportunities)
- Keep a material's score at a safe range (Review)

Arbitrary percentage: 70% 20% 10%

Each of these three will be calculated for every material:

- BI (declined 12 over the past 3 days), Sj (declined 7 over the past 2 days), Math (declined 13 over the past 3 days)
- PJOK (now 46), PPKn (now 34)
- IPA (97), IPS (96)

(anggap saja pembelajaran2 ini adalah materi)

On 1 and 2, the materials will be sorted in an ascending order, which means selected subjects will be the "worst" ones.
On 3, it will be sorted descendingly, and subjects that aren't frequent will be prioritised.

If there is little to no decline, then 2 and 3 will expand accordingly.

Now that we've chosen our material. Let's see if they fit in the schedule. A subject may be
referenced more than one day.

In this development stage, StraightA will only schedule evening schedules, and an optional
long-hours for saturday & sunday.

Each material will be calculated a weight on this stage.

I'm thinking of arbitrarily setting a weight for these materials like postgres does with its cost
calculation. But I don't think that's a good idea, considering that each user has their own learning
style, environment, variables and preferences. So it must come dynamically from other values coming
from the user itself.

Bit confused about where to derive weight from.

Weight: How impactful if a study session were to be conducted on this specific material. Consider
the weights according to the arbitrarily-set percentage, and weigh each material to get the highest
weights.

Okay, okay I'm getting some ideas

What if we calculate the effectiveness of a study session based on previous study sessions, per minute.
Since a study session can contain a break and study time. We will only need the study time.

Then calculate the difference between the before & after tests (that can vary), and then compare it
to other study sessions?

Weight for declining: 

### Calculated decline of material score

Every week, a material's overall score will be reduced based on the distance between:

```js
const lastStudySession = studySessions[studySessions.length - 1];
const secondLastStudySession = studySessions[studySessions.length - 2];

const difference =
  ((secondLastStudySession.afterTest - lastStudySession.beforeTest) /
    (lastStudySession.time - secondLastStudySession.time)) *
  time;

material.score.reduce(difference < 0 ? difference : 1);
```

Bahasa gampangnya, dikurangi sesuai dengan kecepatan kelupaan pengguna setelah tidak melakukan
sesi pembelajaran.

## First log-ins

On the first log-ins of the user, there won't be any meaningful data to be able to be processed.
So in other words, the algorithm will need to learn the user itself.

## What I could do better

What I would do if I had more time and resources, I'd kick on a machine learning on this project.
It's much more easier letting a machine learning algorithm learn the study patterns of a user. Than
to hypothetically guess the pattern behind it.

## Internal Implementation

Internally, the algorithm calculation is done lazily. It only does it when the user wants it.

When the user fetches /api/schedule, it will check if there already is a schedule, if not, then
run the algorithm to create one.

If I could do better, if this was not hosted on vercel, I could do a some kind of OLAP or
aggregation warehouse in the background, crunching user data and generating some kind of meaningful
schedule for them.

## Footnote

I compiled this algorithm without prior research, nor do I have any experience with statistics,
or even education. I am doing this of my own interest and I hope it provides a good framework for
further development.
