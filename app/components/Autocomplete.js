// @flow
import React from 'react';
import Downshift from 'downshift';
import { MenuItem, Paper, TextField, withStyles } from 'material-ui';

const styles = { container: { height: 50 }, paper: { position: 'absolute', width: 452, zIndex: 9999 } };

type Props = {
  id: string,
  label: string,
  classes: typeof styles,
  onChange: (string) => void,
  value: string,
  items: string[]
};

const isSelected = (selection: string, item: string) =>
  !selection || item.toLowerCase()
    .includes(selection.toLowerCase());

function UnstyledAutocomplete(props: Props) {
  const { classes, id, label, items, onChange, value } = props;

  return (
    <Downshift onChange={onChange} defaultSelectedItem={value}>
      {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
        <div className={classes.container}>
          <TextField
            fullWidth
            autoFocus
            label={label}
            InputProps={getInputProps({ id })}
          />
          {isOpen ? (
            <Paper square className={classes.paper}>
              {items
                .filter(exchange => isSelected(inputValue, exchange))
                .slice(0, 5)
                .map((suggestion, index) => (
                  <MenuItem
                    {...getItemProps({ item: suggestion })}
                    key={suggestion}
                    selected={highlightedIndex === index}
                    component="div"
                  >
                    {suggestion}
                  </MenuItem>),
                )}
            </Paper>
          ) : null}
        </div>
      )}
    </Downshift>
  );
}

export const Autocomplete = withStyles(styles)(UnstyledAutocomplete);
