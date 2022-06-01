import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Box } from '@material-ui/core'
import styled from 'styled-components'
import { enableBodyScroll } from 'body-scroll-lock'

import Topbar from './Topbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import ConnectModal from 'components/ConnectModal'

interface Props {
    children?: any;
    open: boolean;
    setOpen: any;
}

const Layout: React.FC<Props> = ({ children, open, setOpen }: any) => {
    const [showWallet, setShowWallet] = useState(false)
    const bodyRef = useRef<any>()

    return (
        <StyledContainer>
            <Topbar />
            <Sidebar />
            <Overlay showwallet={showWallet ? 1 : 0} onClick={() => {
                setShowWallet(false)
                enableBodyScroll(bodyRef.current)
            }} />
            <Body component='main' {...{ ref: bodyRef }}>
                {children}
            </Body>
            <Footer />
            <ConnectModal open={open} setOpen={setOpen} />
        </StyledContainer>
    );
}

const Overlay = styled(Box) <{ showwallet: any; }>`
    position: fixed;
    inset: 0px;
    z-index: 30;
    opacity: ${({ showwallet }) => showwallet ? 1 : 0};
    height: ${({ showwallet }) => showwallet ? 'auto' : '0px'};
    transition: opacity 0.3s ease-in-out 0s;
    background-color: rgba(0, 0, 0, 0.15);
`

const StyledContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    min-height: 100%;
`

const Body = styled(Box)`
    display: flex;
    flex-direction: column;
    flex: 1;
`

Layout.propTypes = {
    children: PropTypes.node.isRequired
}

export default Layout;