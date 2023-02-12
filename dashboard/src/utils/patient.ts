import config from 'utils/config'

import dayjs from 'dayjs'
import { IScreenResult, IScreenResultAnswer, ISeverityType } from 'types'

export const getSeverityType = (answer: IScreenResultAnswer): ISeverityType => {
  switch (answer.type) {
    case 'PHQ-2':
      if (answer.score <= 3) return 'Minimal'
      else if (answer.score <= 6) return 'Moderate'
      else return 'Severe'
    case 'PHQ-9':
      if (answer.score <= 4) return 'Minimal'
      else if (answer.score <= 19) return 'Moderate'
      else return 'Severe'
    case 'GAD-7':
      if (answer.score <= 4) return 'Minimal'
      else if (answer.score <= 14) return 'Moderate'
      else return 'Severe'
    case 'EPDS':
      if (answer.score <= 8) return 'Minimal'
      else if (answer.score <= 30) return 'Moderate'
      else return 'Severe'
  }
}

export const getCategorizationType = (answer: IScreenResultAnswer): string => {
  if (answer.score === 0) {
    return 'None'
  }

  switch (answer.type) {
    case 'PHQ-2':
      if (answer.score <= 3) return 'minimal depression'
      else if (answer.score <= 6) return 'probable depression'
      else return ''
    case 'PHQ-9':
      if (answer.score <= 4) return 'minimal depression'
      else if (answer.score <= 9) return 'mild depression'
      else if (answer.score <= 14) return 'moderate depression'
      else if (answer.score <= 19) return 'moderately severe depression'
      else return 'severe depression'
    case 'GAD-7':
      if (answer.score <= 4) return 'minimal anxiety'
      else if (answer.score <= 9) return 'mild anxiety'
      else if (answer.score <= 14) return 'moderate anxiety'
      else return 'severe anxiety'
    case 'EPDS':
      if (answer.score <= 8) return 'minimal depression'
      else if (answer.score <= 11) return 'possibility of depression'
      else if (answer.score <= 13)
        return 'fairly high possibility of depression'
      else if (answer.score <= 30) return 'probable depression'
      else return 'Severe'
    default:
      return 'None'
  }
}

const getAssessmentLength = (type: string): number => {
  switch (type) {
    case 'PHQ-2':
      return 2 * 3
    case 'PHQ-9':
      return 9 * 3
    case 'GAD-7':
      return 7 * 3
    case 'EPDS':
      return 10 * 3
    default:
      return -1
  }
}

export const handleClickSaveToClipboard = async (result: IScreenResult) => {
  let timestamp = dayjs(result.createdAt).format(
    'MMMM DD, YYYY, HH:mm:ss',
  )
  const name = 'Patient';
  const screener = 'screener';
  const totalScore = getAssessmentLength(result.answers[0].type)
  const answers = result.answers.map(answer => {
    const score = answer.score;
    const prefix = `Patient responded with a score of ${score} out of ${totalScore}`;
    const conjunction = ' on ';
    const screener = answer.type;
    const suggestion = ` suggesting ${getCategorizationType(answer)}`;
    return prefix + conjunction + screener + suggestion + '\n';
  })
  const link = `${config.patientBaseUrl}/results/${result.id}`
  const template = `${name} was administered a ${screener} on ${timestamp}.
    ${answers}
    Link to details: ${link};
  `
  await navigator.clipboard.writeText(template) 
}
