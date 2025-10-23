// ResumePDF.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
} from "@react-pdf/renderer";
import sectionsData from "./sections.json";

// Register Helvetica font
Font.register({
  family: "Helvetica",
  fonts: [{ src: "https://pdfjs-examples.s3.amazonaws.com/fonts/Helvetica.ttf" }],
});

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 40,
    lineHeight: 1.4,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subheader: {
    fontSize: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#DFDDDD",
    paddingBottom: 6,
  },
  positionTitle: {
    fontWeight: "bold",
    marginBottom: 0,
  },
  positionDetails: {
    fontStyle: "italic",
    marginBottom: 0,
  },
  smallText: {
    fontSize: 10,
    color: "#555",
    marginBottom: 0,
  },
  listItem: {
    marginBottom: 0,
    marginLeft: 10,
  },
  listItemLast: {
    marginBottom: 20,
    marginLeft: 10,
  },
  link: {
    color: "#1a0dab",
    textDecoration: "underline",
  },
  contact: {
    marginBottom: 12,
  },
});

// Markdown parser: bold **text**, italic *text* or _text_
// Updated to handle punctuation after underscores
const parseMarkdown = (text) => {
  if (!text) return null;

  const elements = [];
  let remaining = text;
  let key = 0;

  // Matches **bold**, *italic*, or _italic_ (allow punctuation inside)
  const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(_([^_]+?)_)/;

  while (remaining.length > 0) {
    const match = remaining.match(regex);
    if (!match) {
      elements.push(<Text key={key++}>{remaining}</Text>);
      break;
    }

    const index = match.index;

    // Text before markdown
    if (index > 0) {
      elements.push(<Text key={key++}>{remaining.slice(0, index)}</Text>);
    }

    if (match[1]) {
      // Bold **text**
      elements.push(
        <Text key={key++} style={{ fontWeight: "bold" }}>
          {match[2]}
        </Text>
      );
    } else if (match[3]) {
      // Italic *text*
      elements.push(
        <Text key={key++} style={{ fontStyle: "italic" }}>
          {match[4]}
        </Text>
      );
    } else if (match[5]) {
      // Italic _text_ (non-greedy match)
      elements.push(
        <Text key={key++} style={{ fontStyle: "italic" }}>
          {match[6]}
        </Text>
      );
    }

    remaining = remaining.slice(index + match[0].length);
  }

  return elements;
};

// Render content blocks
const RenderContent = ({ content }) => {
  if (!content) return null;

  if (Array.isArray(content)) {
    return content.map((item, idx, arr) => {
      switch (item.type) {
        case "paragraph":
        case "markdown":
          return (
            <Text key={idx} style={{ marginBottom: 6 }}>
              {parseMarkdown(item.text)}
            </Text>
          );

        case "markdownListitem":
          let text = item.text.replace(/^•\s*/, "");
          const isLast =
            idx === arr.length - 1 || arr[idx + 1].type !== "markdownListitem";
          return (
            <Text
              key={idx}
              style={isLast ? styles.listItemLast : styles.listItem}
            >
              • {parseMarkdown(text)}
            </Text>
          );

        case "position":
          return (
            <View key={idx} style={{ marginBottom: 0 }}>
              <Text style={styles.positionTitle}>{item.title}</Text>
              <Text style={styles.positionDetails}>
                {item.role} – {item.location}
              </Text>
              <Text style={styles.smallText}>{item.date}</Text>
            </View>
          );

        default:
          return null;
      }
    });
  }

  if (typeof content === "object" && content !== null) {
    return (
      <View style={styles.contact}>
        {content.email && <Text>Email: {content.email}</Text>}
        {content.linkedin && <Text>LinkedIn: {content.linkedin}</Text>}
      </View>
    );
  }

  return <Text>{content}</Text>;
};

// Main PDF component
const ResumePDF = () => {
  const filteredSections = sectionsData.filter(
    (section) => section.id !== "portfolio"
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Overview */}
        {filteredSections
          .filter((section) => section.id === "overview")
          .map((section) => (
            <View key={section.id} style={{ marginBottom: 12 }}>
              <Text style={styles.header}>{section.title}</Text>
              {section.subtitle && (
                <Text style={styles.subheader}>{section.subtitle}</Text>
              )}
              <RenderContent content={section.content} />
            </View>
          ))}

        {/* Other Sections */}
        {filteredSections
          .filter((section) => section.id !== "overview")
          .map((section) => (
            <View key={section.id} wrap={false} style={{ marginBottom: 12 }}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <RenderContent content={section.content} />
            </View>
          ))}
      </Page>
    </Document>
  );
};

export default ResumePDF;
