// Section.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

const Section = ({ title, items = [] }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>
      <List>
        {items.map((item, index) => (
          <ListItem key={index} disableGutters>
            <ListItemText
              primary={<strong>{item.title}</strong>}
              secondary={item.description}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ),
};

export default Section;
