import { Question } from "../question/question-component"
import { AssessmentQuestion } from "../../state/interfaces";

interface AgreementProps {
    index: number;
    question: AssessmentQuestion;
    handleSelection?: Function;
    length?: number;
    review?: boolean;
    values: Array<boolean>;
}

export const Agreement = ({
    index, 
    question, 
    handleSelection,
    length,
    review=false,
    values
}: AgreementProps) => {
    return (
        <Question 
            index={index} 
            handleSelection={handleSelection}
            question={question}
            length={length}
            values={values}
        />
    )
}