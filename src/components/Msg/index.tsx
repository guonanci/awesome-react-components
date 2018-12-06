import * as React from 'react'
import BaseNotification from '../BaseNotification'


let defaultDuration = 3
let defaultTop: number
let msgInstance: any
let key = 1
let prefixCls = 'arc-msg'
let transitionName = 'move-up'
let getContainer: () => HTMLElement
let maxCount: number

function getMsgInstance(cb: (i: any) => void) {
  if (msgInstance) {
    cb(msgInstance)
    return
  }
  BaseNotification.newInstance({
    prefixCls,
    transitionName,
    style: { top: defaultTop },
    getContainer,
    maxCount,
  }, (instance: any) => {
    if (msgInstance) {
      cb(msgInstance)
      return
    }
    msgInstance = instance
    cb(instance)
  })
}

type NoticeType = 'info' | 'success' | 'error' | 'warning'

export interface IThenableArg {
  // tslint:disable-next-line
  (_: any): any
}

export interface IMsgType {
  (): void
  then: (fill: IThenableArg, reject: IThenableArg) => Promise<any>
  promise: Promise<any>
}

export interface IArgsProps {
  content: React.ReactNode
  duration: number | undefined
  type: NoticeType
  onClose?: () => any
  icon?: React.ReactNode
}

function notice(args: IArgsProps): IMsgType {
  const duration = args.duration !== undefined ? args.duration : defaultDuration
  const iconType = ({
    info: 'infoCircle',
    success: 'checkCircle',
    warning: 'exclamationCircle',
    error: 'closeCircle',
  })[args.type]

  const target = key++
  const closePromise = new Promise((resolve) => {
    const cb = () => {
      if (typeof args.onClose === 'function') {
        args.onClose()
      }
      return resolve(true)
    }
    getMsgInstance((instance) => {
      const iconNode = <span className={`icon-${iconType}`} />
      instance.notice({
        key: target,
        duration,
        style: {},
        content: (
          <div className={`${prefixCls}=custom-content${args.type ? ` ${prefixCls}-${args.type}` : ''}`}>
            {args.icon ? args.icon : iconType ? iconNode : ''}
          </div>
        ),
        onClose: cb,
      })
    })
  })
  const result: any = () => {
    if (msgInstance) {
      msgInstance.removeNotice(target)
    }
  }
  result.then = (filled: IThenableArg, rejected: IThenableArg) => closePromise.then(filled, rejected)
  result.promise = closePromise
  return result
}

type ConfigContent = React.ReactNode | string
type ConfigDuration = number | (() => void)
export type ConfigOnClose = () => void

export interface IConfigOptions {
  top?: number
  duration?: number
  prefixCls?: string
  getContainer?: () => HTMLElement
  transitionName?: string
  maxCount?: number
}
export interface IApi {
  open: (props: IArgsProps) => IMsgType
  config: (options: IConfigOptions) => any
  destroy: () => any
  [key: string]: any // Add index signature
}
export interface IAPI {
  [key:string]: any
}

const api = {
  open: notice,
  config(options: IConfigOptions) {
    if (options.top !== undefined) {
      defaultTop = options.top
      msgInstance = null
    }
    if (options.duration !== undefined) {
      defaultDuration = options.duration
    }
    if (options.prefixCls !== undefined) {
      prefixCls = options.prefixCls
    }
    if (options.getContainer !== undefined) {
      getContainer = options.getContainer
    }
    if (options.transitionName !== undefined) {
      transitionName = options.transitionName
      msgInstance = null
    }
    if (options.maxCount !== undefined) {
      maxCount = options.maxCount
      msgInstance = null
    }
  },
  destroy() {
    if (msgInstance) {
      msgInstance.destroy()
      msgInstance = null
    }
  },
} as any

['success', 'info', 'warning', 'error'].forEach((type: NoticeType) => {
  api[type] = (content: ConfigContent, duration?: ConfigDuration, onClose?: ConfigOnClose) => {
    if (typeof duration === 'function') {
      onClose = duration
      duration = undefined
    }
    return api.open({ content, duration, type, onClose })
  }
})

api.warn = api.warning

export interface IMsgApi {
  info(content: ConfigContent, duration?: ConfigDuration, onClose?: ConfigOnClose): IMsgType
  success(content: ConfigContent, duration?: ConfigDuration, onClose?: ConfigOnClose): IMsgType
  error(content: ConfigContent, duration?: ConfigDuration, onClose?: ConfigOnClose): IMsgType
  warn(content: ConfigContent, duration?: ConfigDuration, onClose?: ConfigOnClose): IMsgType
  warning(content: ConfigContent, duration?: ConfigDuration, onClose?: ConfigOnClose): IMsgType
  open(args: IArgsProps): IMsgType
  config(options: IConfigOptions): void
  destroy(): void
}

export default api as IMsgApi