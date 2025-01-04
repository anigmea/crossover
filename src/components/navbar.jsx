import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

const NavbarWrapper = styled.div`
    width: 94%;
    max-height: 200px;
    display: flex;
    color: white;
    align_items: center;
    justify-content: space-between;
    background-color: black;
    padding: 3%;
`;

const LOGO = styled.a`    
color: white;
font-size: 24px;
font-family: "Bebas Neue", sans-serif;
margin-right: 2%;`;


const LINK_DIV = styled.div`
    width: 60%;
    display: flex;
    align_items: center;
    justify-content: center;
`;

const LINK = styled.a`
font-family: "Bebas Neue", sans-serif;
padding-left: 5%;
font-size: 18px;
text-decoration: none;
color: white;

&:hover{
    text-decoration: underline;
}

`;

const SIGNIN_DIV = styled.div`
    width: 10%;
    display: flex;
    align_items: center;
    justify-content: space-between;
`;
// const JOINUS = styled.a`
// font-family: "Bebas Neue", sans-serif;
// font-size: 18px;

// `;
const Navbar = () => {
    return(
        <NavbarWrapper>
            <LOGO href="#">CROSSOVER</LOGO>
            <LINK_DIV>
                <LINK href="#/Shop">Shop</LINK>
                <LINK>New Drops</LINK>
                <LINK>Best Sellers</LINK>
                {/* <LINK>About us</LINK> */}
                <LINK href="#/contact">Contact</LINK>
            </LINK_DIV> 
            <SIGNIN_DIV>
            {/* <JOINUS>Join Us</JOINUS> */}
            <LINK href="/#/Cart"><FontAwesomeIcon  icon= {faCartShopping} style={{color: "#ffffff",}} /></LINK>
            </SIGNIN_DIV>
        </NavbarWrapper>
    );
};

export default Navbar;
