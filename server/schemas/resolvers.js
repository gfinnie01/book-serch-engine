const { AuthenticationError } = require('apollo-server-express');

const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    async getSingleUser(parent,{ user = null, params }, context ) {
      const foundUser = await User.findOne({
        $or: [{ _id: context.user ? context.user._id : args.id }, { username: args.username }],
      });
  
  
     return foundUser
    },
  },
  
  Mutation: {
    async createUser(parent, { body }) {
      const user = await User.create(body);
      const token = signToken(user);
      return { token, user };
    },
    async login(parent, args ) {
      const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });
      if (!user) {
        throw AuthenticationError({ message: "Can't find this user" });
      }
  
      const correctPw = await user.isCorrectPassword(args.password);
  
      if (!correctPw) {
        throw AuthenticationError({ message: 'Wrong password!' });
      }
      const token = signToken(user);
      return { token, user };
    },
    async saveBook(parent,{ user, body }) {
      console.log(user);
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: body } },
          { new: true, runValidators: true }
        );
        return res.json(updatedUser);
      } catch (err) {
        console.log(err);
      }
    },
    async deleteBook(parent,{ user, params }) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: params.bookId } } },
        { new: true }
      );
      return updatedUser;
    },
  },

};

module.exports = resolvers;
