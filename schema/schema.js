const graphql = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {GraphQLObjectType, 
	   GraphQLInt,
	   GraphQLString,
	   GraphQLSchema, 
	   GraphQLID, 
	   GraphQLList, 
	   GraphQLNonNull } = graphql;

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: {type: GraphQLID},
        fullname: {type: GraphQLString},
        username: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        country: {type: GraphQLString},
        about: {type: GraphQLString},
        gender: {type: GraphQLString},
        yob: {type: GraphQLString},      //Year of Birth;
		events: {
			type: new GraphQLList(EventType),
			resolve(parent, args){
			//	return _.filter(events, {userId: parent.id});
				return Event.find({creator: parent.id});
			}
		}
		
		
	})
});

const AuthType = new GraphQLObjectType({
	name: 'Auth',
	fields: () => ({
		userId: {type: GraphQLString},
		username: {type: GraphQLString},
		email: {type: GraphQLString},
        token: {type: GraphQLString},
        tokenExpiration: {type: GraphQLInt}
	})
});

const EventType = new GraphQLObjectType({
    name: 'Event',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        address: {type: GraphQLString},
        location: {type: GraphQLString},
        dateStart: {type: GraphQLString},
        timeStart: {type: GraphQLString},
        dateEnd: {type: GraphQLString},
        timeEnd: {type: GraphQLString},
        createdAt: {type: GraphQLString},
        UpdatdedAt: {type: GraphQLString},
		creator: {
			type: UserType,
			resolve(parent, args){
				//return _.find(users, {id: parent.userId});
				return User.findById(parent.creator);
			}
		}
    })
});


const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addUser: {
			type: UserType,
			args: {
				fullname: {type: new GraphQLNonNull(GraphQLString)},
				username: {type: new GraphQLNonNull(GraphQLString)},
				email: {type: new GraphQLNonNull(GraphQLString)},
				password: {type: new GraphQLNonNull(GraphQLString)},
				country: {type: new GraphQLNonNull(GraphQLString)},
				about: {type: GraphQLString},
				gender: {type: new GraphQLNonNull(GraphQLString)},
				yob: {type: new GraphQLNonNull(GraphQLInt)}      //Year of Birth;
			},
			resolve(parent, args){
                return User.findOne ({email: args.email} || {username: args.username})
                    .then( user =>{
                        if(user) {
                            throw new Error('Email exists already.')
                        }
                       return bcrypt.hash(args.password, 12)
                    })
                    .then(hashedPassword => {
				        let user = new User({
					       fullname: args.fullname,
					       username: args.username,
					       email: args.email,
					       password: hashedPassword,
					       country: args.country,
					       about: args.about,
					       gender: args.gender,
					       yob: args.yob    //Year of Birth;
				        });
				            return user.save();
			         }).then(result => {
                            return {...result._doc, id: result.id, username: result.username, password: null};
                        })
                        .catch(err => {throw err});
                      
            } // end of resolve function
		},
        login: {
			type: AuthType,
			args: { email: {type: GraphQLString }, password: {type: GraphQLString } },
			resolve: async (parent, {email, password}) => {
				const user = await User.findOne({email: email});
				 if (!user) {
            throw new Error('User does not exist!');
        }
       const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign({userId: user.id, email: user.email}, 'thetopsecretbaseofthealiensthatcametonigeria', { expiresIn: '1h'});
        return {Id: user.id, username: user.username};
			}
		}
        
        }
    });

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
		user: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                //code to get data from db or other sources;
                //return _.find(users, {id: args.id});
				return User.findById(args.id);
            }
		},
		users: {
			type: new GraphQLList(UserType),
			resolve(parent, args){
				//return users;
				return User.find({});
			}
		}
    })
});



module.exports = new GraphQLSchema({
    query: RootQuery,
	mutation: Mutation
	
});