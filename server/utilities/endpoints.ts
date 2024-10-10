export interface EndpointConfig {
  url: string;
  method: "patch" | "get" | "post" | "delete";
  auth?: boolean;
  sensitive?: boolean;
}

export enum Endpoints {
  healthy = "healthy",

  signIn = "signIn",
  signUp = "signUp",
  getUser = "getUser",
  getCurrentUser = "getCurrentUser",
  updateCurrentUser = "updateCurrentUser",

  listPosts = "listPosts",
  getPost = "getPost",
  createPost = "createPost",
  deletePost = "deletePost",

  listLikes = "listLikes",
  createLike = "createLike",
  deleteLike = "deleteLike",

  countComments = "countComments",
  listComments = "listComments",
  createComment = "createComment",
  deleteComment = "deleteComment",
}

export function withParams(endpoint: EndpointConfig, ...params: string[]): EndpointConfig {
  let url = endpoint.url;
  const placeholders = url.match(/:[^\/]*/g) || [];

  if (placeholders.length !== params.length) {
    throw `Too ${placeholders.length < params.length ? "many" : "few"} params for url: ${url}!`;
  }

  for (let i = 0; i < params.length; i++) {
    url = url.replace(placeholders[i], params[i]);
  }

  return {
    url,
    method: endpoint.method,
    auth: endpoint.auth,
  } as EndpointConfig;
}

export const ENDPOINT_CONFIGS: { [key in Endpoints]: EndpointConfig } = {
  [Endpoints.healthy]: { method: "get", url: "/api/v1/healthy" },

  [Endpoints.signIn]: { method: "post", url: "/api/v1/signIn", sensitive: true },
  [Endpoints.signUp]: { method: "post", url: "/api/v1/signUp", sensitive: true },
  [Endpoints.getUser]: { method: "get", url: "/api/v1/users/:id" },
  [Endpoints.getCurrentUser]: { method: "get", url: "/api/v1/users", auth: true },
  [Endpoints.updateCurrentUser]: { method: "patch", url: "/api/v1/users", auth: true },

  [Endpoints.listPosts]: { method: "get", url: "/api/v1/posts" },
  [Endpoints.getPost]: { method: "get", url: "/api/v1/posts/:id" },
  [Endpoints.createPost]: { method: "post", url: "/api/v1/posts", auth: true },
  [Endpoints.deletePost]: { method: "delete", url: "/api/v1/posts/:id", auth: true },

  [Endpoints.listLikes]: { method: "get", url: "/api/v1/likes/:postId" },
  [Endpoints.createLike]: { method: "post", url: "/api/v1/likes/:postId", auth: true },
  [Endpoints.deleteLike]: { method: "delete", url: "/api/v1/likes/:postId", auth: true },

  [Endpoints.countComments]: { method: "get", url: "/api/v1/comments/:postId/count" },
  [Endpoints.listComments]: { method: "get", url: "/api/v1/comments/:postId" },
  [Endpoints.createComment]: { method: "post", url: "/api/v1/comments/:postId", auth: true },
  [Endpoints.deleteComment]: { method: "delete", url: "/api/v1/comments/:id", auth: true },
};
