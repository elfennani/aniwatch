import { GraphQLClient } from "graphql-request";
import { useInfiniteQuery } from "@tanstack/react-query";
import useAniListClient from "@/hooks/use-anilist-client";
import Notification from "@/interfaces/Notification";
import { graphql } from "gql.tada";

const useNotificationsQuery = () => {
  const client = useAniListClient();
  return useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) => fetchNotifications(pageParam, client),
    initialPageParam: 1,
    getNextPageParam: (_, __, lastPageParam) => lastPageParam + 1,
    select: (data) => data.pages.flat(),
  })
}

export default useNotificationsQuery

export async function fetchNotifications(page: number, client: GraphQLClient, markAsRead: boolean = true, perPage = 25): Promise<Notification[]> {
  const notifications = await client.request(query, { page, markAsRead, perPage });
  return notifications.Page?.notifications?.map(function (n): Notification {
    if (n?.__typename == "AiringNotification") {
      let content = ""

      if (n.contexts && n.media?.title?.userPreferred) {
        const contexts = n.contexts as string[];
        content = contexts[0] + n.episode + contexts[1] + n.media?.title?.userPreferred + contexts[2]
      }

      return {
        id: n.id,
        content,
        createdAt: n.createdAt ?? 0,
        thumbnail: n.media?.coverImage?.large ?? undefined,
        path: `/media/${n.media?.id}`
      };
    }
    if (
      n?.__typename == "RelatedMediaAdditionNotification" ||
      n?.__typename == "MediaDataChangeNotification" ||
      n?.__typename == "MediaMergeNotification"
    ) {
      return {
        id: n.id,
        content: (n.media?.title?.userPreferred ?? "") + n.context,
        createdAt: n.createdAt ?? 0,
        thumbnail: n.media?.coverImage?.large ?? undefined,
        path: `/media/${n.media?.id}`
      };
    }

    if (n?.__typename == "FollowingNotification") {
      return {
        id: n.id,
        content: (n.user?.name ?? "") + n.context,
        createdAt: n.createdAt ?? 0,
        thumbnail: n.user?.avatar?.large ?? undefined,
        path: `/user/${n.user?.id}`
      }
    }

    if (
      n?.__typename == "ActivityMessageNotification" ||
      n?.__typename == "ActivityMentionNotification" ||
      n?.__typename == "ActivityLikeNotification" ||
      n?.__typename == "ActivityReplyLikeNotification" ||
      n?.__typename == "ActivityReplyNotification" ||
      n?.__typename == "ActivityReplySubscribedNotification"
    ) {
      return {
        id: n.id,
        createdAt: n.createdAt ?? 0,
        content: (n.user?.name ?? "") + n.context,
        thumbnail: n.user?.avatar?.large ?? undefined,
      }
    }

    if (n?.__typename == "MediaDeletionNotification") {
      return {
        id: n.id,
        createdAt: n.createdAt ?? 0,
        content: (n.deletedMediaTitle ?? "") + n.context,
      }
    }

    if (
      n?.__typename == "ThreadCommentLikeNotification" ||
      n?.__typename == "ThreadCommentMentionNotification" ||
      n?.__typename == "ThreadCommentReplyNotification" ||
      n?.__typename == "ThreadCommentSubscribedNotification" ||
      n?.__typename == "ThreadLikeNotification"
    ) {
      return {
        id: n.id,
        createdAt: n.createdAt ?? 0,
        content: (n.user?.name ?? "") + n.context + (n.thread?.title ?? ""),
        thumbnail: n.user?.avatar?.large ?? undefined,
      }
    }

    return {
      id: NaN,
      content: "Unknown notification",
      createdAt: 0
    }
  }) ?? []
}


const query = graphql(`
  query GetNotifications($page: Int!, $markAsRead: Boolean!, $perPage: Int = 25){
    Page(page: $page, perPage: $perPage){
      notifications(resetNotificationCount: $markAsRead){
        __typename
        ... on AiringNotification {
        id
        episode
        contexts
        media {
          id
          title {
            userPreferred
          }
          coverImage {
            large
          }
        }
        createdAt
      }
      ... on RelatedMediaAdditionNotification {
        id
        context
        media {
          id
          title {
            userPreferred
          }
          coverImage {
            large
          }
        }
        createdAt
      }
      ... on FollowingNotification {
        id
        
        context
        user {
          id
          name
          avatar {
            large
          }
        }
        createdAt
      }
      ... on ActivityMessageNotification {
        id
        
        context
        activityId
        user {
          id
          name
          avatar {
            large
          }
        }
        createdAt
      }
      ... on ActivityMentionNotification {
        id
        
        context
        activityId
        user {
          id
          name
          avatar {
            large
          }
        }
        createdAt
      }
      ... on ActivityReplyNotification {
        id
        
        context
        activityId
        user {
          id
          name
          avatar {
            large
          }
        }
        createdAt
      }
      ... on ActivityReplySubscribedNotification {
        id
        
        context
        activityId
        user {
          id
          name
          avatar {
            large
          }
        }
        createdAt
      }
      ... on ActivityLikeNotification {
        id
        
        context
        activityId
        user {
          id
          name
          avatar {
            large
          }
        }
        createdAt
      }
      ... on ActivityReplyLikeNotification {
        id
        
        context
        activityId
        user {
          id
          name
          avatar {
            large
          }
        }
        createdAt
      }
      ... on ThreadCommentMentionNotification {
        id
        
        context
        commentId
        thread {
          id
          title
        }
        user {
          id
          name
          avatar {
            large
          }
        }
        createdAt
      }
      ... on ThreadCommentReplyNotification {
        id
        
        context
        commentId
        thread {
          id
          title
        }
        user {
          id
          name
          avatar {
            large
          }
        }
        createdAt
      }
      ... on ThreadCommentSubscribedNotification {
        id
        
        context
        commentId
        thread {
          id
          title
        }
        user {
          id
          name
          avatar {
            large
          }
        }
        createdAt
      }
      ... on ThreadCommentLikeNotification {
        id
        
        context
        commentId
        thread {
          id
          title
        }
        user {
          id
          name
          avatar {
            large
          }
        }
        createdAt
      }
      ... on ThreadLikeNotification {
        id
        
        context
        thread {
          id
          title
        }
        user {
          id
          name
          avatar {
            large
          }
        }
        createdAt
      }
      ... on MediaDataChangeNotification {
        id
        
        context
        media {
          id
          title {
            userPreferred
          }
          coverImage {
            large
          }
        }
        reason
        createdAt
      }
      ... on MediaMergeNotification {
        id
        
        context
        media {
          id
          title {
            userPreferred
          }
          coverImage {
            large
          }
        }
        deletedMediaTitles
        reason
        createdAt
      }
      ... on MediaDeletionNotification {
        id
        
        context
        deletedMediaTitle
        reason
        createdAt
      }
      }
    }
  }
`)