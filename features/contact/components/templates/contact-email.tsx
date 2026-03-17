import { Body, Container, Column, Heading, Hr, Html, Row, Section, Text } from "@react-email/components";

interface ContactEmailProps {
  data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
}

const subjectLabels: Record<string, string> = {
  demo: "Prezentacja systemu (Demo)",
  pricing: "Zapytanie o cennik",
  support: "Pomoc techniczna",
  other: "Inne"
};

export function ContactEmail({ data }: ContactEmailProps) {
  const subjectLabel = subjectLabels[data.subject] || data.subject;

  return (
    <Html lang="pl">
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Nowa wiadomość z formularza kontaktowego</Heading>

          <Section style={section}>
            <Row style={row}>
              <Column style={labelColumn}>Imię i nazwisko</Column>
              <Column style={valueColumn}>{data.name}</Column>
            </Row>
            <Row style={row}>
              <Column style={labelColumn}>Adres e-mail</Column>
              <Column style={valueColumn}>
                <a href={`mailto:${data.email}`} style={linkStyle}>
                  {data.email}
                </a>
              </Column>
            </Row>
            <Row style={row}>
              <Column style={labelColumn}>Temat</Column>
              <Column style={valueColumn}>{subjectLabel}</Column>
            </Row>
            <Row style={row}>
              <Column style={labelColumnVertical}>Wiadomość</Column>
              <Column style={valueColumn}>
                <Text style={messageText}>{data.message}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>Wiadomość wysłana z formularza kontaktowego CraftFlow</Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#ffffff",
  fontFamily: "sans-serif",
  margin: "0"
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "24px"
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "24px",
  color: "#111827"
};

const section = {
  marginBottom: "24px"
};

const row = {
  borderBottom: "1px solid #e5e7eb"
};

const labelColumn = {
  width: "30%",
  padding: "12px",
  fontWeight: "bold",
  backgroundColor: "#f9fafb",
  fontSize: "14px",
  color: "#374151"
};

const labelColumnVertical = {
  width: "30%",
  padding: "12px",
  fontWeight: "bold",
  backgroundColor: "#f9fafb",
  fontSize: "14px",
  color: "#374151",
  verticalAlign: "top"
};

const valueColumn = {
  width: "70%",
  padding: "12px",
  fontSize: "14px",
  color: "#111827",
  wordBreak: "break-word" as const
};

const messageText = {
  whiteSpace: "pre-wrap" as const
};

const linkStyle = {
  color: "#2563eb",
  textDecoration: "underline"
};

const hr = {
  margin: "24px 0",
  borderColor: "#e5e7eb"
};

const footer = {
  fontSize: "12px",
  color: "#6b7280",
  textAlign: "center" as const
};
