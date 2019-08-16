/* eslint-disable */
import { GraphQLResolveInfo } from "graphql";
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Design = {
  __typename?: "Design";
  id: Scalars["ID"];
  name: Scalars["String"];
  author: User;
  authorId: Scalars["ID"];
};

export type Query = {
  __typename?: "Query";
  /** Get user by ID */
  user: User;
  /** Get design by ID */
  design: Design;
  designs: Array<Design>;
};

export type QueryUserArgs = {
  id: Scalars["ID"];
};

export type QueryDesignArgs = {
  id: Scalars["ID"];
};

export type QueryDesignsArgs = {
  authorId: Scalars["ID"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  name: Scalars["String"];
  designs: Array<Design>;
  designIds: Array<Scalars["ID"]>;
  friends: Array<User>;
  friendIds: Array<Scalars["ID"]>;
  starRating?: Maybe<Scalars["Int"]>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<any>;
  User: ResolverTypeWrapper<any>;
  String: ResolverTypeWrapper<any>;
  Design: ResolverTypeWrapper<any>;
  Int: ResolverTypeWrapper<any>;
  Boolean: ResolverTypeWrapper<any>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  ID: any;
  User: any;
  String: any;
  Design: any;
  Int: any;
  Boolean: any;
};

export type DesignResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Design"] = ResolversParentTypes["Design"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  author?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  authorId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  user?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    QueryUserArgs
  >;
  design?: Resolver<
    ResolversTypes["Design"],
    ParentType,
    ContextType,
    QueryDesignArgs
  >;
  designs?: Resolver<
    Array<ResolversTypes["Design"]>,
    ParentType,
    ContextType,
    QueryDesignsArgs
  >;
};

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  designs?: Resolver<Array<ResolversTypes["Design"]>, ParentType, ContextType>;
  designIds?: Resolver<Array<ResolversTypes["ID"]>, ParentType, ContextType>;
  friends?: Resolver<Array<ResolversTypes["User"]>, ParentType, ContextType>;
  friendIds?: Resolver<Array<ResolversTypes["ID"]>, ParentType, ContextType>;
  starRating?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Design?: DesignResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
