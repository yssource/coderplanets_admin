import R from 'ramda'

import {
  asyncRes,
  asyncErr,
  $solver,
  ERR,
  makeDebugger,
  EVENT,
  TYPE,
  scrollIntoEle,
  closePreviewer,
  dispatchEvent,
} from '../../utils'

import { PAGE_SIZE } from '../../config'
import S from './schema'
import SR71 from '../../utils/network/sr71'

const sr71$ = new SR71({
  resv_event: [EVENT.LOGOUT, EVENT.LOGIN, EVENT.PREVIEW_CLOSE],
})

/* eslint-disable no-unused-vars */
const debug = makeDebugger('L:CommunitiesContent')
/* eslint-enable no-unused-vars */

let communitiesContent = null

export function loadCommunities(page = 1) {
  const size = PAGE_SIZE.COMMON
  const args = {
    filter: { page, size },
  }
  communitiesContent.markState({
    communitiesLoading: true,
  })
  scrollIntoEle(TYPE.APP_HEADER_ID)
  sr71$.query(S.pagedCommunities, args)
}

export function loadPosts(page = 1) {
  const size = PAGE_SIZE.COMMON
  const args = {
    filter: { page, size },
  }
  scrollIntoEle(TYPE.APP_HEADER_ID)
  communitiesContent.markState({
    postsLoading: true,
  })
  sr71$.query(S.pagedPosts, args)
}

const commonFilter = page => {
  const size = PAGE_SIZE.COMMON
  return {
    filter: { page, size },
  }
}

export function loadCategories(page = 1) {
  scrollIntoEle(TYPE.APP_HEADER_ID)
  communitiesContent.markState({
    categoriessLoading: true,
  })
  sr71$.query(S.pagedCategories, commonFilter(page))
}

export function loadTags(page = 1) {
  scrollIntoEle(TYPE.APP_HEADER_ID)
  communitiesContent.markState({
    tagsLoading: true,
  })
  // TODO: use paged version
  sr71$.query(S.pagedTags, commonFilter(page))
}

export function onEdit(record) {
  debug('onEdit', record)

  dispatchEvent(EVENT.NAV_UPDATE_CATEGORY, {
    type: TYPE.PREVIEW_UPDATE_CATEGORY,
    data: record,
  })
}

export function onDelete(record) {
  sr71$.mutate(S.deleteCommunity, { id: record.id })
}

export function unsetCategory(communityId, category) {
  sr71$.mutate(S.unsetCategory, {
    communityId,
    categoryId: category.id,
  })
}

export function setCategory(communityId, categories) {
  dispatchEvent(EVENT.NAV_SET_CATEGORY, {
    type: TYPE.PREVIEW_SET_CATEGORY,
    data: {
      communityId,
      categories,
    },
  })
}

export function unsetTag(partId, tag) {
  const args = {
    part: R.toUpper(tag.part),
    id: partId,
    tagId: tag.id,
    communityId: tag.community.id,
  }
  sr71$.mutate(S.unsetTag, args)
}

/* when error occured cancle all the loading state */
const cancleLoading = () => {
  communitiesContent.markState({
    communitiesLoading: false,
    postsLoading: false,
    tagsLoading: false,
    categoriessLoading: false,
  })
}

const DataSolver = [
  {
    match: asyncRes('pagedCommunities'),
    action: ({ pagedCommunities }) => {
      cancleLoading()
      communitiesContent.markState({
        pagedCommunities,
      })
    },
  },
  {
    match: asyncRes('pagedTags'),
    action: ({ pagedTags }) => {
      cancleLoading()
      communitiesContent.markState({
        pagedTags,
      })
    },
  },
  {
    match: asyncRes('pagedPosts'),
    action: ({ pagedPosts }) => {
      console.log('pagedPosts --> ', pagedPosts)
      cancleLoading()
      communitiesContent.markState({
        pagedPosts,
      })
    },
  },
  {
    match: asyncRes('pagedCategories'),
    action: ({ pagedCategories }) => {
      cancleLoading()
      communitiesContent.markState({
        pagedCategories,
      })
    },
  },
  {
    match: asyncRes('deleteCommunity'),
    action: () => closePreviewer(TYPE.COMMUNITIES_REFRESH),
  },
  {
    match: asyncRes('unsetCategory'),
    action: () => loadCommunities(),
  },
  {
    match: asyncRes('unsetTag'),
    action: () => loadPosts(),
  },
  {
    match: asyncRes(EVENT.LOGOUT),
    action: () => loadCommunities(),
  },
  {
    match: asyncRes(EVENT.LOGIN),
    action: () => loadCommunities(),
  },
  {
    match: asyncRes(EVENT.PREVIEW_CLOSE),
    action: res => {
      const closeType = res[EVENT.PREVIEW_CLOSE].type
      if (closeType === TYPE.COMMUNITIES_REFRESH) {
        loadCommunities()
      } else if (closeType === TYPE.TAGS_REFRESH) {
        loadTags()
      } else if (closeType === TYPE.GATEGORIES_REFRESH) {
        loadCategories()
      }
    },
  },
]

const ErrSolver = [
  {
    match: asyncErr(ERR.CRAPHQL),
    action: ({ details }) => {
      debug('ERR.CRAPHQL -->', details)
      cancleLoading()
    },
  },
  {
    match: asyncErr(ERR.TIMEOUT),
    action: ({ details }) => {
      debug('ERR.TIMEOUT -->', details)
      cancleLoading()
    },
  },
  {
    match: asyncErr(ERR.NETWORK),
    action: ({ details }) => {
      debug('ERR.NETWORK -->', details)
      cancleLoading()
    },
  },
]

export function init(selectedStore) {
  communitiesContent = selectedStore
  debug(communitiesContent)
  sr71$.data().subscribe($solver(DataSolver, ErrSolver))

  // loadCommunities()
}
