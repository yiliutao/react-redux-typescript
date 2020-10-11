import * as React from 'react';
import { Steps } from 'antd';

const Step = Steps.Step;

interface StepStruct {
    code: string,
    name: string,
};
interface PropStruct {
    steps: Array<StepStruct>;
    currentIndex: number;
    className?: string;
};
export default class LwSteps extends React.Component<PropStruct, {}>{
    render() {
        let { className, steps = [], currentIndex = 0 } = this.props;
        return <Steps current={currentIndex} className={className}>
            {
                steps.map((step) => {
                    return <Step key={step.code} title={step.name} />
                })
            }
        </Steps>
    }
};