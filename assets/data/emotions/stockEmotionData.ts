const stockEmotionData = {
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
      { name: "Playful", color: "#f1b542", parent: "Happy", level: 2 },
      { name: "Content", color: "#f1b542", parent: "Happy", level: 2 },
      { name: "Interested", color: "#f1b542", parent: "Happy", level: 2 },
      { name: "Proud", color: "#f1b542", parent: "Happy", level: 2 },
      { name: "Accepted", color: "#f1b542", parent: "Happy", level: 2 },
      { name: "Powerful", color: "#f1b542", parent: "Happy", level: 2 },
      { name: "Peaceful", color: "#f1b542", parent: "Happy", level: 2 },
      { name: "Trusting", color: "#f1b542", parent: "Happy", level: 2 },
      { name: "Optimistic", color: "#f1b542", parent: "Happy", level: 2 },
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
      { name: "Playful", color: "#f1b542", parent: "Happy", level: 2 },
      { name: "Content", color: "#f1b542", parent: "Happy", level: 2 },
      { name: "Interested", color: "#f1b542", parent: "Happy", level: 2 },
      { name: "Proud", color: "#f1b542", parent: "Happy", level: 2 },
      { name: "Accepted", color: "#f1b542", parent: "Happy", level: 2 },
      { name: "Powerful", color: "#f1b542", parent: "Happy", level: 2 },
      { name: "Peaceful", color: "#f1b542", parent: "Happy", level: 2 },
      { name: "Trusting", color: "#f1b542", parent: "Happy", level: 2 },
      { name: "Optimistic", color: "#f1b542", parent: "Happy", level: 2 },
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
// let stockEmotionData: string;

// switch (i18n.language) {
//   case "lv":
//     stockEmotionData = stockEmotionDataLv;
//     break;
//   case "en":
//     stockEmotionData = stockEmotionDataEn;
//     break;
//   }

const sumn = {
  createAndPopulateEmotions: `
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Repelled', 2, 'Disgusted', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Awful', 2, 'Disgusted', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Disappointed', 2, 'Disgusted', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Disapproving', 2, 'Disgusted', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Critical', 2, 'Angry', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Distant', 2, 'Angry', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Frustrated', 2, 'Angry', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Aggressive', 2, 'Angry', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Mad', 2, 'Angry', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Bitter', 2, 'Angry', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Humiliated', 2, 'Angry', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Let down', 2, 'Angry', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Threatened', 2, 'Fearful', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Rejected', 2, 'Fearful', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Weak', 2, 'Fearful', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Insecure', 2, 'Fearful', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Anxious', 2, 'Fearful', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Scared', 2, 'Fearful', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Startled', 2, 'Surprised', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Confused', 2, 'Surprised', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Amazed', 2, 'Surprised', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Excited', 2, 'Surprised', 'white');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Aroused', 3, 'Playful', '#99e28e');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Cheeky', 3, 'Playful', '#91da85');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Free', 3, 'Content', '#99e28e');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Joyful', 3, 'Content', '#91da85');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Curious', 3, 'Interested', '#99e28e');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Inquisitive', 3, 'Interested', '#91da85');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Successful', 3, 'Proud', '#99e28e');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Confident', 3, 'Proud', '#91da85');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Respected', 3, 'Accepted', '#99e28e');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Valued', 3, 'Accepted', '#91da85');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Courageous', 3, 'Powerful', '#99e28e');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Creative', 3, 'Powerful', '#91da85');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Loving', 3, 'Peaceful', '#99e28e');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Thankful', 3, 'Peaceful', '#91da85');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Sensitive', 3, 'Trusting', '#99e28e');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Intimate', 3, 'Trusting', '#91da85');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Hopeful', 3, 'Optimistic', '#99e28e');
  INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Inspired', 3, 'Optimistic', '#91da85');
  `,
};

export { stockEmotionData };
