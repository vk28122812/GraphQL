const gql = require("graphql-tag");
const {ApolloServer} = require("apollo-server");

const typeDefs = gql`
    enum ShoeType{
        JORDAN,
        NIKE,
        ADIDAS
    }
    type User{
        email: String!
        avatar: String
        shoes: [Shoe]!
    }

    interface Shoe{
        brand:ShoeType!
        size: Int!
        user: User!
    }
    type Sneaker implements Shoe{
        brand:ShoeType!
        size: Int!
        sport: String!
        user: User!
    }
    type Boot implements Shoe{
        brand: ShoeType!
        size:Int!
        hasGrip:Boolean!
        user: User!
    }
    input ShoeInput{
        brand: ShoeType
        size: Int
    }

    input NewShoeInput{
        brand:ShoeType
        size: Int!
    }
    type Query{
        me: User!
        shoes(input: ShoeInput): [Shoe]!
    }


    type Mutation{
        newShoe(input : NewShoeInput):Shoe!
    }
`
const user = {
    email:'vishal@mail.com',
    avatar: 'vishal.jpg',
    id: 1,
    shoes: []
}

const shoes =  [
    {brand: "NIKE", size: 12, sport:"cricket",user:1},
    {brand: "JORDAN", size: 10, hasGrip:true, user:1}
];
const resolvers = {
    Query: {
        me(){
            return user;
        },
        
        shoes(_, {input}){
            return shoes ;
        }
    },

    Mutation:{
        newShoe(_, {input}){
            return input;
        }
    },

    Shoe: {
        __resolveType(shoe){
            if(shoe.sport)return 'Sneaker';
            return 'Boot';
        }
    },
    Sneaker:{
        user(shoe){
            return user;
        }
    },
    Boot:{
        user(shoe){
            return user;
        }
    },

    User: {
        shoes(){
            return shoes;
        }
    }


}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({url}) => {
    console.log(`Server is running at ${url}`)
})



    