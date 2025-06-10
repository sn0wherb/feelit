import i18n from "@/assets/i18n";

const stockEmotionDataEn = {
  1: [
    { name: "Happy", color: "#eec068", level: 1 },
    { name: "Sad", color: "#5b78ba", level: 1 },
    { name: "Disgusted", color: "#b27189", level: 1 },
    { name: "Angry", color: "#d06363", level: 1 },
    { name: "Fearful", color: "#7c846f", level: 1 },
    // { name: "Bad", color: "#9fa4b0", level: 1 },
    { name: "Surprised", color: "#d09363", level: 1 },
  ],
  2: {
    Happy: [
      { name: "Playful", color: "#f1b542", level: 2 },
      { name: "Content", color: "#f1b542", level: 2 },
      { name: "Interested", color: "#f1b542", level: 2 },
      { name: "Proud", color: "#f1b542", level: 2 },
      { name: "Accepted", color: "#f1b542", level: 2 },
      { name: "Powerful", color: "#f1b542", level: 2 },
      { name: "Peaceful", color: "#f1b542", level: 2 },
      { name: "Trusting", color: "#f1b542", level: 2 },
      { name: "Optimistic", color: "#f1b542", level: 2 },
    ],
    Sad: [
      { name: "Lonely", color: "#5b78ba", level: 2 },
      { name: "Vulnerable", color: "#5b78ba", level: 2 },
      { name: "In despair", color: "#5b78ba", level: 2 },
      { name: "Guilty", color: "#5b78ba", level: 2 },
      { name: "Depressed", color: "#5b78ba", level: 2 },
      { name: "Hurt", color: "#5b78ba", level: 2 },
    ],
    Disgusted: [
      { name: "Repelled", color: "#b27189", level: 2 },
      { name: "Awful", color: "#b27189", level: 2 },
      { name: "Disappointed", color: "#b27189", level: 2 },
      { name: "Disapproving", color: "#b27189", level: 2 },
    ],
    Angry: [
      { name: "Critical", color: "#d06363", level: 2 },
      { name: "Distant", color: "#d06363", level: 2 },
      { name: "Frustrated", color: "#d06363", level: 2 },
      { name: "Aggressive", color: "#d06363", level: 2 },
      { name: "Mad", color: "#d06363", level: 2 },
      { name: "Bitter", color: "#d06363", level: 2 },
      { name: "Humiliated", color: "#d06363", level: 2 },
      { name: "Let down", color: "#d06363", level: 2 },
    ],
    Fearful: [
      { name: "Threatened", color: "#7c846f", level: 2 },
      { name: "Rejected", color: "#7c846f", level: 2 },
      { name: "Weak", color: "#7c846f", level: 2 },
      { name: "Insecure", color: "#7c846f", level: 2 },
      { name: "Anxious", color: "#7c846f", level: 2 },
      { name: "Scared", color: "#7c846f", level: 2 },
    ],
    // Bad: [
    //   { name: "Bored", color: "#9fa4b0", level: 2 },
    //   { name: "Busy", color: "#9fa4b0", level: 2 },
    //   { name: "Stressed", color: "#9fa4b0", level: 2 },
    //   { name: "Tired", color: "#9fa4b0", level: 2 },
    // ],
    Surprised: [
      { name: "Startled", color: "#d09363", level: 2 },
      { name: "Confused", color: "#d09363", level: 2 },
      { name: "Amazed", color: "#d09363", level: 2 },
      { name: "Excited", color: "#d09363", level: 2 },
    ],
  },
  3: {
    Playful: [
      { name: "Aroused", color: "#f1b542", level: 3 },
      { name: "Cheeky", color: "#f1b542", level: 3 },
    ],
    Content: [
      { name: "Free", color: "#f1b542", level: 3 },
      { name: "Joyful", color: "#f1b542", level: 3 },
    ],
    Interested: [
      { name: "Curious", color: "#f1b542", level: 3 },
      { name: "Inquisitive", color: "#f1b542", level: 3 },
    ],
    Proud: [
      { name: "Successful", color: "#f1b542", level: 3 },
      { name: "Confident", color: "#f1b542", level: 3 },
    ],
    Accepted: [
      { name: "Respected", color: "#f1b542", level: 3 },
      { name: "Valued", color: "#f1b542", level: 3 },
    ],
    Powerful: [
      { name: "Courageous", color: "#f1b542", level: 3 },
      { name: "Creative", color: "#f1b542", level: 3 },
    ],
    Peaceful: [
      { name: "Loving", color: "#f1b542", level: 3 },
      { name: "Thankful", color: "#f1b542", level: 3 },
    ],
    Trusting: [
      { name: "Sensitive", color: "#f1b542", level: 3 },
      { name: "Intimate", color: "#f1b542", level: 3 },
    ],
    Optimistic: [
      { name: "Hopeful", color: "#f1b542", level: 3 },
      { name: "Inspired", color: "#f1b542", level: 3 },
    ],
    Lonely: [
      { name: "Isolated", color: "#5b78ba", level: 3 },
      { name: "Abandoned", color: "#5b78ba", level: 3 },
    ],
    Vulnerable: [
      { name: "Victimised", color: "#5b78ba", level: 3 },
      { name: "Fragile", color: "#5b78ba", level: 3 },
    ],
    "In despair": [
      { name: "Grieving", color: "#5b78ba", level: 3 },
      { name: "Powerless", color: "#5b78ba", level: 3 },
    ],
    Guilty: [
      { name: "Ashamed", color: "#5b78ba", level: 3 },
      { name: "Remorseful", color: "#5b78ba", level: 3 },
    ],
    Depressed: [
      { name: "Empty", color: "#5b78ba", level: 3 },
      { name: "Inferior", color: "#5b78ba", level: 3 },
    ],
    Hurt: [
      { name: "Disappointed", color: "#5b78ba", level: 3 },
      { name: "Forgotten", color: "#5b78ba", level: 3 },
    ],
    Repelled: [
      { name: "Hesitant", color: "#b27189", level: 3 },
      { name: "Horrified", color: "#b27189", level: 3 },
    ],
    Awful: [
      { name: "Detestable", color: "#b27189", level: 3 },
      { name: "Nauseated", color: "#b27189", level: 3 },
    ],
    Disappointed: [
      { name: "Revolted", color: "#b27189", level: 3 },
      { name: "Appalled", color: "#b27189", level: 3 },
    ],
    Disapproving: [
      { name: "Embarrassed", color: "#b27189", level: 3 },
      { name: "Judgemental", color: "#b27189", level: 3 },
    ],
    Critical: [
      { name: "Dismissive", color: "#d06363", level: 3 },
      { name: "Sceptical", color: "#d06363", level: 3 },
    ],
    Distant: [
      { name: "Numb", color: "#d06363", level: 3 },
      { name: "Withdrawn", color: "#d06363", level: 3 },
    ],
    Frustrated: [
      { name: "Annoyed", color: "#d06363", level: 3 },
      { name: "Infuriated", color: "#d06363", level: 3 },
    ],
    Aggressive: [
      { name: "Provoked", color: "#d06363", level: 3 },
      { name: "Hostile", color: "#d06363", level: 3 },
    ],
    Mad: [
      { name: "Jealous", color: "#d06363", level: 3 },
      { name: "Furious", color: "#d06363", level: 3 },
    ],
    Bitter: [
      { name: "Violated", color: "#d06363", level: 3 },
      { name: "Indignant", color: "#d06363", level: 3 },
    ],
    Humiliated: [
      { name: "Ridiculed", color: "#d06363", level: 3 },
      { name: "Disrespectful", color: "#d06363", level: 3 },
    ],
    "Let down": [
      { name: "Betrayed", color: "#d06363", level: 3 },
      { name: "Resentful", color: "#d06363", level: 3 },
    ],
    Threatened: [
      { name: "Exposed", color: "#7c846f", level: 3 },
      { name: "Nervous", color: "#7c846f", level: 3 },
    ],
    Rejected: [
      { name: "Persecuted", color: "#7c846f", level: 3 },
      { name: "Excluded", color: "#7c846f", level: 3 },
    ],
    Weak: [
      { name: "Insignificant", color: "#7c846f", level: 3 },
      { name: "Worthless", color: "#7c846f", level: 3 },
    ],
    Insecure: [
      { name: "Inferior", color: "#7c846f", level: 3 },
      { name: "Inadequate", color: "#7c846f", level: 3 },
    ],
    Anxious: [
      { name: "Worried", color: "#7c846f", level: 3 },
      { name: "Overwhelmed", color: "#7c846f", level: 3 },
    ],
    Scared: [
      { name: "Frightened", color: "#7c846f", level: 3 },
      { name: "Helpless", color: "#7c846f", level: 3 },
    ],
    Startled: [
      { name: "Shocked", color: "#d09363", level: 3 },
      { name: "Dismayed", color: "#d09363", level: 3 },
    ],
    Confused: [
      { name: "Disillusioned", color: "#d09363", level: 3 },
      { name: "Perplexed", color: "#d09363", level: 3 },
    ],
    Amazed: [
      { name: "Astonished", color: "#d09363", level: 3 },
      { name: "Awe", color: "#d09363", level: 3 },
    ],
    Excited: [
      { name: "Eager", color: "#d09363", level: 3 },
      { name: "Energetic", color: "#d09363", level: 3 },
    ],
  },
};

const stockEmotionDataLv = {
  1: [
    { name: "Priecīgi", color: "#eec068", level: 1 },
    { name: "Bēdīgi", color: "#5b78ba", level: 1 },
    { name: "Riebīgi", color: "#b27189", level: 1 },
    { name: "Dusmīgi", color: "#d06363", level: 1 },
    { name: "Bailīgi", color: "#7c846f", level: 1 },
    { name: "Pārsteigti", color: "#d09363", level: 1 },
  ],
  2: {
    Priecīgi: [
      { name: "Rotaļīgi", color: "#f1b542", parent: "Priecīgi", level: 2 },
      { name: "Apmierināti", color: "#f1b542", parent: "Priecīgi", level: 2 },
      { name: "Ieinteresēti", color: "#f1b542", parent: "Priecīgi", level: 2 },
      { name: "Lepni", color: "#f1b542", parent: "Priecīgi", level: 2 },
      { name: "Pieņemti", color: "#f1b542", parent: "Priecīgi", level: 2 },
      { name: "Spēcīgi", color: "#f1b542", parent: "Priecīgi", level: 2 },
      { name: "Mierīgi", color: "#f1b542", parent: "Priecīgi", level: 2 },
      { name: "Uzticīgi", color: "#f1b542", parent: "Priecīgi", level: 2 },
      { name: "Optimistiski", color: "#f1b542", parent: "Priecīgi", level: 2 },
    ],
    Bēdīgi: [
      { name: "Vientuļi", color: "#5b78ba", parent: "Bēdīgi", level: 2 },
      { name: "Trausli", color: "#5b78ba", parent: "Bēdīgi", level: 2 },
      { name: "Izmisuši", color: "#5b78ba", parent: "Bēdīgi", level: 2 },
      { name: "Vainīgi", color: "#5b78ba", parent: "Bēdīgi", level: 2 },
      { name: "Nomākti", color: "#5b78ba", parent: "Bēdīgi", level: 2 },
      { name: "Aizskarti", color: "#5b78ba", parent: "Bēdīgi", level: 2 },
    ],
    Riebīgi: [
      { name: "Atgrūsti", color: "#b27189", parent: "Riebīgi", level: 2 },
      { name: "Briesmīgi", color: "#b27189", parent: "Riebīgi", level: 2 },
      { name: "Vīlušies", color: "#b27189", parent: "Riebīgi", level: 2 },
      { name: "Nosodoši", color: "#b27189", parent: "Riebīgi", level: 2 },
    ],
    Dusmīgi: [
      { name: "Kritiski", color: "#d06363", parent: "Dusmīgi", level: 2 },
      { name: "Attālināti", color: "#d06363", parent: "Dusmīgi", level: 2 },
      { name: "Neapmierināti", color: "#d06363", parent: "Dusmīgi", level: 2 },
      { name: "Agresīvi", color: "#d06363", parent: "Dusmīgi", level: 2 },
      { name: "Nikni", color: "#d06363", parent: "Dusmīgi", level: 2 },
      { name: "Rūgti", color: "#d06363", parent: "Dusmīgi", level: 2 },
      { name: "Pazemoti", color: "#d06363", parent: "Dusmīgi", level: 2 },
      { name: "Pievilti", color: "#d06363", parent: "Dusmīgi", level: 2 },
    ],
    Bailīgi: [
      { name: "Apdraudēti", color: "#7c846f", parent: "Bailīgi", level: 2 },
      { name: "Noraidīti", color: "#7c846f", parent: "Bailīgi", level: 2 },
      { name: "Vāji", color: "#7c846f", parent: "Bailīgi", level: 2 },
      { name: "Nedroši", color: "#7c846f", parent: "Bailīgi", level: 2 },
      { name: "Noraizējušies", color: "#7c846f", parent: "Bailīgi", level: 2 },
      { name: "Nobijušies", color: "#7c846f", parent: "Bailīgi", level: 2 },
    ],
    Pārsteigti: [
      { name: "Šokēti", color: "#d09363", parent: "Pārsteigti", level: 2 },
      { name: "Apjukuši", color: "#d09363", parent: "Pārsteigti", level: 2 },
      { name: "Apbrīnoti", color: "#d09363", parent: "Pārsteigti", level: 2 },
      { name: "Sajūsmināti", color: "#d09363", parent: "Pārsteigti", level: 2 },
    ],
  },
  3: {
    Rotaļīgi: [
      { name: "Uzbudināti", color: "#f1b542", parent: "Rotaļīgi", level: 3 },
      { name: "Palaidnīgi", color: "#f1b542", parent: "Rotaļīgi", level: 3 },
    ],
    Apmierināti: [
      { name: "Brīvi", color: "#f1b542", parent: "Apmierināti", level: 3 },
      { name: "Priecīgi", color: "#f1b542", parent: "Apmierināti", level: 3 },
    ],
    Ieinteresēti: [
      { name: "Ziņkārīgi", color: "#f1b542", parent: "Ieinteresēti", level: 3 },
      { name: "Izpētoši", color: "#f1b542", parent: "Ieinteresēti", level: 3 },
    ],
    Lepni: [
      { name: "Veiksmīgi", color: "#f1b542", parent: "Lepni", level: 3 },
      { name: "Pārliecināti", color: "#f1b542", parent: "Lepni", level: 3 },
    ],
    Pieņemti: [
      { name: "Cienīti", color: "#f1b542", parent: "Pieņemti", level: 3 },
      { name: "Novērtēti", color: "#f1b542", parent: "Pieņemti", level: 3 },
    ],
    Spēcīgi: [
      { name: "Drosmīgi", color: "#f1b542", parent: "Spēcīgi", level: 3 },
      { name: "Radoši", color: "#f1b542", parent: "Spēcīgi", level: 3 },
    ],
    Mierīgi: [
      { name: "Mīloši", color: "#f1b542", parent: "Mierīgi", level: 3 },
      { name: "Pateicīgi", color: "#f1b542", parent: "Mierīgi", level: 3 },
    ],
    Uzticīgi: [
      { name: "Jutīgi", color: "#f1b542", parent: "Uzticīgi", level: 3 },
      { name: "Tuvākie", color: "#f1b542", parent: "Uzticīgi", level: 3 },
    ],
    Optimistiski: [
      { name: "Cerīgi", color: "#f1b542", parent: "Optimistiski", level: 3 },
      {
        name: "Iedvesmoti",
        color: "#f1b542",
        parent: "Optimistiski",
        level: 3,
      },
    ],
    Vientuļi: [
      { name: "Izolēti", color: "#5b78ba", parent: "Vientuļi", level: 3 },
      { name: "Pamesti", color: "#5b78ba", parent: "Vientuļi", level: 3 },
    ],
    Trausli: [
      { name: "Upurēti", color: "#5b78ba", parent: "Trausli", level: 3 },
      { name: "Juteklīgi", color: "#5b78ba", parent: "Trausli", level: 3 },
    ],
    Izmisuši: [
      { name: "Sērojoši", color: "#5b78ba", parent: "Izmisuši", level: 3 },
      { name: "Bezcerīgi", color: "#5b78ba", parent: "Izmisuši", level: 3 },
    ],
    Vainīgi: [
      { name: "Kaunīgi", color: "#5b78ba", parent: "Vainīgi", level: 3 },
      { name: "Nožēlas", color: "#5b78ba", parent: "Vainīgi", level: 3 },
    ],
    Nomākti: [
      { name: "Tukši", color: "#5b78ba", parent: "Nomākti", level: 3 },
      { name: "Nepilnvērtīgi", color: "#5b78ba", parent: "Nomākti", level: 3 },
    ],
    Aizskarti: [
      { name: "Aizmirsti", color: "#5b78ba", parent: "Aizskarti", level: 3 },
      { name: "Aizvainoti", color: "#5b78ba", parent: "Aizskarti", level: 3 },
    ],
    Atgrūsti: [
      { name: "Svārstīgi", color: "#b27189", parent: "Atgrūsti", level: 3 },
      { name: "Šausmināti", color: "#b27189", parent: "Atgrūsti", level: 3 },
    ],
    Briesmīgi: [
      { name: "Pretīgi", color: "#b27189", parent: "Briesmīgi", level: 3 },
      { name: "Nelabi", color: "#b27189", parent: "Briesmīgi", level: 3 },
    ],
    Vīlušies: [
      { name: "Sašutuši", color: "#b27189", parent: "Vīlušies", level: 3 },
      { name: "Šokēti", color: "#b27189", parent: "Vīlušies", level: 3 },
    ],
    Nosodoši: [
      { name: "Apkaunoti", color: "#b27189", parent: "Nosodoši", level: 3 },
      { name: "Nicinoši", color: "#b27189", parent: "Nosodoši", level: 3 },
    ],
    Kritiski: [
      { name: "Noraidoši", color: "#d06363", parent: "Kritiski", level: 3 },
      { name: "Skeptiski", color: "#d06363", parent: "Kritiski", level: 3 },
    ],
    Attālināti: [
      { name: "Nejūtīgi", color: "#d06363", parent: "Attālināti", level: 3 },
      { name: "Atsvešināti", color: "#d06363", parent: "Attālināti", level: 3 },
    ],
    Neapmierināti: [
      {
        name: "Aizkaitināti",
        color: "#d06363",
        parent: "Neapmierināti",
        level: 3,
      },
      { name: "Dusmīgi", color: "#d06363", parent: "Neapmierināti", level: 3 },
    ],
    Agresīvi: [
      { name: "Provocēti", color: "#d06363", parent: "Agresīvi", level: 3 },
      { name: "Naidīgi", color: "#d06363", parent: "Agresīvi", level: 3 },
    ],
    Nikni: [
      { name: "Greizsirdīgi", color: "#d06363", parent: "Nikni", level: 3 },
      { name: "Traki", color: "#d06363", parent: "Nikni", level: 3 },
    ],
    Rūgti: [
      { name: "Aizvainoti", color: "#d06363", parent: "Rūgti", level: 3 },
      { name: "Sarūgtināti", color: "#d06363", parent: "Rūgti", level: 3 },
    ],
    Pazemoti: [
      { name: "Izsmieti", color: "#d06363", parent: "Pazemoti", level: 3 },
      { name: "Necienīti", color: "#d06363", parent: "Pazemoti", level: 3 },
    ],
    Pievilti: [
      { name: "Nodoti", color: "#d06363", parent: "Pievilti", level: 3 },
      { name: "Aizmirsti", color: "#d06363", parent: "Pievilti", level: 3 },
    ],
    Apdraudēti: [
      { name: "Atmaskoti", color: "#7c846f", parent: "Apdraudēti", level: 3 },
      { name: "Nervozi", color: "#7c846f", parent: "Apdraudēti", level: 3 },
    ],
    Noraidīti: [
      { name: "Vajāti", color: "#7c846f", parent: "Noraidīti", level: 3 },
      { name: "Izslēgti", color: "#7c846f", parent: "Noraidīti", level: 3 },
    ],
    Vāji: [
      { name: "Nenozīmīgi", color: "#7c846f", parent: "Vāji", level: 3 },
      { name: "Bezvērtīgi", color: "#7c846f", parent: "Vāji", level: 3 },
    ],
    Nedroši: [
      { name: "Nepietiekami", color: "#7c846f", parent: "Nedroši", level: 3 },
      { name: "Apjukuši", color: "#7c846f", parent: "Nedroši", level: 3 },
    ],
    Noraizējušies: [
      { name: "Nobažīti", color: "#7c846f", parent: "Noraizējušies", level: 3 },
      {
        name: "Nemierīgi",
        color: "#7c846f",
        parent: "Noraizējušies",
        level: 3,
      },
    ],
    Nobijušies: [
      { name: "Izbijuši", color: "#7c846f", parent: "Nobijušies", level: 3 },
      {
        name: "Bezpalīdzīgi",
        color: "#7c846f",
        parent: "Nobijušies",
        level: 3,
      },
    ],
    Šokēti: [
      { name: "Satraukti", color: "#d09363", parent: "Šokēti", level: 3 },
      { name: "Izbrīnīti", color: "#d09363", parent: "Šokēti", level: 3 },
    ],
    Apjukuši: [
      { name: "Sutīgi", color: "#d09363", parent: "Apjukuši", level: 3 },
      { name: "Neizpratnē", color: "#d09363", parent: "Apjukuši", level: 3 },
    ],
    Apbrīnoti: [
      { name: "Sajūsmā", color: "#d09363", parent: "Apbrīnoti", level: 3 },
      { name: "Pārsteigti", color: "#d09363", parent: "Apbrīnoti", level: 3 },
    ],
    Sajūsmināti: [
      {
        name: "Ieinteresēti",
        color: "#d09363",
        parent: "Sajūsmināti",
        level: 3,
      },
      { name: "Enerģiski", color: "#d09363", parent: "Sajūsmināti", level: 3 },
    ],
  },
};

let stockEmotionData;
console.log(i18n.language);
switch (i18n.language) {
  case "lv":
    stockEmotionData = stockEmotionDataLv;
    break;
  case "en":
    stockEmotionData = stockEmotionDataEn;
    break;
}

export { stockEmotionData };
