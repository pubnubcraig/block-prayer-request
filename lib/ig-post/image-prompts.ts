// Topic-to-visual-scene mapping for DALL-E 3 image generation.
// Each scene description creates a photorealistic, emotionally resonant image
// that reflects the prayer topic without text overlays.

export const TOPIC_SCENE_MAP: Record<string, string> = {
  // ── Comfort ────────────────────────────────────────────────────────
  Anxiety:
    'A person standing alone near a peaceful lake at dawn, still water reflecting soft golden light, mist rising gently, serene mountain backdrop',
  Fear:
    'A single candle flame burning steadily in a dark room, warm golden glow illuminating weathered hands held together, intimate and reassuring',
  Loneliness:
    'An empty wooden bench on a quiet hillside at sunset, warm amber light streaming through trees, a single wildflower growing nearby',
  Depression:
    'A person sitting quietly on a rocky shore during sunrise, dramatic golden light breaking through heavy storm clouds overhead, hope emerging from darkness',
  Grief:
    'A quiet garden path in early morning with warm sunlight filtering through autumn leaves, a weathered stone bench with a single white rose',
  Worry:
    'Gentle hands releasing a paper boat onto a calm stream, soft morning light, shallow depth of field, peaceful forest backdrop',
  Overwhelmed:
    'A person standing at the base of a tall mountain looking upward, golden hour light illuminating the peak, clouds parting to reveal blue sky',
  Burnout:
    'A hammock gently swaying between two trees in a sunlit meadow, wildflowers in soft focus, peaceful afternoon light',
  Suffering:
    'A cracked desert floor with a single green sprout pushing through, dramatic sunset light, symbolizing resilience and new life',
  Heartbreak:
    'Broken pottery pieces arranged on a wooden table with golden light streaming through a window, kintsugi-inspired beauty in brokenness',
  'Overcoming Shame':
    'A person walking out of a dark tunnel into brilliant warm sunlight, silhouette becoming illuminated, symbolic of freedom',

  // ── Peace ──────────────────────────────────────────────────────────
  Peace:
    'A still mountain lake at dawn perfectly reflecting snow-capped peaks, not a ripple on the water, soft pink and gold sky',
  Rest:
    'Green pastures beside quiet waters at golden hour, a winding path through tall grass, gentle rolling hills in the distance',
  'Calm in the Storm':
    'A lighthouse standing firm against crashing waves at dusk, warm light beaming from the top, dramatic sky beginning to clear',
  Contentment:
    'A cozy window seat overlooking a rainy garden, warm cup of tea on the sill, soft indoor lighting, peaceful and intimate',
  Stillness:
    'A perfectly still forest pond at dawn, mist hovering over the water, tall trees reflected perfectly, absolute tranquility',
  'Inner Peace':
    'A person meditating in a sunlit garden courtyard, stone fountain with gently flowing water, warm afternoon light through archways',
  'Work-Life Balance':
    'A sunset view from a quiet porch with a closed book and cup of coffee, rocking chair, golden evening light',

  // ── Hope ───────────────────────────────────────────────────────────
  Hope:
    'A dramatic sunrise breaking through dark storm clouds over an open field, rays of golden light streaming down, vast expansive sky',
  Encouragement:
    'An eagle soaring high above a mountain valley, wings spread wide catching warm updrafts, golden sunlight behind, majestic and free',
  'New Beginnings':
    'A fresh green sprout emerging from dark rich soil, morning dew drops catching sunlight, blurred garden background, new life',
  Perseverance:
    'A winding mountain trail leading upward through fog, sunlight visible at the top, worn but steady footpath, determined journey',
  Endurance:
    'A long-distance runner on a scenic trail at sunrise, silhouette against golden sky, rolling hills ahead, perseverance embodied',
  'Waiting on God':
    'A person sitting patiently on a dock overlooking a calm lake at twilight, stars beginning to appear, peaceful anticipation',
  'Eternal Life':
    'An infinite golden road stretching toward a brilliant horizon, warm light growing brighter ahead, clouds parting in majesty',
  'Aging Gracefully':
    'Weathered hands holding a blooming flower in a sunlit garden, deep character lines telling stories, warm and dignified',
  Renewal:
    'A butterfly emerging from its chrysalis on a dewy morning branch, soft bokeh background, transformation and beauty',

  // ── Faith ──────────────────────────────────────────────────────────
  'Trusting God':
    'A narrow mountain bridge over a deep valley covered in morning mist, sunlight breaking through on the far side, a step of faith',
  Faith:
    'A mustard seed held in an open palm with a vast landscape stretching behind, shallow depth of field, powerful metaphor',
  'Spiritual Growth':
    'A young tree growing strong beside a flowing stream, roots visible reaching toward water, morning light through leaves',
  'Prayer Life':
    'Weathered hands clasped in prayer on an open Bible, warm candlelight illuminating the scene, intimate and reverent',
  'Walking by Faith':
    'A solitary figure walking a misty forest path, soft light filtering through tall trees ahead, peaceful unknown journey',
  Doubt:
    'A person looking up at a night sky full of stars from a hilltop, searching and contemplative, moonlight on their face',
  'Surrendering to God':
    'Open hands held up toward a bright sky, releasing white flower petals into the wind, golden hour light, letting go',
  'Obedience to God':
    'A well-worn path through a golden wheat field leading toward distant mountains, clear direction, warm harvest light',
  Salvation:
    'A dramatic beam of light breaking through dark clouds onto a wooden cross on a hilltop, powerful and reverent',
  'The Holy Spirit':
    'A white dove in flight against a brilliant blue sky with golden sunlight, wings spread wide, pure and graceful',
  'The Power of Scripture':
    'An ancient leather Bible open on a wooden desk, warm candlelight illuminating the pages, dust motes in the light',
  "God's Sovereignty":
    'A panoramic view from a mountain summit above the clouds, vast and majestic landscape stretching to the horizon, awe-inspiring',
  Righteousness:
    'A straight narrow path through a beautiful garden leading toward brilliant morning light, flowers blooming on both sides',

  // ── Strength ───────────────────────────────────────────────────────
  Strength:
    'A mighty oak tree standing alone in a field, roots deep and visible, storm clouds in the background but tree unmoved, resilient',
  Courage:
    'A person standing at the edge of a cliff overlooking a vast valley at sunrise, wind in their hair, brave and determined',
  'Overcoming Temptation':
    'A fork in a forest road, one path dark and tangled, the other bright and clear, warm light guiding toward the right choice',
  Resilience:
    'A wildflower growing through a crack in concrete, vibrant color against gray, sunlight catching its petals, unstoppable life',
  'Addiction Recovery':
    'Broken chains lying on the ground in warm sunlight, a person walking away toward a bright horizon, freedom and liberation',
  'Standing Firm':
    'A lighthouse on a rocky cliff during a dramatic sunset, waves crashing below but the structure unmoved, strong and steadfast',

  // ── Wisdom ─────────────────────────────────────────────────────────
  Wisdom:
    'An open book beneath a massive ancient tree, dappled sunlight filtering through leaves onto the pages, peaceful and contemplative',
  'Decision Making':
    'A crossroads in a beautiful countryside at golden hour, both paths leading through scenic landscapes, thoughtful moment of choice',
  Discernment:
    'A jeweler examining a gem under warm focused light, careful attention to detail, craftsmanship and precision',
  Guidance:
    'A compass resting on an old map with warm candlelight, navigation and direction, warm tones and detailed textures',
  Understanding:
    'A person looking through a telescope at a starry night sky from a mountaintop, wonder and discovery, cosmic beauty',
  'Self-Control':
    'A still archery bow with arrow perfectly aligned, focused aim, soft bokeh background of a training ground at dawn',
  Integrity:
    'A straight tall pine tree standing among bent ones after a storm, morning light highlighting its strength, character shown',
  Truthfulness:
    'A clear mountain spring bubbling up from rocks, crystal clear water reflecting sky, purity and transparency',

  // ── Forgiveness ────────────────────────────────────────────────────
  Forgiveness:
    'Two people facing each other with hands extended in reconciliation, warm golden sunset behind them, silhouettes, restoration',
  Grace:
    'Rain falling gently on a parched field with the first green shoots appearing, soft overcast light, undeserved blessing',
  Mercy:
    'A sunrise over a calm ocean, first light of a new day, fresh start, warm colors painting the sky and water',
  Repentance:
    'A person kneeling in a sunlit cathedral, light streaming through stained glass windows, creating colorful patterns on the floor',
  'Letting Go of Bitterness':
    'A person releasing a dark balloon into a bright sky, watching it float away, standing in a field of sunflowers',

  // ── Family ─────────────────────────────────────────────────────────
  Marriage:
    'A husband and wife holding hands while walking along a beach at golden sunset, their shadows stretching behind them, unity',
  Children:
    'Small feet running through a sunlit meadow with wildflowers, joyful movement, warm afternoon light, innocence and delight',
  Families:
    'Multiple generations gathered around a table in a warm dining room, candlelight, laughter implied, togetherness and love',
  Parenting:
    'A parent and child planting a young tree together in a garden, warm sunlight, teamwork and nurture, growth metaphor',
  'Honoring Parents':
    'An elderly person and adult child walking arm in arm down a tree-lined path in autumn, warm golden light, respect',
  'Military Families':
    'A folded American flag on a mantle with a family photo beside it, warm home lighting, sacrifice and love',
  'Single Parents':
    'A parent carrying a child on their shoulders through a sunflower field, warm golden light, strength and love combined',
  'Widows and Widowers':
    'A single place setting at a beautiful table by a window with sunset light, quiet dignity, remembrance',

  // ── Health ─────────────────────────────────────────────────────────
  Healing:
    'Gentle hands wrapping a bandage in warm light, a window showing sunrise, care and tenderness, hope for recovery',
  'Physical Health':
    'A person stretching at dawn on a hilltop, silhouette against warm sky, vitality and wellness, fresh morning air',
  'Mental Health':
    'A person sitting peacefully in a zen garden, raked sand patterns, green plants, calm and centered, therapeutic space',
  Caregivers:
    'Gentle hands holding an elderly person\'s weathered hand, warm window light, compassion and service, intimate care',
  Recovery:
    'A path through a hospital garden with blooming flowers, warm sunlight, bench for rest, hope and healing journey',

  // ── Praise ─────────────────────────────────────────────────────────
  Thankfulness:
    'A harvest table filled with autumn produce in warm golden light, abundance and gratitude, rustic wooden setting',
  Worship:
    'Hands raised toward a brilliant sunrise over mountains, silhouette, golden rays streaming through clouds, adoration',
  Joy:
    'A child laughing while running through sunlit rain, water droplets catching rainbow light, pure happiness and wonder',
  Gratitude:
    'A sunflower field at golden hour, faces turned toward the warm light, abundance and thankfulness in nature',
  'Praising God in Hard Times':
    'A single flower blooming in a barren rocky landscape, dramatic light, beauty and praise despite harsh conditions',
  "Celebrating God's Goodness":
    'A spectacular double rainbow over a lush green valley after rain, sunlight breaking through, celebration of beauty',

  // ── Community ──────────────────────────────────────────────────────
  'Community Unity':
    'Many hands of different ethnicities stacked together in a circle, warm natural light, unity and togetherness',
  Friendships:
    'Two friends walking side by side on a country road at sunset, long shadows, companionship and loyalty',
  Churches:
    'A beautiful old church with warm light glowing from within at dusk, welcoming open doors, steeple against twilight sky',
  Neighbors:
    'A white picket fence between two gardens, both sides flourishing, warm afternoon light, community and care',
  Hospitality:
    'A welcoming front door with a warm light inside, a wreath on the door, inviting porch, evening glow',
  Justice:
    'A balanced scale against a sunrise backdrop, golden light, fairness and righteousness symbolized',
  'Those in Prison':
    'Light streaming through a barred window onto a Bible on a simple bed, hope in confinement, warm contrast',
  'Refugees and the Displaced':
    'A family silhouetted walking toward a bright horizon across a vast landscape, journey and hope ahead',
  'World Leaders':
    'A globe on a desk illuminated by warm desk lamp, world map visible, thoughtful leadership setting',

  // ── Service ────────────────────────────────────────────────────────
  Pastors:
    'A shepherd with a staff silhouetted on a hillside at sunset, flock visible below, pastoral care and guidance',
  Missionaries:
    'A well-worn pair of walking shoes on a dusty road stretching to the horizon, warm sunset light, journey of service',
  Teachers:
    'An open book on a desk with warm sunlight streaming through a classroom window, chalkboard in soft focus',
  'First Responders':
    'Emergency lights reflecting on rain-wet pavement at dusk, warm amber glow, courage and service in action',
  'Healthcare Workers':
    'A stethoscope on a white coat in warm hospital light, caring hands visible, dedication and compassion',
  'Serving Others':
    'Hands serving food at a community kitchen, warm overhead lighting, generosity and love in action',
  Volunteers:
    'People working together building something outdoors in warm sunlight, teamwork and purpose, community service',
  'Caring for the Poor':
    'Hands gently offering bread, warm golden light, close-up with blurred background, generosity and compassion',
  Students:
    'A young person studying by a window with warm morning light, books and notes spread out, dedication to learning',
  'Environmental Stewardship':
    'Hands planting a young seedling in rich dark earth, morning dew, new growth and care for creation',

  // ── Provision ──────────────────────────────────────────────────────
  'Financial Stress':
    'An open empty wallet on a table with warm light, a Bible nearby, trusting God in difficulty, intimate scene',
  Employment:
    'A sunrise over a city skyline, new day of opportunity, warm golden light on buildings, hope for provision',
  "God's Provision":
    'A bird\'s nest with eggs in a flowering tree branch, warm spring light, God caring for His creation',
  Generosity:
    'Open hands pouring grain into waiting hands below, warm harvest light, giving freely and abundantly',
  Stewardship:
    'A well-tended garden with organized rows of vegetables, morning light, faithful management and care',

  // ── Patience ───────────────────────────────────────────────────────
  Patience:
    'A fisherman sitting quietly by a still river at dawn, patient and calm, warm golden mist rising from water',
  "God's Timing":
    'A clock face overlaid with blooming flowers, time and nature intertwined, soft warm lighting, seasons and trust',
  "Trusting God's Process":
    'A potter\'s hands shaping clay on a wheel, warm studio light, patience and artistry in creation',
  'Long-Suffering':
    'A farmer looking over a newly planted field at sunset, empty but full of potential, patient expectation',

  // ── Protection ─────────────────────────────────────────────────────
  Safety:
    'A cozy cabin with warm light glowing in windows during a snowstorm, shelter and safety, warm against cold',
  Protection:
    'A mother hen sheltering chicks under her wings, warm barn light, gentle and protective, security',
  'Spiritual Warfare':
    'Dramatic sunrise breaking through dark clouds over a battlefield of wildflowers, light overcoming darkness, victory',
  'God as Refuge':
    'A cave opening framing a beautiful valley view, warm light outside, shelter and protection, safe haven',
  'Those Facing Persecution':
    'A candle burning steadily in darkness with other candles lighting from it, spreading light, courage under pressure',

  // ── Relationships ──────────────────────────────────────────────────
  Love:
    'Two trees growing side by side with intertwined roots visible, autumn golden light, deep connection and love',
  Kindness:
    'A hand gently placing a flower on a stranger\'s doorstep, warm morning light, small act of love',
  Humility:
    'A person washing another\'s feet in warm candlelight, basin of water, intimate act of service, reverent',
  'Conflict Resolution':
    'A bridge over a peaceful stream connecting two green meadows, warm golden light, reconciliation and connection',
  Compassion:
    'A person embracing another in a field at golden hour, warm light surrounding them, empathy and care',
  "God's Unconditional Love":
    'A vast ocean stretching to the horizon under a magnificent sunset, boundless and unchanging, overwhelming beauty',
  'Speaking Truth in Love':
    'Two people sitting face to face on a park bench in dappled sunlight, open and honest conversation',

  // ── Purpose ────────────────────────────────────────────────────────
  Purpose:
    'A compass pointing north on a mountaintop at sunrise, clear direction, vast possibilities ahead, calling',
  'Identity in Christ':
    'A reflection in still water showing a crown where a person stands, golden light, true identity revealed',
  Calling:
    'A path of light leading through a dark forest to an illuminated clearing, vocational calling, divine direction',
  'Using Your Gifts':
    'An artist\'s hands working with vibrant paints at a sunlit easel, creativity and purpose, colorful expression',
  "God's Will":
    'A river flowing through a carved canyon, following the natural path, warm sunset light on red rock walls',

  // ── Guidance ───────────────────────────────────────────────────────
  Direction:
    'A lamp illuminating a single step on a dark stone path, warm glow, one step at a time, trust',
  'Life Transitions':
    'An open door leading from a dark hallway into a sunlit garden, transition and new chapter, warm inviting light',
  "God's Faithfulness":
    'A rainbow arching over a peaceful countryside after rain, promise and faithfulness, vibrant colors against clearing sky',
  "Following God's Path":
    'Footprints in sand leading along a beach toward a brilliant sunrise, following the way, warm coastal light',
};

// Fallback scene for topics not in the map
export const FALLBACK_SCENE =
  'A serene sunrise over a calm lake with golden light reflecting on still water, mountain silhouettes in the distance, peaceful and hopeful atmosphere';

export function getSceneForTopic(topic: string): string {
  return TOPIC_SCENE_MAP[topic] ?? FALLBACK_SCENE;
}
