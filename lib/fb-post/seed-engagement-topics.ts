export type SeedEngagementTopic = {
  contentType: string;
  prompt: string;
  verseReference?: string;
  verseText?: string;
  triviaAnswer?: string;
  imageUrl?: string;
};

export const ENGAGEMENT_SEED_TOPICS: SeedEngagementTopic[] = [
  // One Word Prayer (40 entries)
  {
    contentType: 'one_word_prayer',
    prompt: 'What is one word you need prayer for today?',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'Comment one word below that describes what you are facing today.',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'What is one thing you would like us to pray for?',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'In one word, how can we pray for you today?',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'Share one word that describes your prayer request.',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'What is one word you need to give to God today?',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'Comment one word you are bringing to God in prayer.',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'In one word, what are you trusting God with?',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'What is one thing on your heart today? (One word)',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'Share one word that captures your prayer today.',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'What is one word you need God help with?',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'In one word, what do you need from God today?',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'Comment one word you are laying at God feet.',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'What is one thing you need God peace about? (One word)',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'Share one word for what you are believing God for.',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'In one word, what are you asking God for today?',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'What is one word that describes your journey right now?',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'Comment one word you are surrendering to God.',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'What is one area where you need God strength? (One word)',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'Share one word for what you are seeking from God.',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'In one word, what is weighing on your heart?',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'What is one thing you need God wisdom about? (One word)',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'Comment one word that describes what you are praying for.',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'What is one word you are clinging to in prayer?',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'Share one word for what you need breakthrough in.',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'In one word, what are you hoping in God for?',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'What is one thing you are wrestling with? (One word)',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'Comment one word you need God to touch.',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'What is one area you need God guidance? (One word)',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'Share one word for what you are entrusting to God.',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'In one word, what do you need God comfort for?',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'What is one thing you need God healing in? (One word)',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'Comment one word that describes your current season.',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'What is one word you need God provision for?',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'Share one word for what you are releasing to God.',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'In one word, what are you hoping God will do?',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'What is one thing you need God clarity on? (One word)',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'Comment one word you are leaning on God for.',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'What is one area you need God patience with? (One word)',
  },
  {
    contentType: 'one_word_prayer',
    prompt: 'Share one word that captures what you need from God.',
  },

  // Scripture Reflection Question (40 entries)
  {
    contentType: 'scripture_reflection',
    verseReference: 'Proverbs 3:5-6',
    verseText:
      'Trust in Jehovah with all thy heart, And lean not upon thine own understanding: In all thy ways acknowledge him, And he will direct thy paths.',
    prompt: 'What area of your life are you trusting God with today?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Philippians 4:6',
    verseText:
      'In nothing be anxious; but in everything by prayer and supplication with thanksgiving let your requests be made known unto God.',
    prompt: 'What are you bringing to God in prayer today?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Psalm 46:1',
    verseText:
      'God is our refuge and strength, A very present help in trouble.',
    prompt: 'How has God been your refuge lately?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Matthew 11:28',
    verseText:
      'Come unto me, all ye that labor and are heavy laden, and I will give you rest.',
    prompt: 'What burden are you bringing to Jesus today?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Psalm 23:1',
    verseText: 'Jehovah is my shepherd; I shall not want.',
    prompt: 'How has God provided for you recently?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Romans 8:28',
    verseText:
      'And we know that to them that love God all things work together for good, even to them that are called according to his purpose.',
    prompt: 'Where have you seen God working things together for good?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Isaiah 40:31',
    verseText:
      'But they that wait for Jehovah shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; they shall walk, and not faint.',
    prompt: 'What are you waiting on God for?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Jeremiah 29:11',
    verseText:
      'For I know the thoughts that I think toward you, saith Jehovah, thoughts of peace, and not of evil, to give you hope in your latter end.',
    prompt: 'How does knowing God has plans for your good encourage you?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Psalm 46:10',
    verseText: 'Be still, and know that I am God.',
    prompt: 'What helps you be still before God?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Proverbs 16:3',
    verseText: 'Commit thy works unto Jehovah, And thy purposes shall be established.',
    prompt: 'What are you committing to God today?',
  },

  // Christian Trivia (30 more entries - adding to existing 10)
  {
    contentType: 'trivia',
    prompt: 'Who built the ark?\n\nA) Moses\nB) Noah\nC) Abraham\nD) David',
    triviaAnswer: 'B) Noah (Genesis 6-9)',
  },
  {
    contentType: 'trivia',
    prompt: 'Which disciple walked on water with Jesus?\n\nA) James\nB) John\nC) Peter\nD) Andrew',
    triviaAnswer: 'C) Peter (Matthew 14:29)',
  },
  {
    contentType: 'trivia',
    prompt: 'How many days was Jesus in the tomb?\n\nA) 1 day\nB) 2 days\nC) 3 days\nD) 7 days',
    triviaAnswer: 'C) 3 days (Matthew 12:40)',
  },
  {
    contentType: 'trivia',
    prompt: 'Who was swallowed by a great fish?\n\nA) Elijah\nB) Jonah\nC) Daniel\nD) Job',
    triviaAnswer: 'B) Jonah (Jonah 1:17)',
  },
  {
    contentType: 'trivia',
    prompt: 'How many disciples did Jesus have?\n\nA) 7\nB) 10\nC) 12\nD) 24',
    triviaAnswer: 'C) 12 (Matthew 10:1-4)',
  },
  {
    contentType: 'trivia',
    prompt: 'Who parted the Red Sea?\n\nA) Moses\nB) Joshua\nC) Elijah\nD) David',
    triviaAnswer: 'A) Moses (Exodus 14:21)',
  },
  {
    contentType: 'trivia',
    prompt: 'What was the name of the garden where Adam and Eve lived?\n\nA) Gethsemane\nB) Eden\nC) Bethany\nD) Nazareth',
    triviaAnswer: 'B) Eden (Genesis 2:8)',
  },
  {
    contentType: 'trivia',
    prompt: 'Who defeated Goliath?\n\nA) Saul\nB) Solomon\nC) David\nD) Samuel',
    triviaAnswer: 'C) David (1 Samuel 17:50)',
  },
  {
    contentType: 'trivia',
    prompt: 'How many books are in the New Testament?\n\nA) 22\nB) 27\nC) 39\nD) 66',
    triviaAnswer: 'B) 27 books',
  },
  {
    contentType: 'trivia',
    prompt: 'Who wrote most of the New Testament letters?\n\nA) Peter\nB) Paul\nC) John\nD) James',
    triviaAnswer: 'B) Paul (13 letters)',
  },
  {
    contentType: 'trivia',
    prompt: 'What is the shortest verse in the Bible?\n\nA) God is love\nB) Jesus wept\nC) Pray without ceasing\nD) Be still',
    triviaAnswer: 'B) Jesus wept (John 11:35)',
  },
  {
    contentType: 'trivia',
    prompt: 'Who betrayed Jesus?\n\nA) Peter\nB) Thomas\nC) Judas\nD) Matthew',
    triviaAnswer: 'C) Judas Iscariot (Matthew 26:48-49)',
  },
  {
    contentType: 'trivia',
    prompt: 'What was the first miracle Jesus performed?\n\nA) Walking on water\nB) Healing the blind\nC) Turning water into wine\nD) Feeding 5000',
    triviaAnswer: 'C) Turning water into wine (John 2:1-11)',
  },
  {
    contentType: 'trivia',
    prompt: 'How many plagues did God send on Egypt?\n\nA) 7\nB) 10\nC) 12\nD) 40',
    triviaAnswer: 'B) 10 plagues (Exodus 7-12)',
  },
  {
    contentType: 'trivia',
    prompt: 'Who was the oldest person in the Bible?\n\nA) Adam\nB) Noah\nC) Methuselah\nD) Abraham',
    triviaAnswer: 'C) Methuselah (969 years, Genesis 5:27)',
  },

  // Finish The Verse (20 entries)
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"The Lord is my shepherd; I shall not ______."',
    triviaAnswer: 'want (Psalm 23:1, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"In the beginning God created the ______ and the ______."',
    triviaAnswer: 'heaven / earth (Genesis 1:1, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"For God so loved the world, that he gave his only begotten ______."',
    triviaAnswer: 'Son (John 3:16, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"Trust in Jehovah with all thy ______."',
    triviaAnswer: 'heart (Proverbs 3:5, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"Be still, and know that I am ______."',
    triviaAnswer: 'God (Psalm 46:10, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"I can do all things through Christ which ______ me."',
    triviaAnswer: 'strengtheneth (Philippians 4:13, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"Thy word is a lamp unto my feet, and a ______ unto my path."',
    triviaAnswer: 'light (Psalm 119:105, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"Rejoice in the Lord ______."',
    triviaAnswer: 'always (Philippians 4:4, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"The Lord is my light and my ______."',
    triviaAnswer: 'salvation (Psalm 27:1, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"Love is patient, love is ______."',
    triviaAnswer: 'kind (1 Corinthians 13:4, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"This is the day which Jehovah hath made; we will ______ and be glad in it."',
    triviaAnswer: 'rejoice (Psalm 118:24, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"Cast thy burden upon Jehovah, and he will ______ thee."',
    triviaAnswer: 'sustain (Psalm 55:22, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"The fruit of the Spirit is love, joy, ______."',
    triviaAnswer: 'peace (Galatians 5:22, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"I will lift up mine eyes unto the mountains: From whence shall my ______ come?"',
    triviaAnswer: 'help (Psalm 121:1, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"Come unto me, all ye that labor and are heavy laden, and I will give you ______."',
    triviaAnswer: 'rest (Matthew 11:28, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"The Lord is my strength and my ______."',
    triviaAnswer: 'song (Exodus 15:2, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"But they that wait for Jehovah shall renew their ______."',
    triviaAnswer: 'strength (Isaiah 40:31, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"Ask, and it shall be given you; seek, and ye shall ______."',
    triviaAnswer: 'find (Matthew 7:7, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"Fear thou not, for I am with thee; be not dismayed, for I am thy ______."',
    triviaAnswer: 'God (Isaiah 41:10, ASV)',
  },
  {
    contentType: 'finish_verse',
    prompt: 'Finish this verse:\n\n"In all thy ways acknowledge him, and he will ______ thy paths."',
    triviaAnswer: 'direct (Proverbs 3:6, ASV)',
  },

  // Gratitude Prompt (20 entries)
  {
    contentType: 'gratitude',
    prompt: 'God has blessed me with ______.',
  },
  {
    contentType: 'gratitude',
    prompt: 'One thing I am thankful for today is ______.',
  },
  {
    contentType: 'gratitude',
    prompt: 'What is one blessing you experienced this week?',
  },
  {
    contentType: 'gratitude',
    prompt: 'I am grateful to God for ______.',
  },
  {
    contentType: 'gratitude',
    prompt: 'God has been faithful in ______.',
  },
  {
    contentType: 'gratitude',
    prompt: 'One way God has provided for me is ______.',
  },
  {
    contentType: 'gratitude',
    prompt: 'What is something good that happened to you today?',
  },
  {
    contentType: 'gratitude',
    prompt: 'I am thankful God gave me ______.',
  },
  {
    contentType: 'gratitude',
    prompt: 'What is one answer to prayer you are celebrating?',
  },
  {
    contentType: 'gratitude',
    prompt: 'God goodness is shown in ______.',
  },
  {
    contentType: 'gratitude',
    prompt: 'Today I am praising God for ______.',
  },
  {
    contentType: 'gratitude',
    prompt: 'What is a gift from God you are grateful for?',
  },
  {
    contentType: 'gratitude',
    prompt: 'One unexpected blessing this week was ______.',
  },
  {
    contentType: 'gratitude',
    prompt: 'I see God love in ______.',
  },
  {
    contentType: 'gratitude',
    prompt: 'What is one thing God has taught you recently?',
  },
  {
    contentType: 'gratitude',
    prompt: 'I am thankful for God grace with ______.',
  },
  {
    contentType: 'gratitude',
    prompt: 'What is a simple joy God gave you this week?',
  },
  {
    contentType: 'gratitude',
    prompt: 'God surprised me with ______.',
  },
  {
    contentType: 'gratitude',
    prompt: 'One way I have seen God move is ______.',
  },
  {
    contentType: 'gratitude',
    prompt: 'What is something about God you are grateful for?',
  },

  // This Or That (10 entries - using text instead of emojis to avoid encoding issues)
  {
    contentType: 'this_or_that',
    prompt: 'Which helps you feel closest to God?\n\nReact with: Heart for Prayer, Thumbs Up for Reading Scripture, Praying Hands for Worship, or Wow for Serving Others',
  },
  {
    contentType: 'this_or_that',
    prompt: 'When do you feel most connected to God?\n\nReact with: Heart for Morning, Thumbs Up for Afternoon, Praying Hands for Evening, or Wow for Night',
  },
  {
    contentType: 'this_or_that',
    prompt: 'Where do you like to pray?\n\nReact with: Heart for At Home, Thumbs Up for At Church, Praying Hands for In Nature, or Wow for While Driving',
  },
  {
    contentType: 'this_or_that',
    prompt: 'What helps you focus in prayer?\n\nReact with: Heart for Quiet Time, Thumbs Up for Music, Praying Hands for Journaling, or Wow for Walking',
  },
  {
    contentType: 'this_or_that',
    prompt: 'What brings you peace?\n\nReact with: Heart for Scripture, Thumbs Up for Prayer, Praying Hands for Worship Music, or Wow for Time in Nature',
  },
  {
    contentType: 'this_or_that',
    prompt: 'How do you like to start your day with God?\n\nReact with: Heart for Prayer, Thumbs Up for Bible Reading, Praying Hands for Worship, or Wow for Devotional',
  },
  {
    contentType: 'this_or_that',
    prompt: 'What draws you closer to God?\n\nReact with: Heart for Community, Thumbs Up for Solitude, Praying Hands for Service, or Wow for Study',
  },
  {
    contentType: 'this_or_that',
    prompt: 'What encourages your faith?\n\nReact with: Heart for God Word, Thumbs Up for Answered Prayer, Praying Hands for Fellowship, or Wow for Testimonies',
  },
  {
    contentType: 'this_or_that',
    prompt: 'When do you feel God presence most?\n\nReact with: Heart for In Worship, Thumbs Up for In Prayer, Praying Hands for Serving Others, or Wow for In Nature',
  },
  {
    contentType: 'this_or_that',
    prompt: 'What helps you trust God?\n\nReact with: Heart for Past Faithfulness, Thumbs Up for His Promises, Praying Hands for Prayer, or Wow for Community',
  },

  // Testimony Prompt (15 entries)
  {
    contentType: 'testimony',
    prompt: 'What is one prayer God has answered in your life?',
  },
  {
    contentType: 'testimony',
    prompt: 'Share a moment when God showed His faithfulness.',
  },
  {
    contentType: 'testimony',
    prompt: 'What is a lesson God has taught you recently?',
  },
  {
    contentType: 'testimony',
    prompt: 'When did you feel God presence in a powerful way?',
  },
  {
    contentType: 'testimony',
    prompt: 'How has God brought you through a difficult time?',
  },
  {
    contentType: 'testimony',
    prompt: 'What is a way God has surprised you with His goodness?',
  },
  {
    contentType: 'testimony',
    prompt: 'Share a time when you saw God provision.',
  },
  {
    contentType: 'testimony',
    prompt: 'When has God timing been perfect in your life?',
  },
  {
    contentType: 'testimony',
    prompt: 'What is a breakthrough you have experienced through prayer?',
  },
  {
    contentType: 'testimony',
    prompt: 'How has God changed your heart about something?',
  },
  {
    contentType: 'testimony',
    prompt: 'Share a moment when you felt God speak to you.',
  },
  {
    contentType: 'testimony',
    prompt: 'What is a way God has used a difficult season for good?',
  },
  {
    contentType: 'testimony',
    prompt: 'When have you witnessed God power in your life?',
  },
  {
    contentType: 'testimony',
    prompt: 'How has God restored something you thought was lost?',
  },
  {
    contentType: 'testimony',
    prompt: 'What is a promise from God that has sustained you?',
  },

  // Additional Scripture Reflection entries (30 more to reach 40 total)
  {
    contentType: 'scripture_reflection',
    verseReference: 'John 14:27',
    verseText:
      'Peace I leave with you; my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be fearful.',
    prompt: 'Where do you need God peace today?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: '1 Peter 5:7',
    verseText:
      'Casting all your anxiety upon him, because he careth for you.',
    prompt: 'What worry are you casting on God today?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Joshua 1:9',
    verseText:
      'Have not I commanded thee? Be strong and of good courage; be not affrighted, neither be thou dismayed: for Jehovah thy God is with thee whithersoever thou goest.',
    prompt: 'What situation do you need courage for today?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Romans 12:12',
    verseText:
      'Rejoicing in hope; patient in tribulation; continuing stedfastly in prayer.',
    prompt: 'What are you hoping in God for right now?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Psalm 34:8',
    verseText:
      'Oh taste and see that Jehovah is good: Blessed is the man that taketh refuge in him.',
    prompt: 'How have you experienced God goodness this week?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Colossians 3:15',
    verseText:
      'And let the peace of Christ rule in your hearts, to the which also ye were called in one body; and be ye thankful.',
    prompt: 'What are you most thankful for today?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Isaiah 26:3',
    verseText:
      'Thou wilt keep him in perfect peace, whose mind is stayed on thee; because he trusteth in thee.',
    prompt: 'What helps you keep your mind stayed on God?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Psalm 121:2',
    verseText:
      'My help cometh from Jehovah, Who made heaven and earth.',
    prompt: 'Where do you need help from God today?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Galatians 5:22-23',
    verseText:
      'But the fruit of the Spirit is love, joy, peace, longsuffering, kindness, goodness, faithfulness, meekness, self-control.',
    prompt: 'Which fruit of the Spirit do you need most right now?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Hebrews 13:5',
    verseText:
      'I will in no wise fail thee, neither will I in any wise forsake thee.',
    prompt: 'How does knowing God will never leave you bring you comfort?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: '2 Corinthians 12:9',
    verseText:
      'And he hath said unto me, My grace is sufficient for thee: for my power is made perfect in weakness.',
    prompt: 'Where do you need God strength in your weakness?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Psalm 107:1',
    verseText:
      'Oh give thanks unto Jehovah; for he is good; For his lovingkindness endureth for ever.',
    prompt: 'What is one way God has shown His lovingkindness to you?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'James 1:5',
    verseText:
      'But if any of you lacketh wisdom, let him ask of God, who giveth to all liberally and upbraideth not; and it shall be given him.',
    prompt: 'What decision do you need wisdom from God about?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Psalm 73:26',
    verseText:
      'My flesh and my heart faileth; But God is the strength of my heart and my portion for ever.',
    prompt: 'In what area are you leaning on God as your strength?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Romans 15:13',
    verseText:
      'Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, in the power of the Holy Spirit.',
    prompt: 'How has God filled you with hope recently?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Lamentations 3:22-23',
    verseText:
      'It is of Jehovah lovingkindnesses that we are not consumed, because his compassions fail not. They are new every morning; great is thy faithfulness.',
    prompt: 'What new mercy from God are you grateful for today?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Nahum 1:7',
    verseText:
      'Jehovah is good, a stronghold in the day of trouble; and he knoweth them that take refuge in him.',
    prompt: 'How has God been your stronghold in trouble?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: '1 Thessalonians 5:16-18',
    verseText:
      'Rejoice always; pray without ceasing; in everything give thanks: for this is the will of God in Christ Jesus to you-ward.',
    prompt: 'What are you giving thanks for today?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Psalm 37:4',
    verseText:
      'Delight thyself also in Jehovah; And he will give thee the desires of thy heart.',
    prompt: 'What brings you delight in your relationship with God?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Isaiah 43:2',
    verseText:
      'When thou passest through the waters, I will be with thee; and through the rivers, they shall not overflow thee.',
    prompt: 'What waters are you passing through right now?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Psalm 62:8',
    verseText:
      'Trust in him at all times, ye people; Pour out your heart before him: God is a refuge for us.',
    prompt: 'What is on your heart to pour out to God?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Matthew 6:33',
    verseText:
      'But seek ye first his kingdom, and his righteousness; and all these things shall be added unto you.',
    prompt: 'How are you seeking God first today?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Psalm 100:4',
    verseText:
      'Enter into his gates with thanksgiving, And into his courts with praise: Give thanks unto him, and bless his name.',
    prompt: 'What are you praising God for this week?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: '2 Timothy 1:7',
    verseText:
      'For God gave us not a spirit of fearfulness; but of power and love and discipline.',
    prompt: 'What fear is God helping you overcome?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Psalm 139:14',
    verseText:
      'I will give thanks unto thee; for I am fearfully and wonderfully made.',
    prompt: 'How does knowing you are wonderfully made encourage you?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Ephesians 3:20',
    verseText:
      'Now unto him that is able to do exceeding abundantly above all that we ask or think.',
    prompt: 'What are you asking God to do that seems impossible?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Psalm 145:18',
    verseText:
      'Jehovah is nigh unto all them that call upon him, To all that call upon him in truth.',
    prompt: 'When have you felt God near when you called on Him?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Zephaniah 3:17',
    verseText:
      'Jehovah thy God is in the midst of thee, a mighty one who will save; he will rejoice over thee with joy; he will rest in his love; he will joy over thee with singing.',
    prompt: 'How does it feel to know God rejoices over you?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Psalm 91:4',
    verseText:
      'He will cover thee with his pinions, And under his wings shalt thou take refuge.',
    prompt: 'What are you seeking refuge from today?',
  },
  {
    contentType: 'scripture_reflection',
    verseReference: 'Isaiah 41:13',
    verseText:
      'For I, Jehovah thy God, will hold thy right hand, saying unto thee, Fear not; I will help thee.',
    prompt: 'Where do you need to feel God holding your hand?',
  },

  // Additional Trivia entries (15 more to reach 30 total)
  {
    contentType: 'trivia',
    prompt: 'How many fruits of the Spirit are there?\n\nA) 7\nB) 9\nC) 10\nD) 12',
    triviaAnswer: 'B) 9 (Galatians 5:22-23)',
  },
  {
    contentType: 'trivia',
    prompt: 'What did Jesus turn water into at the wedding in Cana?\n\nA) Wine\nB) Bread\nC) Oil\nD) Milk',
    triviaAnswer: 'A) Wine (John 2:1-11)',
  },
  {
    contentType: 'trivia',
    prompt: 'Who baptized Jesus?\n\nA) Peter\nB) John the Baptist\nC) Andrew\nD) James',
    triviaAnswer: 'B) John the Baptist (Matthew 3:13-17)',
  },
  {
    contentType: 'trivia',
    prompt: 'How many days did God take to create the world?\n\nA) 3\nB) 5\nC) 6\nD) 7',
    triviaAnswer: 'C) 6 days (Genesis 1)',
  },
  {
    contentType: 'trivia',
    prompt: 'What did David use to defeat Goliath?\n\nA) Sword\nB) Spear\nC) Sling and stones\nD) Bow and arrow',
    triviaAnswer: 'C) Sling and stones (1 Samuel 17:49-50)',
  },
  {
    contentType: 'trivia',
    prompt: 'Who was the mother of Jesus?\n\nA) Elizabeth\nB) Mary\nC) Martha\nD) Sarah',
    triviaAnswer: 'B) Mary (Luke 1:26-38)',
  },
  {
    contentType: 'trivia',
    prompt: 'How many commandments did God give Moses?\n\nA) 7\nB) 10\nC) 12\nD) 40',
    triviaAnswer: 'B) 10 commandments (Exodus 20)',
  },
  {
    contentType: 'trivia',
    prompt: 'What sea did Moses part?\n\nA) Dead Sea\nB) Sea of Galilee\nC) Red Sea\nD) Mediterranean Sea',
    triviaAnswer: 'C) Red Sea (Exodus 14:21)',
  },
  {
    contentType: 'trivia',
    prompt: 'Who denied Jesus three times?\n\nA) Judas\nB) Thomas\nC) Peter\nD) John',
    triviaAnswer: 'C) Peter (Luke 22:54-62)',
  },
  {
    contentType: 'trivia',
    prompt: 'How many people did Jesus feed with 5 loaves and 2 fish?\n\nA) 500\nB) 1000\nC) 3000\nD) 5000',
    triviaAnswer: 'D) 5000 (Matthew 14:13-21)',
  },
  {
    contentType: 'trivia',
    prompt: 'What did God create on the first day?\n\nA) Sun and moon\nB) Light\nC) Animals\nD) Plants',
    triviaAnswer: 'B) Light (Genesis 1:3)',
  },
  {
    contentType: 'trivia',
    prompt: 'Who was the first king of Israel?\n\nA) David\nB) Solomon\nC) Saul\nD) Samuel',
    triviaAnswer: 'C) Saul (1 Samuel 10:1)',
  },
  {
    contentType: 'trivia',
    prompt: 'What city were Jesus and his family from?\n\nA) Bethlehem\nB) Jerusalem\nC) Nazareth\nD) Galilee',
    triviaAnswer: 'C) Nazareth (Matthew 2:23)',
  },
  {
    contentType: 'trivia',
    prompt: 'How many days and nights did it rain during the flood?\n\nA) 7\nB) 30\nC) 40\nD) 100',
    triviaAnswer: 'C) 40 days and nights (Genesis 7:12)',
  },
  {
    contentType: 'trivia',
    prompt: 'Who wrote most of the Psalms?\n\nA) Moses\nB) David\nC) Solomon\nD) Isaiah',
    triviaAnswer: 'B) David (about 73 psalms)',
  },

  // Additional This Or That entries (10 more to reach 20 total)
  {
    contentType: 'this_or_that',
    prompt: 'What encourages you more?\n\nReact with: Heart for Answered Prayers, Thumbs Up for God Word, Praying Hands for Worship, or Wow for Fellowship',
  },
  {
    contentType: 'this_or_that',
    prompt: 'How do you learn best about God?\n\nReact with: Heart for Reading, Thumbs Up for Listening, Praying Hands for Discussing, or Wow for Experiencing',
  },
  {
    contentType: 'this_or_that',
    prompt: 'Where do you feel God presence most?\n\nReact with: Heart for Church, Thumbs Up for Home, Praying Hands for Work, or Wow for Outdoors',
  },
  {
    contentType: 'this_or_that',
    prompt: 'What strengthens your faith?\n\nReact with: Heart for Bible Study, Thumbs Up for Testimony, Praying Hands for Worship, or Wow for Service',
  },
  {
    contentType: 'this_or_that',
    prompt: 'When do you pray most?\n\nReact with: Heart for Morning, Thumbs Up for Throughout Day, Praying Hands for Evening, or Wow for When Needed',
  },
  {
    contentType: 'this_or_that',
    prompt: 'What helps you stay in God Word?\n\nReact with: Heart for Daily Routine, Thumbs Up for Accountability, Praying Hands for Apps, or Wow for Study Groups',
  },
  {
    contentType: 'this_or_that',
    prompt: 'How do you express gratitude to God?\n\nReact with: Heart for Prayer, Thumbs Up for Praise, Praying Hands for Service, or Wow for Giving',
  },
  {
    contentType: 'this_or_that',
    prompt: 'What brings you closer to God community?\n\nReact with: Heart for Small Groups, Thumbs Up for Sunday Service, Praying Hands for Volunteering, or Wow for One-on-One',
  },
  {
    contentType: 'this_or_that',
    prompt: 'What type of worship moves you?\n\nReact with: Heart for Upbeat, Thumbs Up for Reflective, Praying Hands for Traditional, or Wow for Contemporary',
  },
  {
    contentType: 'this_or_that',
    prompt: 'How do you share your faith?\n\nReact with: Heart for Words, Thumbs Up for Actions, Praying Hands for Invitation, or Wow for Social Media',
  },

  // Additional Testimony entries (15 more to reach 30 total)
  {
    contentType: 'testimony',
    prompt: 'When did God answer a prayer in an unexpected way?',
  },
  {
    contentType: 'testimony',
    prompt: 'Share a time when God comfort got you through a hard day.',
  },
  {
    contentType: 'testimony',
    prompt: 'What is a miracle you have witnessed in your life?',
  },
  {
    contentType: 'testimony',
    prompt: 'How has God changed your perspective on something?',
  },
  {
    contentType: 'testimony',
    prompt: 'When has God opened a door you thought was closed?',
  },
  {
    contentType: 'testimony',
    prompt: 'Share a moment when you felt God peace in the storm.',
  },
  {
    contentType: 'testimony',
    prompt: 'What is a specific way God has provided for your needs?',
  },
  {
    contentType: 'testimony',
    prompt: 'How has God used someone to bless you?',
  },
  {
    contentType: 'testimony',
    prompt: 'When did God show up right on time in your life?',
  },
  {
    contentType: 'testimony',
    prompt: 'Share a time when God conviction led you to change.',
  },
  {
    contentType: 'testimony',
    prompt: 'What is a way God has healed you physically or emotionally?',
  },
  {
    contentType: 'testimony',
    prompt: 'How has God used a trial to strengthen your faith?',
  },
  {
    contentType: 'testimony',
    prompt: 'When have you seen God work through your weakness?',
  },
  {
    contentType: 'testimony',
    prompt: 'Share a time when God gave you the courage to step out in faith.',
  },
  {
    contentType: 'testimony',
    prompt: 'What is a relationship God has restored in your life?',
  },

  // Prayer Poll (20 entries)
  {
    contentType: 'prayer_poll',
    prompt: 'What would you like prayer for this week?\n\n❤️ Family\n👍 Health\n😮 Finances\n🙏 Spiritual Growth',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'What area of your life needs God\'s strength right now?\n\n❤️ Work\n👍 Relationships\n😮 Health\n🙏 Faith',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'Where do you need God\'s peace today?\n\n❤️ Home\n👍 Workplace\n😮 Heart\n🙏 Future',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'What are you trusting God with this week?\n\n❤️ A relationship\n👍 A decision\n😮 A financial need\n🙏 A health concern',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'What do you need most from God today?\n\n❤️ Comfort\n👍 Direction\n😮 Healing\n🙏 Patience',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'How can we pray for you this week?\n\n❤️ Marriage or family\n👍 Career or school\n😮 Anxiety or stress\n🙏 Purpose or calling',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'What is your biggest prayer request right now?\n\n❤️ Healing\n👍 Provision\n😮 Restoration\n🙏 Guidance',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'What season are you walking through?\n\n❤️ Waiting\n👍 Growing\n😮 Struggling\n🙏 Celebrating',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'What would strengthen your faith this week?\n\n❤️ Answered prayer\n👍 Community\n😮 Scripture\n🙏 Worship',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'What do you need God\'s wisdom for?\n\n❤️ A decision at work\n👍 A family matter\n😮 A friendship\n🙏 My next step in life',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'What are you believing God for?\n\n❤️ Breakthrough\n👍 Healing\n😮 Restoration\n🙏 Open doors',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'Where do you need courage today?\n\n❤️ A hard conversation\n👍 A new beginning\n😮 Letting go\n🙏 Standing firm in faith',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'What is weighing on your heart this week?\n\n❤️ A loved one\n👍 My health\n😮 Uncertainty\n🙏 Loneliness',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'What kind of prayer do you need most?\n\n❤️ Prayer for peace\n👍 Prayer for strength\n😮 Prayer for provision\n🙏 Prayer for protection',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'How can the church pray for you?\n\n❤️ My family\n👍 My walk with God\n😮 A difficult trial\n🙏 My community',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'What do you need to surrender to God?\n\n❤️ Fear\n👍 Control\n😮 Doubt\n🙏 Unforgiveness',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'What is God teaching you right now?\n\n❤️ Trust\n👍 Patience\n😮 Humility\n🙏 Gratitude',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'What would help you grow closer to God?\n\n❤️ Daily prayer\n👍 Bible study\n😮 Fellowship\n🙏 Serving others',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'What area of life do you want God to move in?\n\n❤️ Finances\n👍 Relationships\n😮 Career\n🙏 Health',
  },
  {
    contentType: 'prayer_poll',
    prompt: 'What do you need to hear from God today?\n\n❤️ "I love you"\n👍 "I am with you"\n😮 "Trust me"\n🙏 "I have a plan"',
  },

  // Caption This (20 entries)
  // Sunrises/Sunsets (5)
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
  },
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869',
  },
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee',
  },
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
  },
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0',
  },

  // Mountains (4)
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e',
  },
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606',
  },
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
  },
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5',
  },

  // Oceans/Beaches (3)
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0',
  },
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
  },
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
  },

  // Forests/Trees (3)
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
  },
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969',
  },
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b',
  },

  // Starry Skies/Night (2)
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a',
  },
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78',
  },

  // Valleys/Meadows (2)
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
  },
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
  },

  // Peaceful Waters (1)
  {
    contentType: 'caption_this',
    prompt: 'Give this image a Christian caption.',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
  },
];
