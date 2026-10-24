/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Python Data Analysis Curriculum for Teens.
 * Bite-sized micro-lessons with code challenges, instant automated tests, and hints.
 */

import { ExecutionResult } from '../engine/pythonRunner';

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  shortDesc: string;
  xpReward: number;
  datasetId?: string;
  concept: string[];
  analogy: string;
  taskPrompt: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  validate: (result: ExecutionResult) => { passed: boolean; message: string };
}

export interface Module {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  lessons: Lesson[];
}

export const MODULES: Module[] = [
  {
    id: 'launchpad',
    number: 1,
    title: 'Python Launchpad',
    subtitle: 'Variables, Lists & Player Dictionaries',
    description: 'Get familiar with Python syntax using gaming XP, music queue lists, and character player cards.',
    lessons: [
      {
        id: 'xp-variables',
        moduleId: 'launchpad',
        title: '01. Gaming XP & Level Math',
        shortDesc: 'Variables, integer math, and formatted print output',
        xpReward: 50,
        concept: [
          'In Python, variables store information like a player score or username.',
          'You assign values using the equal sign: name = "Alex" or xp = 450.',
          'You can use arithmetic like + (add), * (multiply), and / (divide) to calculate stats.'
        ],
        analogy: 'Think of a variable as a labeled storage chest in Minecraft: whenever you open chest "xp", you retrieve the number stored inside.',
        taskPrompt: 'Calculate your total gaming XP! You defeated 8 bosses (each giving 250 XP) and completed 3 daily quests (each giving 100 XP). Multiply and add them up into a variable named total_xp, then print it out.',
        starterCode: `# Lesson 1.1: Calculate Gaming XP
boss_kills = 8
boss_xp = 250

quest_count = 3
quest_xp = 100

# TODO: Calculate total_xp by multiplying kills by boss_xp and quests by quest_xp
total_xp = (boss_kills * boss_xp) + (quest_count * quest_xp)

# TODO: Print the total_xp
print(f"Total XP Earned: {total_xp}")
`,
        solutionCode: `boss_kills = 8
boss_xp = 250
quest_count = 3
quest_xp = 100

total_xp = (boss_kills * boss_xp) + (quest_count * quest_xp)
print(f"Total XP Earned: {total_xp}")`,
        hints: [
          'Remember: multiplication is * and addition is +',
          'Make sure you assign the result to total_xp',
          'Use print(total_xp) to display the answer in the console'
        ],
        validate: (res) => {
          if (!res.success) return { passed: false, message: 'Your code ran into an error. Check the error box below!' };
          const hasXpVar = res.variables['total_xp'] === 2300;
          const printed2300 = res.stdout.some(line => line.includes('2300'));
          if (hasXpVar || printed2300) {
            return { passed: true, message: 'Victory! You calculated 2,300 XP perfectly!' };
          }
          return { passed: false, message: 'Expected total_xp to equal 2300 (8 * 250 + 3 * 100).' };
        }
      },
      {
        id: 'music-lists',
        moduleId: 'launchpad',
        title: '02. Spotify Playlist Queues',
        shortDesc: 'Python lists, indexing, appending, and length',
        xpReward: 60,
        concept: [
          'A list is an ordered collection of items enclosed in square brackets: tracks = ["Espresso", "Greedy", "Stay"].',
          'Python uses 0-based indexing: tracks[0] gets the first track!',
          'Use tracks.append("Song") to queue a new song at the end.',
          'len(tracks) tells you how many songs are in the playlist.'
        ],
        analogy: 'A list is like your Spotify queue: songs play in exact order from top to bottom, and you can push new bangers to the end.',
        taskPrompt: 'Create a playlist with at least 3 song titles. Add another favorite song using .append(), then print the total number of songs using len().',
        starterCode: `# Lesson 1.2: Python Lists & Queues
playlist = ["Espresso", "Birds of a Feather", "Cruel Summer"]

# 1. Print the first song in the playlist
print(f"Now playing: {playlist[0]}")

# 2. Append a new track to the playlist
playlist.append("Not Like Us")

# 3. Print the total count of songs using len()
song_count = len(playlist)
print(f"Total queued songs: {song_count}")
`,
        solutionCode: `playlist = ["Espresso", "Birds of a Feather", "Cruel Summer"]
print(f"Now playing: {playlist[0]}")
playlist.append("Not Like Us")
song_count = len(playlist)
print(f"Total queued songs: {song_count}")`,
        hints: [
          'Access the first item with playlist[0]',
          'Call playlist.append("Song Name") to add one more',
          'Use len(playlist) to count the songs'
        ],
        validate: (res) => {
          if (!res.success) return { passed: false, message: 'Fix the error to complete the lesson!' };
          const p = res.variables['playlist'];
          const count = res.variables['song_count'];
          if (Array.isArray(p) && p.length >= 4) {
            return { passed: true, message: `Awesome! Your playlist has ${p.length} tracks queued up.` };
          }
          if (count && count >= 4) {
            return { passed: true, message: `Well done! song_count is ${count}.` };
          }
          return { passed: false, message: 'Make sure your playlist has at least 4 songs after calling .append()!' };
        }
      },
      {
        id: 'player-dictionaries',
        moduleId: 'launchpad',
        title: '03. Character Player Cards',
        shortDesc: 'Dictionaries with key-value pairs',
        xpReward: 65,
        concept: [
          'Dictionaries store data as key-value pairs inside curly braces: player = {"username": "PixelNinja", "level": 42}.',
          'Access any stat using its key: player["level"].',
          'Dictionaries are the building blocks of data rows in datasets and DataFrames!'
        ],
        analogy: 'A dictionary is like your RPG character sheet: each stat name (HP, Speed, Weapon) has a specific value right next to it.',
        taskPrompt: 'Build a player dictionary containing "username", "rank", and "win_rate". Then access and print the player\'s win_rate.',
        starterCode: `# Lesson 1.3: Dictionaries for Data
player = {
    "username": "ValkyrieAce",
    "rank": "Diamond",
    "win_rate": 68.5,
    "main_agent": "Jett"
}

# Print the player's rank and win rate
print(f"Player: {player['username']}")
print(f"Rank: {player['rank']}")
print(f"Win Rate: {player['win_rate']}%")
`,
        solutionCode: `player = {
    "username": "ValkyrieAce",
    "rank": "Diamond",
    "win_rate": 68.5,
    "main_agent": "Jett"
}
print(f"Player: {player['username']}")
print(f"Rank: {player['rank']}")
print(f"Win Rate: {player['win_rate']}%")`,
        hints: [
          'Keys are strings in quotes like "rank"',
          'Values can be numbers, text, or booleans',
          'Access values with player["key_name"]'
        ],
        validate: (res) => {
          if (!res.success) return { passed: false, message: 'Code error detected.' };
          const p = res.variables['player'];
          if (p && typeof p === 'object' && p['win_rate'] !== undefined) {
            return { passed: true, message: `Great! Player card created with win rate ${p['win_rate']}%.` };
          }
          return { passed: false, message: 'Ensure your player dictionary contains the "win_rate" key.' };
        }
      }
    ]
  },
  {
    id: 'pandas-tables',
    number: 2,
    title: 'Table Wrangling with Pandas',
    subtitle: 'DataFrames, Columns & Shape Inspection',
    description: 'Learn how professional data analysts load CSV files and inspect real-world datasets using Pandas.',
    lessons: [
      {
        id: 'pandas-loading',
        moduleId: 'pandas-tables',
        title: '01. Loading CSVs & First 5 Rows',
        shortDesc: 'pd.read_csv() and df.head()',
        xpReward: 70,
        datasetId: 'spotify',
        concept: [
          'Pandas is the world\'s most popular Python data science library.',
          'pd.read_csv("filename.csv") reads a table file into a DataFrame (df).',
          'df.head() shows you the top 5 rows so you can peek at the data.',
          'df.shape tells you [total_rows, total_columns].'
        ],
        analogy: 'A DataFrame is like a supercharged Google Sheet, and df.head() gives you an instant preview of row 1 through 5.',
        taskPrompt: 'Load the "spotify_hits.csv" dataset into a variable named df using pd.read_csv(). Then print df.head() and print df.shape.',
        starterCode: `import pandas as pd

# Load the Spotify dataset
df = pd.read_csv('spotify_hits.csv')

# Print the top 5 rows
print("Preview of Spotify Hits:")
print(df.head())

# Print the dimensions [rows, columns]
print(f"Dataset Shape: {df.shape}")
`,
        solutionCode: `import pandas as pd

df = pd.read_csv('spotify_hits.csv')
print(df.head())
print(df.shape)`,
        hints: [
          'Use pd.read_csv("spotify_hits.csv")',
          'Call df.head() to inspect the first 5 tracks',
          'Use df.shape to check dimensions'
        ],
        validate: (res) => {
          if (!res.success) return { passed: false, message: 'Execution error occurred.' };
          const hasDf = res.variables['df'] && res.variables['df'].records?.length > 0;
          const printedShape = res.stdout.some(s => s.includes('25') && s.includes('9'));
          if (hasDf || printedShape || res.tables.length > 0) {
            return { passed: true, message: 'Score! You loaded the Spotify dataset and inspected its shape!' };
          }
          return { passed: false, message: 'Make sure df = pd.read_csv("spotify_hits.csv") runs and you print df.head().' };
        }
      },
      {
        id: 'inspecting-columns',
        moduleId: 'pandas-tables',
        title: '02. Inspecting Columns & Types',
        shortDesc: 'df.columns and selecting specific fields',
        xpReward: 75,
        datasetId: 'spotify',
        concept: [
          'df.columns returns a list of all column headers in the table.',
          'You can pick specific columns using brackets: df[["track_name", "artist", "streams_millions"]].',
          'Picking columns helps focus your analysis on what matters.'
        ],
        analogy: 'Like hiding unneeded columns in a spreadsheet, picking columns lets you zero in on artist and streams.',
        taskPrompt: 'Extract only the "track_name", "artist", and "streams_millions" columns from df.head() and print them.',
        starterCode: `import pandas as pd

df = pd.read_csv('spotify_hits.csv')

# Check all available columns
print("Available Columns:")
print(df.columns)

# Pick specific columns for the top 5 songs
top_songs = df[['track_name', 'artist', 'streams_millions']].head()
print("\nStream Leaders:")
print(top_songs)
`,
        solutionCode: `import pandas as pd

df = pd.read_csv('spotify_hits.csv')
print(df.columns)
top_songs = df[['track_name', 'artist', 'streams_millions']].head()
print(top_songs)`,
        hints: [
          'Double brackets [[\'col1\', \'col2\']] are used when selecting multiple columns',
          'Check spelling: track_name, artist, streams_millions'
        ],
        validate: (res) => {
          if (!res.success) return { passed: false, message: 'Code error detected.' };
          const printedStreams = res.stdout.some(l => l.includes('track_name') || l.includes('streams_millions') || l.includes('Espresso'));
          if (printedStreams) {
            return { passed: true, message: 'Spot on! You selected the key audio columns.' };
          }
          return { passed: false, message: 'Ensure you print the selected columns with df[[\'track_name\', ...]].' };
        }
      },
      {
        id: 'summary-math',
        moduleId: 'pandas-tables',
        title: '03. Summary Statistics & Averages',
        shortDesc: '.mean(), .max(), .min(), and .describe()',
        xpReward: 80,
        datasetId: 'spotify',
        concept: [
          'Data analysts love summary statistics: what is the typical value? What is the extreme?',
          'df["column"].mean() gives the average value.',
          'df["column"].max() gives the highest value.',
          'df["column"].min() gives the lowest value.'
        ],
        analogy: 'Calculating the mean is like finding your average grade or average kill-to-death ratio across all matches.',
        taskPrompt: 'Calculate the average streams across all songs in millions using .mean(), and find the maximum stream count using .max(). Print both.',
        starterCode: `import pandas as pd

df = pd.read_csv('spotify_hits.csv')

# Calculate average streams
avg_streams = df['streams_millions'].mean()

# Calculate maximum streams
max_streams = df['streams_millions'].max()

print(f"Average Song Streams: {avg_streams:.1f} Million")
print(f"Max Record Streams: {max_streams} Million")
`,
        solutionCode: `import pandas as pd

df = pd.read_csv('spotify_hits.csv')
avg_streams = df['streams_millions'].mean()
max_streams = df['streams_millions'].max()
print(f"Average: {avg_streams}, Max: {max_streams}")`,
        hints: [
          'Use df["streams_millions"].mean()',
          'Use df["streams_millions"].max()'
        ],
        validate: (res) => {
          if (!res.success) return { passed: false, message: 'Code error occurred.' };
          const avg = res.variables['avg_streams'];
          const maxVal = res.variables['max_streams'];
          if ((avg && avg > 1000) || (maxVal && maxVal >= 4000) || res.stdout.some(s => s.includes('4150'))) {
            return { passed: true, message: 'Boom! Blinding Lights by The Weeknd tops out at 4,150M streams!' };
          }
          return { passed: false, message: 'Ensure avg_streams and max_streams are calculated from df["streams_millions"].' };
        }
      }
    ]
  },
  {
    id: 'detective-filtering',
    number: 3,
    title: 'Data Detective (Filtering & Sorting)',
    subtitle: 'Boolean Indexing & Top Charts',
    description: 'Find needles in the haystack: filter tactical gaming gear by DPS and sort top-tier performers.',
    lessons: [
      {
        id: 'boolean-filters',
        moduleId: 'detective-filtering',
        title: '01. Battle Royale DPS Filter',
        shortDesc: 'Filtering rows where column > threshold',
        xpReward: 85,
        datasetId: 'gaming',
        concept: [
          'Filtering lets you find only the rows that meet a condition.',
          'In pandas: high_dps = df[df["dps"] >= 350] creates a sub-table with only weapons dealing 350+ DPS!',
          'You can use comparison operators: >, <, >=, <=, ==, !='
        ],
        analogy: 'Like applying a rarity filter in a game inventory (Legendary Only), boolean filters drop every row that doesn\'t meet your rule.',
        taskPrompt: 'In the gaming armory dataset, find all weapons with a DPS of 350 or higher. Print how many weapons qualify and print their names.',
        starterCode: `import pandas as pd

df = pd.read_csv('gaming_weapons.csv')

# Filter for lethal weapons with DPS >= 350
power_weapons = df[df['dps'] >= 350]

print(f"Weapons with 350+ DPS: {len(power_weapons)}")
print(power_weapons[['weapon_name', 'game_category', 'dps']])
`,
        solutionCode: `import pandas as pd

df = pd.read_csv('gaming_weapons.csv')
power_weapons = df[df['dps'] >= 350]
print(f"Count: {len(power_weapons)}")
print(power_weapons[['weapon_name', 'dps']])`,
        hints: [
          'The syntax is df[df["dps"] >= 350]',
          'Use len(power_weapons) to count how many guns made the cut'
        ],
        validate: (res) => {
          if (!res.success) return { passed: false, message: 'Execution error.' };
          const p = res.variables['power_weapons'];
          if (p && p.records && p.records.length > 0) {
            const allHigh = p.records.every((r: any) => r.dps >= 350);
            if (allHigh) return { passed: true, message: `Awesome! Found ${p.records.length} high-DPS weapons!` };
          }
          if (res.stdout.some(l => l.includes('Odin Gatling') || l.includes('Phantom Spec'))) {
            return { passed: true, message: 'Great job filtering the weapon database!' };
          }
          return { passed: false, message: 'Filter df with df[df["dps"] >= 350].' };
        }
      },
      {
        id: 'multi-condition-filters',
        moduleId: 'detective-filtering',
        title: '02. Dual Condition Search',
        shortDesc: 'Combining conditions with and / or',
        xpReward: 90,
        datasetId: 'spotify',
        concept: [
          'Often you want to satisfy two criteria at once (e.g. high danceability AND high energy).',
          'In Python data queries: df[(df["danceability"] > 75) and (df["energy"] > 70)].',
          'Only songs matching both criteria stay in the filtered table.'
        ],
        analogy: 'Searching for a sneaker that is BOTH under $100 AND in your shoe size.',
        taskPrompt: 'Find Spotify viral hits that have both danceability >= 80 and energy >= 70. How many bangers fit this high-vibe category?',
        starterCode: `import pandas as pd

df = pd.read_csv('spotify_hits.csv')

# Find high-vibe party anthems: danceability >= 80 and energy >= 70
party_hits = df[(df['danceability'] >= 80) and (df['energy'] >= 70)]

print(f"High-energy dance hits found: {len(party_hits)}")
print(party_hits[['track_name', 'artist', 'danceability', 'energy']])
`,
        solutionCode: `import pandas as pd

df = pd.read_csv('spotify_hits.csv')
party_hits = df[(df['danceability'] >= 80) and (df['energy'] >= 70)]
print(party_hits[['track_name', 'artist']])`,
        hints: [
          'Combine conditions with "and"',
          'Make sure you check both danceability and energy'
        ],
        validate: (res) => {
          if (!res.success) return { passed: false, message: 'Check syntax error.' };
          const ph = res.variables['party_hits'];
          if (ph && ph.records && ph.records.length > 0) {
            return { passed: true, message: `Great! Found songs like Espresso, Not Like Us, and Greedy!` };
          }
          if (res.stdout.some(l => l.includes('Espresso') || l.includes('Not Like Us'))) {
            return { passed: true, message: 'Anthems successfully filtered!' };
          }
          return { passed: false, message: 'Filter for danceability >= 80 and energy >= 70.' };
        }
      },
      {
        id: 'sorting-leaderboards',
        moduleId: 'detective-filtering',
        title: '03. Sorting Leaderboards',
        shortDesc: 'df.sort_values(by=..., ascending=False)',
        xpReward: 95,
        datasetId: 'gaming',
        concept: [
          'To rank items, use df.sort_values(by="column_name", ascending=False).',
          'ascending=False puts the highest numbers at the top (leaderboard style).',
          'ascending=True puts the lowest numbers at the top.'
        ],
        analogy: 'Sorting is like opening a tournament leaderboard: the top scorer is at rank 1, followed by rank 2, 3, etc.',
        taskPrompt: 'Sort the weapons by accuracy_pct in descending order to discover the top 3 most pinpoint accurate weapons in the game.',
        starterCode: `import pandas as pd

df = pd.read_csv('gaming_weapons.csv')

# Sort by accuracy from highest to lowest
snipers_leaderboard = df.sort_values(by='accuracy_pct', ascending=False)

print("Top 3 Most Accurate Armaments:")
print(snipers_leaderboard[['weapon_name', 'accuracy_pct', 'range_meters']].head(3))
`,
        solutionCode: `import pandas as pd

df = pd.read_csv('gaming_weapons.csv')
snipers_leaderboard = df.sort_values(by='accuracy_pct', ascending=False)
print(snipers_leaderboard.head(3))`,
        hints: [
          'Use df.sort_values(by="accuracy_pct", ascending=False)',
          'Use .head(3) to keep only the top three'
        ],
        validate: (res) => {
          if (!res.success) return { passed: false, message: 'Code error detected.' };
          const s = res.variables['snipers_leaderboard'];
          if (s && s.records && s.records[0]?.accuracy_pct === 99) {
            return { passed: true, message: 'Bullseye! The Operator Heavy leads with 99% accuracy!' };
          }
          if (res.stdout.some(l => l.includes('Operator Heavy') && l.includes('99'))) {
            return { passed: true, message: 'Accurate weapons ranked!' };
          }
          return { passed: false, message: 'Make sure you sort by accuracy_pct with ascending=False.' };
        }
      }
    ]
  },
  {
    id: 'feature-engineering',
    number: 4,
    title: 'Feature Engineering & Grouping',
    subtitle: 'Formulas, Ratios & Category Aggregations',
    description: 'Transform raw data into new insights: calculate creator engagement rates and group music by genre.',
    lessons: [
      {
        id: 'calculated-columns',
        moduleId: 'feature-engineering',
        title: '01. Engagement Rate Formula',
        shortDesc: 'Engineering new columns from existing ones',
        xpReward: 100,
        datasetId: 'social',
        concept: [
          'Raw numbers alone don\'t tell the whole story. 100k likes is great, but is it from 1M views (10%) or 10M views (1%)?',
          'You can calculate a new column: like_ratio = likes / views.',
          'In pandas: df["engagement_rate"] = df["likes_k"] / df["avg_views_k"] * 100.'
        ],
        analogy: 'Calculating free throw percentage in basketball: dividing made shots by total attempts gives the true skill rating.',
        taskPrompt: 'Calculate the engagement percentage for each creator (likes_k divided by avg_views_k * 100) and identify the top engaging creator.',
        starterCode: `import pandas as pd

df = pd.read_csv('creator_virality.csv')

# Calculate engagement percentage: (likes / views) * 100
for i, row in df.iterrows():
    rate = round((row['likes_k'] / row['avg_views_k']) * 100, 1)
    if rate > 15:
        print(f"Super Engaged Creator: {row['creator_handle']} ({rate}%)")
`,
        solutionCode: `import pandas as pd

df = pd.read_csv('creator_virality.csv')
for i, row in df.iterrows():
    rate = round((row['likes_k'] / row['avg_views_k']) * 100, 1)
    print(f"{row['creator_handle']}: {rate}%")`,
        hints: [
          'Multiply (likes_k / avg_views_k) by 100 to get percentage',
          'Print the creator handles with high engagement'
        ],
        validate: (res) => {
          if (!res.success) return { passed: false, message: 'Execution error.' };
          if (res.stdout.some(l => l.includes('15') || l.includes('alex_codez') || l.includes('vibes_daily'))) {
            return { passed: true, message: 'Genius! You engineered an engagement metric from raw views & likes!' };
          }
          return { passed: false, message: 'Iterate or calculate likes_k / avg_views_k * 100 and print results.' };
        }
      },
      {
        id: 'groupby-aggregations',
        moduleId: 'feature-engineering',
        title: '02. Grouping by Genre',
        shortDesc: 'df.groupby(col).mean() and .count()',
        xpReward: 110,
        datasetId: 'spotify',
        concept: [
          'Groupby groups rows sharing the same category (e.g. all Pop songs together, all Hip Hop songs together).',
          'Then it applies an aggregation like .mean() or .count() to each group.',
          'Example: df.groupby("genre")["streams_millions"].mean() reveals which genre has the highest average streams.'
        ],
        analogy: 'Like sorting Pokémon cards into element piles (Fire, Water, Grass), then measuring the average attack power of each pile.',
        taskPrompt: 'Group the Spotify hits by "genre" and calculate the average streams for each genre.',
        starterCode: `import pandas as pd

df = pd.read_csv('spotify_hits.csv')

# Group by musical genre and find average streams
genre_stats = df.groupby('genre').mean('streams_millions')

print("Average Streams per Music Genre:")
print(genre_stats)
`,
        solutionCode: `import pandas as pd

df = pd.read_csv('spotify_hits.csv')
genre_stats = df.groupby('genre').mean('streams_millions')
print(genre_stats)`,
        hints: [
          'Use df.groupby("genre").mean("streams_millions")',
          'Print the resulting table to see the category breakdown'
        ],
        validate: (res) => {
          if (!res.success) return { passed: false, message: 'Code error detected.' };
          const gs = res.variables['genre_stats'];
          if (gs && gs.records?.length > 0) {
            return { passed: true, message: 'Phenomenal! You grouped 25 songs into genre averages!' };
          }
          if (res.stdout.some(l => l.includes('genre') || l.includes('Synthwave') || l.includes('Pop'))) {
            return { passed: true, message: 'Genre groupings computed!' };
          }
          return { passed: false, message: 'Call df.groupby("genre").mean() and print the results.' };
        }
      }
    ]
  },
  {
    id: 'data-storytelling',
    number: 5,
    title: 'Visual Storytelling with Charts',
    subtitle: 'Bar Charts, Scatter Plots & Histograms',
    description: 'Transform numbers into charts with Matplotlib: bar charts, scatter plots, and distribution histograms.',
    lessons: [
      {
        id: 'bar-charts',
        moduleId: 'data-storytelling',
        title: '01. Top 5 Hits Bar Chart',
        shortDesc: 'plt.bar(x, height) and plt.show()',
        xpReward: 115,
        datasetId: 'spotify',
        concept: [
          'A bar chart is best for comparing categories (e.g. songs, players, products).',
          'plt.bar(x_labels, y_values, color="#10B981") creates the bars.',
          'plt.title("Chart Name") and plt.ylabel("Label") label your axes.',
          'plt.show() renders the chart directly on screen!'
        ],
        analogy: 'A bar chart is like podium steps at a competition: the taller the step, the higher the stream count.',
        taskPrompt: 'Sort the Spotify dataset by streams_millions, pick the top 5 songs, and render a bar chart using plt.bar() and plt.show().',
        starterCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('spotify_hits.csv')

# Get top 5 most streamed hits
top5 = df.sort_values(by='streams_millions', ascending=False).head(5)

# Render Bar Chart
plt.bar(top5['track_name'], top5['streams_millions'], color='#1DB954')
plt.title("Top 5 Most Streamed Spotify Viral Hits")
plt.ylabel("Streams (Millions)")
plt.show()
`,
        solutionCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('spotify_hits.csv')
top5 = df.sort_values(by='streams_millions', ascending=False).head(5)
plt.bar(top5['track_name'], top5['streams_millions'], color='#1DB954')
plt.title("Top 5")
plt.show()`,
        hints: [
          'Pass song names as the first argument to plt.bar()',
          'Pass streams as the second argument',
          'Always call plt.show() at the end to render the graphic!'
        ],
        validate: (res) => {
          if (!res.success) return { passed: false, message: 'Execution error.' };
          if (res.charts.length > 0 && res.charts.some(c => c.type === 'bar')) {
            return { passed: true, message: 'Magnificent chart! The bar chart visualized the top streaming hits!' };
          }
          return { passed: false, message: 'Make sure to call plt.bar() and plt.show() to generate the chart.' };
        }
      },
      {
        id: 'scatter-plots',
        moduleId: 'data-storytelling',
        title: '02. Range vs Damage Scatter Plot',
        shortDesc: 'plt.scatter(x, y) to spot correlations',
        xpReward: 125,
        datasetId: 'gaming',
        concept: [
          'Scatter plots plot two numeric variables against each other to find correlations.',
          'Do long-range sniper rifles do more damage than close-range SMGs?',
          'plt.scatter(df["range_meters"], df["damage_per_shot"]) maps each weapon as a point in 2D space.'
        ],
        analogy: 'A scatter plot is like a tactical GPS minimap: each dot is a weapon located by its range (X axis) and damage (Y axis).',
        taskPrompt: 'Create a scatter plot comparing weapon range_meters against damage_per_shot to see if range correlates with firepower.',
        starterCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('gaming_weapons.csv')

# Scatter Plot: Range vs Damage
plt.scatter(df['range_meters'], df['damage_per_shot'], color='#0EA5E9')
plt.title("Tactical Armory: Range vs Hit Damage")
plt.xlabel("Effective Range (Meters)")
plt.ylabel("Damage per Shot")
plt.show()
`,
        solutionCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('gaming_weapons.csv')
plt.scatter(df['range_meters'], df['damage_per_shot'], color='#0EA5E9')
plt.title("Range vs Damage")
plt.show()`,
        hints: [
          'Use plt.scatter(x, y)',
          'Don\'t forget plt.show()'
        ],
        validate: (res) => {
          if (!res.success) return { passed: false, message: 'Execution error.' };
          if (res.charts.length > 0 && res.charts.some(c => c.type === 'scatter')) {
            return { passed: true, message: 'Incredible! Look at the top right: high-range snipers pack immense punch!' };
          }
          return { passed: false, message: 'Call plt.scatter() and plt.show() to draw the scatter diagram.' };
        }
      }
    ]
  },
  {
    id: 'boss-missions',
    number: 6,
    title: 'Teen Data Science Missions',
    subtitle: 'Real-World Investigation Projects',
    description: 'Solve real mysteries: discover the ultimate gaming weapon and crack the social media posting clock.',
    lessons: [
      {
        id: 'mission-weapon-meta',
        moduleId: 'boss-missions',
        title: 'Boss Mission: Meta Weapon Verdict',
        shortDesc: 'Identify the king of sustained DPS in competitive FPS',
        xpReward: 200,
        datasetId: 'gaming',
        concept: [
          'Competitive esports players debate weapon tiers constantly.',
          'Can data settle the debate?',
          'A weapon needs high DPS (> 380) AND high accuracy (> 75%) to be true S-Tier meta.'
        ],
        analogy: 'You are the head data analyst for an esports team giving your squad the winning loadout.',
        taskPrompt: 'Find all weapons with DPS >= 380 and accuracy >= 75%. Sort them by DPS descending. Print the top weapon recommendation!',
        starterCode: `# Boss Mission: Esports Weapon Meta
import pandas as pd

df = pd.read_csv('gaming_weapons.csv')

# Step 1: Filter weapons with dps >= 380 and accuracy_pct >= 75
meta_guns = df[(df['dps'] >= 380) and (df['accuracy_pct'] >= 75)]

# Step 2: Sort by DPS in descending order
ranked_meta = meta_guns.sort_values(by='dps', ascending=False)

print("🏆 S-TIER META WEAPONS:")
print(ranked_meta[['weapon_name', 'game_category', 'dps', 'accuracy_pct']])

best_gun = ranked_meta.head(1)['weapon_name'].values[0]
print(f"\nFinal Recommendation for Esports Team: {best_gun}")
`,
        solutionCode: `import pandas as pd

df = pd.read_csv('gaming_weapons.csv')
meta_guns = df[(df['dps'] >= 380) and (df['accuracy_pct'] >= 75)]
ranked_meta = meta_guns.sort_values(by='dps', ascending=False)
print(ranked_meta)
best_gun = ranked_meta.head(1)['weapon_name'].values[0]
print(f"Best: {best_gun}")`,
        hints: [
          'Filter with (df["dps"] >= 380) and (df["accuracy_pct"] >= 75)',
          'Sort with .sort_values(by="dps", ascending=False)',
          'Pick the first weapon with .head(1)'
        ],
        validate: (res) => {
          if (!res.success) return { passed: false, message: 'Check code syntax.' };
          const printedBest = res.stdout.some(l => l.includes('Odin Gatling') || l.includes('Phantom Spec'));
          if (printedBest) {
            return { passed: true, message: 'MISSION ACCOMPLISHED! Odin Gatling and Phantom Spec dominate the competitive meta!' };
          }
          return { passed: false, message: 'Filter for dps >= 380 and accuracy >= 75, then print the top gun.' };
        }
      },
      {
        id: 'mission-viral-clock',
        moduleId: 'boss-missions',
        title: 'Boss Mission: Viral Post Clock',
        shortDesc: 'Discover the peak engagement hour for creator uploads',
        xpReward: 200,
        datasetId: 'social',
        concept: [
          'Uploading when your audience is asleep kills video engagement.',
          'By analyzing best_post_hour across top creators, you can find the statistical sweet spot!'
        ],
        analogy: 'Timing a rocket launch for the exact orbital window to maximize fuel and speed.',
        taskPrompt: 'Calculate the average views for each post hour, or find which post hour has the most viral creators. Render a histogram with plt.hist()!',
        starterCode: `# Boss Mission: The Virality Clock
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('creator_virality.csv')

# Peek at posting hours
print("Posting Hours & Average Views:")
print(df[['creator_handle', 'best_post_hour', 'avg_views_k']])

# Plot distribution of peak posting hours
plt.hist(df['best_post_hour'], bins=8, color='#EC4899')
plt.title("Peak Posting Hour Distribution for Viral Creators")
plt.xlabel("Hour of the Day (24-Hour Clock)")
plt.ylabel("Number of Viral Creators")
plt.show()
`,
        solutionCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('creator_virality.csv')
plt.hist(df['best_post_hour'], bins=8, color='#EC4899')
plt.title("Posting Hours")
plt.show()`,
        hints: [
          'Use plt.hist(df["best_post_hour"]) to see when creators get the biggest view spikes',
          'Notice how 18:00 - 20:00 (6 PM - 8 PM) has the biggest cluster!'
        ],
        validate: (res) => {
          if (!res.success) return { passed: false, message: 'Execution error.' };
          if (res.charts.length > 0 && res.charts.some(c => c.type === 'hist')) {
            return { passed: true, message: 'MISSION ACCOMPLISHED! Evenings (18h-20h / 6-8 PM) are statistically prime time!' };
          }
          return { passed: false, message: 'Render the histogram using plt.hist(df["best_post_hour"]) and plt.show().' };
        }
      }
    ]
  }
];

export function getLessonById(id: string): Lesson | undefined {
  for (const m of MODULES) {
    const found = m.lessons.find(l => l.id === id);
    if (found) return found;
  }
  return undefined;
}
