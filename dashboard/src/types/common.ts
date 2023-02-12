import React from 'react'

export type IMenuItem = {
  label: string
  Icon: React.FC
  onClick: Function
}

export type ISeverityType = 'None' | 'Minimal' | 'Moderate' | 'Severe'

export type IRoute = {
  label: string
  link: string
}
