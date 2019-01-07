const {http} = require('../app');
const {io} = require('../app');
// console.log(io);

http.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));