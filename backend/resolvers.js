const Artist = require('./models/Artist');
const Category = require('./models/Category');
const Venue = require('./models/Venue');

const resolvers = {
  Query: {
    artists: async () => await Artist.find(),
    artist: async (parent, args) => await Artist.findById(args.id),
    categories: async () => await Category.find(),
    category: async (parent, args) => await Category.findById(args.id),
    venues: async () => await Venue.find(),
    venue: async (parent, args) => await Venue.findById(args.id),
  },
  Mutation: {
    addArtist: async (parent, args) => {
      const newArtist = new Artist(args);
      return await newArtist.save();
    },
    updateArtist: async (parent, args) => {
      return await Artist.findByIdAndUpdate(args.id, args, { new: true });
    },
    deleteArtist: async (parent, args) => {
      return await Artist.findByIdAndDelete(args.id);
    },
    
    addCategory: async (parent, args) => {
      const newCategory = new Category(args);
      return await newCategory.save();
    },
    updateCategory: async (parent, args) => {
      return await Category.findByIdAndUpdate(args.id, args, { new: true });
    },
    deleteCategory: async (parent, args) => {
      return await Category.findByIdAndDelete(args.id);
    },
    
    addVenue: async (parent, args) => {
      const newVenue = new Venue(args);
      return await newVenue.save();
    },
    updateVenue: async (parent, args) => {
      return await Venue.findByIdAndUpdate(args.id, args, { new: true });
    },
    deleteVenue: async (parent, args) => {
      return await Venue.findByIdAndDelete(args.id);
    }
  }
};

module.exports = resolvers;
