import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

export interface VerificationEmailProps {
  url: string;
}

export function VerificationEmail({ url }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Confirm your email</Heading>
          <Text style={text}>
            Thanks for signing up. Click the button below to verify your email address and activate
            your account.
          </Text>
          <Button style={button} href={url}>
            Verify email
          </Button>
          <Text style={muted}>
            If you didn't create an account, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default VerificationEmail;

const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" };
const container = { margin: "0 auto", padding: "32px", maxWidth: "480px" };
const heading = { fontSize: "22px", fontWeight: 700, color: "#111827" };
const text = { fontSize: "15px", lineHeight: "24px", color: "#374151" };
const muted = { fontSize: "13px", color: "#6b7280", marginTop: "24px" };
const button = {
  backgroundColor: "#111827",
  color: "#ffffff",
  borderRadius: "8px",
  padding: "12px 20px",
  fontSize: "14px",
  textDecoration: "none",
  display: "inline-block",
};
