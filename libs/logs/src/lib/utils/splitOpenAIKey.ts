function splitOpenAIKey(key: string) {
  const firstFour = key.slice(0, 4);
  const lastFour = key.slice(-4);
  return `${firstFour}...${lastFour}`;
}

export {
  splitOpenAIKey
};

