import { Post, Comment } from "@prisma/client"

export interface PostsWithNames extends Post {
  subbenditName: string
  userName: string
}

export interface CommentWithChildren extends Comment {
  otherComments: { id: string }[]
  users: {
    name: string
  }
}
