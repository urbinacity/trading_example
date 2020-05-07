const fieldsToString = (object, separator = ' AND ') => {
  return Object.entries(object)
  .filter((field) => field[1])
  .map(([operator, value]) => `${operator} "${value}"`)
  .join(separator);
};
const mapNestedToJson = (records, nested = 'user') => {
  return records.map((field) => {
    return {
      ...field,
      [nested]: JSON.parse(field[nested])
    };
  });
}
export {
  fieldsToString,
  mapNestedToJson
}