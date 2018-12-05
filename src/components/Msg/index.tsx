import * as React from 'react'
import BaseNotification from '../BaseNotification'
import { } from 'react-icons'

const defaultDuration = 3
let defaultTop: number
let msgInstance: any
const key = 1
const prefixCls = 'arc-msg'
const transitionName = 'move-up'
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

type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading'

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
  duration: number | null
  type: NoticeType
  onClose?: () => any
  icon?: React.ReactNode
}

function notice(args: IArgsProps): IMsgType {
  const duration = args.duration !== undefined ? args.duration : defaultDuration
  const iconNode = ({
    info:
  })
}