import React from 'react';
import styled from 'styled-components';
import { NeueOption, OptionsWrapper, OptionsDivider } from '@onboarding-components';

import { WordCount } from '@recovery-types';
import { Translation } from '@suite-components';

const StyledOption = styled(NeueOption)`
    justify-content: center;
`;

interface Props {
    onSelect: (number: WordCount) => void;
}

const SelectWordCount = ({ onSelect }: Props) => (
    <OptionsWrapper>
        {/* <P size="small">
            <Translation id="TR_RECOVER_SUBHEADING" />
        </P> */}
        <StyledOption
            onClick={() => {
                onSelect(12);
            }}
            heading={<Translation id="TR_WORDS" values={{ count: '12' }} />}
            data-test="@recover/select-count/12"
        />
        <OptionsDivider />
        <StyledOption
            onClick={() => {
                onSelect(18);
            }}
            heading={<Translation id="TR_WORDS" values={{ count: '18' }} />}
            data-test="@recover/select-count/18"
        />
        <OptionsDivider />
        <StyledOption
            onClick={() => {
                onSelect(24);
            }}
            heading={<Translation id="TR_WORDS" values={{ count: '24' }} />}
            data-test="@recover/select-count/24"
        />
    </OptionsWrapper>
);

export default SelectWordCount;
