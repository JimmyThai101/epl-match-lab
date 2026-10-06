const GROUPS = [
  {
    title: "How a soccer match works",
    items: [
      {
        term: "The aim",
        meaning:
          "Two teams of 11 try to put the ball into the other team’s goal. After about 90 minutes, the side with more goals wins.",
      },
      {
        term: "Goal",
        meaning:
          "The whole ball crosses the white line between the posts and under the bar. That is one goal.",
      },
      {
        term: "Draw / tie",
        meaning: "Both teams finish with the same number of goals. Each gets 1 point in the table.",
      },
      {
        term: "Kick-off",
        meaning: "The start of the match, or the restart after a goal. The listed time is usually in UK time.",
      },
      {
        term: "Half-time",
        meaning: "A short break after 45 minutes. Teams swap ends for the second half.",
      },
      {
        term: "Added time",
        meaning:
          "Extra minutes at the end of a half for stoppages (injuries, substitutions). It is still the same match.",
      },
      {
        term: "Home and away",
        meaning:
          "Home is the club’s own stadium. Away means they are the visitors. Home sides often have a small edge.",
      },
    ],
  },
  {
    title: "Who does what on the pitch",
    items: [
      {
        term: "Goalkeeper (GK)",
        meaning:
          "The only player who may use hands (inside their box). Their job is to stop shots. A “clean sheet” means they let in zero goals.",
      },
      {
        term: "Defender (DEF)",
        meaning: "Plays nearer their own goal. Tries to block attacks and win the ball back.",
      },
      {
        term: "Midfielder (MID)",
        meaning:
          "The link in the middle. Some break up play, some create chances, some score. Assists often come from here.",
      },
      {
        term: "Forward (FWD)",
        meaning: "Plays nearest the other team’s goal. Main job is to score, or occupy defenders so others can.",
      },
      {
        term: "Coach / manager",
        meaning: "Picks the team, the tactics, and substitutions. Not one of the 11 on the pitch.",
      },
      {
        term: "Substitute",
        meaning: "A player on the bench who can come on later. Minutes can be low even if they are important.",
      },
    ],
  },
  {
    title: "The Premier League table",
    items: [
      {
        term: "Premier League",
        meaning:
          "The top division in English men’s club soccer. 20 clubs play each other home and away (38 matches each).",
      },
      {
        term: "Table / standings",
        meaning:
          "The ranking of all 20 clubs. Win = 3 points, draw = 1, loss = 0. More points means higher place.",
      },
      {
        term: "Goal difference (GD)",
        meaning:
          "Goals scored minus goals conceded. If two clubs have the same points, the one with better GD is usually higher.",
      },
      {
        term: "Form",
        meaning:
          "The last few league results, oldest to newest. W = win, D = draw, L = loss. A hot streak can hide a slow start.",
      },
      {
        term: "Relegation",
        meaning:
          "The bottom clubs drop into the division below next season. (This lab does not predict that.)",
      },
    ],
  },
  {
    title: "Numbers you will see in this lab",
    items: [
      {
        term: "Kit colors",
        meaning:
          "Each club has a main color on this site. Team A’s bars, borders, and photo frames use Team A’s color; Team B uses its own. That is so you can tell whose number is whose at a glance.",
      },
      {
        term: "Goals / game",
        meaning: "How often that club scores, on average, in league matches counted so far.",
      },
      {
        term: "Goals conceded / game",
        meaning: "How often they let a goal in. Lower is better for the defence.",
      },
      {
        term: "xG (expected goals)",
        meaning:
          "A model of how many goals the chances were worth, not just the ones that went in. A lucky bounce can beat xG; a great keeper can sit under it.",
      },
      {
        term: "Assist",
        meaning: "The pass or setup that led to a goal. The scorer gets the goal; the helper gets the assist.",
      },
      {
        term: "Starts vs minutes",
        meaning:
          "A start means they began the match. Minutes is time on the pitch, including coming off the bench.",
      },
      {
        term: "Fixture rating",
        meaning:
          "Fantasy Premier League’s 1–5 difficulty for that matchup. 1 is usually easier, 5 is usually tougher. It is a game rating, not a guarantee.",
      },
      {
        term: "Players facing off",
        meaning:
          "On the snapshot we pair similar jobs (goalkeepers, main scorers, chance makers). Photos are shown in profile so they look toward each other. It is a visual, not a prediction of who would win a duel.",
      },
    ],
  },
  {
    title: "Cards, fitness, and money words",
    items: [
      {
        term: "Yellow card",
        meaning: "A caution. Two yellows in one match become a red. Too many yellows over a season can mean a ban.",
      },
      {
        term: "Red card",
        meaning: "Sent off. The team plays with one fewer player for the rest of that match.",
      },
      {
        term: "Injured / doubtful",
        meaning:
          "May miss the next match. News lines in this lab come from the public Fantasy Premier League feed.",
      },
      {
        term: "FPL price",
        meaning:
          "A made-up cost in the Fantasy Premier League video-game-like contest. It is not a real salary or transfer fee.",
      },
      {
        term: "Wage / signing",
        meaning:
          "Shown only when a public community database lists it. Figures can be old or missing. We never invent them.",
      },
    ],
  },
];

export function GuidePanel() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Soccer, explained slowly
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
          You do not need to know the sport to use this lab. Read a section, skip the rest, come back
          when a word pops up on the snapshot. Nothing here is a prediction — only a map of the words
          and numbers on the screen.
        </p>
      </section>

      {GROUPS.map((group) => (
        <section key={group.title} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-8">
          <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">{group.title}</h3>
          <dl className="mt-5 divide-y divide-slate-100">
            {group.items.map((item) => (
              <div key={item.term} className="py-4 sm:grid sm:grid-cols-[13rem_1fr] sm:gap-8 sm:py-5">
                <dt className="text-base font-semibold text-slate-900 sm:text-lg">{item.term}</dt>
                <dd className="mt-1.5 text-[15px] leading-7 text-slate-600 sm:mt-0 sm:text-lg sm:leading-8">
                  {item.meaning}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
