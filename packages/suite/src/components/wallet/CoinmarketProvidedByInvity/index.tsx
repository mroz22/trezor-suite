import React from 'react';
import styled from 'styled-components';
import { Translation } from '@suite-components';
import { resolveStaticPath } from '@suite-utils/build';
import { variables } from '@trezor/components';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    color: ${props => props.theme.TYPE_LIGHT_GREY};
`;

const Image = styled.img`
    width: 70px;
`;

const Link = styled.a`
    display: flex;
    flex: 1;
    padding-top: 1px;
    align-items: center;
`;

const CoinmarketProvidedByInvity = () => (
    <Wrapper>
        <Translation id="TR_BUY_PROVIDED_BY_INVITY" />
        <Link href="https://invity.io/" target="_blank">
            <Image src={resolveStaticPath('/images/svg/invity-logo.svg')} />
        </Link>
    </Wrapper>
);

export default CoinmarketProvidedByInvity;
