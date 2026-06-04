const { faker } = require("@faker-js/faker");

/**
 * Generate a single item based on field definitions
 * @param {object} fields - Field definitions
 * @param {object} params - URL parameters
 * @param {number} index - Current index (for increment)
 * @returns {object} Generated item
 */
function generateSingleItem(fields, params = {}, index = 1) {
  const item = {};

  Object.entries(fields).forEach(([key, type]) => {
    item[key] = generateFieldValue(type, params, index);
  });

  return item;
}

/**
 * Generate a value based on field type
 * @param {string} type - Field type
 * @param {object} params - URL parameters
 * @param {number} index - Current index
 * @returns {any} Generated value
 */
function generateFieldValue(type, params = {}, index = 1) {
  // Handle string type
  if (typeof type === "string") {
    const typeLower = type.toLowerCase();

    switch (typeLower) {
      // ID types
      case "increment":
      case "id":
        return index;
      case "param":
        return params.id || index;
      case "uuid":
        return faker.string.uuid();
      case "objectid":
        return faker.database.mongodbObjectId();

      // Person
      case "name":
      case "fullname":
        return faker.person.fullName();
      case "firstname":
        return faker.person.firstName();
      case "lastname":
        return faker.person.lastName();
      case "email":
        return faker.internet.email();
      case "phone":
        return faker.phone.number();
      case "avatar":
        return faker.image.avatar();
      case "gender":
        return faker.person.gender();
      case "jobtitle":
      case "title":
        return faker.person.jobTitle();
      case "bio":
        return faker.person.bio();

      // Address
      case "address":
        return faker.location.streetAddress();
      case "city":
        return faker.location.city();
      case "state":
        return faker.location.state();
      case "country":
        return faker.location.country();
      case "zipcode":
      case "zip":
        return faker.location.zipCode();
      case "latitude":
        return faker.location.latitude();
      case "longitude":
        return faker.location.longitude();

      // Company
      case "company":
        return faker.company.name();
      case "companysuffix":
        return faker.company.name();

      // Text
      case "lorem":
        return faker.lorem.sentence();
      case "sentence":
        return faker.lorem.sentence();
      case "paragraph":
        return faker.lorem.paragraph();
      case "paragraphs":
        return faker.lorem.paragraphs(3);
      case "word":
        return faker.lorem.word();
      case "words":
        return faker.lorem.words(5);
      case "slug":
        return faker.lorem.slug();

      // Internet
      case "url":
        return faker.internet.url();
      case "image":
        return faker.image.url();
      case "ip":
        return faker.internet.ip();
      case "ipv6":
        return faker.internet.ipv6();
      case "useragent":
        return faker.internet.userAgent();
      case "domainname":
      case "domain":
        return faker.internet.domainName();
      case "username":
        return faker.internet.username();
      case "password":
        return faker.internet.password();

      // Numbers
      case "number":
        return faker.number.int({ min: 1, max: 1000 });
      case "float":
        return parseFloat(faker.number.float({ min: 0, max: 100, precision: 0.01 }).toFixed(2));
      case "price":
        return parseFloat(faker.commerce.price({ min: 1, max: 999, dec: 2 }));
      case "rating":
        return parseFloat((faker.number.float({ min: 1, max: 5, precision: 0.1 })).toFixed(1));

      // Boolean
      case "boolean":
      case "bool":
        return faker.datatype.boolean();

      // Date
      case "date":
        return faker.date.recent().toISOString().split("T")[0];
      case "pastdate":
        return faker.date.past().toISOString().split("T")[0];
      case "futuredate":
        return faker.date.future().toISOString().split("T")[0];
      case "datetime":
        return faker.date.recent().toISOString();
      case "timestamp":
        return Date.now();
      case "year":
        return faker.date.past({ years: 30 }).getFullYear();

      // Color
      case "color":
        return faker.color.rgb({ format: "hex" });
      case "hex":
        return faker.color.rgb({ format: "hex" });

      // Misc
      case "product":
        return faker.commerce.productName();
      case "productname":
        return faker.commerce.productName();
      case "price":
        return parseFloat(faker.commerce.price({ min: 1, max: 999, dec: 2 }));
      default:
        return faker.lorem.word();
    }
  }

  // Handle object type with options
  if (typeof type === "object" && type !== null) {
    return generateFromOptions(type, params, index);
  }

  return faker.lorem.word();
}

/**
 * Generate value from options object
 */
function generateFromOptions(options, params, index) {
  const { type: fieldType, min, max, values, format, ...rest } = options;

  if (values && Array.isArray(values)) {
    return faker.helpers.arrayElement(values);
  }

  return generateFieldValue(fieldType || "word", params, index);
}

/**
 * Generate multiple items
 */
function generateMultipleItems(fields, count, params = {}) {
  const items = [];
  for (let i = 1; i <= count; i++) {
    items.push(generateSingleItem(fields, params, i));
  }
  return items;
}

module.exports = {
  generateSingleItem,
  generateFieldValue,
  generateMultipleItems,
};
