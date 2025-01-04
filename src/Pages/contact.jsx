import React from "react";
import styled from "styled-components";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

const ContactWrapper = styled.div``;

const ContactText = styled.div`
margin: 5% 25%;
display: grid;
grid-template-rows: 1fr;
font-family: "Bebas Neue", sans-serif;
font-size: 18px;
`;

const CONTACTFORM = styled.div`
display: grid;
grid-gap: 20px;
`;

const CONTACTFORMLINK = styled.input`
margin: 1% 2%;
height: 80%;
width: 100%;
border-radius: 0px;
font-family: "Bebas Neue", sans-serif;
padding: 6px;
border: 0.5px solid grey;
outline-style: solid;
outline-color: black;
outline-width: 0.5px;
`;

const CONTACTFORMtextArea = styled.textarea`
margin: 1% 2%;
height: 100px;
width: 100%;
border-radius: 0px;
font-family: "Bebas Neue", sans-serif;
padding: 6px;
border: 0.5px solid grey;
outline-style: solid;
outline-color: black;
outline-width: 0.5px;
`;

const CONTACTFORMBUTTON = styled.button`
margin: 1% 2%;
height: 80%;
width: 100%;
border-radius: 0px;
font-family: "Bebas Neue", sans-serif;
border: 0.5px solid grey;
outline-style: solid;
outline-color: black;
outline-width: 0.5px;
padding: 6px;
`;



const Contact = () => {
    return(
        <ContactWrapper>
            <Navbar/>
            <ContactText>
            <p>CONTACT</p>
            <p>SEND US A MESSAGE</p>
            <CONTACTFORM method="POST">
                <CONTACTFORMLINK type="text" placeholder="NAME"/>
                <CONTACTFORMLINK type="text" placeholder="REASON"/>
                <CONTACTFORMLINK type="text" placeholder="EMAIL"/>
                <CONTACTFORMtextArea placeholder="MESSAGE" height="400px"/>
                <CONTACTFORMBUTTON type="submit">SUBMIT</CONTACTFORMBUTTON >
            </CONTACTFORM>
            </ContactText>
            <Footer/>
        </ContactWrapper>
    );
};


export default Contact;