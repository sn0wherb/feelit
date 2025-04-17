const stockEmotionData = {
  1: {
    0: { name: "Happy", color: "#eec068", level: 1 },
    1: { name: "Sad", color: "#5b78ba", level: 1 },
    2: { name: "Disgusted", color: "#b27189", level: 1 },
    3: { name: "Angry", color: "#d06363", level: 1 },
    4: { name: "Fearful", color: "#7c846f", level: 1 },
    // 5: { name: "Bad", color: "#9fa4b0", level: 1 },
    6: { name: "Surprised", color: "#d09363", level: 1 },
  },
  2: {
    Happy: {
      0: { name: "Playful", color: "#f1b542", parent: "Happy", level: 2 },
      1: { name: "Content", color: "#f1b542", parent: "Happy", level: 2 },
      2: { name: "Interested", color: "#f1b542", parent: "Happy", level: 2 },
      3: { name: "Proud", color: "#f1b542", parent: "Happy", level: 2 },
      4: { name: "Accepted", color: "#f1b542", parent: "Happy", level: 2 },
      5: { name: "Powerful", color: "#f1b542", parent: "Happy", level: 2 },
      6: { name: "Peaceful", color: "#f1b542", parent: "Happy", level: 2 },
      7: { name: "Trusting", color: "#f1b542", parent: "Happy", level: 2 },
      8: { name: "Optimistic", color: "#f1b542", parent: "Happy", level: 2 },
    },
    Sad: {
      0: { name: "Lonely", color: "#5b78ba", level: 2 },
      1: { name: "Vulnerable", color: "#5b78ba", level: 2 },
      2: { name: "In despair", color: "#5b78ba, level: 2" },
      3: { name: "Guilty", color: "#5b78ba", level: 2 },
      4: { name: "Depressed", color: "#5b78ba", level: 2 },
      5: { name: "Hurt", color: "#5b78ba", level: 2 },
    },
    Disgusted: {
      0: { name: "Repelled", color: "#b27189", level: 2 },
      1: { name: "Awful", color: "#b27189", level: 2 },
      2: { name: "Disappointed", color: "#b27189", level: 2 },
      3: { name: "Disapproving", color: "#b27189", level: 2 },
    },
    Angry: {
      0: { name: "Critical", color: "#d06363", level: 2 },
      1: { name: "Distant", color: "#d06363", level: 2 },
      2: { name: "Frustrated", color: "#d06363", level: 2 },
      3: { name: "Aggressive", color: "#d06363", level: 2 },
      4: { name: "Mad", color: "#d06363", level: 2 },
      5: { name: "Bitter", color: "#d06363", level: 2 },
      6: { name: "Humiliated", color: "#d06363", level: 2 },
      7: { name: "Let down", color: "#d06363, level: 2" },
    },
    Fearful: {
      0: { name: "Threatened", color: "#7c846f", level: 2 },
      1: { name: "Rejected", color: "#7c846f", level: 2 },
      2: { name: "Weak", color: "#7c846f", level: 2 },
      3: { name: "Insecure", color: "#7c846f", level: 2 },
      4: { name: "Anxious", color: "#7c846f", level: 2 },
      5: { name: "Scared", color: "#7c846f", level: 2 },
    },
    // Bad: {
    //   0: { name: "Bored", color: "#9fa4b0", level: 2 },
    //   1: { name: "Busy", color: "#9fa4b0", level: 2 },
    //   2: { name: "Stressed", color: "#9fa4b0", level: 2 },
    //   3: { name: "Tired", color: "#9fa4b0", level: 2 },
    // },
    Surprised: {
      0: { name: "Startled", color: "#d09363", level: 2 },
      1: { name: "Confused", color: "#d09363", level: 2 },
      2: { name: "Amazed", color: "#d09363", level: 2 },
      3: { name: "Excited", color: "#d09363", level: 2 },
    },
  },
  3: {
    // Grandhildren of happy
    Playful: {
      0: { name: "Aroused", color: "#f1b542", level: 3 },
      1: { name: "Cheeky", color: "#f1b542", level: 3 },
    },
    Content: {
      0: { name: "Free", color: "#f1b542", level: 3 },
      1: { name: "Joyful", color: "#f1b542", level: 3 },
    },
    Interested: {
      0: { name: "Curious", color: "#f1b542", level: 3 },
      1: { name: "Inquisitive", color: "#f1b542", level: 3 },
    },
    Proud: {
      0: { name: "Successful", color: "#f1b542", level: 3 },
      1: { name: "Confident", color: "#f1b542", level: 3 },
    },
    Accepted: {
      0: { name: "Respected", color: "#f1b542", level: 3 },
      1: { name: "Valued", color: "#f1b542", level: 3 },
    },
    Powerful: {
      0: { name: "Courageous", color: "#f1b542", level: 3 },
      1: { name: "Creative", color: "#f1b542", level: 3 },
    },
    Peaceful: {
      0: { name: "Loving", color: "#f1b542", level: 3 },
      1: { name: "Thankful", color: "#f1b542", level: 3 },
    },
    Trusting: {
      0: { name: "Sensitive", color: "#f1b542", level: 3 },
      1: { name: "Intimate", color: "#f1b542", level: 3 },
    },
    Optimistic: {
      0: { name: "Hopeful", color: "#f1b542", level: 3 },
      1: { name: "Inspired", color: "#f1b542", level: 3 },
    },

    // Grandchildren of sad
    Lonely: {
      0: { name: "Isolated", color: "#5b78ba", level: 3 },
      1: { name: "Abandoned", color: "#5b78ba", level: 3 },
    },
    Vulnerable: {
      0: { name: "Victimised", color: "#5b78ba", level: 3 },
      1: { name: "Fragile", color: "#5b78ba", level: 3 },
    },
    "In despair": {
      0: { name: "Grieving", color: "#5b78ba", level: 3 },
      1: { name: "Powerless", color: "#5b78ba", level: 3 },
    },
    Guilty: {
      0: { name: "Ashamed", color: "#5b78ba", level: 3 },
      1: { name: "Remorseful", color: "#5b78ba", level: 3 },
    },
    Depressed: {
      0: { name: "Empty", color: "#5b78ba", level: 3 },
      1: { name: "Inferior", color: "#5b78ba", level: 3 },
    },
    Hurt: {
      0: { name: "Disappointed", color: "#5b78ba", level: 3 },
      1: { name: "Forgotten", color: "#5b78ba", level: 3 },
    },

    // Grandchildren of disgusted
    Repelled: {
      0: { name: "Hesitant", color: "#b27189", level: 3 },
      1: { name: "Horrified", color: "#b27189", level: 3 },
    },
    Awful: {
      0: { name: "Detestable", color: "#b27189", level: 3 },
      1: { name: "Nauseated", color: "#b27189", level: 3 },
    },
    Disappointed: {
      0: { name: "Revolted", color: "#b27189", level: 3 },
      1: { name: "Appalled", color: "#b27189", level: 3 },
    },
    Disapproving: {
      0: { name: "Embarrassed", color: "#b27189", level: 3 },
      1: { name: "Judgemental", color: "#b27189", level: 3 },
    },

    // Grandchildren of angry
    Critical: {
      0: { name: "Dismissive", color: "#d06363", level: 3 },
      1: { name: "Sceptical", color: "#d06363", level: 3 },
    },
    Distant: {
      0: { name: "Numb", color: "#d06363", level: 3 },
      1: { name: "Withdrawn", color: "#d06363", level: 3 },
    },
    Frustrated: {
      0: { name: "Annoyed", color: "#d06363", level: 3 },
      1: { name: "Infuriated", color: "#d06363", level: 3 },
    },
    Aggressive: {
      0: { name: "Provoked", color: "#d06363", level: 3 },
      1: { name: "Hostile", color: "#d06363", level: 3 },
    },
    Mad: {
      0: { name: "Jealous", color: "#d06363", level: 3 },
      1: { name: "Furious", color: "#d06363", level: 3 },
    },
    Bitter: {
      0: { name: "Violated", color: "#d06363", level: 3 },
      1: { name: "Indignant", color: "#d06363", level: 3 },
    },
    Humiliated: {
      0: { name: "Ridiculed", color: "#d06363", level: 3 },
      1: { name: "Disrespectful", color: "#d06363", level: 3 },
    },
    "Let down": {
      0: { name: "Betrayed", color: "#d06363", level: 3 },
      1: { name: "Resentful", color: "#d06363", level: 3 },
    },
    // Grandchildren of fearful
    Threatened: {
      0: { name: "Exposed", color: "#7c846f", level: 3 },
      1: { name: "Nervous", color: "#7c846f", level: 3 },
    },
    Rejected: {
      0: { name: "Persecuted", color: "#7c846f", level: 3 },
      1: { name: "Excluded", color: "#7c846f", level: 3 },
    },
    Weak: {
      0: { name: "Insignificant", color: "#7c846f", level: 3 },
      1: { name: "Worthless", color: "#7c846f", level: 3 },
    },
    Insecure: {
      0: { name: "Inferior", color: "#7c846f", level: 3 },
      1: { name: "Inadequate", color: "#7c846f", level: 3 },
    },
    Anxious: {
      0: { name: "Worried", color: "#7c846f", level: 3 },
      1: { name: "Overwhelmed", color: "#7c846f", level: 3 },
    },
    Scared: {
      0: { name: "Frightened", color: "#7c846f", level: 3 },
      1: { name: "Helpless", color: "#7c846f", level: 3 },
    },

    // Grandchildren of surprised
    Startled: {
      0: { name: "Shocked", color: "#d09363", level: 3 },
      1: { name: "Dismayed", color: "#d09363", level: 3 },
    },
    Confused: {
      0: { name: "Disillusioned", color: "#d09363", level: 3 },
      1: { name: "Perplexed", color: "#d09363", level: 3 },
    },
    Amazed: {
      0: { name: "Astonished", color: "#d09363", level: 3 },
      1: { name: "Awe", color: "#d09363", level: 3 },
    },
    Excited: {
      0: { name: "Eager", color: "#d09363", level: 3 },
      1: { name: "Energetic", color: "#d09363", level: 3 },
    },
  },
};

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
