import { FC } from 'react'
import { Breadcrumbs as MuiBreadcrumbs, Link } from '@mui/material'
import { IRoute } from 'types'

interface BreadcrumbsProps {
  links: IRoute[]
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ links }) => (
  <MuiBreadcrumbs aria-label="breadcrumb">
    {links.map((link, index) => (
      <Link
        key={link.link}
        color={index === links.length - 1 ? 'text.primary' : 'inherit'}
        href={link.link}
        underline="hover"
      >
        {link.label}
      </Link>
    ))}
  </MuiBreadcrumbs>
)
