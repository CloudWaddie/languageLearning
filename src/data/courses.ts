export type Word = { target: string; base: string };

export type SelectExercise = {
  kind: "select";
  prompt: string;
  options: string[];
  answer: number;
  speak?: string;
};

export type BankExercise = {
  kind: "bank";
  prompt: string;
  tiles: string[];
  answer: string[];
};

export type TypeExercise = {
  kind: "type";
  prompt: string;
  accept: string[];
  speak?: string;
};

export type MatchExercise = {
  kind: "match";
  pairs: [string, string][];
};

export type ListenExercise = {
  kind: "listen";
  speak: string;
  options: string[];
  answer: number;
};

export type Exercise =
  | SelectExercise
  | BankExercise
  | TypeExercise
  | MatchExercise
  | ListenExercise;

export type Lesson = {
  id: string;
  title: string;
  words: Word[];
  exercises: Exercise[];
};

export type Unit = {
  id: string;
  title: string;
  blurb: string;
  color: "sage" | "peach" | "sky" | "lavender";
  lessons: Lesson[];
};

export type Course = {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  ttsLang: string;
  units: Unit[];
};

const italian: Course = {
  id: "it",
  name: "Italian",
  nativeName: "Italiano",
  flag: "🇮🇹",
  ttsLang: "it-IT",
  units: [
    {
      id: "it-u1",
      title: "Le basi",
      blurb: "Greetings, introductions and the little phrases that open every conversation.",
      color: "sage",
      lessons: [
        {
          id: "it-u1-l1",
          title: "Saluti",
          words: [
            { target: "ciao", base: "hello / bye" },
            { target: "buongiorno", base: "good morning" },
            { target: "buonasera", base: "good evening" },
            { target: "come stai", base: "how are you" },
            { target: "bene, grazie", base: "well, thank you" },
            { target: "arrivederci", base: "goodbye" },
          ],
          exercises: [
            { kind: "select", prompt: "Hello!", options: ["Ciao!", "Buonasera!", "Arrivederci!", "Grazie!"], answer: 0, speak: "Ciao!" },
            { kind: "bank", prompt: "Translate: Good morning, how are you?", tiles: ["Buongiorno,", "come", "stai?", "sei", "dove", "grazie"], answer: ["Buongiorno,", "come", "stai?"] },
            { kind: "type", prompt: "Type in Italian: Goodbye (formal)", accept: ["arrivederci"] },
            { kind: "match", pairs: [["ciao", "hello"], ["buongiorno", "good morning"], ["grazie", "thank you"], ["arrivederci", "goodbye"]] },
            { kind: "listen", speak: "Buonasera", options: ["Buonasera", "Buongiorno", "Buonanotte", "Arrivederci"], answer: 0 },
            { kind: "select", prompt: "«Bene, grazie!» means…", options: ["Well, thank you!", "See you soon!", "Yes, please!", "Good evening!"], answer: 0 },
            { kind: "bank", prompt: "Translate: Thank you very much", tiles: ["Grazie", "mille", "molto", "tanto", "bene"], answer: ["Grazie", "mille"] },
          ],
        },
        {
          id: "it-u1-l2",
          title: "Presentarsi",
          words: [
            { target: "mi chiamo", base: "my name is" },
            { target: "piacere", base: "nice to meet you" },
            { target: "sono", base: "I am" },
            { target: "io", base: "I" },
            { target: "di dove sei", base: "where are you from" },
            { target: "e tu", base: "and you" },
          ],
          exercises: [
            { kind: "select", prompt: "Nice to meet you!", options: ["Piacere!", "Per favore!", "Come stai!", "Scusa!"], answer: 0, speak: "Piacere!" },
            { kind: "bank", prompt: "Translate: My name is Anna", tiles: ["Mi", "chiamo", "Anna", "sono", "io", "tu"], answer: ["Mi", "chiamo", "Anna"] },
            { kind: "type", prompt: "Type in Italian: Where are you from?", accept: ["di dove sei", "di dove sei?"] },
            { kind: "match", pairs: [["mi chiamo", "my name is"], ["piacere", "nice to meet you"], ["sono", "I am"], ["io", "I"]] },
            { kind: "select", prompt: "«Sono di Roma» means…", options: ["I am from Rome", "I live in Rome today", "Rome is beautiful", "See you in Rome"], answer: 0 },
            { kind: "listen", speak: "Mi chiamo Luna", options: ["Mi chiamo Luna", "Come stai, Luna?", "Ciao, Luna", "Sono Luna"], answer: 0 },
            { kind: "bank", prompt: "Translate: And you?", tiles: ["E", "tu?", "io?", "anche", "noi"], answer: ["E", "tu?"] },
          ],
        },
        {
          id: "it-u1-l3",
          title: "Per favore",
          words: [
            { target: "per favore", base: "please" },
            { target: "prego", base: "you're welcome" },
            { target: "scusa", base: "sorry / excuse me" },
            { target: "sì", base: "yes" },
            { target: "no", base: "no" },
            { target: "va bene", base: "okay / all right" },
          ],
          exercises: [
            { kind: "select", prompt: "Please!", options: ["Per favore!", "Prego!", "Scusa!", "Va bene!"], answer: 0, speak: "Per favore!" },
            { kind: "bank", prompt: "Translate: Yes, please", tiles: ["Sì,", "per", "favore", "grazie", "no"], answer: ["Sì,", "per", "favore"] },
            { kind: "type", prompt: "Type in Italian: You're welcome", accept: ["prego"] },
            { kind: "match", pairs: [["per favore", "please"], ["prego", "you're welcome"], ["scusa", "sorry"], ["va bene", "okay"]] },
            { kind: "listen", speak: "Scusa", options: ["Scusa", "Scusi", "Sì", "Prego"], answer: 0 },
            { kind: "select", prompt: "Someone says «Grazie!». You reply…", options: ["Prego!", "Scusa!", "No!", "Ciao!"], answer: 0 },
            { kind: "bank", prompt: "Translate: No, thank you", tiles: ["No,", "grazie", "prego", "sì", "bene"], answer: ["No,", "grazie"] },
          ],
        },
      ],
    },
    {
      id: "it-u2",
      title: "Al bar",
      blurb: "Order coffee, food and the bill like a local.",
      color: "peach",
      lessons: [
        {
          id: "it-u2-l1",
          title: "Un caffè, per favore",
          words: [
            { target: "un caffè", base: "a coffee" },
            { target: "un cornetto", base: "a croissant" },
            { target: "vorrei", base: "I would like" },
            { target: "un cappuccino", base: "a cappuccino" },
            { target: "un tè", base: "a tea" },
            { target: "latte", base: "milk" },
          ],
          exercises: [
            { kind: "select", prompt: "I would like a coffee", options: ["Vorrei un caffè", "Vorrei un cornetto", "Un tè, per favore", "Il conto, grazie"], answer: 0, speak: "Vorrei un caffè" },
            { kind: "bank", prompt: "Translate: A cappuccino, please", tiles: ["Un", "cappuccino,", "per", "favore", "caffè", "grazie"], answer: ["Un", "cappuccino,", "per", "favore"] },
            { kind: "type", prompt: "Type in Italian: a croissant", accept: ["un cornetto"] },
            { kind: "match", pairs: [["un caffè", "a coffee"], ["latte", "milk"], ["un tè", "a tea"], ["vorrei", "I would like"]] },
            { kind: "listen", speak: "Un cornetto, per favore", options: ["Un cornetto, per favore", "Un caffè, per favore", "Un tè, per favore", "Un cappuccino, grazie"], answer: 0 },
            { kind: "select", prompt: "«Vorrei» means…", options: ["I would like", "I see", "I am", "I have"], answer: 0 },
            { kind: "bank", prompt: "Translate: I would like a tea", tiles: ["Vorrei", "un", "tè", "caffè", "latte", "per"], answer: ["Vorrei", "un", "tè"] },
          ],
        },
        {
          id: "it-u2-l2",
          title: "Il cibo",
          words: [
            { target: "il pane", base: "bread" },
            { target: "l'acqua", base: "water" },
            { target: "il vino", base: "wine" },
            { target: "il formaggio", base: "cheese" },
            { target: "il gelato", base: "ice cream" },
            { target: "l'insalata", base: "salad" },
          ],
          exercises: [
            { kind: "select", prompt: "water", options: ["l'acqua", "il vino", "il pane", "il latte"], answer: 0 },
            { kind: "bank", prompt: "Translate: bread and cheese", tiles: ["pane", "e", "formaggio", "vino", "con", "il"], answer: ["pane", "e", "formaggio"] },
            { kind: "type", prompt: "Type in Italian: ice cream", accept: ["gelato", "il gelato"] },
            { kind: "match", pairs: [["il pane", "bread"], ["l'acqua", "water"], ["il vino", "wine"], ["il gelato", "ice cream"]] },
            { kind: "listen", speak: "il formaggio", options: ["il formaggio", "il prosciutto", "il gelato", "il pane"], answer: 0 },
            { kind: "select", prompt: "«L'insalata» is…", options: ["salad", "soup", "pasta", "fruit"], answer: 0 },
            { kind: "bank", prompt: "Translate: wine and water", tiles: ["vino", "e", "acqua", "pane", "o", "latte"], answer: ["vino", "e", "acqua"] },
          ],
        },
        {
          id: "it-u2-l3",
          title: "Il conto",
          words: [
            { target: "il conto", base: "the bill" },
            { target: "quanto costa", base: "how much does it cost" },
            { target: "mangiare", base: "to eat" },
            { target: "bere", base: "to drink" },
            { target: "un tavolo", base: "a table" },
            { target: "per due", base: "for two" },
          ],
          exercises: [
            { kind: "select", prompt: "The bill, please", options: ["Il conto, per favore", "Un tavolo, per favore", "Quanto costa?", "Vorrei mangiare"], answer: 0, speak: "Il conto, per favore" },
            { kind: "bank", prompt: "Translate: A table for two", tiles: ["Un", "tavolo", "per", "due", "tre", "conto"], answer: ["Un", "tavolo", "per", "due"] },
            { kind: "type", prompt: "Type in Italian: How much does it cost?", accept: ["quanto costa", "quanto costa?"] },
            { kind: "match", pairs: [["mangiare", "to eat"], ["bere", "to drink"], ["il conto", "the bill"], ["un tavolo", "a table"]] },
            { kind: "listen", speak: "Quanto costa?", options: ["Quanto costa?", "Quanto tempo?", "Quanti anni?", "Quando parte?"], answer: 0 },
            { kind: "select", prompt: "«Vorrei bere qualcosa» means…", options: ["I would like something to drink", "I would like something to eat", "I would like the bill", "I would like a table"], answer: 0 },
            { kind: "bank", prompt: "Translate: I would like to eat", tiles: ["Vorrei", "mangiare", "bere", "un", "il"], answer: ["Vorrei", "mangiare"] },
          ],
        },
      ],
    },
    {
      id: "it-u3",
      title: "In giro",
      blurb: "Find places, ask for directions and get help around town.",
      color: "sky",
      lessons: [
        {
          id: "it-u3-l1",
          title: "I luoghi",
          words: [
            { target: "la stazione", base: "the station" },
            { target: "l'aeroporto", base: "the airport" },
            { target: "l'albergo", base: "the hotel" },
            { target: "la strada", base: "the street" },
            { target: "il centro", base: "the centre" },
            { target: "il bagno", base: "the bathroom" },
          ],
          exercises: [
            { kind: "select", prompt: "the station", options: ["la stazione", "l'aeroporto", "l'albergo", "la strada"], answer: 0 },
            { kind: "bank", prompt: "Translate: the hotel", tiles: ["l'albergo", "la", "stazione", "centro", "via"], answer: ["l'albergo"] },
            { kind: "type", prompt: "Type in Italian: the airport", accept: ["l'aeroporto", "l aeroporto", "aeroporto"] },
            { kind: "match", pairs: [["la strada", "the street"], ["il centro", "the centre"], ["il bagno", "the bathroom"], ["la stazione", "the station"]] },
            { kind: "listen", speak: "l'aeroporto", options: ["l'aeroporto", "l'albergo", "l'autobus", "il treno"], answer: 0 },
            { kind: "select", prompt: "«Dov'è il bagno?» asks for…", options: ["the bathroom", "the station", "the hotel", "the bill"], answer: 0 },
            { kind: "bank", prompt: "Translate: the centre", tiles: ["il", "centro", "la", "strada", "di"], answer: ["il", "centro"] },
          ],
        },
        {
          id: "it-u3-l2",
          title: "Le direzioni",
          words: [
            { target: "dov'è", base: "where is" },
            { target: "a sinistra", base: "on the left" },
            { target: "a destra", base: "on the right" },
            { target: "sempre dritto", base: "straight ahead" },
            { target: "vicino", base: "near" },
            { target: "lontano", base: "far" },
          ],
          exercises: [
            { kind: "select", prompt: "on the left", options: ["a sinistra", "a destra", "sempre dritto", "vicino"], answer: 0 },
            { kind: "bank", prompt: "Translate: Where is the station?", tiles: ["Dov'è", "la", "stazione?", "il", "centro?", "a"], answer: ["Dov'è", "la", "stazione?"] },
            { kind: "type", prompt: "Type in Italian: straight ahead", accept: ["sempre dritto", "dritto"] },
            { kind: "match", pairs: [["a destra", "on the right"], ["sempre dritto", "straight ahead"], ["vicino", "near"], ["lontano", "far"]] },
            { kind: "listen", speak: "a destra", options: ["a destra", "a sinistra", "sempre dritto", "lontano"], answer: 0 },
            { kind: "select", prompt: "«È lontano?» means…", options: ["Is it far?", "Is it near?", "Is it open?", "Is it closed?"], answer: 0 },
            { kind: "bank", prompt: "Translate: near the centre", tiles: ["vicino", "al", "centro", "lontano", "da", "il"], answer: ["vicino", "al", "centro"] },
          ],
        },
        {
          id: "it-u3-l3",
          title: "Chiedere aiuto",
          words: [
            { target: "parla inglese", base: "do you speak English" },
            { target: "non capisco", base: "I don't understand" },
            { target: "aiuto", base: "help" },
            { target: "un biglietto", base: "a ticket" },
            { target: "scusi", base: "excuse me (formal)" },
            { target: "dov'è il bagno", base: "where is the bathroom" },
          ],
          exercises: [
            { kind: "select", prompt: "Do you speak English?", options: ["Parla inglese?", "Non capisco", "Scusi, il bagno?", "Un biglietto"], answer: 0, speak: "Parla inglese?" },
            { kind: "bank", prompt: "Translate: I don't understand", tiles: ["Non", "capisco", "parlo", "vedo", "il"], answer: ["Non", "capisco"] },
            { kind: "type", prompt: "Type in Italian: a ticket", accept: ["un biglietto", "biglietto"] },
            { kind: "match", pairs: [["aiuto", "help"], ["scusi", "excuse me"], ["un biglietto", "a ticket"], ["non capisco", "I don't understand"]] },
            { kind: "listen", speak: "Dov'è il bagno?", options: ["Dov'è il bagno?", "Dov'è la stazione?", "Parla inglese?", "Un biglietto, per favore"], answer: 0 },
            { kind: "select", prompt: "«Scusi!» is best translated as…", options: ["Excuse me!", "Sorry!", "Thank you!", "Help!"], answer: 0 },
            { kind: "bank", prompt: "Translate: A ticket, please", tiles: ["Un", "biglietto,", "per", "favore", "tavolo", "grazie"], answer: ["Un", "biglietto,", "per", "favore"] },
          ],
        },
      ],
    },
  ],
};

const spanish: Course = {
  id: "es",
  name: "Spanish",
  nativeName: "Español",
  flag: "🇪🇸",
  ttsLang: "es-ES",
  units: [
    {
      id: "es-u1",
      title: "Los básicos",
      blurb: "Greetings, introductions and the little phrases that open every conversation.",
      color: "sage",
      lessons: [
        {
          id: "es-u1-l1",
          title: "Saludos",
          words: [
            { target: "hola", base: "hello" },
            { target: "buenos días", base: "good morning" },
            { target: "buenas noches", base: "good evening / good night" },
            { target: "¿cómo estás?", base: "how are you" },
            { target: "bien, gracias", base: "well, thank you" },
            { target: "adiós", base: "goodbye" },
          ],
          exercises: [
            { kind: "select", prompt: "Hello!", options: ["¡Hola!", "¡Adiós!", "¡Gracias!", "¡Buenas noches!"], answer: 0, speak: "¡Hola!" },
            { kind: "bank", prompt: "Translate: Good morning, how are you?", tiles: ["Buenos", "días,", "¿cómo", "estás?", "qué", "bien"], answer: ["Buenos", "días,", "¿cómo", "estás?"] },
            { kind: "type", prompt: "Type in Spanish: goodbye", accept: ["adiós", "adios"] },
            { kind: "match", pairs: [["hola", "hello"], ["buenos días", "good morning"], ["adiós", "goodbye"], ["gracias", "thank you"]] },
            { kind: "listen", speak: "buenas noches", options: ["buenas noches", "buenos días", "buenas tardes", "adiós"], answer: 0 },
            { kind: "select", prompt: "«Bien, gracias» means…", options: ["Well, thank you", "See you later", "Yes, please", "Good night"], answer: 0 },
            { kind: "bank", prompt: "Translate: Thank you very much", tiles: ["Muchas", "gracias", "muy", "bien", "por"], answer: ["Muchas", "gracias"] },
          ],
        },
        {
          id: "es-u1-l2",
          title: "Presentarse",
          words: [
            { target: "me llamo", base: "my name is" },
            { target: "mucho gusto", base: "nice to meet you" },
            { target: "soy", base: "I am" },
            { target: "yo", base: "I" },
            { target: "¿de dónde eres?", base: "where are you from" },
            { target: "¿y tú?", base: "and you" },
          ],
          exercises: [
            { kind: "select", prompt: "Nice to meet you!", options: ["¡Mucho gusto!", "¡Por favor!", "¡Buenos días!", "¡Perdón!"], answer: 0, speak: "¡Mucho gusto!" },
            { kind: "bank", prompt: "Translate: My name is Ana", tiles: ["Me", "llamo", "Ana", "soy", "yo", "tú"], answer: ["Me", "llamo", "Ana"] },
            { kind: "type", prompt: "Type in Spanish: Where are you from?", accept: ["¿de dónde eres?", "de dónde eres", "de donde eres", "¿de donde eres?"] },
            { kind: "match", pairs: [["me llamo", "my name is"], ["mucho gusto", "nice to meet you"], ["soy", "I am"], ["yo", "I"]] },
            { kind: "select", prompt: "«Soy de Madrid» means…", options: ["I am from Madrid", "I live in Madrid today", "Madrid is beautiful", "See you in Madrid"], answer: 0 },
            { kind: "listen", speak: "Me llamo Luna", options: ["Me llamo Luna", "¿Cómo estás, Luna?", "Hola, Luna", "Soy Luna"], answer: 0 },
            { kind: "bank", prompt: "Translate: And you?", tiles: ["¿Y", "tú?", "yo?", "también", "él"], answer: ["¿Y", "tú?"] },
          ],
        },
        {
          id: "es-u1-l3",
          title: "Por favor",
          words: [
            { target: "por favor", base: "please" },
            { target: "de nada", base: "you're welcome" },
            { target: "perdón", base: "sorry / excuse me" },
            { target: "sí", base: "yes" },
            { target: "no", base: "no" },
            { target: "vale", base: "okay" },
          ],
          exercises: [
            { kind: "select", prompt: "Please!", options: ["¡Por favor!", "¡De nada!", "¡Perdón!", "¡Vale!"], answer: 0, speak: "¡Por favor!" },
            { kind: "bank", prompt: "Translate: Yes, please", tiles: ["Sí,", "por", "favor", "gracias", "no"], answer: ["Sí,", "por", "favor"] },
            { kind: "type", prompt: "Type in Spanish: You're welcome", accept: ["de nada"] },
            { kind: "match", pairs: [["por favor", "please"], ["de nada", "you're welcome"], ["perdón", "sorry"], ["vale", "okay"]] },
            { kind: "listen", speak: "perdón", options: ["perdón", "por favor", "sí", "de nada"], answer: 0 },
            { kind: "select", prompt: "Someone says «¡Gracias!». You reply…", options: ["¡De nada!", "¡Perdón!", "¡No!", "¡Hola!"], answer: 0 },
            { kind: "bank", prompt: "Translate: No, thank you", tiles: ["No,", "gracias", "por", "favor", "sí"], answer: ["No,", "gracias"] },
          ],
        },
      ],
    },
    {
      id: "es-u2",
      title: "En el café",
      blurb: "Order coffee, food and the bill like a local.",
      color: "peach",
      lessons: [
        {
          id: "es-u2-l1",
          title: "Un café, por favor",
          words: [
            { target: "un café", base: "a coffee" },
            { target: "un cruasán", base: "a croissant" },
            { target: "quisiera", base: "I would like" },
            { target: "un café con leche", base: "a coffee with milk" },
            { target: "un té", base: "a tea" },
            { target: "leche", base: "milk" },
          ],
          exercises: [
            { kind: "select", prompt: "I would like a coffee", options: ["Quisiera un café", "Quisiera un cruasán", "Un té, por favor", "La cuenta, gracias"], answer: 0, speak: "Quisiera un café" },
            { kind: "bank", prompt: "Translate: A coffee with milk, please", tiles: ["Un", "café", "con", "leche,", "por", "favor", "té"], answer: ["Un", "café", "con", "leche,", "por", "favor"] },
            { kind: "type", prompt: "Type in Spanish: a croissant", accept: ["un cruasán", "un cruasan"] },
            { kind: "match", pairs: [["un café", "a coffee"], ["leche", "milk"], ["un té", "a tea"], ["quisiera", "I would like"]] },
            { kind: "listen", speak: "Un té, por favor", options: ["Un té, por favor", "Un café, por favor", "Un cruasán, por favor", "Un café con leche"], answer: 0 },
            { kind: "select", prompt: "«Quisiera» means…", options: ["I would like", "I see", "I am", "I have"], answer: 0 },
            { kind: "bank", prompt: "Translate: I would like a tea", tiles: ["Quisiera", "un", "té", "café", "leche", "por"], answer: ["Quisiera", "un", "té"] },
          ],
        },
        {
          id: "es-u2-l2",
          title: "La comida",
          words: [
            { target: "el pan", base: "bread" },
            { target: "el agua", base: "water" },
            { target: "el vino", base: "wine" },
            { target: "el queso", base: "cheese" },
            { target: "el helado", base: "ice cream" },
            { target: "la ensalada", base: "salad" },
          ],
          exercises: [
            { kind: "select", prompt: "water", options: ["el agua", "el vino", "el pan", "la leche"], answer: 0 },
            { kind: "bank", prompt: "Translate: bread and cheese", tiles: ["pan", "y", "queso", "vino", "con", "el"], answer: ["pan", "y", "queso"] },
            { kind: "type", prompt: "Type in Spanish: ice cream", accept: ["helado", "el helado"] },
            { kind: "match", pairs: [["el pan", "bread"], ["el agua", "water"], ["el vino", "wine"], ["el helado", "ice cream"]] },
            { kind: "listen", speak: "el queso", options: ["el queso", "el beso", "el helado", "el pan"], answer: 0 },
            { kind: "select", prompt: "«La ensalada» is…", options: ["salad", "soup", "pasta", "fruit"], answer: 0 },
            { kind: "bank", prompt: "Translate: wine and water", tiles: ["vino", "y", "agua", "pan", "o", "leche"], answer: ["vino", "y", "agua"] },
          ],
        },
        {
          id: "es-u2-l3",
          title: "La cuenta",
          words: [
            { target: "la cuenta", base: "the bill" },
            { target: "¿cuánto cuesta?", base: "how much does it cost" },
            { target: "comer", base: "to eat" },
            { target: "beber", base: "to drink" },
            { target: "una mesa", base: "a table" },
            { target: "para dos", base: "for two" },
          ],
          exercises: [
            { kind: "select", prompt: "The bill, please", options: ["La cuenta, por favor", "Una mesa, por favor", "¿Cuánto cuesta?", "Quisiera comer"], answer: 0, speak: "La cuenta, por favor" },
            { kind: "bank", prompt: "Translate: A table for two", tiles: ["Una", "mesa", "para", "dos", "tres", "cuenta"], answer: ["Una", "mesa", "para", "dos"] },
            { kind: "type", prompt: "Type in Spanish: How much does it cost?", accept: ["¿cuánto cuesta?", "cuánto cuesta", "cuanto cuesta", "¿cuanto cuesta?"] },
            { kind: "match", pairs: [["comer", "to eat"], ["beber", "to drink"], ["la cuenta", "the bill"], ["una mesa", "a table"]] },
            { kind: "listen", speak: "¿Cuánto cuesta?", options: ["¿Cuánto cuesta?", "¿Cuánto tiempo?", "¿Cuántos años?", "¿Cuándo sale?"], answer: 0 },
            { kind: "select", prompt: "«Quisiera beber algo» means…", options: ["I would like something to drink", "I would like something to eat", "I would like the bill", "I would like a table"], answer: 0 },
            { kind: "bank", prompt: "Translate: I would like to eat", tiles: ["Quisiera", "comer", "beber", "una", "la"], answer: ["Quisiera", "comer"] },
          ],
        },
      ],
    },
    {
      id: "es-u3",
      title: "De viaje",
      blurb: "Find places, ask for directions and get help around town.",
      color: "sky",
      lessons: [
        {
          id: "es-u3-l1",
          title: "Los lugares",
          words: [
            { target: "la estación", base: "the station" },
            { target: "el aeropuerto", base: "the airport" },
            { target: "el hotel", base: "the hotel" },
            { target: "la calle", base: "the street" },
            { target: "el centro", base: "the centre" },
            { target: "el baño", base: "the bathroom" },
          ],
          exercises: [
            { kind: "select", prompt: "the station", options: ["la estación", "el aeropuerto", "el hotel", "la calle"], answer: 0 },
            { kind: "bank", prompt: "Translate: the hotel", tiles: ["el", "hotel", "la", "estación", "centro", "calle"], answer: ["el", "hotel"] },
            { kind: "type", prompt: "Type in Spanish: the airport", accept: ["el aeropuerto", "aeropuerto"] },
            { kind: "match", pairs: [["la calle", "the street"], ["el centro", "the centre"], ["el baño", "the bathroom"], ["la estación", "the station"]] },
            { kind: "listen", speak: "el aeropuerto", options: ["el aeropuerto", "el hotel", "el autobús", "el tren"], answer: 0 },
            { kind: "select", prompt: "«¿Dónde está el baño?» asks for…", options: ["the bathroom", "the station", "the hotel", "the bill"], answer: 0 },
            { kind: "bank", prompt: "Translate: the centre", tiles: ["el", "centro", "la", "calle", "de"], answer: ["el", "centro"] },
          ],
        },
        {
          id: "es-u3-l2",
          title: "Las direcciones",
          words: [
            { target: "¿dónde está?", base: "where is" },
            { target: "a la izquierda", base: "on the left" },
            { target: "a la derecha", base: "on the right" },
            { target: "todo recto", base: "straight ahead" },
            { target: "cerca", base: "near" },
            { target: "lejos", base: "far" },
          ],
          exercises: [
            { kind: "select", prompt: "on the left", options: ["a la izquierda", "a la derecha", "todo recto", "cerca"], answer: 0 },
            { kind: "bank", prompt: "Translate: Where is the station?", tiles: ["¿Dónde", "está", "la", "estación?", "el", "centro?"], answer: ["¿Dónde", "está", "la", "estación?"] },
            { kind: "type", prompt: "Type in Spanish: straight ahead", accept: ["todo recto", "recto"] },
            { kind: "match", pairs: [["a la derecha", "on the right"], ["todo recto", "straight ahead"], ["cerca", "near"], ["lejos", "far"]] },
            { kind: "listen", speak: "a la derecha", options: ["a la derecha", "a la izquierda", "todo recto", "lejos"], answer: 0 },
            { kind: "select", prompt: "«¿Está lejos?» means…", options: ["Is it far?", "Is it near?", "Is it open?", "Is it closed?"], answer: 0 },
            { kind: "bank", prompt: "Translate: near the centre", tiles: ["cerca", "del", "centro", "lejos", "de", "el"], answer: ["cerca", "del", "centro"] },
          ],
        },
        {
          id: "es-u3-l3",
          title: "Pedir ayuda",
          words: [
            { target: "¿habla inglés?", base: "do you speak English" },
            { target: "no entiendo", base: "I don't understand" },
            { target: "ayuda", base: "help" },
            { target: "un billete", base: "a ticket" },
            { target: "disculpe", base: "excuse me (formal)" },
            { target: "¿dónde está el baño?", base: "where is the bathroom" },
          ],
          exercises: [
            { kind: "select", prompt: "Do you speak English?", options: ["¿Habla inglés?", "No entiendo", "Disculpe, ¿el baño?", "Un billete"], answer: 0, speak: "¿Habla inglés?" },
            { kind: "bank", prompt: "Translate: I don't understand", tiles: ["No", "entiendo", "hablo", "veo", "el"], answer: ["No", "entiendo"] },
            { kind: "type", prompt: "Type in Spanish: a ticket", accept: ["un billete", "billete"] },
            { kind: "match", pairs: [["ayuda", "help"], ["disculpe", "excuse me"], ["un billete", "a ticket"], ["no entiendo", "I don't understand"]] },
            { kind: "listen", speak: "¿Dónde está el baño?", options: ["¿Dónde está el baño?", "¿Dónde está la estación?", "¿Habla inglés?", "Un billete, por favor"], answer: 0 },
            { kind: "select", prompt: "«¡Disculpe!» is best translated as…", options: ["Excuse me!", "Sorry!", "Thank you!", "Help!"], answer: 0 },
            { kind: "bank", prompt: "Translate: A ticket, please", tiles: ["Un", "billete,", "por", "favor", "mesa", "gracias"], answer: ["Un", "billete,", "por", "favor"] },
          ],
        },
      ],
    },
  ],
};

const french: Course = {
  id: "fr",
  name: "French",
  nativeName: "Français",
  flag: "🇫🇷",
  ttsLang: "fr-FR",
  units: [
    {
      id: "fr-u1",
      title: "Les bases",
      blurb: "Greetings, introductions and the little phrases that open every conversation.",
      color: "sage",
      lessons: [
        {
          id: "fr-u1-l1",
          title: "Salutations",
          words: [
            { target: "bonjour", base: "hello / good morning" },
            { target: "salut", base: "hi / bye" },
            { target: "bonsoir", base: "good evening" },
            { target: "comment ça va ?", base: "how are you" },
            { target: "bien, merci", base: "well, thank you" },
            { target: "au revoir", base: "goodbye" },
          ],
          exercises: [
            { kind: "select", prompt: "Hello!", options: ["Bonjour !", "Bonsoir !", "Au revoir !", "Merci !"], answer: 0, speak: "Bonjour !" },
            { kind: "bank", prompt: "Translate: Good evening, how are you?", tiles: ["Bonsoir,", "comment", "ça", "va ?", "tu", "bien"], answer: ["Bonsoir,", "comment", "ça", "va ?"] },
            { kind: "type", prompt: "Type in French: goodbye", accept: ["au revoir"] },
            { kind: "match", pairs: [["bonjour", "hello"], ["bonsoir", "good evening"], ["merci", "thank you"], ["au revoir", "goodbye"]] },
            { kind: "listen", speak: "Bonsoir", options: ["Bonsoir", "Bonjour", "Bonne nuit", "Au revoir"], answer: 0 },
            { kind: "select", prompt: "« Bien, merci ! » means…", options: ["Well, thank you!", "See you soon!", "Yes, please!", "Good evening!"], answer: 0 },
            { kind: "bank", prompt: "Translate: Thank you very much", tiles: ["Merci", "beaucoup", "très", "bien", "de"], answer: ["Merci", "beaucoup"] },
          ],
        },
        {
          id: "fr-u1-l2",
          title: "Se présenter",
          words: [
            { target: "je m'appelle", base: "my name is" },
            { target: "enchanté", base: "nice to meet you" },
            { target: "je suis", base: "I am" },
            { target: "je", base: "I" },
            { target: "tu viens d'où ?", base: "where are you from" },
            { target: "et toi ?", base: "and you" },
          ],
          exercises: [
            { kind: "select", prompt: "Nice to meet you!", options: ["Enchanté !", "S'il vous plaît !", "Comment ça va ?", "Pardon !"], answer: 0, speak: "Enchanté !" },
            { kind: "bank", prompt: "Translate: My name is Anna", tiles: ["Je", "m'appelle", "Anna", "suis", "tu", "et"], answer: ["Je", "m'appelle", "Anna"] },
            { kind: "type", prompt: "Type in French: I am", accept: ["je suis"] },
            { kind: "match", pairs: [["je m'appelle", "my name is"], ["enchanté", "nice to meet you"], ["je suis", "I am"], ["je", "I"]] },
            { kind: "select", prompt: "« Je suis de Paris » means…", options: ["I am from Paris", "I live in Paris today", "Paris is beautiful", "See you in Paris"], answer: 0 },
            { kind: "listen", speak: "Je m'appelle Luna", options: ["Je m'appelle Luna", "Comment ça va, Luna ?", "Salut, Luna", "Je suis Luna"], answer: 0 },
            { kind: "bank", prompt: "Translate: And you?", tiles: ["Et", "toi ?", "moi ?", "aussi", "vous"], answer: ["Et", "toi ?"] },
          ],
        },
        {
          id: "fr-u1-l3",
          title: "S'il vous plaît",
          words: [
            { target: "s'il vous plaît", base: "please" },
            { target: "de rien", base: "you're welcome" },
            { target: "pardon", base: "sorry / excuse me" },
            { target: "oui", base: "yes" },
            { target: "non", base: "no" },
            { target: "d'accord", base: "okay" },
          ],
          exercises: [
            { kind: "select", prompt: "Please!", options: ["S'il vous plaît !", "De rien !", "Pardon !", "D'accord !"], answer: 0, speak: "S'il vous plaît !" },
            { kind: "bank", prompt: "Translate: Yes, please", tiles: ["Oui,", "s'il", "vous", "plaît", "merci", "non"], answer: ["Oui,", "s'il", "vous", "plaît"] },
            { kind: "type", prompt: "Type in French: You're welcome", accept: ["de rien"] },
            { kind: "match", pairs: [["s'il vous plaît", "please"], ["de rien", "you're welcome"], ["pardon", "sorry"], ["d'accord", "okay"]] },
            { kind: "listen", speak: "Pardon", options: ["Pardon", "S'il vous plaît", "Oui", "De rien"], answer: 0 },
            { kind: "select", prompt: "Someone says « Merci ! ». You reply…", options: ["De rien !", "Pardon !", "Non !", "Salut !"], answer: 0 },
            { kind: "bank", prompt: "Translate: No, thank you", tiles: ["Non,", "merci", "oui", "s'il", "vous"], answer: ["Non,", "merci"] },
          ],
        },
      ],
    },
    {
      id: "fr-u2",
      title: "Au café",
      blurb: "Order coffee, food and the bill like a local.",
      color: "peach",
      lessons: [
        {
          id: "fr-u2-l1",
          title: "Un café, s'il vous plaît",
          words: [
            { target: "un café", base: "a coffee" },
            { target: "un croissant", base: "a croissant" },
            { target: "je voudrais", base: "I would like" },
            { target: "un café crème", base: "a coffee with milk" },
            { target: "un thé", base: "a tea" },
            { target: "lait", base: "milk" },
          ],
          exercises: [
            { kind: "select", prompt: "I would like a coffee", options: ["Je voudrais un café", "Je voudrais un croissant", "Un thé, s'il vous plaît", "L'addition, merci"], answer: 0, speak: "Je voudrais un café" },
            { kind: "bank", prompt: "Translate: A coffee, please", tiles: ["Un", "café,", "s'il", "vous", "plaît", "thé", "merci"], answer: ["Un", "café,", "s'il", "vous", "plaît"] },
            { kind: "type", prompt: "Type in French: a croissant", accept: ["un croissant"] },
            { kind: "match", pairs: [["un café", "a coffee"], ["lait", "milk"], ["un thé", "a tea"], ["je voudrais", "I would like"]] },
            { kind: "listen", speak: "Un croissant, s'il vous plaît", options: ["Un croissant, s'il vous plaît", "Un café, s'il vous plaît", "Un thé, s'il vous plaît", "Un café crème, merci"], answer: 0 },
            { kind: "select", prompt: "« Je voudrais » means…", options: ["I would like", "I see", "I am", "I have"], answer: 0 },
            { kind: "bank", prompt: "Translate: I would like a tea", tiles: ["Je", "voudrais", "un", "thé", "café", "lait"], answer: ["Je", "voudrais", "un", "thé"] },
          ],
        },
        {
          id: "fr-u2-l2",
          title: "La nourriture",
          words: [
            { target: "le pain", base: "bread" },
            { target: "l'eau", base: "water" },
            { target: "le vin", base: "wine" },
            { target: "le fromage", base: "cheese" },
            { target: "la glace", base: "ice cream" },
            { target: "la salade", base: "salad" },
          ],
          exercises: [
            { kind: "select", prompt: "water", options: ["l'eau", "le vin", "le pain", "le lait"], answer: 0 },
            { kind: "bank", prompt: "Translate: bread and cheese", tiles: ["pain", "et", "fromage", "vin", "avec", "le"], answer: ["pain", "et", "fromage"] },
            { kind: "type", prompt: "Type in French: ice cream", accept: ["la glace", "glace"] },
            { kind: "match", pairs: [["le pain", "bread"], ["l'eau", "water"], ["le vin", "wine"], ["la glace", "ice cream"]] },
            { kind: "listen", speak: "le fromage", options: ["le fromage", "le partage", "la glace", "le pain"], answer: 0 },
            { kind: "select", prompt: "« La salade » is…", options: ["salad", "soup", "pasta", "fruit"], answer: 0 },
            { kind: "bank", prompt: "Translate: wine and water", tiles: ["vin", "et", "eau", "pain", "ou", "lait"], answer: ["vin", "et", "eau"] },
          ],
        },
        {
          id: "fr-u2-l3",
          title: "L'addition",
          words: [
            { target: "l'addition", base: "the bill" },
            { target: "c'est combien ?", base: "how much does it cost" },
            { target: "manger", base: "to eat" },
            { target: "boire", base: "to drink" },
            { target: "une table", base: "a table" },
            { target: "pour deux", base: "for two" },
          ],
          exercises: [
            { kind: "select", prompt: "The bill, please", options: ["L'addition, s'il vous plaît", "Une table, s'il vous plaît", "C'est combien ?", "Je voudrais manger"], answer: 0, speak: "L'addition, s'il vous plaît" },
            { kind: "bank", prompt: "Translate: A table for two", tiles: ["Une", "table", "pour", "deux", "trois", "addition"], answer: ["Une", "table", "pour", "deux"] },
            { kind: "type", prompt: "Type in French: How much does it cost?", accept: ["c'est combien", "c'est combien ?", "c est combien"] },
            { kind: "match", pairs: [["manger", "to eat"], ["boire", "to drink"], ["l'addition", "the bill"], ["une table", "a table"]] },
            { kind: "listen", speak: "C'est combien ?", options: ["C'est combien ?", "C'est comment ?", "C'est combien de temps ?", "C'est où ?"], answer: 0 },
            { kind: "select", prompt: "« Je voudrais boire quelque chose » means…", options: ["I would like something to drink", "I would like something to eat", "I would like the bill", "I would like a table"], answer: 0 },
            { kind: "bank", prompt: "Translate: I would like to eat", tiles: ["Je", "voudrais", "manger", "boire", "une", "la"], answer: ["Je", "voudrais", "manger"] },
          ],
        },
      ],
    },
    {
      id: "fr-u3",
      title: "En ville",
      blurb: "Find places, ask for directions and get help around town.",
      color: "sky",
      lessons: [
        {
          id: "fr-u3-l1",
          title: "Les lieux",
          words: [
            { target: "la gare", base: "the station" },
            { target: "l'aéroport", base: "the airport" },
            { target: "l'hôtel", base: "the hotel" },
            { target: "la rue", base: "the street" },
            { target: "le centre", base: "the centre" },
            { target: "les toilettes", base: "the bathroom" },
          ],
          exercises: [
            { kind: "select", prompt: "the station", options: ["la gare", "l'aéroport", "l'hôtel", "la rue"], answer: 0 },
            { kind: "bank", prompt: "Translate: the hotel", tiles: ["l'hôtel", "la", "gare", "centre", "rue"], answer: ["l'hôtel"] },
            { kind: "type", prompt: "Type in French: the airport", accept: ["l'aéroport", "l'aeroport", "l aeroport", "aéroport", "aeroport"] },
            { kind: "match", pairs: [["la rue", "the street"], ["le centre", "the centre"], ["les toilettes", "the bathroom"], ["la gare", "the station"]] },
            { kind: "listen", speak: "l'aéroport", options: ["l'aéroport", "l'hôtel", "le bus", "le train"], answer: 0 },
            { kind: "select", prompt: "« Où sont les toilettes ? » asks for…", options: ["the bathroom", "the station", "the hotel", "the bill"], answer: 0 },
            { kind: "bank", prompt: "Translate: the centre", tiles: ["le", "centre", "la", "rue", "de"], answer: ["le", "centre"] },
          ],
        },
        {
          id: "fr-u3-l2",
          title: "Les directions",
          words: [
            { target: "où est", base: "where is" },
            { target: "à gauche", base: "on the left" },
            { target: "à droite", base: "on the right" },
            { target: "tout droit", base: "straight ahead" },
            { target: "près", base: "near" },
            { target: "loin", base: "far" },
          ],
          exercises: [
            { kind: "select", prompt: "on the left", options: ["à gauche", "à droite", "tout droit", "près"], answer: 0 },
            { kind: "bank", prompt: "Translate: Where is the station?", tiles: ["Où", "est", "la", "gare ?", "le", "centre ?"], answer: ["Où", "est", "la", "gare ?"] },
            { kind: "type", prompt: "Type in French: straight ahead", accept: ["tout droit", "droit"] },
            { kind: "match", pairs: [["à droite", "on the right"], ["tout droit", "straight ahead"], ["près", "near"], ["loin", "far"]] },
            { kind: "listen", speak: "à droite", options: ["à droite", "à gauche", "tout droit", "loin"], answer: 0 },
            { kind: "select", prompt: "« C'est loin ? » means…", options: ["Is it far?", "Is it near?", "Is it open?", "Is it closed?"], answer: 0 },
            { kind: "bank", prompt: "Translate: near the centre", tiles: ["près", "du", "centre", "loin", "de", "le"], answer: ["près", "du", "centre"] },
          ],
        },
        {
          id: "fr-u3-l3",
          title: "Demander de l'aide",
          words: [
            { target: "parlez-vous anglais ?", base: "do you speak English" },
            { target: "je ne comprends pas", base: "I don't understand" },
            { target: "au secours", base: "help" },
            { target: "un billet", base: "a ticket" },
            { target: "excusez-moi", base: "excuse me" },
            { target: "où sont les toilettes ?", base: "where is the bathroom" },
          ],
          exercises: [
            { kind: "select", prompt: "Do you speak English?", options: ["Parlez-vous anglais ?", "Je ne comprends pas", "Excusez-moi", "Un billet"], answer: 0, speak: "Parlez-vous anglais ?" },
            { kind: "bank", prompt: "Translate: I don't understand", tiles: ["Je", "ne", "comprends", "pas", "parle", "le"], answer: ["Je", "ne", "comprends", "pas"] },
            { kind: "type", prompt: "Type in French: a ticket", accept: ["un billet", "billet"] },
            { kind: "match", pairs: [["au secours", "help"], ["excusez-moi", "excuse me"], ["un billet", "a ticket"], ["je ne comprends pas", "I don't understand"]] },
            { kind: "listen", speak: "Où sont les toilettes ?", options: ["Où sont les toilettes ?", "Où est la gare ?", "Parlez-vous anglais ?", "Un billet, s'il vous plaît"], answer: 0 },
            { kind: "select", prompt: "« Excusez-moi ! » is best translated as…", options: ["Excuse me!", "Sorry!", "Thank you!", "Help!"], answer: 0 },
            { kind: "bank", prompt: "Translate: A ticket, please", tiles: ["Un", "billet,", "s'il", "vous", "plaît", "table", "merci"], answer: ["Un", "billet,", "s'il", "vous", "plaît"] },
          ],
        },
      ],
    },
  ],
};

export const courses: Course[] = [italian, spanish, french];

export function getCourse(id: string | null | undefined): Course {
  return courses.find((course) => course.id === id) ?? courses[0];
}

export function allLessons(course: Course): Lesson[] {
  return course.units.flatMap((unit) => unit.lessons);
}

export function findLesson(course: Course, lessonId: string): Lesson | undefined {
  return allLessons(course).find((lesson) => lesson.id === lessonId);
}
