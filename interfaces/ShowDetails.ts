import { Episode } from './Episode'
import MediaFormat from './MediaFormat';
import MediaSource from './MediaSource';
import MediaStatus from './MediaStatus';
import ShowRelation from './ShowRelation';
import Tag from './Tag';

export interface ShowDetails {
  id: number
  allanimeId?: string
  episodes?: Episode[]
  title: {
    romaji?: string,
    english?: string,
    native?: string,
    default?: string,
  };
  banner?: string;
  cover?: string;
  type: "ANIME" | "MANGA",
  description?: string
  genres?: string[]
  episodesCount?: number
  chapters?: number;
  progress?: number
  year?: number,
  relations: ShowRelation[]
  tags?: Tag[]
  score?: number;
  status?: MediaStatus,
  format?: MediaFormat,
  startDate?: MediaDate,
  endDate?: MediaDate,
  source?: MediaSource
}

interface MediaDate {
  year?: number
  month?: number
  day?: number
}