import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
    color: 'white',
    borderColor: 'white',
    float: 'right',
  },
  text: {
    opacity: '1',
  },
  detailedItem: {
    width: '100%',
    marginTop: '-260px',
    position: 'relative',
    height: '40%',
  },
  detailedText: {
    color: 'white',
    position: 'relative',
    top: '-260px',
    padding: '10px'

  },
  detailedOpacity: {
    background: 'black',
    opacity: '0.6',
    height: '100%',
    width: '100%',
  },
}));

const DetailedItem = ({ org, close }) => {
  const { name = '', description = '', CompanyMetaData = '' } = org.properties;
  const { Categories = [], Hours, url } = CompanyMetaData;
  const cat = (Categories.map(c => c.name).join(',')) || '';
  const classes = useStyles();
  console.log('item', org);
  return (
    <div className={classes.detailedItem}>
      <div className={classes.detailedOpacity} />
      <div className={classes.detailedText}>
        <h4>{name}</h4>
        <div>{cat}</div>
        <div>{description}</div>
        <div>{Hours && Hours.text}</div>
        <div>{url && url}</div>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={() => close && close()}
        >
      Close
        </Button>
      </div>
    </div>
  );
};

export default (DetailedItem);
