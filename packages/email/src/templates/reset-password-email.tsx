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

export interface ResetPasswordEmailProps {
  url: string;
}

export function ResetPasswordEmail({ url }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Reset your password</Heading>
          <Text style={text}>
            We received a request to reset your password. Click the button below to choose a new
            one. This link expires in one hour.
          </Text>
          <Button style={button} href={url}>
            Reset password
          </Button>
          <Text style={muted}>If you didn't request this, you can safely ignore this email.</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ResetPasswordEmail;

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
