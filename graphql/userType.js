const graphql = require('graphql');

const {GraphQLObjectType, GraphQLString} = graphql;

const userType = new GraphQLObjectType({
   'name': 'user',
   fields: ()=>({

})
});