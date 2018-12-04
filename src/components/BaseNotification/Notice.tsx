import * as React from 'react'
import classNames from 'classnames'

export interface INoticeProp {
  closable: boolean,
  className?: string,
  prefixCls: string,
  duration?: number,
  onClose: () => any,
  onClick: () => any,
  children: any,
  update: boolean,
  closeIcon: React.ReactNode,
  style?: React.CSSProperties,
}
export interface INoticeState {
  closeTimer: number,
}
export default class Notice extends React.Component<INoticeProp, INoticeState> {
  static defaultProps = {
    closable: false,
    onClose() {},
    duration: 1.5,
    style: {
      right: '50%',
    },
  }
  state: INoticeState = {
    closeTimer: 0,
  }
  componentDidMount() {
    this.startCloseTimer()
  }
  componentDidUpdate(prevProps: INoticeProp) {
    if (this.props.duration !== prevProps.duration || this.props.update) {
      this.restartCloseTimer()
    }
  }
  close = () => {
    this.clearCloseTimer()
    this.props.onClose()
  }
  startCloseTimer = () => {
    if (this.props.duration) {
      const closeTimer = setTimeout(() => this.close(), this.props.duration! * 1000)
      // this.setState((state, props) => ({
      //   closeTimer,
      // }))
    }
  }
  clearCloseTimer = () => {
    if (this.state.closeTimer) {
      clearTimeout(this.state.closeTimer)
      // this.setState((state, props) => ({
      //   closeTimer: null
      // }))
    }
  }
  restartCloseTimer = () => {
    this.clearCloseTimer()
    this.startCloseTimer()
  }
  render() {
    const props = this.props
    const componentClass = `${props.prefixCls}-notice`
    const className = {
      [`${componentClass}`]: 1,
      [`${componentClass}-closable`]: props.closable,
      [props.className!]: !!props.className,
    }
    return (
      <div
        className={classNames(className)}
        style={props.style}
        onMouseEnter={this.clearCloseTimer}
        onMouseLeave={this.startCloseTimer}
        onClick={props.onClick}
      >
        <div className={`${componentClass}-content`}>{props.children}</div>
        {props.closable ?
          <a tabIndex={0} onClick={this.close} className={`${componentClass}-close`}>
            {props.closeIcon || <span className={`${componentClass}-close-x`} />}
          </a> : null
        }
      </div>
    )
  }
}
