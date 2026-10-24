/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Curated datasets designed for teenagers: Music, Esports/Gaming, TikTok/Social, Pokémon, and Space.
 */

export interface DatasetMeta {
  id: string;
  name: string;
  category: 'music' | 'gaming' | 'social' | 'anime' | 'space';
  tagline: string;
  description: string;
  image: string;
  filename: string;
  columns: {
    key: string;
    label: string;
    type: 'string' | 'number' | 'boolean';
    unit?: string;
    description: string;
  }[];
  starterQuestions: string[];
  sampleCode: string;
  csvContent: string;
  records: Record<string, any>[];
}

const spotifyRawCSV = `track_name,artist,genre,streams_millions,danceability,energy,tempo_bpm,release_year,explicit
Espresso,Sabrina Carpenter,Pop,1420,84,76,104,2024,true
Birds of a Feather,Billie Eilish,Indie Pop,1280,72,58,105,2024,false
Cruel Summer,Taylor Swift,Synth Pop,1960,78,70,170,2019,false
Not Like Us,Kendrick Lamar,West Coast Rap,995,86,81,101,2024,true
Paint The Town Red,Doja Cat,Hip Hop,1510,87,54,100,2023,true
Greedy,Tate McRae,Dance Pop,1140,82,73,111,2023,false
Beautiful Things,Benson Boone,Pop Rock,1350,56,68,105,2024,false
Good Luck Babe,Chappell Roan,Synth Pop,870,71,83,117,2024,false
Lovin On Me,Jack Harlow,Hip Hop,780,91,56,111,2023,true
Too Sweet,Hozier,Blues Rock,890,68,74,117,2024,false
Blinding Lights,The Weeknd,Synthwave,4150,75,80,171,2020,false
As It Was,Harry Styles,Indie Pop,3340,74,73,174,2022,false
Starboy,The Weeknd ft. Daft Punk,Electropop,3100,68,59,186,2016,true
Levitating,Dua Lipa,Nu-Disco,2980,79,83,103,2020,false
Heat Waves,Glass Animals,Indie R&B,2890,76,53,81,2020,false
Stay,The Kid LAROI & Justin Bieber,Pop Rock,2810,59,76,170,2021,true
Save Your Tears,The Weeknd,Synthwave,2740,68,83,118,2020,false
Water,Tyla,Afrobeats,720,77,72,117,2023,false
Stick Season,Noah Kahan,Folk Pop,1120,66,49,118,2022,false
Flowers,Miley Cyrus,Disco Pop,2100,74,68,118,2023,false
FE!N,Travis Scott ft. Playboi Carti,Trap,890,62,88,148,2023,true
Sweater Weather,The Neighbourhood,Indie Rock,2450,61,81,118,2013,false
One Dance,Drake,Dancehall,3150,79,63,104,2016,false
bad guy,Billie Eilish,Dark Pop,2600,70,43,135,2019,false
Gata Only,FloyyMenor & Cris Mj,Reggaeton,910,79,74,100,2024,true`;

const gamingRawCSV = `weapon_name,game_category,damage_per_shot,fire_rate_rpm,magazine_size,range_meters,accuracy_pct,dps
Apex Flatline,Assault Rifle,19,600,30,45,86,190
Vandal Prime,Assault Rifle,40,580,25,50,91,386
Phantom Spec,Assault Rifle,39,660,30,35,93,429
Operator Heavy,Sniper,150,45,5,100,99,112
Peacekeeper,Shotgun,99,75,5,15,74,124
R-99 SMG,SMG,11,1080,27,20,82,198
Wingman Revolver,Pistol,45,155,6,35,88,116
Spectre Sub,SMG,26,800,30,22,85,347
Ares Heavy,LMG,30,780,50,40,78,390
Odin Gatling,LMG,38,720,100,35,76,456
Judge Auto,Shotgun,17,210,7,12,68,357
Sheriff Handgun,Pistol,55,150,6,30,89,138
Ghost Suppressed,Pistol,30,400,15,25,92,200
Kraber .50-Cal,Sniper,140,25,4,120,98,58
Volt Energy,SMG,15,720,28,28,87,180
CAR SMG,SMG,13,930,27,22,81,201
Nemesis Burst,Assault Rifle,17,680,32,45,89,193
Marshal Lever,Sniper,101,90,5,60,94,151
Bucky Pump,Shotgun,20,66,5,10,65,110
Spitfire LMG,LMG,18,540,50,40,79,162`;

const creatorRawCSV = `creator_handle,platform,category,followers_k,avg_views_k,likes_k,video_length_sec,best_post_hour
@alex_codez,TikTok,Coding & Tech,480,310,48,45,18
@pixel_master,YouTube,Gaming,1250,720,95,720,16
@vibes_daily,TikTok,Music & Dance,2100,1450,220,30,19
@speedy_runs,Twitch,Speedrunning,340,180,24,3600,20
@study_with_mia,YouTube,Study & Vlogs,890,410,62,900,14
@retro_builder,TikTok,Minecraft & Lego,1400,980,140,55,17
@anime_recap,TikTok,Anime Reviews,920,630,88,60,21
@science_guy_z,YouTube,Science & Space,1780,1100,165,600,15
@skate_trickz,Instagram,Skateboarding,510,290,38,25,18
@beats_by_sam,TikTok,Music Production,670,420,59,40,19
@chef_campus,YouTube,Quick Recipes,1120,580,77,480,12
@fashion_rebel,Instagram,Thrifting & Fits,790,340,49,35,17
@comedy_skits,TikTok,Comedy Skits,3200,2800,430,35,19
@gym_bro_teen,TikTok,Fitness,620,310,39,45,16
@cozy_setup,Instagram,Room & Desk Aesthetics,840,490,72,20,20`;

const pokemonRawCSV = `name,type_1,type_2,hp,attack,defense,speed,base_total,is_legendary
Charizard,Fire,Flying,78,84,78,100,534,false
Gengar,Ghost,Poison,60,65,60,110,500,false
Lucario,Fighting,Steel,70,110,70,90,525,false
Greninja,Water,Dark,72,95,67,122,530,false
Mewtwo,Psychic,None,106,110,90,130,680,true
Pikachu,Electric,None,35,55,40,90,320,false
Rayquaza,Dragon,Flying,105,150,90,95,680,true
Gardevoir,Psychic,Fairy,68,65,65,80,518,false
Tyranitar,Rock,Dark,100,134,110,61,600,false
Garchomp,Dragon,Ground,108,130,95,102,600,false
Snorlax,Normal,None,160,110,65,30,540,false
Gyarados,Water,Flying,95,125,79,81,540,false
Arcanine,Fire,None,90,110,80,95,555,false
Umbreon,Dark,None,95,65,110,65,525,false
Sylveon,Fairy,None,95,65,65,60,525,false
Dragonite,Dragon,Flying,91,134,95,80,600,false
Scizor,Bug,Steel,70,130,100,65,500,false
Blastoise,Water,None,79,83,100,78,530,false
Venusaur,Grass,Poison,80,82,83,80,525,false
Zacian,Fairy,Steel,92,130,115,138,670,true`;

const spaceRawCSV = `mission,agency,destination,launch_year,duration_days,budget_million_usd,success
Perseverance Rover,NASA,Mars,2020,1850,2700,true
Curiosity Rover,NASA,Mars,2011,4600,2500,true
James Webb Telescope,NASA/ESA,Sun-Earth L2,2021,1400,10000,true
Artemis 1,NASA,Moon,2022,25,4100,true
Chandrayaan-3,ISRO,Moon South Pole,2023,14,75,true
Voyager 1,NASA,Interstellar Space,1977,17500,865,true
Hubble Space Telescope,NASA/ESA,Low Earth Orbit,1990,12700,16000,true
New Horizons,NASA,Pluto & Kuiper Belt,2006,7100,700,true
Parker Solar Probe,NASA,Sun Corona,2018,2600,1500,true
Tianwen-1,CNSA,Mars,2020,1500,600,true
Europa Clipper,NASA,Jupiter Moon Europa,2024,1800,5200,true
SLIM Lunar Lander,JAXA,Moon,2023,110,120,true`;

function parseSimpleCSV(csv: string): Record<string, any>[] {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const vals = line.split(',');
    const obj: Record<string, any> = {};
    headers.forEach((h, idx) => {
      const v = vals[idx]?.trim() ?? '';
      if (v.toLowerCase() === 'true') obj[h] = true;
      else if (v.toLowerCase() === 'false') obj[h] = false;
      else if (!isNaN(Number(v)) && v !== '') obj[h] = Number(v);
      else obj[h] = v;
    });
    return obj;
  });
}

export const TEEN_DATASETS: DatasetMeta[] = [
  {
    id: 'spotify',
    name: 'Spotify Viral Top Hits',
    category: 'music',
    tagline: 'Stream counts, danceability, beats per minute, and audio energy',
    description: 'Real audio telemetry for 25 chart-topping viral hits from Sabrina Carpenter, Taylor Swift, Billie Eilish, Kendrick Lamar, and The Weeknd.',
    image: '/src/assets/images/dataset_spotify_music_1792840876147.jpg',
    filename: 'spotify_hits.csv',
    columns: [
      { key: 'track_name', label: 'Track Title', type: 'string', description: 'Name of the song' },
      { key: 'artist', label: 'Artist', type: 'string', description: 'Artist name' },
      { key: 'genre', label: 'Genre', type: 'string', description: 'Primary musical category' },
      { key: 'streams_millions', label: 'Streams (M)', type: 'number', unit: 'M', description: 'Total global streams in millions' },
      { key: 'danceability', label: 'Danceability', type: 'number', unit: '%', description: 'Dance score from 0 to 100 based on tempo and rhythm' },
      { key: 'energy', label: 'Energy', type: 'number', unit: '%', description: 'Perceptual intensity and activity from 0 to 100' },
      { key: 'tempo_bpm', label: 'Tempo', type: 'number', unit: 'BPM', description: 'Estimated speed in Beats Per Minute' },
      { key: 'release_year', label: 'Year', type: 'number', description: 'Release year' },
      { key: 'explicit', label: 'Explicit', type: 'boolean', description: 'Explicit language tag' }
    ],
    starterQuestions: [
      'What is the average danceability of viral pop songs versus hip hop?',
      'Do higher tempo songs get more streams than slower songs?',
      'Which artist has the single most streamed track in the dataset?'
    ],
    sampleCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('spotify_hits.csv')
print("Top 5 Spotify Viral Hits:")
print(df.head())

# Find songs with over 1 Billion streams
viral_billion = df[df['streams_millions'] >= 1000]
print(f"Billion Club Count: {len(viral_billion)}")

# Average danceability score
avg_dance = df['danceability'].mean()
print(f"Average Danceability: {avg_dance:.1f}%")

# Plot Top 5 Most Streamed Songs
top5 = df.sort_values(by='streams_millions', ascending=False).head(5)
plt.bar(top5['track_name'], top5['streams_millions'], color='#1DB954')
plt.title("Top 5 Most Streamed Spotify Hits")
plt.ylabel("Streams (Millions)")
plt.show()`,
    csvContent: spotifyRawCSV,
    records: parseSimpleCSV(spotifyRawCSV)
  },
  {
    id: 'gaming',
    name: 'Battle Royale & FPS Armory',
    category: 'gaming',
    tagline: 'Weapon DPS, fire rates, accuracy, and effective range',
    description: 'Competitive tactical armament metrics comparing Rifles, SMGs, Snipers, and Shotguns across hit damage, rounds per minute, and kill speeds.',
    image: '/src/assets/images/dataset_gaming_stats_1792840877520.jpg',
    filename: 'gaming_weapons.csv',
    columns: [
      { key: 'weapon_name', label: 'Weapon', type: 'string', description: 'Armament designation' },
      { key: 'game_category', label: 'Class', type: 'string', description: 'Assault, SMG, Sniper, Shotgun, LMG, or Pistol' },
      { key: 'damage_per_shot', label: 'Shot Damage', type: 'number', description: 'Single projectile hit damage to body' },
      { key: 'fire_rate_rpm', label: 'Fire Rate', type: 'number', unit: 'RPM', description: 'Rounds fired per minute' },
      { key: 'magazine_size', label: 'Mag Size', type: 'number', description: 'Rounds per reload clip' },
      { key: 'range_meters', label: 'Range', type: 'number', unit: 'm', description: 'Effective lethal distance in meters' },
      { key: 'accuracy_pct', label: 'Accuracy', type: 'number', unit: '%', description: 'First-shot precision percentage' },
      { key: 'dps', label: 'DPS', type: 'number', description: 'Damage Per Second sustained' }
    ],
    starterQuestions: [
      'Which weapon class dishes out the highest sustained Damage Per Second (DPS)?',
      'What is the correlation between weapon range and shot damage?',
      'Which weapon has the best balance of fire rate and accuracy?'
    ],
    sampleCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('gaming_weapons.csv')
print("Gaming Armory Stats:")
print(df[['weapon_name', 'game_category', 'dps', 'accuracy_pct']].head())

# Find the highest DPS weapon
highest_dps = df.sort_values(by='dps', ascending=False).head(1)
print(f"Top DPS Gun: {highest_dps['weapon_name'].values[0]} ({highest_dps['dps'].values[0]} DPS)")

# Scatter Plot: Range vs Damage
plt.scatter(df['range_meters'], df['damage_per_shot'], color='#0284C7')
plt.title("Weapon Range vs Single Shot Damage")
plt.xlabel("Effective Range (Meters)")
plt.ylabel("Hit Damage")
plt.show()`,
    csvContent: gamingRawCSV,
    records: parseSimpleCSV(gamingRawCSV)
  },
  {
    id: 'social',
    name: 'Social Creator Algorithm',
    category: 'social',
    tagline: 'TikTok & YouTube metrics: followers, view spikes, and post timing',
    description: 'Creator analytics tracking virality factors: video durations, posting hours, like-to-view ratios, and category performance.',
    image: '/src/assets/images/dataset_creator_virality_1792840878319.jpg',
    filename: 'creator_virality.csv',
    columns: [
      { key: 'creator_handle', label: 'Creator', type: 'string', description: 'Channel username' },
      { key: 'platform', label: 'Platform', type: 'string', description: 'TikTok, YouTube, Twitch, or Instagram' },
      { key: 'category', label: 'Niche', type: 'string', description: 'Content domain (Gaming, Coding, Dance, etc.)' },
      { key: 'followers_k', label: 'Followers (K)', type: 'number', unit: 'K', description: 'Total audience in thousands' },
      { key: 'avg_views_k', label: 'Avg Views (K)', type: 'number', unit: 'K', description: 'Typical views per upload' },
      { key: 'likes_k', label: 'Likes (K)', type: 'number', unit: 'K', description: 'Average likes per video' },
      { key: 'video_length_sec', label: 'Duration', type: 'number', unit: 's', description: 'Video length in seconds' },
      { key: 'best_post_hour', label: 'Peak Hour', type: 'number', unit: 'h (24h)', description: 'Hour of day (0-23) with highest engagement' }
    ],
    starterQuestions: [
      'What hour of the day sees the highest average views for uploads?',
      'Do shorter TikTok videos (< 45s) generate higher like ratios than long-form videos?',
      'Which content category boasts the highest engagement rate?'
    ],
    sampleCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('creator_virality.csv')
print("Creator Analytics Overview:")
print(df.head())

# Calculate Engagement Rate (Likes / Views * 100)
# Most engaged creators:
df_sorted = df.sort_values(by='avg_views_k', ascending=False)
print("Top 3 Most Viewed Creators:")
for i, row in df_sorted.head(3).iterrows():
    print(f"- {row['creator_handle']} ({row['avg_views_k']}k views)")

# Plot Peak Post Hours
plt.hist(df['best_post_hour'], bins=8, color='#EC4899')
plt.title("Best Posting Hour Distribution (24h Clock)")
plt.xlabel("Hour of Day")
plt.ylabel("Number of Creators")
plt.show()`,
    csvContent: creatorRawCSV,
    records: parseSimpleCSV(creatorRawCSV)
  },
  {
    id: 'pokemon',
    name: 'Pokémon Battle Competitive Dex',
    category: 'anime',
    tagline: 'Base stats, speeds, dual-typing, attack, and defense power',
    description: 'Comprehensive competitive combat statistics for favorite Pokémon from Generation 1 to 9, identifying tanky defenders and sweepers.',
    image: '/src/assets/images/hero_teen_datascience_1792840876382.jpg',
    filename: 'pokemon_stats.csv',
    columns: [
      { key: 'name', label: 'Pokémon', type: 'string', description: 'Species name' },
      { key: 'type_1', label: 'Primary Type', type: 'string', description: 'Elemental type 1' },
      { key: 'type_2', label: 'Secondary Type', type: 'string', description: 'Elemental type 2 (or None)' },
      { key: 'hp', label: 'HP', type: 'number', description: 'Health point pool' },
      { key: 'attack', label: 'Attack', type: 'number', description: 'Physical damage rating' },
      { key: 'defense', label: 'Defense', type: 'number', description: 'Physical resistance rating' },
      { key: 'speed', label: 'Speed', type: 'number', description: 'Turn order speed' },
      { key: 'base_total', label: 'Base Total', type: 'number', description: 'Sum of all combat base stats' },
      { key: 'is_legendary', label: 'Legendary', type: 'boolean', description: 'Legendary status' }
    ],
    starterQuestions: [
      'Who is the fastest non-legendary Pokémon in the dataset?',
      'Which elemental type has the highest average defense?',
      'Does high attack usually mean low speed, or can Pokémon have both?'
    ],
    sampleCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('pokemon_stats.csv')
print("Top Pokémon by Base Total:")
top_pokes = df.sort_values(by='base_total', ascending=False).head(5)
print(top_pokes[['name', 'type_1', 'base_total', 'speed']])

# Find the fastest speed demons (Speed >= 110)
speedsters = df[df['speed'] >= 110]
print(f"Speed Demons: {speedsters['name'].tolist()}")

# Bar chart of Speed stats
plt.bar(top_pokes['name'], top_pokes['speed'], color='#EAB308')
plt.title("Speed Ratings for Top 5 Power Pokémon")
plt.ylabel("Speed Stat")
plt.show()`,
    csvContent: pokemonRawCSV,
    records: parseSimpleCSV(pokemonRawCSV)
  },
  {
    id: 'space',
    name: 'Space Missions & Planetary Exploration',
    category: 'space',
    tagline: 'Mars rovers, lunar landers, deep space probes, and budgets',
    description: 'Actual mission flight logs from NASA, ESA, ISRO, and JAXA tracking mission durations, destinations, launch years, and budgets.',
    image: '/src/assets/images/hero_teen_datascience_1792840876382.jpg',
    filename: 'space_missions.csv',
    columns: [
      { key: 'mission', label: 'Mission', type: 'string', description: 'Spacecraft or rover name' },
      { key: 'agency', label: 'Agency', type: 'string', description: 'NASA, ESA, ISRO, JAXA, CNSA' },
      { key: 'destination', label: 'Target', type: 'string', description: 'Planet, moon, or space orbit' },
      { key: 'launch_year', label: 'Launch Year', type: 'number', description: 'Year launched from Earth' },
      { key: 'duration_days', label: 'Active Days', type: 'number', unit: 'days', description: 'Days active in space' },
      { key: 'budget_million_usd', label: 'Budget ($M)', type: 'number', unit: '$M', description: 'Total cost in millions USD' },
      { key: 'success', label: 'Success', type: 'boolean', description: 'Mission success status' }
    ],
    starterQuestions: [
      'Which space mission has been running the longest time in days?',
      'What was the average budget for Mars missions versus Moon missions?',
      'Which recent mission achieved its objectives at the lowest cost?'
    ],
    sampleCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('space_missions.csv')
print("Deep Space Missions Data:")
print(df[['mission', 'destination', 'duration_days', 'budget_million_usd']])

# Find the longest lasting explorer
longest = df.sort_values(by='duration_days', ascending=False).head(1)
print(f"Longest Explorer: {longest['mission'].values[0]} ({longest['duration_days'].values[0]} days in flight!)")

# Plot mission budgets
top_cost = df.sort_values(by='budget_million_usd', ascending=False).head(5)
plt.bar(top_cost['mission'], top_cost['budget_million_usd'], color='#6366F1')
plt.title("Top 5 Most Expensive Space Telescopes & Missions")
plt.ylabel("Budget ($ Millions USD)")
plt.show()`,
    csvContent: spaceRawCSV,
    records: parseSimpleCSV(spaceRawCSV)
  }
];

export function getDatasetById(id: string): DatasetMeta | undefined {
  return TEEN_DATASETS.find(d => d.id === id);
}
