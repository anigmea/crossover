import React from "react";
import styled from "styled-components";
import Navbar from "../components/navbar";

// Styled Components
const PrivacyWrapper = styled.div`
  font-family: "Yeezy", sans-serif;
  text-align: left;
  background-color: #f8f9fa;
  padding: 20px;
  min-height: 100vh;
`;

const PrivacyHeader = styled.h1`
  font-size: 28px;
  color: #4caf50;
  text-align: center;
  margin-bottom: 20px;
`;

const SectionHeader = styled.h2`
  font-size: 22px;
  color: #000;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const SectionText = styled.p`
  font-size: 16px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 15px;
`;

const PrivacyPolicy = () => {
  return (
    <PrivacyWrapper>
      <Navbar />
      <PrivacyHeader>Privacy Policy</PrivacyHeader>

      <SectionText>Last updated January 17, 2025</SectionText>

      <SectionText>
        This Privacy Notice for Crossover ("we", "us", or "our"), describes how and why
        we might access, collect, store, use, and/or share ("process") your personal
        information when you use our services ("Services"), including when you:
      </SectionText>

      <ul>
        <li>
          <SectionText>
            Visit our website at <a href="http://www.crossover.in.net">http://www.crossover.in.net</a>, or any website of ours
            that links to this Privacy Notice
          </SectionText>
        </li>
        <li>
          <SectionText>
            Engage with us in other related ways, including any sales, marketing, or events
          </SectionText>
        </li>
      </ul>

      <SectionText>
        Questions or concerns? Reading this Privacy Notice will help you understand
        your privacy rights and choices. If you still have any questions or concerns,
        please contact us at <a href="mailto:aaravkanodia7@gmail.com">aaravkanodia7@gmail.com</a>.
      </SectionText>

      <SectionHeader>Summary of Key Points</SectionHeader>
      <SectionText>
        This summary provides key points from our Privacy Notice, but you can find out
        more details about any of these topics by using the table of contents below.
      </SectionText>

      <SectionHeader>1. What Information Do We Collect?</SectionHeader>
      <SectionText>
        We collect personal information that you voluntarily provide to us, such as
        names, phone numbers, email addresses, mailing addresses, and payment data.
      </SectionText>

      <SectionHeader>2. How Do We Process Your Information?</SectionHeader>
      <SectionText>
        We process your personal information to provide, improve, and administer our
        Services, communicate with you, for security and fraud prevention, and to
        comply with law.
      </SectionText>

      <SectionHeader>3. When and With Whom Do We Share Your Personal Information?</SectionHeader>
      <SectionText>
        We may share your information in specific situations described in this section
        and/or with the following third parties: business transfers and payment processors.
      </SectionText>

      <SectionHeader>4. How Long Do We Keep Your Information?</SectionHeader>
      <SectionText>
        We keep your information for as long as necessary to fulfil the purposes outlined
        in this Privacy Notice unless otherwise required by law.
      </SectionText>

      <SectionHeader>5. What Are Your Privacy Rights?</SectionHeader>
      <SectionText>
        Depending on where you are located, you may have certain rights regarding your
        personal information, including the right to access, update, or delete your data.
      </SectionText>

      <SectionHeader>6. How Can You Contact Us About This Notice?</SectionHeader>
      <SectionText>
        If you have questions or comments about this notice, you may contact us at:
      </SectionText>

      <SectionText>
        Crossover<br />
        B-801 Sangini Solitaire, Vesu<br />
        Surat, Gujarat 395007<br />
        India<br />
        Email: <a href="mailto:aaravkanodia7@gmail.com">aaravkanodia7@gmail.com</a>
      </SectionText>

      <SectionText>
        For more details, please visit our full privacy policy at
        <a href="https://razorpay.com/privacy/"> https://razorpay.com/privacy/</a>.
      </SectionText>
    </PrivacyWrapper>
  );
};

export default PrivacyPolicy;
