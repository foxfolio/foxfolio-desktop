import { CardContent, WithStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import { StyleRulesCallback, Theme, withStyles } from '@material-ui/core/styles';
import { ExpandMore } from '@material-ui/icons';
import classnames from 'classnames';
import React, { Component, ComponentType } from 'react';

export const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    '&:last-child': {
      paddingBottom: theme.spacing.unit,
    },
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  collapse: {
    padding: 10,
  },
});

interface Props {
  cardContent: JSX.Element;
  collapseContent: JSX.Element;
  className?: string;
}

interface State {
  expanded: boolean;
}

export const ExpandableCard = withStyles(styles)(
  class extends Component<Props & WithStyles, State> {
    public state = {
      expanded: false,
    };

    public handleExpandClick = () => {
      this.setState({ expanded: !this.state.expanded });
    };

    public render() {
      const { classes, className, cardContent, collapseContent } = this.props;

      return (
        <Card className={className} square>
          <CardContent className={classes.root} onClick={this.handleExpandClick}>
            {cardContent}
            <div>
              <IconButton
                className={classnames(classes.expand, {
                  [classes.expandOpen]: this.state.expanded,
                })}
              >
                <ExpandMore />
              </IconButton>
            </div>
          </CardContent>
          <Collapse in={this.state.expanded} timeout="auto" mountOnEnter unmountOnExit>
            <div className={classes.collapse}>{collapseContent}</div>
          </Collapse>
        </Card>
      );
    }
  }
);
