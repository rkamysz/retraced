export const convertToStringNumber = (o: Buffer) => {
  try {
    return JSON.parse(o.toString()).count.toString();
  } catch (error) {
    /// log error!
    return "NaN";
  }
};
