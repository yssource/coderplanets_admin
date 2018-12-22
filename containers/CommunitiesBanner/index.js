import React from 'react'
import { inject, observer } from 'mobx-react'

import { storePlug, makeDebugger, ROUTE, stripMobx } from '../../utils'

import * as logic from './logic'

import IndexBanner from './IndexBanner'
import EditorsBanner from './EditorsBanner'
import CategoryBanner from './CategoryBanner'
import TagsBanner from './TagsBanner'
import ThreadsBanner from './ThreadsBanner'

import PostsBanner from './PostsBanner'
import JobsBanner from './JobsBanner'

import { BannerContainer } from './styles'

/* eslint-disable no-unused-vars */
const debug = makeDebugger('C:CommunitiesBanner')
/* eslint-enable no-unused-vars */

const ChildBanner = ({
  curRoute,
  totalCount,
  tagsTotalCount,
  categoriesTotalCount,
  threadsTotalCount,
  postsTotalCount,
  restProps,
}) => {
  const {
    // communities
    filteredTotalCount,
    // tags
    filterdTagsCount,
    // threads
    filterdThreadsCount,
    // categories
    filterdCategoriesCount,
    // posts
    filteredPostsCount,
    // jobs
    jobsTotalCount,
    filteredJobsCount,
  } = restProps

  switch (curRoute.subPath) {
    case ROUTE.CATEGORIES: {
      return (
        <CategoryBanner
          totalCount={categoriesTotalCount}
          filteredCount={filterdCategoriesCount}
        />
      )
    }
    case ROUTE.TAGS: {
      return (
        <TagsBanner
          totalCount={tagsTotalCount}
          filteredCount={filterdTagsCount}
        />
      )
    }
    case ROUTE.EDITORS: {
      return <EditorsBanner totalCount={102} filteredCount={10} />
    }
    case ROUTE.THREADS: {
      return (
        <ThreadsBanner
          totalCount={threadsTotalCount}
          filteredCount={filterdThreadsCount}
        />
      )
    }
    case ROUTE.POSTS: {
      return (
        <PostsBanner
          totalCount={postsTotalCount}
          filteredCount={filteredPostsCount}
        />
      )
    }
    case ROUTE.JOBS: {
      return (
        <JobsBanner
          totalCount={jobsTotalCount}
          filteredCount={filteredJobsCount}
        />
      )
    }
    case ROUTE.REPOS: {
      return <h3>REPOS Banner</h3>
    }
    case ROUTE.VIDEOS: {
      return <h3>VIDEOS Banner</h3>
    }
    default: {
      return (
        <IndexBanner
          totalCount={totalCount}
          filteredCount={filteredTotalCount}
        />
      )
    }
  }
}

class CommunitiesBannerContainer extends React.Component {
  componentDidMount() {
    const { communitiesBanner } = this.props
    logic.init(communitiesBanner)
  }

  componentWillUnmount() {
    logic.uninit()
  }

  render() {
    const { communitiesBanner } = this.props
    const {
      curRoute,
      totalCount,
      tagsTotalCount,
      categoriesTotalCount,
      threadsTotalCount,
      postsTotalCount,
    } = communitiesBanner

    return (
      <BannerContainer>
        <ChildBanner
          curRoute={curRoute}
          totalCount={totalCount}
          categoriesTotalCount={categoriesTotalCount}
          threadsTotalCount={threadsTotalCount}
          tagsTotalCount={tagsTotalCount}
          postsTotalCount={postsTotalCount}
          restProps={stripMobx(communitiesBanner)}
        />
      </BannerContainer>
    )
  }
}

export default inject(storePlug('communitiesBanner'))(
  observer(CommunitiesBannerContainer)
)
