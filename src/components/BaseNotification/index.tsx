import * as React from 'react'
import * as ReactDOM from 'react-dom'
import classNames from 'classnames'
import { Motion } from 'react-motion'
import { createChainedFunction } from '../utils'
import Notice from './Notice'

let seed = 0
const now = Date.now()

function getUuid() {
  return `arcNotification_${now}_${seed++}`
}
export interface INotificationProps {
  prefixCls: string
  transitionName: string
  animation: string | object
  style: any
  className: string
  maxCount: number
  closeIcon: React.ReactNode
}
export interface INoticeElm {
  key: string
  updateKey: string
  content: React.ReactNode
  onClick: () => any
  onClose: () => any
}
export interface INotificationState {
  notices: INoticeElm[],
}

class Notification extends React.Component<INotificationProps, INotificationState> {
  static defaultProps = {
    prefixCls: 'arc-notification',
    animation: 'fade',
    style: {
      top: 65,
      left: '50%',
    },
  }
  state: INotificationState = {
    notices: [],
  }
  getTransitionName = () => {
    const props = this.props
    let transitionName = props.transitionName
    if (!transitionName && props.animation) {
      transitionName = `${props.prefixCls}-${props.animation}`
    }
    return transitionName
  }

  add = (notice: INoticeElm) => {
    const key = notice.key = notice.key || getUuid()
    const { maxCount } = this.props
    this.setState(state => {
      const { notices } = state
      const noticeInd = notices.map(v => v.key).indexOf(key)
      const updatedNotices = notices.concat()
      if (noticeInd !== -1) {
        updatedNotices.splice(noticeInd, 1, notice)
      } else {
        if (maxCount && notices.length >= maxCount) {
          notice.updateKey = updatedNotices[0].updateKey || updatedNotices[0].key
          updatedNotices.shift()
        }
        updatedNotices.push(notice)
      }
      return {
        notices: updatedNotices,
      }
    })
  }

  remove = (key: string) => {
    this.setState(state => {
      return {
        notices: state.notices.filter(notice => notice.key !== key),
      }
    })
  }

  render() {
    const props = this.props
    const { notices } = this.state
    const noticeNodes = notices.map((notice, i) => {
      const update = Boolean(i === notices.length - 1 && notice.updateKey)
      const key = notice.updateKey ? notice.updateKey : notice.key
      const onClose = createChainedFunction(this.remove.bind(this, notice.key), notice.onClose)
      return (
        <Notice
          prefixCls={props.prefixCls}
          {...notice}
          key={key}
          update={update}
          onClose={onClose}
          onClick={notice.onClick}
          closeIcon={props.closeIcon}
        >
          {notice.content}
        </Notice>
      )
    })
    const className = {
      [props.prefixCls]: 1,
      [props.className]: !!props.className,
    }
    return (
    <Motion style={props.style}>
      {value => <>{noticeNodes}</>}
    </Motion>
    )
  }
}
export default Notification