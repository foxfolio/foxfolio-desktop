import classnames from 'classnames';
import { CardContent, WithStyles } from 'material-ui';
import { ExpandMore } from 'material-ui-icons';
import Card from 'material-ui/Card';
import green from 'material-ui/colors/green';
import IconButton from 'material-ui/IconButton';
import { StyleRulesCallback, Theme, withStyles } from 'material-ui/styles';
import { CollapseProps } from 'material-ui/transitions';
import MaterialCollapse from 'material-ui/transitions/Collapse';
import React, { Component, ComponentType } from 'react';

// TODO Remove after update to material-ui@1.0.0-beta.33
const Collapse = (MaterialCollapse as any) as ComponentType<CollapseProps & { mountOnEnter: any }>;

export const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
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
        <Card className={className}>
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
