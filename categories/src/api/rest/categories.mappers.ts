export const convertCategoryTreeToJson = (tree) => {
  return tree.map(({ name, children }) => ({
    name,
    children: convertCategoryTreeToJson(children),
  }));
};

export const convertCategoryTreeToString = (tree, level = 0) => {
  let result = "";
  tree.forEach((node) => {
    result += `${"-----".repeat(level)}${node.name}\n`;
    if (node.children.length > 0) {
      result += convertCategoryTreeToString(node.children, level + 1);
    }
  });
  return result;
};
