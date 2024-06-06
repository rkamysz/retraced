/**
 * Converts a Buffer object to a string representation of a number.
 *
 * This function attempts to parse the Buffer object to extract a numerical value and convert it to a string.
 *
 * @param {Buffer} o - The Buffer object containing the data to be converted.
 * @returns {string} The string representation of the number, or "NaN" if an error occurs.
 */
export const convertToStringNumber = (o: Buffer) => {
  return JSON.parse(o.toString()).count.toString();
};
