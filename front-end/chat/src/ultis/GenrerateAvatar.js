const generateAdventureAvataaars = (seed) =>
  `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${seed}`;

const generateAvataaars = (seed) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

const generateBottts = (seed) =>
  `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;

export const generateAvatar = () => {
  const data = [];
  const name =['Charlie','Bella'];

  for (let i = 0; i < 2; i++) {
    const res = generateAdventureAvataaars(name[i]);
    data.push(res);
  }
  for (let i = 0; i < 2; i++) {
    const res = generateAvataaars(name[i]);
    data.push(res);
  }
  for (let i = 0; i < 2; i++) {
    const res = generateBottts(name[i]);
    data.push(res);
  }
  return data;
};