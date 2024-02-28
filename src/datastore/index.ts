import { CommentDao } from './dao/commentDao';
import { LikeDao } from './dao/likeDao';
import { PostDao } from './dao/postDao';
import { UserDao } from './dao/userDao';
import { InMemoryDatastore } from './memorydb/index';

export interface DataStore extends UserDao, PostDao, LikeDao, CommentDao {}

export const db = new InMemoryDatastore();
