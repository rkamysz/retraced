/**
 * Converts a category tree to a JSON format.
 *
 * This function takes a category tree and recursively converts it into a JSON-friendly format
 * where each node has a `name` and a `children` property.
 *
 * @param {Array} tree - The category tree to be converted.
 * @param {string} tree[].name - The name of the category.
 * @param {Array} tree[].children - The child categories.
 * @returns {Array} The converted category tree in JSON format.
 */
export const convertCategoryTreeToJson = (tree) => {
  return tree.map(({ name, children }) => ({
    name,
    children: convertCategoryTreeToJson(children),
  }));
};

/**
 * Converts a category tree to a string representation with indentation.
 *
 * This function takes a category tree and recursively converts it into a string representation
 * with indentation to indicate the level of each category.
 *
 * @param {Array} tree - The category tree to be converted.
 * @param {number} [level=0] - The current level of the tree, used for indentation.
 * @returns {string} The string representation of the category tree.
 */
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
