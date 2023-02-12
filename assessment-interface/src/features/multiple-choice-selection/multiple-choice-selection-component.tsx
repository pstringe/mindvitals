import { 
  FormControl, 
  ButtonBase, 
  Checkbox, 
} from "@mui/material";
import { styled } from '@mui/material/styles';
import styles from './multiple-choice-selection.module.css'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';


interface ChoiceProps {
    index: number;
    handleSelection: Function;
    choices: any[];
    answer: number;
    values: Array<boolean>;
}

const ChoiceButton = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  borderRadius: '8px',
  border: '1px solid #e3e3e3',
  backgroundColor: '#fff',
  minHeight: 70,
  color: '#183f4f',
  fontSize: '1.125rem',
  fontWeight: 400,
  padding: '0.75rem 1rem 0.75rem 1.5rem',
  width: '100%',
  textAlign: 'left',
  lineHeight: '150%',
  "&:active": {
      color: '#6D9147'
  }, 
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
    },
  },
  '.MuiButtonBase-root:disabled': {
    cursor: 'not-allowed',
      pointerEvents: 'auto'
    }
}));

export const MultipleChoiceSelection = ({
  choices, 
  handleSelection, 
  index, 
  answer,
  values=[]
}: ChoiceProps) => {
    const selectedStyle = (buttonValue: number, selectedValue: number) => {
        return buttonValue == selectedValue ? 
            { border: '1px solid #6D9147', color: '#6D9147'} : 
            { }
    }

    const ListLayout = () => {
        return (
        <FormControl className={styles.multipleChoiceContainer} sx={{
          width: '100%'
        }}>
          {choices?.map((option, idx) => {
            console.log('option', option)
            return(
                <ChoiceButton
                  key={`assessment${index}${idx}`}
                  sx={selectedStyle(option.pointValue, answer)}
                  onClick={(e) => handleSelection(e, index, option.pointValue)}>
                      <Checkbox checked={values[option.pointValue]}
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleIcon />}
                        sx={{
                          color: '#6D9147',
                          marginRight: '16px',
                          '&.MuiCheckbox-root': {
                            color: '#6D9147',
                          },
                          '&.MuiCheckbox-colorSecondary.Mui-checked': {
                            color: '#6D9147',
                          }
                        }}
                      />
                    {option.choice}
                </ChoiceButton>
              );
          })}
        </FormControl>
        );
    }

    const ListLayoutCheck = () => {
      return (
        <FormControl className={styles.multipleChoiceContainer} sx={{
          width: '100%'
        }}>
          {choices?.map((choice: string, pointValue: number) => {
              return(
                <ChoiceButton
                  key={`${index}${pointValue}`}
                  sx={selectedStyle(pointValue, answer)}
                  onClick={(e) => handleSelection(pointValue)}>
                      <Checkbox checked={values[pointValue]}
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleIcon />}
                        sx={{
                          color: '#6D9147',
                          marginRight: '16px',
                          '&.MuiCheckbox-root': {
                            color: '#6D9147',
                          },
                          '&.MuiCheckbox-colorSecondary.Mui-checked': {
                            color: '#6D9147',
                          }
                        }}
                      />
                    {choice}
                </ChoiceButton>
              );
          })
        }
        </FormControl>
      );
  }

  const getLayout = () => {
    if (index == -2){
      return (<ListLayoutCheck/>)
    }
    return (<ListLayout/>)

  }

  return (getLayout());
}