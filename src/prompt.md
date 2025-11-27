- Actual: Hiện tại đang tạo mock data cho 1 trường hợp hợp cụ thể
```
function getMockValue(type, fieldName = '') {
  const unwrapped = type.ofType || type;
  if (unwrapped.name === 'String') {
    if (fieldName.toLowerCase().includes('name')) return `"${faker.person.fullName()}"`;
    if (fieldName.toLowerCase().includes('email')) return `"${faker.internet.email()}"`;
    if (fieldName.toLowerCase().includes('code')) return `"${faker.string.alphanumeric(5).toUpperCase()}"`;
    if (fieldName.toLowerCase().includes('origin') || fieldName.toLowerCase().includes('destination')) return `"${faker.location.city()}"`;
    if (fieldName.toLowerCase().includes('busnumber')) return `"${faker.vehicle.vrm()}"`;
    return `"${faker.lorem.words(2)}"`;
  }
  if (unwrapped.name === 'ID') return `"${faker.string.uuid()}"`;
  if (unwrapped.name === 'Int') {
    if (fieldName.toLowerCase().includes('count') || fieldName.toLowerCase().includes('limit')) return faker.number.int({ min: 1, max: 10 });
    if (fieldName.toLowerCase().includes('offset')) return faker.number.int({ min: 0, max: 50 });
    if (fieldName.toLowerCase().includes('seatnumber')) return faker.number.int({ min: 1, max: 40 });
    return faker.number.int({ min: 1, max: 100 });
  }
  if (unwrapped.name === 'Boolean') return faker.datatype.boolean();
  if (unwrapped.name === 'DateTime') return `"${faker.date.recent().toISOString()}"`;
  return `"${faker.lorem.word()}"`; // Default
}
```

- Expect: Tạo mock data cho trường hợp bất kỳ với việc upload bất kỳ file *.graphql nào
  