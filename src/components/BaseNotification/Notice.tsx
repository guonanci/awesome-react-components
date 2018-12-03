import * as React from 'react'
import classNames from 'classnames'

export interface INoticeProp {
  duration: number,
  onClose: () => any,
  children: any,
  update: boolean,
  closeIcon: React.ReactNode,
}
export default class Notice extends React.Component {
  static defaultProps = {
    onClose () {},
    duration: 1.5,
    style: {
      right: '50%',
    },
  }
  componentDidMount () {
    this.startCloseTimer()
  }
  componentDidUpdate (prevProps) {
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
      this.closeTimer = setTimeout(() => this.close(), this.props.duration * 1000)
    }
  }
  render () {
    const props = this.props
    const componentClass = `${props.prefixCls}-notice`
    const className = {
      [`${componentClass}`]: 1,
      [`${componentClass}-closable`]: props.closable,
      [props.className]: !!props.className,
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
          <a tabIndex="0" onClick={this.close} className={`${componentClass}-close`}>
            {props.closeIcon || <span className={`${componentClass}-close-x`} />}
          </a> : null
        }
      </div>
    )
  }
}
