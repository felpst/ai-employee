function extractPathFromDist(filePath: string): string {
    const distIndex = filePath.indexOf('/dist/');
      return filePath.substring(distIndex);

}

export {
    extractPathFromDist
};
