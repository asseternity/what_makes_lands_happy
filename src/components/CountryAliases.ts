const country_aliases: { [key: string]: string } = {
  // Bosnia
  'bosnia-herzegovina': 'bosnia and herzegovina',
  'bosnia and herzegovina': 'bosnia and herzegovina',
  'bosnia and herz.': 'bosnia and herzegovina',
  'bosnia and herz': 'bosnia and herzegovina',

  // North Macedonia
  macedonia: 'north macedonia',
  'macedonia (fyrom)': 'north macedonia',
  'the former yugoslav republic of macedonia': 'north macedonia',

  // us and uk
  'united states of america': 'united states',
  usa: 'united states',
  'u s a': 'united states',
  us: 'united states',
  america: 'united states',
  'u.s.a.': 'united states',
  'u. s. a.': 'united states',
  'u. s. a. ': 'united states',

  uk: 'united kingdom',
  'united kingdom of great britain and northern ireland': 'united kingdom',
  'great britain': 'united kingdom',
  britain: 'united kingdom',

  // korea
  'south korea': 'korea republic of',
  'korea republic of': 'korea republic of',
  'republic of korea': 'korea republic of',
  'korea south': 'korea republic of',
  's korea': 'korea republic of',
  'ro korea': 'korea republic of',
  'korea, south': 'korea republic of',

  'north korea': 'korea democratic peoples republic of',
  'democratic peoples republic of korea':
    'korea democratic peoples republic of',
  dprk: 'korea democratic peoples republic of',

  // russia / soviet-era variants
  russia: 'russian federation',
  'russian federation': 'russian federation',
  'russian fed': 'russian federation',
  'russian federation (the)': 'russian federation',

  // ivory coast
  'ivory coast': 'cote divoire',
  'cote d ivoire': 'cote divoire',
  'cote divoire': 'cote divoire',
  cotedivoire: 'cote divoire',

  // guinea-bissau
  'guinea bissau': 'guinea bissau',
  'guinea-bissau': 'guinea bissau',
  'republic of guinea bissau': 'guinea bissau',

  // belarus
  belarus: 'belarus',
  belorussia: 'belarus',
  byelorussia: 'belarus',
  'republic of belarus': 'belarus',

  // eswatini / swaziland
  eswatini: 'eswatini',
  'kingdom of eswatini': 'eswatini',
  swaziland: 'eswatini',
  'kingdom of swaziland': 'eswatini',

  // czechia
  czechia: 'czech republic',
  'czech republic': 'czech republic',

  // other common alternates / formal names (helpful general additions)
  prc: 'china',
  'people s republic of china': 'china',
  'people s republic of china (china)': 'china',
  china: 'china',

  iran: 'iran',
  'islamic republic of iran': 'iran',
  'iran islamic republic of': 'iran',

  'syrian arab republic': 'syria',
  syria: 'syria',

  'viet nam': 'vietnam',
  vietnam: 'vietnam',

  moldova: 'moldova',
  'republic of moldova': 'moldova',
  'moldova republic of': 'moldova',

  bolivia: 'bolivia',
  'bolivia plurinational state of': 'bolivia',

  vatican: 'vatican city',
  'vatican city': 'vatican city',
  'holy see': 'vatican city',

  turkiye: 'turkey',
  turkey: 'turkey',

  'cape verde': 'cape verde',
  'cabo verde': 'cape verde',

  'congo republic': 'congo republic',
  'congo democratic republic': 'democratic republic of the congo',
  'democratic republic of the congo': 'democratic republic of the congo',
  'dr congo': 'democratic republic of the congo',

  // small/alternate common forms
  slovakia: 'slovakia',
  'slovak republic': 'slovakia',

  'north macedonia': 'north macedonia',
  'republic of north macedonia': 'north macedonia',

  // handy abbreviations
  uae: 'united arab emirates',
  'u a e': 'united arab emirates',
  drc: 'democratic republic of the congo',
  ukraine: 'ukraine',
};

export default country_aliases;
