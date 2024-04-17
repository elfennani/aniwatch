export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /**
   * The `BigInt` scalar type represents non-fractional signed whole numeric
   * values.BigInt can represent values between -(2^63) + 1 and 2^63 - 1.
   */
  BigInt: any
  /**
   * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the
   * `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO
   * 8601 standard for representation of dates and times using the Gregorian calendar.
   */
  DateTime: any
  /** Represents an arbitrary object. */
  Object: any
  /** The `Upload` scalar type represents a file upload. */
  Upload: any
}

export type ActivityResponse = {
  __typename?: "ActivityResponse"
  edges?: Maybe<Array<Maybe<PageRelation>>>
  pageInfo?: Maybe<PageInfo>
}

export type AnyCard = {
  __typename?: "AnyCard"
  _id?: Maybe<Scalars["String"]>
  updateQueue?: Maybe<Scalars["BigInt"]>
  manualUpdated?: Maybe<Scalars["Boolean"]>
  dailyUpdateNeeded?: Maybe<Scalars["Boolean"]>
  hidden?: Maybe<Scalars["Boolean"]>
  lastUpdateStart?: Maybe<Scalars["DateTime"]>
  lastUpdateEnd?: Maybe<Scalars["DateTime"]>
  shownOnOtherSite?: Maybe<Scalars["Boolean"]>
  shownOnMAL?: Maybe<Scalars["Boolean"]>
  malId?: Maybe<Scalars["BigInt"]>
  aniListId?: Maybe<Scalars["BigInt"]>
  streamerUrls?: Maybe<Array<Maybe<Scalars["Object"]>>>
  name?: Maybe<Scalars["String"]>
  englishName?: Maybe<Scalars["String"]>
  nativeName?: Maybe<Scalars["String"]>
  nameOnlyString?: Maybe<Scalars["String"]>
  status?: Maybe<Scalars["String"]>
  altNames?: Maybe<Array<Maybe<Scalars["String"]>>>
  trustedAltNames?: Maybe<Array<Maybe<Scalars["String"]>>>
  description?: Maybe<Scalars["String"]>
  prevideos?: Maybe<Array<Maybe<Scalars["String"]>>>
  thumbnail?: Maybe<Scalars["String"]>
  banner?: Maybe<Scalars["String"]>
  musics?: Maybe<Array<Maybe<Scalars["Object"]>>>
  thumbnails?: Maybe<Array<Maybe<Scalars["String"]>>>
  type?: Maybe<Scalars["String"]>
  score?: Maybe<Scalars["Float"]>
  averageScore?: Maybe<Scalars["Float"]>
  popularity?: Maybe<Scalars["Int"]>
  genres?: Maybe<Array<Maybe<Scalars["String"]>>>
  airedStart?: Maybe<Scalars["Object"]>
  airedEnd?: Maybe<Scalars["Object"]>
  season?: Maybe<Scalars["Object"]>
  episodeCount?: Maybe<Scalars["Int"]>
  chapterCount?: Maybe<Scalars["Int"]>
  broadcastInterval?: Maybe<Scalars["BigInt"]>
  episodeDuration?: Maybe<Scalars["BigInt"]>
  rating?: Maybe<Scalars["String"]>
  studios?: Maybe<Array<Maybe<Scalars["String"]>>>
  relatedShows?: Maybe<Array<Maybe<Scalars["Object"]>>>
  relatedMangas?: Maybe<Array<Maybe<Scalars["Object"]>>>
  characters?: Maybe<Array<Maybe<Scalars["Object"]>>>
  nextAiringEpisode?: Maybe<Scalars["Object"]>
  determinedInterval?: Maybe<Scalars["Object"]>
  lastEpisodeDate?: Maybe<Scalars["Object"]>
  lastEpisodeTimestamp?: Maybe<Scalars["Object"]>
  lastEpisodeInfo?: Maybe<Scalars["Object"]>
  lastChapterDate?: Maybe<Scalars["Object"]>
  lastChapterTimestamp?: Maybe<Scalars["Object"]>
  lastChapterInfo?: Maybe<Scalars["Object"]>
  availableChapters?: Maybe<Scalars["Object"]>
  availableChaptersDetail?: Maybe<Scalars["Object"]>
  availableEpisodes?: Maybe<Scalars["Object"]>
  availableEpisodesDetail?: Maybe<Scalars["Object"]>
  searchFragments?: Maybe<Array<Maybe<Scalars["String"]>>>
  firstCharacters?: Maybe<Array<Maybe<Scalars["String"]>>>
  slugTime?: Maybe<Scalars["BigInt"]>
}

export type AppAccessbility = {
  __typename?: "AppAccessbility"
  appDisabled?: Maybe<Scalars["Object"]>
  appNeedCheckLogin?: Maybe<Scalars["Object"]>
}

export type AppSettings = {
  __typename?: "AppSettings"
  type?: Maybe<Scalars["String"]>
  value?: Maybe<Scalars["String"]>
}

export type AuthenticateParamsInput = {
  access_token?: Maybe<Scalars["String"]>
  access_token_secret?: Maybe<Scalars["String"]>
  provider?: Maybe<Scalars["String"]>
  password?: Maybe<Scalars["String"]>
  user?: Maybe<UserInput>
  code?: Maybe<Scalars["String"]>
  recaptchCode?: Maybe<Scalars["String"]>
}

export type Badge = {
  __typename?: "Badge"
  name?: Maybe<Scalars["String"]>
  rank?: Maybe<Scalars["Int"]>
  date?: Maybe<Scalars["DateTime"]>
}

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE"
}

export type Chapter = {
  __typename?: "Chapter"
  _id?: Maybe<Scalars["String"]>
  mangaId?: Maybe<Scalars["String"]>
  chapterString?: Maybe<Scalars["String"]>
  chapterNumStart?: Maybe<Scalars["BigInt"]>
  chapterNumEnd?: Maybe<Scalars["BigInt"]>
  notes?: Maybe<Scalars["String"]>
  chapterAiredDateString?: Maybe<Scalars["String"]>
  volume?: Maybe<Scalars["BigInt"]>
  translationType?: Maybe<VaildTranslationTypeEnumType>
  thumbnail?: Maybe<Scalars["String"]>
  videoUrlProcessed?: Maybe<Scalars["Boolean"]>
  downloadQueue?: Maybe<Scalars["BigInt"]>
  uploadDate?: Maybe<Scalars["Object"]>
  pictureUrls?: Maybe<Array<Maybe<Scalars["Object"]>>>
  pictureUrlsProcessed?: Maybe<Scalars["BigInt"]>
  streamerId?: Maybe<Scalars["String"]>
  sourceName?: Maybe<Scalars["String"]>
  sourceUrl?: Maybe<Scalars["String"]>
  versionFix?: Maybe<Scalars["String"]>
  pictureUrlHead?: Maybe<Scalars["String"]>
  priority?: Maybe<Scalars["Int"]>
  pictureServers?: Maybe<Array<Maybe<Scalars["Object"]>>>
}

export type ChaptersConnection = {
  __typename?: "ChaptersConnection"
  edges?: Maybe<Array<Chapter>>
  pageInfo?: Maybe<PageInfo>
  pageStatus: PageStatus
  manga?: Maybe<Manga>
}

export type Character = {
  __typename?: "Character"
  _id?: Maybe<Scalars["String"]>
  aniListId?: Maybe<Scalars["Int"]>
  showId?: Maybe<Scalars["String"]>
  mangaId?: Maybe<Scalars["String"]>
  lastUpdateStart?: Maybe<Scalars["DateTime"]>
  lastUpdateEnd?: Maybe<Scalars["DateTime"]>
  name?: Maybe<Scalars["Object"]>
  altNames?: Maybe<Array<Maybe<Scalars["String"]>>>
  thumbnails?: Maybe<Array<Maybe<Scalars["String"]>>>
  image?: Maybe<Scalars["Object"]>
  description?: Maybe<Scalars["String"]>
  searchFragments?: Maybe<Scalars["String"]>
  firstCharacters?: Maybe<Scalars["String"]>
  views?: Maybe<Scalars["BigInt"]>
  likesCount?: Maybe<Scalars["BigInt"]>
  commentCount?: Maybe<Scalars["BigInt"]>
  dislikesCount?: Maybe<Scalars["BigInt"]>
  userScoreCount?: Maybe<Scalars["BigInt"]>
  reviewCount?: Maybe<Scalars["BigInt"]>
  userScoreTotalValue?: Maybe<Scalars["Float"]>
  userScoreAverValue?: Maybe<Scalars["Float"]>
  viewers?: Maybe<ValidViewers>
  pgRelation?: Maybe<PageRelation>
}

export type Comment = {
  __typename?: "Comment"
  _id?: Maybe<Scalars["String"]>
  comment?: Maybe<Scalars["Object"]>
  referenceId?: Maybe<Scalars["String"]>
  replyTo?: Maybe<Array<Maybe<Scalars["String"]>>>
  userId?: Maybe<Scalars["String"]>
  user?: Maybe<User>
  myLike?: Maybe<PageRelationLikes>
  format?: Maybe<Scalars["String"]>
}

export type CommentBody = {
  content: Scalars["String"]
  disableReply?: Maybe<Scalars["Boolean"]>
}

export type CommentEditted = {
  __typename?: "CommentEditted"
  times?: Maybe<Scalars["Int"]>
  date?: Maybe<Scalars["DateTime"]>
  from?: Maybe<Scalars["BigInt"]>
}

export type CommentResponse = {
  __typename?: "CommentResponse"
  edges?: Maybe<Array<Maybe<Comment>>>
  pageInfo?: Maybe<PageInfo>
}

export type CommentsSearch = {
  sortBy?: Maybe<SortBy>
  format: VaildPageRelationLikesFormatEnumType
  referenceId: Scalars["String"]
  size?: Maybe<Scalars["Int"]>
  page?: Maybe<Scalars["Int"]>
}

export type CreateUserInput = {
  username?: Maybe<Scalars["String"]>
  email?: Maybe<Scalars["String"]>
  password?: Maybe<Scalars["String"]>
}

export type CreateUserResult = {
  __typename?: "CreateUserResult"
  userId?: Maybe<Scalars["ID"]>
  loginResult?: Maybe<LoginResult>
}

export type Email = {
  __typename?: "Email"
  address?: Maybe<Scalars["String"]>
  verified?: Maybe<Scalars["Boolean"]>
}

export type EmailRecord = {
  __typename?: "EmailRecord"
  address?: Maybe<Scalars["String"]>
  verified?: Maybe<Scalars["Boolean"]>
}

export type Episode = {
  __typename?: "Episode"
  _id?: Maybe<Scalars["String"]>
  showId?: Maybe<Scalars["String"]>
  episodeString?: Maybe<Scalars["String"]>
  episodeNumStart?: Maybe<Scalars["BigInt"]>
  episodeNumEnd?: Maybe<Scalars["BigInt"]>
  notes?: Maybe<Scalars["String"]>
  description?: Maybe<Scalars["String"]>
  episodeAiredDateString?: Maybe<Scalars["String"]>
  translationType?: Maybe<VaildTranslationTypeEnumType>
  sourceUrls?: Maybe<Scalars["Object"]>
  thumbnail?: Maybe<Scalars["String"]>
  videoUrlProcessed?: Maybe<Scalars["Boolean"]>
  downloadQueue?: Maybe<Scalars["BigInt"]>
  uploadDate?: Maybe<Scalars["Object"]>
  show?: Maybe<Show>
  versionFix?: Maybe<Scalars["String"]>
  episodeInfo?: Maybe<EpisodeInfo>
  pageStatus?: Maybe<PageStatus>
}

export type EpisodeInfo = {
  __typename?: "EpisodeInfo"
  _id?: Maybe<Scalars["String"]>
  notes?: Maybe<Scalars["String"]>
  description?: Maybe<Scalars["String"]>
  pictureUrlsProcessed?: Maybe<Scalars["BigInt"]>
  isManga?: Maybe<Scalars["Boolean"]>
  thumbnails?: Maybe<Array<Maybe<Scalars["String"]>>>
  uploadDates?: Maybe<Scalars["Object"]>
  showId?: Maybe<Scalars["String"]>
  episodeIdNum?: Maybe<Scalars["Float"]>
  vidInforssub?: Maybe<Scalars["Object"]>
  vidInforsdub?: Maybe<Scalars["Object"]>
  vidInforsraw?: Maybe<Scalars["Object"]>
}

export type EpisodesConnection = {
  __typename?: "EpisodesConnection"
  edges?: Maybe<Array<Episode>>
  pageInfo: PageInfo
}

export type Error = {
  __typename?: "Error"
  message?: Maybe<Scalars["String"]>
  code?: Maybe<Scalars["Int"]>
}

export type FavEntity = {
  __typename?: "FavEntity"
  userId?: Maybe<Scalars["String"]>
  addedDate?: Maybe<Scalars["DateTime"]>
}

export type Image = {
  __typename?: "Image"
  medium?: Maybe<Scalars["String"]>
  large?: Maybe<Scalars["String"]>
}

export type ImpersonateReturn = {
  __typename?: "ImpersonateReturn"
  authorized?: Maybe<Scalars["Boolean"]>
  tokens?: Maybe<Tokens>
  user?: Maybe<User>
}

export type ImpersonationUserIdentityInput = {
  userId?: Maybe<Scalars["String"]>
  username?: Maybe<Scalars["String"]>
  email?: Maybe<Scalars["String"]>
}

export type Lastlogin = {
  __typename?: "lastlogin"
  date?: Maybe<Scalars["DateTime"]>
  ipAddr?: Maybe<Scalars["String"]>
}

export type Listenter = {
  __typename?: "Listenter"
  userId?: Maybe<Scalars["String"]>
  listenCount?: Maybe<Scalars["Int"]>
  lastListenedDate?: Maybe<Scalars["DateTime"]>
}

export type ListForTagInput = {
  slug?: Maybe<Scalars["String"]>
  format: Scalars["String"]
  page?: Maybe<Scalars["Int"]>
  offset?: Maybe<Scalars["Int"]>
  limit?: Maybe<Scalars["Int"]>
  name?: Maybe<Scalars["String"]>
  tagType?: Maybe<TagType>
  allowAdult?: Maybe<Scalars["Boolean"]>
  allowUnknown?: Maybe<Scalars["Boolean"]>
  denyEcchi?: Maybe<Scalars["Boolean"]>
}

export type LoginResult = {
  __typename?: "LoginResult"
  sessionId?: Maybe<Scalars["String"]>
  tokens?: Maybe<Tokens>
  user?: Maybe<User>
}

export type Manga = {
  __typename?: "Manga"
  _id?: Maybe<Scalars["String"]>
  updateQueue?: Maybe<Scalars["BigInt"]>
  isAdult?: Maybe<Scalars["Boolean"]>
  manualUpdated?: Maybe<Scalars["Boolean"]>
  dailyUpdateNeeded?: Maybe<Scalars["Boolean"]>
  hidden?: Maybe<Scalars["Boolean"]>
  lastUpdateStart?: Maybe<Scalars["DateTime"]>
  lastUpdateEnd?: Maybe<Scalars["DateTime"]>
  name?: Maybe<Scalars["String"]>
  englishName?: Maybe<Scalars["String"]>
  nativeName?: Maybe<Scalars["String"]>
  nameOnlyString?: Maybe<Scalars["String"]>
  countryOfOrigin?: Maybe<VaildCountryOriginEnumType>
  malId?: Maybe<Scalars["BigInt"]>
  aniListId?: Maybe<Scalars["BigInt"]>
  status?: Maybe<Scalars["String"]>
  altNames?: Maybe<Array<Maybe<Scalars["String"]>>>
  trustedAltNames?: Maybe<Array<Maybe<Scalars["String"]>>>
  description?: Maybe<Scalars["String"]>
  prevideos?: Maybe<Array<Maybe<Scalars["String"]>>>
  thumbnail?: Maybe<Scalars["String"]>
  banner?: Maybe<Scalars["String"]>
  thumbnails?: Maybe<Array<Maybe<Scalars["String"]>>>
  musics?: Maybe<Array<Maybe<Scalars["Object"]>>>
  score?: Maybe<Scalars["Float"]>
  type?: Maybe<Scalars["String"]>
  averageScore?: Maybe<Scalars["Float"]>
  genres?: Maybe<Array<Maybe<Scalars["String"]>>>
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>
  popularity?: Maybe<Scalars["BigInt"]>
  airedStart?: Maybe<Scalars["Object"]>
  airedEnd?: Maybe<Scalars["Object"]>
  season?: Maybe<Scalars["Object"]>
  rating?: Maybe<Scalars["String"]>
  broadcastInterval?: Maybe<Scalars["BigInt"]>
  relatedShows?: Maybe<Array<Maybe<Scalars["Object"]>>>
  relatedMangas?: Maybe<Array<Maybe<Scalars["Object"]>>>
  characters?: Maybe<Array<Maybe<Scalars["Object"]>>>
  pageStatus?: Maybe<PageStatus>
  determinedInterval?: Maybe<Scalars["Object"]>
  slugTime?: Maybe<Scalars["BigInt"]>
  chapterCount?: Maybe<Scalars["BigInt"]>
  volumes?: Maybe<Scalars["BigInt"]>
  magazine?: Maybe<Scalars["String"]>
  authors?: Maybe<Array<Maybe<Scalars["String"]>>>
  lastChapterDate?: Maybe<Scalars["Object"]>
  lastChapterTimestamp?: Maybe<Scalars["Object"]>
  lastChapterInfo?: Maybe<Scalars["Object"]>
  availableChapters?: Maybe<Scalars["Object"]>
  availableChaptersDetail?: Maybe<Scalars["Object"]>
}

export type MangasConnection = {
  __typename?: "MangasConnection"
  edges?: Maybe<Array<Manga>>
  pageInfo: PageInfo
}

export type Message = {
  __typename?: "Message"
  date?: Maybe<Scalars["BigInt"]>
  data?: Maybe<Scalars["Object"]>
  title: Scalars["String"]
  content?: Maybe<Scalars["String"]>
  duration?: Maybe<Scalars["Int"]>
  type?: Maybe<NotificationType>
}

export type MessageNotificationLevel = {
  anime?: Maybe<Scalars["Int"]>
  manga?: Maybe<Scalars["Int"]>
  system?: Maybe<Scalars["Int"]>
  music?: Maybe<Scalars["Int"]>
  user?: Maybe<Scalars["Int"]>
}

export type Music = {
  __typename?: "Music"
  _id?: Maybe<Scalars["String"]>
  fileName?: Maybe<Scalars["String"]>
  musicTitle?: Maybe<Scalars["Object"]>
  type?: Maybe<Scalars["String"]>
  slug?: Maybe<Scalars["String"]>
  artist?: Maybe<Scalars["Object"]>
  show?: Maybe<ShowForMusic>
  cover?: Maybe<Scalars["String"]>
  format?: Maybe<Scalars["String"]>
  description?: Maybe<Scalars["String"]>
  duration?: Maybe<Scalars["Float"]>
  album?: Maybe<Scalars["String"]>
  musicUrls?: Maybe<Array<Maybe<Scalars["Object"]>>>
  recommendation?: Maybe<Array<Maybe<Music>>>
  size?: Maybe<Scalars["Float"]>
  content_type?: Maybe<Scalars["String"]>
  editDate?: Maybe<Scalars["DateTime"]>
  createdDate?: Maybe<Scalars["DateTime"]>
  listeners?: Maybe<Array<Maybe<Listenter>>>
  listens?: Maybe<Scalars["Int"]>
  lyrics?: Maybe<Array<Maybe<Scalars["Object"]>>>
  likes?: Maybe<Array<Maybe<Scalars["String"]>>>
  likesCount?: Maybe<Scalars["Int"]>
  dislikesCount?: Maybe<Scalars["Int"]>
  dislikes?: Maybe<Array<Maybe<Scalars["String"]>>>
  lastUpdateStart?: Maybe<Scalars["BigInt"]>
  lastUpdateEnd?: Maybe<Scalars["BigInt"]>
  rangeListens?: Maybe<Scalars["Int"]>
}

export type MusicActionResponse = {
  __typename?: "MusicActionResponse"
  success?: Maybe<Scalars["Boolean"]>
  error?: Maybe<Scalars["Object"]>
}

export type MusicResponse = {
  __typename?: "MusicResponse"
  musicsLinks?: Maybe<Array<Maybe<Scalars["Object"]>>>
  resultMusics?: Maybe<Array<Maybe<Music>>>
}

export type MusicsConnection = {
  __typename?: "MusicsConnection"
  edges?: Maybe<Array<Music>>
  pageInfo: PageInfo
}

export type MusicSearchInput = {
  query?: Maybe<Scalars["String"]>
  types?: Maybe<Array<Maybe<Scalars["String"]>>>
  artists?: Maybe<Array<Maybe<Scalars["String"]>>>
  sortBy?: Maybe<SortBy>
}

export type Mutation = {
  __typename?: "Mutation"
  createUser?: Maybe<CreateUserResult>
  verifyEmail?: Maybe<Scalars["Boolean"]>
  resetPassword?: Maybe<LoginResult>
  sendVerificationEmail?: Maybe<Scalars["Boolean"]>
  sendResetPasswordEmail?: Maybe<Scalars["Boolean"]>
  addEmail?: Maybe<Scalars["Boolean"]>
  changePassword?: Maybe<Scalars["Boolean"]>
  twoFactorSet?: Maybe<Scalars["Boolean"]>
  twoFactorUnset?: Maybe<Scalars["Boolean"]>
  impersonate?: Maybe<ImpersonateReturn>
  refreshTokens?: Maybe<LoginResult>
  logout?: Maybe<Scalars["Boolean"]>
  authenticate?: Maybe<LoginResult>
  verifyAuthentication?: Maybe<Scalars["Boolean"]>
  listenMusic: MusicActionResponse
  createPlaylist?: Maybe<PlaylistActionResponse>
  addPlayId?: Maybe<PlaylistActionResponse>
  editPlaylist?: Maybe<PlaylistActionResponse>
  toggleFavPlaylist?: Maybe<PlaylistActionResponse>
  removePlayId?: Maybe<PlaylistActionResponse>
  viewPage: PageActionResponse
  likePage: PageActionResponse
  scorePage: PageActionResponse
  dislikePage: PageActionResponse
  reportProblem: PageActionResponse
  reviewPage: PageActionResponse
  createComment: PageActionResponse
  updateComment: PageActionResponse
  editReview: PageActionResponse
  deleteComment: PageActionResponse
  likeDislikeComment: PageActionResponse
  toggleWatching?: Maybe<WatchingActionResponse>
  changeWatching?: Maybe<WatchingActionResponse>
  changeCurrentOnlineState?: Maybe<UserOnlineStatics>
  resumeLogin?: Maybe<User>
  deleteAccount?: Maybe<SuccessResponse>
  changeProfile?: Maybe<User>
  resendVerificationLink?: Maybe<SuccessResponse>
  toggleAppsAccessbility: AppSettings
}

export type MutationCreateUserArgs = {
  user: CreateUserInput
  recaptchCode?: Maybe<Scalars["String"]>
}

export type MutationVerifyEmailArgs = {
  token: Scalars["String"]
}

export type MutationResetPasswordArgs = {
  token: Scalars["String"]
  newPassword: Scalars["String"]
}

export type MutationSendVerificationEmailArgs = {
  email: Scalars["String"]
  recaptchCode?: Maybe<Scalars["String"]>
}

export type MutationSendResetPasswordEmailArgs = {
  email: Scalars["String"]
  recaptchCode?: Maybe<Scalars["String"]>
}

export type MutationAddEmailArgs = {
  newEmail: Scalars["String"]
}

export type MutationChangePasswordArgs = {
  oldPassword: Scalars["String"]
  newPassword: Scalars["String"]
}

export type MutationTwoFactorSetArgs = {
  secret: TwoFactorSecretKeyInput
  code: Scalars["String"]
}

export type MutationTwoFactorUnsetArgs = {
  code: Scalars["String"]
}

export type MutationImpersonateArgs = {
  accessToken: Scalars["String"]
  impersonated: ImpersonationUserIdentityInput
}

export type MutationRefreshTokensArgs = {
  accessToken: Scalars["String"]
  refreshToken: Scalars["String"]
}

export type MutationAuthenticateArgs = {
  serviceName: Scalars["String"]
  params: AuthenticateParamsInput
}

export type MutationVerifyAuthenticationArgs = {
  serviceName: Scalars["String"]
  params: AuthenticateParamsInput
}

export type MutationListenMusicArgs = {
  _id: Scalars["String"]
  userId?: Maybe<Scalars["String"]>
}

export type MutationCreatePlaylistArgs = {
  format: VaildPlaylistEnumType
  title?: Maybe<Scalars["String"]>
  privacy?: Maybe<VaildPrivacyEnumType>
}

export type MutationAddPlayIdArgs = {
  format: VaildPlaylistEnumType
  playId: Scalars["String"]
  privacy?: Maybe<VaildPrivacyEnumType>
  playTitle?: Maybe<Scalars["String"]>
  playlistId: Scalars["String"]
  cover?: Maybe<Scalars["String"]>
}

export type MutationEditPlaylistArgs = {
  playlistId?: Maybe<Scalars["String"]>
  title?: Maybe<Scalars["String"]>
  privacy?: Maybe<VaildPrivacyEnumType>
}

export type MutationToggleFavPlaylistArgs = {
  playlistId: Scalars["String"]
  relatedField?: Maybe<Scalars["Object"]>
}

export type MutationRemovePlayIdArgs = {
  playId: Scalars["String"]
  playlistId: Scalars["String"]
}

export type MutationViewPageArgs = {
  _id: Scalars["String"]
  type: VaildPageRelationFormatEnumType
  showId?: Maybe<Scalars["String"]>
  episodeId?: Maybe<Scalars["String"]>
  translationType?: Maybe<VaildTranslationTypeEnumType>
  isAdult?: Maybe<Scalars["Boolean"]>
  relatedField?: Maybe<Scalars["Object"]>
}

export type MutationLikePageArgs = {
  _id: Scalars["String"]
  type: VaildPageRelationFormatEnumType
  relatedField?: Maybe<Scalars["Object"]>
}

export type MutationScorePageArgs = {
  _id: Scalars["String"]
  type: VaildPageRelationFormatEnumType
  score: UserScore
  relatedField?: Maybe<Scalars["Object"]>
}

export type MutationDislikePageArgs = {
  _id: Scalars["String"]
  type: VaildPageRelationFormatEnumType
  relatedField?: Maybe<Scalars["Object"]>
}

export type MutationReportProblemArgs = {
  _id: Scalars["String"]
  type: VaildPageRelationFormatEnumType
  reportBody: ReportBody
}

export type MutationReviewPageArgs = {
  _id: Scalars["String"]
  type: VaildPageRelationFormatEnumType
  commentBody: CommentBody
  relatedField?: Maybe<Scalars["Object"]>
}

export type MutationCreateCommentArgs = {
  referenceId: Scalars["String"]
  replyTo?: Maybe<Array<Maybe<Scalars["String"]>>>
  type: VaildCommentFormatEnumType
  commentBody: CommentBody
  statisticType: VaildStatisticsEnumType
  relatedField?: Maybe<Scalars["Object"]>
}

export type MutationUpdateCommentArgs = {
  _id: Scalars["String"]
  replyTo?: Maybe<Array<Maybe<Scalars["String"]>>>
  statisticType?: Maybe<VaildStatisticsEnumType>
  commentBody: CommentBody
}

export type MutationEditReviewArgs = {
  _id: Scalars["String"]
  statisticType?: Maybe<VaildStatisticsEnumType>
  commentBody: CommentBody
}

export type MutationDeleteCommentArgs = {
  _id: Scalars["String"]
  referenceId: Scalars["String"]
  type: VaildCommentFormatEnumType
  statisticType: VaildStatisticsEnumType
}

export type MutationLikeDislikeCommentArgs = {
  _id: Scalars["String"]
  type: VaildPageRelationLikesFormatEnumType
  actionName: ValidLikeDislike
  relatedField?: Maybe<Scalars["Object"]>
}

export type MutationToggleWatchingArgs = {
  type: VaildWatchingEnumType
  watchStateId: Scalars["String"]
  userId: Scalars["String"]
}

export type MutationChangeWatchingArgs = {
  type: VaildWatchingEnumType
  watchStateId: Scalars["String"]
  userId: Scalars["String"]
}

export type MutationChangeCurrentOnlineStateArgs = {
  userOnlineState?: Maybe<UserOnlineState>
}

export type MutationDeleteAccountArgs = {
  recaptchCode: Scalars["String"]
  typingUserId: Scalars["String"]
}

export type MutationChangeProfileArgs = {
  userInput: UserProfileInput
}

export type MutationResendVerificationLinkArgs = {
  email: Scalars["String"]
  recaptchCode?: Maybe<Scalars["String"]>
}

export type MutationToggleAppsAccessbilityArgs = {
  type: Scalars["String"]
  value?: Maybe<Scalars["String"]>
}

export type MyOwnPlaylistResponse = {
  __typename?: "MyOwnPlaylistResponse"
  edges?: Maybe<Array<MyPlaylist>>
  pageInfo?: Maybe<PageInfo>
}

export type MyPlaylist = {
  __typename?: "MyPlaylist"
  _id?: Maybe<Scalars["String"]>
  format?: Maybe<VaildPlaylistEnumType>
  userId?: Maybe<Scalars["String"]>
  userName?: Maybe<Scalars["String"]>
  userAvatar?: Maybe<Scalars["String"]>
  user?: Maybe<UserDisplay>
  title?: Maybe<Scalars["String"]>
  createdDate?: Maybe<Scalars["DateTime"]>
  modifiedDate?: Maybe<Scalars["DateTime"]>
  cover?: Maybe<Scalars["String"]>
  firstItemId?: Maybe<Scalars["String"]>
  itemCount?: Maybe<Scalars["Int"]>
  privacy?: Maybe<VaildPrivacyEnumType>
  lastActionDate?: Maybe<Scalars["DateTime"]>
  favList?: Maybe<Array<Maybe<FavEntity>>>
  favListCount?: Maybe<Scalars["Int"]>
  views?: Maybe<Scalars["BigInt"]>
}

export enum NotificationType {
  Anime = "anime",
  Manga = "manga",
  App = "app",
  Music = "music",
  User = "user"
}

export type OnlineChanged = {
  __typename?: "OnlineChanged"
  onlineResult: OnlineResult
}

export type OnlineResult = {
  __typename?: "OnlineResult"
  id?: Maybe<Scalars["String"]>
}

export type Overview = {
  __typename?: "Overview"
  anyCard?: Maybe<AnyCard>
  isManga?: Maybe<Scalars["Boolean"]>
  watchState?: Maybe<WatchState>
  pgRelation?: Maybe<PageRelation>
}

export type PageActionResponse = {
  __typename?: "PageActionResponse"
  success?: Maybe<Scalars["Boolean"]>
  error?: Maybe<Scalars["Object"]>
  fields?: Maybe<Scalars["Object"]>
}

export type PageInfo = {
  __typename?: "PageInfo"
  hasNextPage?: Maybe<Scalars["Boolean"]>
  nextPage?: Maybe<Scalars["Int"]>
  prevPage?: Maybe<Scalars["Int"]>
  total?: Maybe<Scalars["Int"]>
  offset?: Maybe<Scalars["Int"]>
  limit?: Maybe<Scalars["Int"]>
  totalPages?: Maybe<Scalars["Int"]>
  page?: Maybe<Scalars["Int"]>
  hasPrevPage?: Maybe<Scalars["Boolean"]>
}

export type PageInput = {
  showId: Scalars["String"]
  episodeId?: Maybe<Scalars["String"]>
  isManga?: Maybe<Scalars["Boolean"]>
  translationType?: Maybe<VaildTranslationTypeEnumType>
}

export type PageRelation = {
  __typename?: "PageRelation"
  _id?: Maybe<Scalars["String"]>
  format?: Maybe<VaildPageRelationFormatEnumType>
  showId?: Maybe<Scalars["String"]>
  userId?: Maybe<Scalars["String"]>
  episodeIdNum?: Maybe<Scalars["Float"]>
  language?: Maybe<Scalars["String"]>
  views?: Maybe<Scalars["Object"]>
  like?: Maybe<Scalars["DateTime"]>
  dislike?: Maybe<Scalars["DateTime"]>
  uScore?: Maybe<Scalars["Object"]>
  lastActivity?: Maybe<Scalars["Object"]>
  spFields?: Maybe<Scalars["Object"]>
  isAdult?: Maybe<Scalars["Boolean"]>
  comment?: Maybe<Scalars["Object"]>
  relatedItem?: Maybe<Scalars["Object"]>
  user?: Maybe<UserDisplay>
}

export type PageRelationLikes = {
  __typename?: "PageRelationLikes"
  _id?: Maybe<Scalars["String"]>
  format?: Maybe<VaildPageRelationLikesFormatEnumType>
  showId?: Maybe<Scalars["String"]>
  userId?: Maybe<Scalars["String"]>
  like?: Maybe<Scalars["DateTime"]>
  dislike?: Maybe<Scalars["DateTime"]>
}

export type PageRelationLikesResponse = {
  __typename?: "PageRelationLikesResponse"
  myLikes?: Maybe<Array<Maybe<PageRelationLikes>>>
}

export type PageRelationResponse = {
  __typename?: "PageRelationResponse"
  myPage?: Maybe<PageRelation>
}

export type PageStatus = {
  __typename?: "PageStatus"
  _id?: Maybe<Scalars["String"]>
  showId?: Maybe<Scalars["String"]>
  episodeId?: Maybe<Scalars["String"]>
  thumbnail?: Maybe<Scalars["String"]>
  notes?: Maybe<Scalars["String"]>
  description?: Maybe<Scalars["String"]>
  translationType?: Maybe<Scalars["String"]>
  rangeViews?: Maybe<Scalars["BigInt"]>
  isManga?: Maybe<Scalars["Boolean"]>
  lastUpdateStart?: Maybe<Scalars["DateTime"]>
  lastUpdateEnd?: Maybe<Scalars["DateTime"]>
  pageId?: Maybe<Scalars["String"]>
  isAdult?: Maybe<Scalars["Boolean"]>
  reports?: Maybe<Array<Report>>
  views?: Maybe<Scalars["BigInt"]>
  likesCount?: Maybe<Scalars["BigInt"]>
  commentCount?: Maybe<Scalars["BigInt"]>
  dislikesCount?: Maybe<Scalars["BigInt"]>
  userScoreCount?: Maybe<Scalars["BigInt"]>
  reviewCount?: Maybe<Scalars["BigInt"]>
  userScoreTotalValue?: Maybe<Scalars["Float"]>
  userScoreAverValue?: Maybe<Scalars["Float"]>
  viewers?: Maybe<ValidViewers>
  pgRelation?: Maybe<PageRelation>
}

export type Playlist = {
  __typename?: "Playlist"
  _id?: Maybe<Scalars["String"]>
  format?: Maybe<VaildPlaylistEnumType>
  userId?: Maybe<Scalars["String"]>
  userName?: Maybe<Scalars["String"]>
  userAvatar?: Maybe<Scalars["String"]>
  user?: Maybe<UserDisplay>
  title?: Maybe<Scalars["String"]>
  createdDate?: Maybe<Scalars["DateTime"]>
  modifiedDate?: Maybe<Scalars["DateTime"]>
  cover?: Maybe<Scalars["String"]>
  firstItemId?: Maybe<Scalars["String"]>
  itemCount?: Maybe<Scalars["Int"]>
  privacy?: Maybe<VaildPrivacyEnumType>
  lastActionDate?: Maybe<Scalars["DateTime"]>
  favList?: Maybe<Array<Maybe<FavEntity>>>
  favListCount?: Maybe<Scalars["Int"]>
  views?: Maybe<Scalars["BigInt"]>
}

export type PlaylistActionResponse = {
  __typename?: "PlaylistActionResponse"
  success?: Maybe<Scalars["Boolean"]>
  playlist?: Maybe<Playlist>
  error?: Maybe<Error>
}

export type PlaylistResponse = {
  __typename?: "PlaylistResponse"
  edges?: Maybe<Array<Playlist>>
  pageInfo?: Maybe<PageInfo>
}

export type Query = {
  __typename?: "Query"
  twoFactorSecret?: Maybe<TwoFactorSecretKey>
  getUser?: Maybe<User>
  fastSearch: SearchResult
  shows: ShowsConnection
  show?: Maybe<Show>
  showsWithIds?: Maybe<Array<Maybe<Show>>>
  showsWithPlaylistId?: Maybe<ShowsConnection>
  mangas: MangasConnection
  manga?: Maybe<Manga>
  mangasWithIds?: Maybe<Array<Maybe<Manga>>>
  mangasWithPlaylistId?: Maybe<MangasConnection>
  episodes: EpisodesConnection
  episode?: Maybe<Episode>
  episodeInfos?: Maybe<Array<Maybe<EpisodeInfo>>>
  chaptersForRead?: Maybe<ChaptersConnection>
  chapterPages?: Maybe<ChaptersConnection>
  chapter?: Maybe<Chapter>
  charactersWithAnilistId?: Maybe<Character>
  stuffs?: Maybe<Array<Maybe<Stuff>>>
  musics: MusicsConnection
  music?: Maybe<Music>
  musicsWithPlaylistId?: Maybe<MusicsConnection>
  queryPopularMusic?: Maybe<MusicsConnection>
  queryMusicRecommendation?: Maybe<MusicsConnection>
  playlistWithId?: Maybe<Playlist>
  playlists?: Maybe<PlaylistResponse>
  myPlaylists?: Maybe<MyOwnPlaylistResponse>
  relatedPlaylistsWithPlayId?: Maybe<PlaylistResponse>
  userPlaylists?: Maybe<PlaylistResponse>
  queryPageStatusForShowManga?: Maybe<PageStatus>
  queryRecommendation?: Maybe<RecommendationsResponse>
  queryPopular?: Maybe<RecommendationsResponse>
  queryLatestPageStatus?: Maybe<RecommendationsResponse>
  queryPageForIndependentDoc?: Maybe<PageRelationResponse>
  queryCommentLikes?: Maybe<PageRelationLikesResponse>
  queryComments?: Maybe<CommentResponse>
  queryReviews?: Maybe<ReviewResponse>
  queryUserReviews?: Maybe<ReviewResponse>
  queryUserComments?: Maybe<CommentResponse>
  queryUserActivities?: Maybe<ActivityResponse>
  queryRandomRecommendation?: Maybe<Array<Maybe<AnyCard>>>
  testFcm?: Maybe<Scalars["String"]>
  watchState?: Maybe<WatchState>
  watchingList?: Maybe<WatchListResponse>
  users?: Maybe<UsersConnection>
  user?: Maybe<UserDisplay>
  queryTags: TagsConnection
  queryListForTag?: Maybe<TagListRecommendationsResponse>
  appsAccessbility: Scalars["String"]
  appParams: Scalars["String"]
}

export type QueryFastSearchArgs = {
  search: SearchInput
}

export type QueryShowsArgs = {
  search?: Maybe<SearchInput>
  page?: Maybe<Scalars["Int"]>
  offset?: Maybe<Scalars["Int"]>
  limit?: Maybe<Scalars["Int"]>
  translationType?: Maybe<VaildTranslationTypeEnumType>
  countryOrigin?: Maybe<VaildCountryOriginEnumType>
  queryAt?: Maybe<Scalars["String"]>
}

export type QueryShowArgs = {
  _id: Scalars["String"]
  queryAt?: Maybe<Scalars["String"]>
}

export type QueryShowsWithIdsArgs = {
  ids: Array<Scalars["String"]>
}

export type QueryShowsWithPlaylistIdArgs = {
  playlistId: Scalars["String"]
  page?: Maybe<Scalars["Int"]>
  offset?: Maybe<Scalars["Int"]>
  limit?: Maybe<Scalars["Int"]>
  visitor?: Maybe<Scalars["Int"]>
  queryAt?: Maybe<Scalars["String"]>
}

export type QueryMangasArgs = {
  search?: Maybe<SearchInput>
  page?: Maybe<Scalars["Int"]>
  offset?: Maybe<Scalars["Int"]>
  limit?: Maybe<Scalars["Int"]>
  translationType?: Maybe<VaildTranslationTypeMangaEnumType>
  countryOrigin?: Maybe<VaildCountryOriginEnumType>
  format?: Maybe<VaildMangaFormatEnumType>
}

export type QueryMangaArgs = {
  _id: Scalars["String"]
}

export type QueryMangasWithIdsArgs = {
  ids: Array<Scalars["String"]>
}

export type QueryMangasWithPlaylistIdArgs = {
  playlistId: Scalars["String"]
  page?: Maybe<Scalars["Int"]>
  offset?: Maybe<Scalars["Int"]>
  limit?: Maybe<Scalars["Int"]>
  visitor?: Maybe<Scalars["Int"]>
}

export type QueryEpisodesArgs = {
  showId?: Maybe<Scalars["String"]>
  translationType?: Maybe<VaildTranslationTypeEnumType>
  episodeNumStart?: Maybe<Scalars["Int"]>
  episodeNumEnd?: Maybe<Scalars["Int"]>
}

export type QueryEpisodeArgs = {
  showId: Scalars["String"]
  episodeString: Scalars["String"]
  translationType: VaildTranslationTypeEnumType
  queryAt?: Maybe<Scalars["String"]>
}

export type QueryEpisodeInfosArgs = {
  showId: Scalars["String"]
  episodeNumStart: Scalars["Float"]
  episodeNumEnd: Scalars["Float"]
  queryAt?: Maybe<Scalars["String"]>
}

export type QueryChaptersForReadArgs = {
  mangaId: Scalars["String"]
  translationType: VaildTranslationTypeMangaEnumType
  chapterString: Scalars["String"]
  page?: Maybe<Scalars["Int"]>
  limit?: Maybe<Scalars["Int"]>
  offset?: Maybe<Scalars["Int"]>
  queryAt?: Maybe<Scalars["String"]>
}

export type QueryChapterPagesArgs = {
  mangaId: Scalars["String"]
  translationType: VaildTranslationTypeMangaEnumType
  chapterString: Scalars["String"]
  page?: Maybe<Scalars["Int"]>
  limit?: Maybe<Scalars["Int"]>
  offset?: Maybe<Scalars["Int"]>
  queryAt?: Maybe<Scalars["String"]>
}

export type QueryChapterArgs = {
  mangaId: Scalars["String"]
  chapterString: Scalars["String"]
  translationType: VaildTranslationTypeMangaEnumType
  queryAt?: Maybe<Scalars["String"]>
}

export type QueryCharactersWithAnilistIdArgs = {
  aniListId: Scalars["Int"]
}

export type QueryStuffsArgs = {
  staffAniListIds: Array<Scalars["Int"]>
  pageNo?: Maybe<Scalars["Int"]>
  limit?: Maybe<Scalars["Int"]>
  offset?: Maybe<Scalars["Int"]>
}

export type QueryMusicsArgs = {
  search?: Maybe<MusicSearchInput>
  page?: Maybe<Scalars["Int"]>
  offset?: Maybe<Scalars["Int"]>
  limit?: Maybe<Scalars["Int"]>
}

export type QueryMusicArgs = {
  _id?: Maybe<Scalars["String"]>
}

export type QueryMusicsWithPlaylistIdArgs = {
  playlistId: Scalars["String"]
  page?: Maybe<Scalars["Int"]>
  offset?: Maybe<Scalars["Int"]>
  limit?: Maybe<Scalars["Int"]>
  visitor?: Maybe<Scalars["Int"]>
}

export type QueryQueryPopularMusicArgs = {
  size: Scalars["Int"]
  dateRange?: Maybe<Scalars["Int"]>
  page?: Maybe<Scalars["Int"]>
}

export type QueryQueryMusicRecommendationArgs = {
  size?: Maybe<Scalars["Int"]>
  page?: Maybe<Scalars["Int"]>
}

export type QueryPlaylistWithIdArgs = {
  playlistId: Scalars["String"]
  userId?: Maybe<Scalars["String"]>
}

export type QueryPlaylistsArgs = {
  format: VaildPlaylistEnumType
  forSelf?: Maybe<Scalars["Boolean"]>
  userId?: Maybe<Scalars["String"]>
  page?: Maybe<Scalars["Int"]>
  offset?: Maybe<Scalars["Int"]>
  limit?: Maybe<Scalars["Int"]>
  favList?: Maybe<Scalars["Int"]>
}

export type QueryMyPlaylistsArgs = {
  search?: Maybe<UserPlaylistsSearch>
  favList?: Maybe<Scalars["Int"]>
}

export type QueryRelatedPlaylistsWithPlayIdArgs = {
  format: VaildPlaylistEnumType
  userId?: Maybe<Scalars["String"]>
  page?: Maybe<Scalars["Int"]>
  offset?: Maybe<Scalars["Int"]>
  limit?: Maybe<Scalars["Int"]>
  playId: Scalars["String"]
}

export type QueryUserPlaylistsArgs = {
  search?: Maybe<UserPlaylistsSearch>
}

export type QueryQueryPageStatusForShowMangaArgs = {
  page: PageInput
  userId?: Maybe<Scalars["String"]>
  nameOnlyString: Scalars["String"]
}

export type QueryQueryRecommendationArgs = {
  pageSearch: QueryPageInput
}

export type QueryQueryPopularArgs = {
  type: VaildPopularTypeEnumType
  size: Scalars["Int"]
  dateRange?: Maybe<Scalars["Int"]>
  isAdult?: Maybe<Scalars["Boolean"]>
  page?: Maybe<Scalars["Int"]>
  allowAdult?: Maybe<Scalars["Boolean"]>
  allowUnknown?: Maybe<Scalars["Boolean"]>
  denyEcchi?: Maybe<Scalars["Boolean"]>
}

export type QueryQueryLatestPageStatusArgs = {
  pageSearch: QueryPageInput
}

export type QueryQueryPageForIndependentDocArgs = {
  _id: Scalars["String"]
  type: Scalars["String"]
  otherFields?: Maybe<Scalars["Object"]>
}

export type QueryQueryCommentLikesArgs = {
  showId: Scalars["String"]
  format: Scalars["String"]
}

export type QueryQueryCommentsArgs = {
  search: CommentsSearch
}

export type QueryQueryReviewsArgs = {
  search: ReviewsSearch
}

export type QueryQueryUserReviewsArgs = {
  search: UserReviewsSearch
}

export type QueryQueryUserCommentsArgs = {
  search: UserCommentsSearch
}

export type QueryQueryUserActivitiesArgs = {
  search: UserActivitiesSearch
}

export type QueryQueryRandomRecommendationArgs = {
  format: Scalars["String"]
  allowAdult?: Maybe<Scalars["Boolean"]>
  translationType?: Maybe<Scalars["String"]>
  denyEcchi?: Maybe<Scalars["Boolean"]>
}

export type QueryTestFcmArgs = {
  msg?: Maybe<Scalars["String"]>
}

export type QueryWatchStateArgs = {
  showId: Scalars["String"]
  isManga: Scalars["Boolean"]
  userId?: Maybe<Scalars["String"]>
}

export type QueryWatchingListArgs = {
  cardType?: Maybe<VaildWatchingCardTypeEnumType>
  type: VaildWatchingEnumType
  userId: Scalars["String"]
  forSelf?: Maybe<Scalars["Boolean"]>
  pageNo?: Maybe<Scalars["Int"]>
  limit: Scalars["Int"]
  sortBy?: Maybe<SortByWatchState>
  sortDirection?: Maybe<Scalars["Int"]>
  translationType?: Maybe<VaildTranslationTypeEnumType>
}

export type QueryUsersArgs = {
  search?: Maybe<UserListInput>
  page?: Maybe<Scalars["Int"]>
  limit?: Maybe<Scalars["Int"]>
}

export type QueryUserArgs = {
  _id: Scalars["ID"]
}

export type QueryQueryTagsArgs = {
  search?: Maybe<TagSearchInput>
  page?: Maybe<Scalars["Int"]>
  offset?: Maybe<Scalars["Int"]>
  limit?: Maybe<Scalars["Int"]>
}

export type QueryQueryListForTagArgs = {
  search: ListForTagInput
}

export type QueryPageInput = {
  type: VaildPopularTypeEnumType
  allowSameShow?: Maybe<Scalars["Boolean"]>
  excludedShowIds?: Maybe<Array<Scalars["String"]>>
  showId?: Maybe<Scalars["String"]>
  episodeId?: Maybe<Scalars["String"]>
  size?: Maybe<Scalars["Int"]>
  page?: Maybe<Scalars["Int"]>
  translationType?: Maybe<VaildTranslationTypeEnumType>
  userId?: Maybe<Scalars["String"]>
  isAdult?: Maybe<Scalars["Boolean"]>
  allowAdult?: Maybe<Scalars["Boolean"]>
  denyEcchi?: Maybe<Scalars["Boolean"]>
  allowUnknown?: Maybe<Scalars["Boolean"]>
  dateAgo?: Maybe<Scalars["Int"]>
  pageId?: Maybe<Scalars["String"]>
  pageType?: Maybe<VaildRecommendationEnumType>
}

export type Recommendation = {
  __typename?: "Recommendation"
  pageStatus: PageStatus
  anyCard?: Maybe<AnyCard>
  isManga?: Maybe<Scalars["Boolean"]>
}

export type RecommendationsResponse = {
  __typename?: "RecommendationsResponse"
  total?: Maybe<Scalars["Int"]>
  recommendations?: Maybe<Array<Recommendation>>
}

export type Report = {
  __typename?: "Report"
  problem?: Maybe<Scalars["String"]>
  email?: Maybe<Email>
  describing?: Maybe<Scalars["String"]>
  userId?: Maybe<Scalars["String"]>
  date?: Maybe<Scalars["DateTime"]>
}

export type ReportBody = {
  problem: Scalars["String"]
  email?: Maybe<Scalars["String"]>
  describing?: Maybe<Scalars["String"]>
  userId?: Maybe<Scalars["String"]>
  date?: Maybe<Scalars["DateTime"]>
}

export type Review = {
  __typename?: "Review"
  _id?: Maybe<Scalars["String"]>
  comment?: Maybe<Scalars["Object"]>
  uScore?: Maybe<Scalars["Object"]>
  user?: Maybe<UserDisplay>
  userId?: Maybe<Scalars["String"]>
  showId?: Maybe<Scalars["String"]>
  episodeIdNum?: Maybe<Scalars["Float"]>
  language?: Maybe<Scalars["String"]>
  myLike?: Maybe<PageRelationLikes>
  views?: Maybe<Scalars["Object"]>
  format?: Maybe<Scalars["String"]>
  relatedItem?: Maybe<Scalars["Object"]>
}

export type ReviewResponse = {
  __typename?: "ReviewResponse"
  edges?: Maybe<Array<Maybe<Review>>>
  pageInfo?: Maybe<PageInfo>
}

export type ReviewsSearch = {
  sortBy?: Maybe<SortBy>
  format: VaildPageRelationFormatEnumType
  allowSameShow?: Maybe<Scalars["Boolean"]>
  showId?: Maybe<Scalars["String"]>
  episodeId?: Maybe<Scalars["String"]>
  size?: Maybe<Scalars["Int"]>
  page?: Maybe<Scalars["Int"]>
  translationType?: Maybe<VaildTranslationTypeEnumType>
  userId?: Maybe<Scalars["String"]>
}

export type ScoreUser = {
  __typename?: "ScoreUser"
  userId?: Maybe<Scalars["String"]>
  scoreValue?: Maybe<Scalars["Float"]>
  scoreDate?: Maybe<Scalars["DateTime"]>
  comments?: Maybe<Scalars["String"]>
}

export type SearchInput = {
  dateRangeStart?: Maybe<Scalars["Int"]>
  dateRangeEnd?: Maybe<Scalars["Int"]>
  sortBy?: Maybe<SortBy>
  sortDirection?: Maybe<SortDirection>
  query?: Maybe<Scalars["String"]>
  isManga?: Maybe<Scalars["Boolean"]>
  types?: Maybe<Array<Maybe<Scalars["String"]>>>
  excludeTypes?: Maybe<Array<Maybe<Scalars["String"]>>>
  includeTypes?: Maybe<Scalars["Boolean"]>
  genres?: Maybe<Array<Maybe<Scalars["String"]>>>
  excludeGenres?: Maybe<Array<Maybe<Scalars["String"]>>>
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>
  excludeTags?: Maybe<Array<Maybe<Scalars["String"]>>>
  authors?: Maybe<Array<Maybe<Scalars["String"]>>>
  studios?: Maybe<Array<Maybe<Scalars["String"]>>>
  magazine?: Maybe<Scalars["String"]>
  includeGenres?: Maybe<Scalars["Boolean"]>
  season?: Maybe<VaildSeasonsEnumType>
  year?: Maybe<Scalars["Int"]>
  allowAdult?: Maybe<Scalars["Boolean"]>
  allowUnknown?: Maybe<Scalars["Boolean"]>
  denyEcchi?: Maybe<Scalars["Boolean"]>
  epRangeStart?: Maybe<Scalars["Int"]>
  epRangeEnd?: Maybe<Scalars["Int"]>
}

export type SearchResult = {
  __typename?: "SearchResult"
  anyCards?: Maybe<Array<Maybe<AnyCard>>>
}

export type Show = {
  __typename?: "Show"
  _id?: Maybe<Scalars["String"]>
  updateQueue?: Maybe<Scalars["BigInt"]>
  isAdult?: Maybe<Scalars["Boolean"]>
  manualUpdated?: Maybe<Scalars["Boolean"]>
  dailyUpdateNeeded?: Maybe<Scalars["Boolean"]>
  hidden?: Maybe<Scalars["Boolean"]>
  lastUpdateStart?: Maybe<Scalars["DateTime"]>
  lastUpdateEnd?: Maybe<Scalars["DateTime"]>
  name?: Maybe<Scalars["String"]>
  englishName?: Maybe<Scalars["String"]>
  nativeName?: Maybe<Scalars["String"]>
  nameOnlyString?: Maybe<Scalars["String"]>
  countryOfOrigin?: Maybe<VaildCountryOriginEnumType>
  malId?: Maybe<Scalars["BigInt"]>
  aniListId?: Maybe<Scalars["BigInt"]>
  status?: Maybe<Scalars["String"]>
  altNames?: Maybe<Array<Maybe<Scalars["String"]>>>
  trustedAltNames?: Maybe<Array<Maybe<Scalars["String"]>>>
  description?: Maybe<Scalars["String"]>
  prevideos?: Maybe<Array<Maybe<Scalars["String"]>>>
  thumbnail?: Maybe<Scalars["String"]>
  banner?: Maybe<Scalars["String"]>
  thumbnails?: Maybe<Array<Maybe<Scalars["String"]>>>
  musics?: Maybe<Array<Maybe<Scalars["Object"]>>>
  score?: Maybe<Scalars["Float"]>
  type?: Maybe<Scalars["String"]>
  averageScore?: Maybe<Scalars["Float"]>
  genres?: Maybe<Array<Maybe<Scalars["String"]>>>
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>
  popularity?: Maybe<Scalars["BigInt"]>
  airedStart?: Maybe<Scalars["Object"]>
  airedEnd?: Maybe<Scalars["Object"]>
  season?: Maybe<Scalars["Object"]>
  rating?: Maybe<Scalars["String"]>
  broadcastInterval?: Maybe<Scalars["BigInt"]>
  relatedShows?: Maybe<Array<Maybe<Scalars["Object"]>>>
  relatedMangas?: Maybe<Array<Maybe<Scalars["Object"]>>>
  characters?: Maybe<Array<Maybe<Scalars["Object"]>>>
  pageStatus?: Maybe<PageStatus>
  determinedInterval?: Maybe<Scalars["Object"]>
  slugTime?: Maybe<Scalars["BigInt"]>
  episodeCount?: Maybe<Scalars["BigInt"]>
  episodeDuration?: Maybe<Scalars["BigInt"]>
  studios?: Maybe<Array<Maybe<Scalars["String"]>>>
  nextAiringEpisode?: Maybe<Scalars["Object"]>
  lastEpisodeDate?: Maybe<Scalars["Object"]>
  lastEpisodeTimestamp?: Maybe<Scalars["Object"]>
  lastEpisodeInfo?: Maybe<Scalars["Object"]>
  availableEpisodes?: Maybe<Scalars["Object"]>
  availableEpisodesDetail?: Maybe<Scalars["Object"]>
  disqusIds?: Maybe<Scalars["Object"]>
}

export type ShowForMusic = {
  __typename?: "ShowForMusic"
  showId?: Maybe<Scalars["String"]>
  name?: Maybe<Scalars["String"]>
  nativeName?: Maybe<Scalars["String"]>
  thumbnail?: Maybe<Scalars["String"]>
}

export type ShowsConnection = {
  __typename?: "ShowsConnection"
  edges?: Maybe<Array<Show>>
  pageInfo: PageInfo
}

export enum SortBy {
  LatestUpdate = "Latest_Update",
  Type = "Type",
  NameAsc = "Name_ASC",
  NameDesc = "Name_DESC",
  Recent = "Recent",
  Top = "Top",
  Popular = "Popular",
  List = "List",
  Random = "Random",
  Recommendation = "Recommendation",
  Trending = "Trending"
}

export enum SortByPlaylists {
  Views = "views",
  FavListCount = "favListCount",
  CreatedDate = "createdDate",
  LastActionDate = "lastActionDate",
  ItemCount = "itemCount"
}

export enum SortByWatchState {
  UploadTime = "UPLOAD_TIME",
  AddedDate = "ADDED_DATE"
}

export enum SortDirection {
  Asc = "ASC",
  Dsc = "DSC"
}

export type Stuff = {
  __typename?: "Stuff"
  _id?: Maybe<Scalars["String"]>
  aniListId?: Maybe<Scalars["Int"]>
  lastUpdateStart?: Maybe<Scalars["DateTime"]>
  lastUpdateEnd?: Maybe<Scalars["DateTime"]>
  name?: Maybe<Scalars["Object"]>
  image?: Maybe<Scalars["Object"]>
  description?: Maybe<Scalars["String"]>
  voiceActingShows?: Maybe<ShowsConnection>
}

export type Subscription = {
  __typename?: "Subscription"
  _?: Maybe<Scalars["Boolean"]>
  newEpisodeAdded?: Maybe<Message>
  userOnlineStatusChanged?: Maybe<UserOnlineStatics>
}

export type SubscriptionNewEpisodeAddedArgs = {
  notificationLevel?: Maybe<Array<Maybe<NotificationType>>>
}

export type SubscriptionUserOnlineStatusChangedArgs = {
  routers?: Maybe<Array<Maybe<Scalars["String"]>>>
}

export type SuccessResponse = {
  __typename?: "SuccessResponse"
  error?: Maybe<Scalars["String"]>
  success?: Maybe<Scalars["Boolean"]>
}

export type Tag = {
  __typename?: "Tag"
  _id?: Maybe<Scalars["String"]>
  name?: Maybe<Scalars["String"]>
  anime?: Maybe<Scalars["Int"]>
  manga?: Maybe<Scalars["Int"]>
  episode?: Maybe<Scalars["Int"]>
  chapter?: Maybe<Scalars["Int"]>
  other?: Maybe<Scalars["Int"]>
  sampleAnime?: Maybe<Scalars["Object"]>
  animeCount?: Maybe<Scalars["Int"]>
  mangaCount?: Maybe<Scalars["Int"]>
  sampleManga?: Maybe<Scalars["Object"]>
  tagType?: Maybe<Scalars["String"]>
  slug?: Maybe<Scalars["String"]>
  views?: Maybe<Scalars["Int"]>
  viewers?: Maybe<Array<Maybe<Viewer>>>
  likesCount?: Maybe<Scalars["Int"]>
  likes?: Maybe<Array<Maybe<Scalars["String"]>>>
  dislikesCount?: Maybe<Scalars["Int"]>
  dislikes?: Maybe<Array<Maybe<Scalars["String"]>>>
}

export type TagListRecommendationsResponse = {
  __typename?: "TagListRecommendationsResponse"
  edges?: Maybe<Array<Maybe<AnyCard>>>
  pageInfo?: Maybe<PageInfo>
}

export type TagsConnection = {
  __typename?: "TagsConnection"
  edges?: Maybe<Array<Tag>>
  pageInfo: PageInfo
}

export type TagSearchInput = {
  sortBy?: Maybe<SortBy>
  sortDirection?: Maybe<SortDirection>
  query?: Maybe<Scalars["String"]>
  format?: Maybe<Scalars["String"]>
  tagType?: Maybe<Scalars["String"]>
  queryType?: Maybe<TagSearchType>
  allowAdult?: Maybe<Scalars["Boolean"]>
  allowUnknown?: Maybe<Scalars["Boolean"]>
  denyEcchi?: Maybe<Scalars["Boolean"]>
}

export enum TagSearchType {
  Popular = "Popular",
  Home = "Home",
  Trending = "Trending",
  Default = "Default"
}

export enum TagType {
  Generic = "generic",
  Studio = "studio",
  Magazine = "magazine",
  Author = "author",
  Random = "random",
  RecentUpdates = "recentUpdates",
  NewSeason = "newSeason",
  Upcoming = "upcoming",
  Movie = "movie"
}

export type Token = {
  __typename?: "Token"
  token: Scalars["String"]
}

export type Tokens = {
  __typename?: "Tokens"
  refreshToken?: Maybe<Scalars["String"]>
  accessToken?: Maybe<Scalars["String"]>
}

export type TwoFactorSecretKey = {
  __typename?: "TwoFactorSecretKey"
  ascii?: Maybe<Scalars["String"]>
  base32?: Maybe<Scalars["String"]>
  hex?: Maybe<Scalars["String"]>
  qr_code_ascii?: Maybe<Scalars["String"]>
  qr_code_hex?: Maybe<Scalars["String"]>
  qr_code_base32?: Maybe<Scalars["String"]>
  google_auth_qr?: Maybe<Scalars["String"]>
  otpauth_url?: Maybe<Scalars["String"]>
}

export type TwoFactorSecretKeyInput = {
  ascii?: Maybe<Scalars["String"]>
  base32?: Maybe<Scalars["String"]>
  hex?: Maybe<Scalars["String"]>
  qr_code_ascii?: Maybe<Scalars["String"]>
  qr_code_hex?: Maybe<Scalars["String"]>
  qr_code_base32?: Maybe<Scalars["String"]>
  google_auth_qr?: Maybe<Scalars["String"]>
  otpauth_url?: Maybe<Scalars["String"]>
}

export type User = {
  __typename?: "User"
  id: Scalars["ID"]
  emails?: Maybe<Array<EmailRecord>>
  username?: Maybe<Scalars["String"]>
  _id?: Maybe<Scalars["String"]>
  displayName?: Maybe<Scalars["String"]>
  password?: Maybe<Scalars["String"]>
  roles?: Maybe<Array<Scalars["String"]>>
  heartbeat?: Maybe<Scalars["DateTime"]>
  hideMe?: Maybe<Scalars["Boolean"]>
  status?: Maybe<UserStatus>
  registered_emails?: Maybe<Array<Maybe<Email>>>
  createdAt?: Maybe<Scalars["DateTime"]>
  picture?: Maybe<Scalars["String"]>
  coverImg?: Maybe<Scalars["String"]>
  description?: Maybe<Scalars["String"]>
  brief?: Maybe<Scalars["String"]>
  badges?: Maybe<Array<Maybe<Scalars["Object"]>>>
  statistics?: Maybe<Scalars["Object"]>
  views?: Maybe<Scalars["BigInt"]>
  likesCount?: Maybe<Scalars["BigInt"]>
  commentCount?: Maybe<Scalars["BigInt"]>
  dislikesCount?: Maybe<Scalars["BigInt"]>
  userScoreCount?: Maybe<Scalars["BigInt"]>
  reviewCount?: Maybe<Scalars["BigInt"]>
  userScoreTotalValue?: Maybe<Scalars["Float"]>
  userScoreAverValue?: Maybe<Scalars["Float"]>
  viewers?: Maybe<ValidViewers>
  pgRelation?: Maybe<PageRelation>
}

export enum User_List_Sort_Format {
  Anime = "anime",
  Manga = "manga",
  Episodes = "episodes",
  Chapters = "chapters",
  Users = "users",
  Characters = "characters",
  Music = "music",
  Totals = "totals"
}

export type UserActivitiesSearch = {
  sortBy?: Maybe<SortBy>
  formats?: Maybe<Array<Maybe<VaildPageRelationFormatEnumType>>>
  allowSameShow?: Maybe<Scalars["Boolean"]>
  size?: Maybe<Scalars["Int"]>
  page?: Maybe<Scalars["Int"]>
  userId: Scalars["String"]
  activityType?: Maybe<ValidActivityTypeEnumType>
}

export type UserCommentsSearch = {
  format?: Maybe<VaildPageRelationLikesFormatEnumType>
  referenceId?: Maybe<Scalars["String"]>
  userId?: Maybe<Scalars["String"]>
  size?: Maybe<Scalars["Int"]>
  page?: Maybe<Scalars["Int"]>
}

export type UserDisplay = {
  __typename?: "UserDisplay"
  _id?: Maybe<Scalars["String"]>
  displayName?: Maybe<Scalars["String"]>
  roles?: Maybe<Array<Scalars["String"]>>
  hideMe?: Maybe<Scalars["Boolean"]>
  status?: Maybe<UserStatus>
  createdAt?: Maybe<Scalars["DateTime"]>
  picture?: Maybe<Scalars["String"]>
  coverImg?: Maybe<Scalars["String"]>
  description?: Maybe<Scalars["String"]>
  brief?: Maybe<Scalars["String"]>
  badges?: Maybe<Array<Maybe<Scalars["Object"]>>>
  statistics?: Maybe<Scalars["Object"]>
  views?: Maybe<Scalars["BigInt"]>
  likesCount?: Maybe<Scalars["BigInt"]>
  commentCount?: Maybe<Scalars["BigInt"]>
  dislikesCount?: Maybe<Scalars["BigInt"]>
  userScoreCount?: Maybe<Scalars["BigInt"]>
  reviewCount?: Maybe<Scalars["BigInt"]>
  userScoreTotalValue?: Maybe<Scalars["Float"]>
  userScoreAverValue?: Maybe<Scalars["Float"]>
  viewers?: Maybe<ValidViewers>
  pgRelation?: Maybe<PageRelation>
}

export type UserInput = {
  id?: Maybe<Scalars["ID"]>
  email?: Maybe<Scalars["String"]>
  username?: Maybe<Scalars["String"]>
}

export type UserListInput = {
  format?: Maybe<User_List_Sort_Format>
  filter?: Maybe<Scalars["Int"]>
  sort?: Maybe<Vaild_User_Sort_By>
}

export type UserOnlineState = {
  routers?: Maybe<Array<Maybe<Scalars["String"]>>>
}

export type UserOnlineStatics = {
  __typename?: "UserOnlineStatics"
  counts?: Maybe<Scalars["Object"]>
}

export type UserPlaylistsSearch = {
  sortBy?: Maybe<SortByPlaylists>
  formats?: Maybe<Array<Maybe<VaildPlaylistEnumType>>>
  size?: Maybe<Scalars["Int"]>
  page?: Maybe<Scalars["Int"]>
  userId?: Maybe<Scalars["String"]>
}

export type UserProfileInput = {
  displayName?: Maybe<Scalars["String"]>
  hideMe?: Maybe<Scalars["Boolean"]>
  picture?: Maybe<Scalars["String"]>
  coverImg?: Maybe<Scalars["String"]>
  description?: Maybe<Scalars["String"]>
  brief?: Maybe<Scalars["String"]>
}

export type UserReviewsSearch = {
  sortBy?: Maybe<SortBy>
  formats?: Maybe<Array<Maybe<VaildPageRelationFormatEnumType>>>
  allowSameShow?: Maybe<Scalars["Boolean"]>
  size?: Maybe<Scalars["Int"]>
  page?: Maybe<Scalars["Int"]>
  userId?: Maybe<Scalars["String"]>
}

export type UsersConnection = {
  __typename?: "UsersConnection"
  edges?: Maybe<Array<UserDisplay>>
  pageInfo?: Maybe<PageInfo>
}

export type UserScore = {
  scoreValue?: Maybe<Scalars["Float"]>
  comments?: Maybe<Scalars["String"]>
}

export type UserStatus = {
  __typename?: "UserStatus"
  lastlogin?: Maybe<Lastlogin>
  userAgent?: Maybe<Scalars["String"]>
  online?: Maybe<Scalars["Boolean"]>
  page?: Maybe<Scalars["String"]>
  idle?: Maybe<Scalars["Boolean"]>
}

export enum Vaild_User_Sort_By {
  CommentsCount = "commentsCount",
  ReviewsCount = "reviewsCount",
  Liked = "liked",
  Viewed = "viewed",
  ScoresCount = "scoresCount",
  Disliked = "disliked"
}

export enum VaildCommentFormatEnumType {
  Review = "review",
  Post = "post",
  Poll = "poll",
  Others = "others"
}

export enum VaildCountryOriginEnumType {
  All = "ALL",
  Jp = "JP",
  Cn = "CN",
  Kr = "KR",
  Other = "OTHER"
}

export enum VaildMangaFormatEnumType {
  All = "ALL",
  Manga = "MANGA",
  Manhua = "MANHUA",
  Manhwa = "MANHWA"
}

export enum VaildPageRelationFormatEnumType {
  Anime = "anime",
  Manga = "manga",
  Music = "music",
  Episode = "episode",
  Chapter = "chapter",
  Character = "character",
  User = "user",
  Page = "page",
  Others = "others"
}

export enum VaildPageRelationLikesFormatEnumType {
  Review = "review",
  Comment = "comment",
  Post = "post",
  Poll = "poll",
  Others = "others"
}

export enum VaildPlaylistEnumType {
  Anime = "anime",
  Manga = "manga",
  Music = "music",
  Episode = "episode",
  Chapter = "chapter"
}

export enum VaildPopularTypeEnumType {
  Anime = "anime",
  Manga = "manga",
  All = "all"
}

export enum VaildPrivacyEnumType {
  Public = "Public",
  Private = "Private"
}

export enum VaildRecommendationEnumType {
  EpCp = "ep_cp",
  AnimeManga = "anime_manga",
  Music = "music"
}

export enum VaildSeasonsEnumType {
  Winter = "Winter",
  Spring = "Spring",
  Summer = "Summer",
  Fall = "Fall"
}

export enum VaildSerivesEnumType {
  Password = "password",
  Google = "google"
}

export enum VaildStatisticsEnumType {
  Anime = "anime",
  Manga = "manga",
  Music = "music",
  Episodes = "episodes",
  Chapters = "chapters",
  Users = "users",
  Characters = "characters"
}

export enum VaildTranslationTypeEnumType {
  Sub = "sub",
  Dub = "dub",
  Raw = "raw"
}

export enum VaildTranslationTypeMangaEnumType {
  Sub = "sub",
  Raw = "raw"
}

export enum VaildTypesEnumType {
  Tv = "TV",
  Ova = "OVA",
  Movie = "Movie",
  Special = "Special",
  Ona = "ONA"
}

export enum VaildWatchingCardTypeEnumType {
  Anime = "anime",
  Manga = "manga",
  All = "all"
}

export enum VaildWatchingEnumType {
  Watching = "watching",
  Dropped = "dropped",
  Planned = "planned",
  Completed = "completed",
  Held = "held"
}

export enum ValidActionType {
  Edit = "edit",
  Remove = "remove"
}

export enum ValidActivityTypeEnumType {
  Views = "views",
  Like = "like",
  Dislike = "dislike",
  Comment = "comment",
  UScore = "uScore"
}

export enum ValidLikeDislike {
  Like = "like",
  Dislike = "dislike"
}

export type ValidViewers = {
  __typename?: "ValidViewers"
  recViewers?: Maybe<Array<Maybe<Viewer>>>
  firstViewers?: Maybe<Array<Maybe<Viewer>>>
}

export type Viewer = {
  __typename?: "Viewer"
  userId?: Maybe<Scalars["String"]>
  viewCount?: Maybe<Scalars["Int"]>
  lastWatchedDate?: Maybe<Scalars["DateTime"]>
  user?: Maybe<UserDisplay>
}

export type WatchingActionResponse = {
  __typename?: "WatchingActionResponse"
  success?: Maybe<Scalars["Boolean"]>
}

export type WatchingEntity = {
  __typename?: "WatchingEntity"
  userId?: Maybe<Scalars["String"]>
  addedDate?: Maybe<Scalars["DateTime"]>
}

export type WatchListResponse = {
  __typename?: "WatchListResponse"
  edges?: Maybe<Array<Overview>>
  pageInfo: PageInfo
}

export type WatchState = {
  __typename?: "WatchState"
  _id?: Maybe<Scalars["String"]>
  showId?: Maybe<Scalars["String"]>
  watchingCount?: Maybe<Scalars["Int"]>
  droppedCount?: Maybe<Scalars["Int"]>
  completedCount?: Maybe<Scalars["Int"]>
  plannedCount?: Maybe<Scalars["Int"]>
  heldCount?: Maybe<Scalars["Int"]>
  isManga?: Maybe<Scalars["Boolean"]>
  watching?: Maybe<Array<Maybe<WatchingEntity>>>
  dropped?: Maybe<Array<Maybe<WatchingEntity>>>
  planned?: Maybe<Array<Maybe<WatchingEntity>>>
  completed?: Maybe<Array<Maybe<WatchingEntity>>>
  held?: Maybe<Array<Maybe<WatchingEntity>>>
  lastEpisodeTimestamp?: Maybe<Scalars["Object"]>
  showName?: Maybe<Scalars["String"]>
  lastEpisodeInfo?: Maybe<Scalars["Object"]>
}
