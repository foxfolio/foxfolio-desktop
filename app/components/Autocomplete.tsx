import { MenuItem, Paper, TextField, withStyles } from '@material-ui/core';
import { StyleRules } from '@material-ui/core/styles';
import Downshift from 'downshift';
import React from 'react';

const styles: StyleRules = {
  container: { height: 50, position: 'relative' },
  paper: { position: 'absolute', width: '100%', zIndex: 9999 },
};

interface Props {
  id: string;
  label: string;
  onChange: (item: string) => any;
  value: string;
  items: string[];
}

const isSelected = (selection: string | null, item: string) =>
  !selection || item.toLowerCase().includes(selection.toLowerCase());

export const Autocomplete = withStyles(styles)<Props>(
  ({ classes, id, label, items, onChange, value }) => (
    <Downshift
      onChange={onChange}
      itemToString={i => (i == null ? '' : String(i))}
      defaultSelectedItem={value}
    >
      {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
        <div className={classes.container}>
          <TextField fullWidth autoFocus label={label} InputProps={getInputProps({ id })} />
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
                  </MenuItem>
                ))}
            </Paper>
          ) : null}
        </div>
      )}
    </Downshift>
  )
);
