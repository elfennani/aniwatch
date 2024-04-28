import useAllAnimeClient from "@/hooks/use-allanime-client";
import useAniListClient from "@/hooks/use-anilist-client";
import { Episode } from "@/interfaces/Episode";
import { ShowDetails } from "@/interfaces/ShowDetails";
import { useQuery } from "@tanstack/react-query";
import { graphql } from "gql.tada";
import { GraphQLClient } from "graphql-request";
import { retry } from "ts-retry-promise";

interface Params {
  id: number
}

const useShowQuery = (params: Params) => {
  const allanime = useAllAnimeClient()
  const anilist = useAniListClient()

  return useQuery({
    queryKey: ["show", params.id],
    queryFn: () => fetchShowById(params, anilist, allanime),
  })
}

export default useShowQuery;

const fetchShowById = async ({ id }: Params, anilist: GraphQLClient, allanime: GraphQLClient) => {
  const { media } = await anilist.request(media_query, { id });

  const search = media?.title?.userPreferred

  let episodes: Episode[] | undefined;
  let showId: string | undefined;
  if (media?.type == "ANIME") {

    const showSearch: ShowQuery = await retry(
      () => allanime.request(show_query, { search }),
      { retries: 3 }
    )
    const show = showSearch!!.shows.edges?.find(
      (show) => show.aniListId == id
    );

    showId = show?._id

    if (show) {
      const max = show.availableEpisodesDetail.sub.length

      const allAnimeEpisodes: AllAnimeEpisodes = await retry(
        () => allanime.request(episodes_details_query, { showId, max }),
        { retries: 3 }
      );

      episodes = allAnimeEpisodes?.episodeInfos.map(ep => ({
        id: ep._id,
        number: ep.episodeIdNum,
        dub: show?.availableEpisodesDetail.dub.includes(String(ep.episodeIdNum)) ?? false,
        duration: ep.vidInforssub?.vidDuration,
        resolution: ep.vidInforssub?.vidResolution,
        thumbnail: ep.thumbnails
          .filter((t) => !t.includes("cdnfile"))
          .map(t => t.startsWith("http") ? t : (source + t))[0]
      })).sort((ep, ep2) => ep2.number - ep.number)
    }
  }

  const showDetails: ShowDetails = {
    id,
    allanimeId: showId,
    title: {
      default: media?.title?.userPreferred ?? undefined,
      english: media?.title?.english ?? undefined,
      native: media?.title?.native ?? undefined,
      romaji: media?.title?.romaji ?? undefined
    },
    format: media?.format ?? undefined,
    banner: media?.bannerImage ?? undefined,
    startDate: !!media?.startDate ? {
      day: media.startDate.day ?? undefined,
      month: media.startDate.month ?? undefined,
      year: media.startDate.year ?? undefined,
    } : undefined,
    endDate: !!media?.endDate ? {
      day: media.endDate.day ?? undefined,
      month: media.endDate.month ?? undefined,
      year: media.endDate.year ?? undefined,
    } : undefined,
    source: media?.source ?? undefined,
    score: media?.mediaListEntry?.score ?? undefined,
    status: media?.mediaListEntry?.status ?? undefined,
    cover: media?.coverImage?.extraLarge!,
    description: media?.description!,
    genres: (media?.genres as string[] | undefined) ?? [],
    progress: media?.mediaListEntry?.progress ?? undefined,
    episodesCount: media?.episodes ?? undefined,
    chapters: media?.chapters ?? undefined,
    type: media?.type!,
    year: media?.seasonYear!,
    episodes,
    relations: media?.relations?.edges?.map(edge => ({
      id: edge?.node?.id!,
      title: edge?.node?.title?.english || edge?.node?.title?.native!,
      relationType: edge?.relationType!,
      cover: edge?.node?.coverImage?.large!,
      type: edge?.node?.type!
    })) ?? [],
    tags: media?.tags?.map(tag => ({
      id: tag?.id!,
      name: tag?.name!,
      rank: tag?.rank ?? 0,
      spoiler: tag?.isGeneralSpoiler || tag?.isMediaSpoiler || false,
      description: tag?.description ?? undefined
    }))
  }

  return showDetails
}

// Thumbnail source for the ones without domain in them
const source = "https://wp.youtube-anime.com/aln.youtube-anime.com"

interface ShowQuery {
  shows: {
    edges: [
      {
        _id: string;
        aniListId: number;
        availableEpisodesDetail: {
          sub: string[];
          dub: string[];
          raw: string[];
        };
      }
    ];
  };
}

const show_query = `
  query($search: String) {
    shows(
        search: {
          query: $search
        }
        page: 1
      ) {
        edges {
          _id
          aniListId
          availableEpisodesDetail
        }
      }
  }
`;

const media_query = graphql(`
  query GetMedia($id: Int) {
    media:Media(id: $id) {
      id
      genres
      episodes
      description
      bannerImage
      type
      seasonYear
      season
      chapters
      startDate{
        year
        month
        day
      }
      endDate{
        year
        month
        day
      }
      format
      source
      title {
        userPreferred
        romaji
        english
        native
      }
      coverImage {
        extraLarge
      }
      mediaListEntry{
        progress
        score
        status
      }
      tags{
        id
        name
        description
        rank
        isMediaSpoiler
        isGeneralSpoiler
      }
      relations{
        edges{
          relationType(version: 2)
          node{
            id
            title{
              english
              native
            }
            coverImage{
              large
            }
            type
          }
        }
      }
    }
  }
`);

interface EpisodeDetail {
  _id: string;
  episodeIdNum: number;
  thumbnails: string[];
  vidInforssub?: {
    vidResolution: number;
    vidPath: string;
    vidSize: number;
    vidDuration: number;
  };
}

interface AllAnimeEpisodes {
  episodeInfos: EpisodeDetail[];
}

const episodes_details_query = `
  query($showId: String!, $max: Float!) {
    episodeInfos(showId:$showId,  episodeNumStart:0, episodeNumEnd:$max){
      _id
      thumbnails
      episodeIdNum
      vidInforssub
    }
  }
`;