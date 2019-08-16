import DataLoader from "dataloader";
import { Resolvers, Design, User } from "../types";
import { random } from "lodash";

const designs = [
  { id: "1", name: "Kitchen", authorId: "2" },
  { id: "2", name: "Bedrooms", authorId: "1" },
  { id: "3", name: "Kitchen", authorId: "1" },
];

const david = {
  id: "1",
  name: "David",
  designIds: ["2", "3"],
  friendIds: [],
};
const dave = {
  id: "2",
  name: "David",
  designIds: ["1"],
  friendIds: ["1"],
};
const users = [david, dave];

const usersLoader = new DataLoader<string, Partial<User>>(async userIds => {
  console.log(`getting users with ids: ${userIds}`);
  return userIds.map(userId => users[+userId]);
});
const designsLoader = new DataLoader<string, Partial<Design>>(
  async designIds => {
    console.log(`getting designs with ids: ${designIds}`);
    return designIds.map(designId => designs[+designId]);
  },
);
const reviewsLoader = new DataLoader<string, number>(async userIds => {
  console.log(`getting user reviews with ids: ${userIds}`);
  return userIds.map(() => random(0, 5));
});
const userDesignsLoader = new DataLoader<string, Partial<Design>[]>(
  async authorIds => {
    console.log(`getting designs for authors: ${authorIds}`);
    return authorIds.map(authorId =>
      designs.filter(design => design.authorId === authorId),
    );
  },
);

export const resolvers: Resolvers = {
  Query: {
    user: (parent, args) => {
      return usersLoader.load(args.id);
    },
    design: (parent, args) => {
      return designsLoader.load(args.id);
    },
    designs: (parent, args) => {
      return userDesignsLoader.load(args.authorId);
    },
  },
  User: {
    designs: user => {
      return user.designIds.map(designId => designsLoader.load(designId));
    },
    friends: user => {
      return user.friendIds.map(friendId => usersLoader.load(friendId));
    },
    starRating: user => {
      return reviewsLoader.load(user.id);
    },
  },
  Design: {
    author: design => {
      return usersLoader.load(design.authorId);
    },
  },
};
