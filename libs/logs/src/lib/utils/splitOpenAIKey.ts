function splitOpenAIKey(key) {
  const firstFour = key.slice(0, 7);
  const lastFour = key.slice(-4);
  return `${firstFour}...${lastFour}`;
}

export {
  splitOpenAIKey
};

