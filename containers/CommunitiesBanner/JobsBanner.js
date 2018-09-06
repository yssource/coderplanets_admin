import React from 'react'

import { ICON_CMD } from '../../config'
import { Tag, Popover, BannerCountBrief } from '../../components'

import {
  BannerContentWrapper,
  Operation,
  OperationItem,
  OperationDivider,
  OperationTitle,
  FilterTags,
  OperationIcon,
  OperationIconChart,
} from './styles/common_banner'

import * as logic from './logic'

class JobsBanner extends React.Component {
  componentWillMount() {
    logic.loadJobs()
  }
  render() {
    const { filteredCount, totalCount } = this.props
    return (
      <BannerContentWrapper>
        <BannerCountBrief
          filteredCount={filteredCount}
          totalCount={totalCount}
          thread="招聘贴"
        />
        <Operation>
          <OperationItem>
            <OperationIcon src={`${ICON_CMD}/filter2.svg`} />
            <Popover
              content={<div>兼容各个页面的 Filter 菜单</div>}
              trigger="hover"
            >
              <OperationTitle>过滤</OperationTitle>
            </Popover>
            <FilterTags>
              <Tag closable>最多xx</Tag>
              <Tag closable>最少..</Tag>
            </FilterTags>
          </OperationItem>
          <OperationDivider />
          <OperationItem onClick={logic.onAdd}>
            <OperationIconChart src={`${ICON_CMD}/plus.svg`} />
            添加
          </OperationItem>
          <OperationDivider />
          <OperationItem>
            <OperationIcon src={`${ICON_CMD}/chart.svg`} />
            {/* <OperationIconChart src={`${ICON_CMD}/list.svg`} /> */}
            统计
          </OperationItem>
        </Operation>
      </BannerContentWrapper>
    )
  }
}

export default JobsBanner
