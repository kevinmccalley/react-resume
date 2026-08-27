// ResumePDF.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import sectionsData from "./sections.json";

// Bundled locally (Vite emits these as same-origin asset URLs) so PDF
// generation never depends on a third-party font host — matches the site:
// Fraunces for headings, Inter for body.
import interRegular from "./fonts/Inter-400.ttf";
import interItalic from "./fonts/Inter-400-italic.ttf";
import interSemiBold from "./fonts/Inter-600.ttf";
import interBold from "./fonts/Inter-700.ttf";
import frauncesRegular from "./fonts/Fraunces-400.ttf";
import frauncesSemiBold from "./fonts/Fraunces-600.ttf";
import frauncesBold from "./fonts/Fraunces-700.ttf";

Font.register({
  family: "Inter",
  fonts: [
    { src: interRegular, fontWeight: 400 },
    { src: interItalic, fontWeight: 400, fontStyle: "italic" },
    { src: interSemiBold, fontWeight: 600 },
    { src: interBold, fontWeight: 700 },
  ],
});

Font.register({
  family: "Fraunces",
  fonts: [
    { src: frauncesRegular, fontWeight: 400 },
    { src: frauncesSemiBold, fontWeight: 600 },
    { src: frauncesBold, fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10.5,
    padding: 40,
    lineHeight: 1.45,
    color: "#1a1a18",
  },
  header: { fontFamily: "Fraunces", fontSize: 22, fontWeight: 600, marginBottom: 4 },
  subheader: { fontSize: 11.5, color: "#444", marginBottom: 12 },
  sectionTitle: {
    fontFamily: "Fraunces",
    fontSize: 13,
    fontWeight: 600,
    marginTop: 14,
    marginBottom: 6,
    borderBottomWidth: 0.75,
    borderBottomColor: "#ddd",
    paddingBottom: 4,
  },
  para: { marginBottom: 6 },
  positionTitle: { fontWeight: "bold", marginTop: 8 },
  positionDetails: { fontStyle: "italic", fontSize: 10 },
  smallText: { fontSize: 9, color: "#666", marginBottom: 2 },
  listItem: { marginLeft: 10, marginBottom: 1 },
  listItemLast: { marginLeft: 10, marginBottom: 12 },
  buildRow: { marginBottom: 9 },
  buildName: { fontWeight: "bold" },
  buildTagline: { fontStyle: "italic", fontSize: 10 },
  buildDetail: { fontSize: 9.5, color: "#333" },
  contact: { marginBottom: 12 },
});

// Markdown parser: **bold**, *italic*, _italic_
const parseMarkdown = (text) => {
  if (!text) return null;
  const elements = [];
  let remaining = text;
  let key = 0;
  const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(_([^_]+?)_)/;

  while (remaining.length > 0) {
    const match = remaining.match(regex);
    if (!match) {
      elements.push(<Text key={key++}>{remaining}</Text>);
      break;
    }
    const index = match.index;
    if (index > 0) elements.push(<Text key={key++}>{remaining.slice(0, index)}</Text>);
    if (match[1]) {
      elements.push(<Text key={key++} style={{ fontWeight: "bold" }}>{match[2]}</Text>);
    } else if (match[3]) {
      elements.push(<Text key={key++} style={{ fontStyle: "italic" }}>{match[4]}</Text>);
    } else if (match[5]) {
      elements.push(<Text key={key++} style={{ fontStyle: "italic" }}>{match[6]}</Text>);
    }
    remaining = remaining.slice(index + match[0].length);
  }
  return elements;
};

const BuildRow = ({ b }) => (
  <View style={styles.buildRow} wrap={false}>
    <Text>
      <Text style={styles.buildName}>{b.name}</Text>
      <Text style={styles.buildTagline}> — {b.tagline}</Text>
    </Text>
    <Text style={styles.buildDetail}>{b.description}</Text>
    {b.stack && b.stack.length > 0 && (
      <Text style={styles.buildDetail}>Stack: {b.stack.join(", ")}</Text>
    )}
    <Text style={styles.smallText}>
      {b.scope}
      {b.link ? `  ·  ${b.linkLabel || b.link}` : b.linkLabel ? `  ·  ${b.linkLabel}` : ""}
    </Text>
  </View>
);

const RenderContent = ({ content }) => {
  if (!content) return null;

  if (Array.isArray(content)) {
    return content.map((item, idx, arr) => {
      switch (item.type) {
        case "paragraph":
        case "markdown":
          return (
            <Text key={idx} style={styles.para}>
              {parseMarkdown(item.text)}
            </Text>
          );

        case "markdownListitem": {
          const text = item.text.replace(/^•\s*/, "");
          const isLast =
            idx === arr.length - 1 || arr[idx + 1].type !== "markdownListitem";
          return (
            <Text key={idx} style={isLast ? styles.listItemLast : styles.listItem}>
              • {parseMarkdown(text)}
            </Text>
          );
        }

        case "position":
          return (
            <View key={idx} wrap={false}>
              <Text style={styles.positionTitle}>{item.title}</Text>
              <Text style={styles.positionDetails}>
                {item.role} – {item.location}
              </Text>
              <Text style={styles.smallText}>{item.date}</Text>
            </View>
          );

        case "buildGrid":
          return (
            <View key={idx}>
              {(item.items || []).map((b) => (
                <BuildRow key={b.name} b={b} />
              ))}
            </View>
          );

        default:
          return null;
      }
    });
  }

  if (typeof content === "object") {
    return (
      <View style={styles.contact}>
        {content.email && <Text>Email: {content.email}</Text>}
        {content.linkedin && <Text>LinkedIn: linkedin.com/in/{content.linkedin}</Text>}
      </View>
    );
  }

  return <Text>{content}</Text>;
};

const ResumePDF = () => {
  const PDF_OMIT = ["prototypes", "case-accessbridge"];
  const sections = sectionsData.filter((s) => !PDF_OMIT.includes(s.id));
  const overview = sections.find((s) => s.id === "overview");
  const rest = sections.filter((s) => s.id !== "overview");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {overview && (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.header}>{overview.title}</Text>
            {overview.subtitle && <Text style={styles.subheader}>{overview.subtitle}</Text>}
            <RenderContent content={overview.content} />
          </View>
        )}

        {rest.map((section) => (
          <View key={section.id} style={{ marginBottom: 8 }}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <RenderContent content={section.content} />
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default ResumePDF;
