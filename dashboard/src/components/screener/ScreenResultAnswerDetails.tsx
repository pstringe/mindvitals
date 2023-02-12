import { FC } from 'react'
import { Typography } from '@mui/material'
import { styled } from '@mui/system'
import { IScreenResultAnswer } from 'types'

const Root = styled('div')(
  () => `
  :not(:last-of-type) {
    margin-bottom: 24px;
  }

  table {
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    border-collapse: collapse;
    width: 100%;
    margin-top: 8px;
  }

  td,
  th {
    border: 1px solid #E3E3E3;
    text-align: left;
    padding: 6px;
  }`,
)

interface ScreenResultAnswerDetailsProps {
  answer: IScreenResultAnswer
}

export const ScreenResultAnswerDetails: FC<ScreenResultAnswerDetailsProps> = ({
  answer,
}) => {
  return (
    <Root>
      <Typography variant="caption">{answer.type}</Typography>

      <table>
        <tbody>
          {answer.details.map(detail => (
            <tr key={detail.question}>
              <td width={400}>
                <Typography variant="subtitle1">{detail.question}</Typography>
              </td>
              <td>
                <Typography variant="subtitle1">{detail.answer}</Typography>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {answer.type} Score
              </Typography>
            </td>
            <td>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {answer.score} (Total: {answer.details.length * 3})
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    </Root>
  )
}
