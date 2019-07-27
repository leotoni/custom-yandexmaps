import React from 'react';

const styles = {
  button: {
    float: 'right',
  },
  pacItem: {
    cursor: 'pointer',
    position: 'relative',
    color: 'white',
    padding: '0 4px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    lineHeight: '30px',
    height: '70px',
    textAlign: 'left',
    borderTop: '1px solid #e6e6e6',
    fontSize: '11px',
    top: '-70px',
  },
  pacItemOpt: {
    backgroundColor: 'black',
    opacity: '0.6',
    width: '100%',
    height: '70px',
  },
  pacItemQuery: {
    fontSize: '13px',
    paddingRight: '3px',
    color: 'white',
  },
  pacMatched: {
    fontWeight: '700',
    color: 'white',
  },
};

const SelectItem = ({ elem, handleSelect, active }) => {
  const { name = '',
    description = '',
    CompanyMetaData = '' } = elem.properties;
  const { Categories = [] } = CompanyMetaData;
  const cat = (Categories.length > 0 && Categories.map(e => e.name).join(',')) || '';
  const style = (!active && styles.pacItem) || { backgroundColor: '#3f51b5', ...styles.pacItem };
  return (
    <div style={{ height: '70px' }} className="pac-item">
      <div style={styles.pacItemOpt} />
      <div
        style={style}
        onClick={() => {
          handleSelect(`${name}, ${cat}`, elem);
        }}
      >
        <span style={styles.pacItemQuery}>
          <span style={styles.pacMatched}>
            {`${name} `}
          </span>
        </span>
        <span>
          {cat}
        </span>
        <div>
          <span style={styles.pacItemQuery}>
            {description}
          </span>
        </div>
      </div>
    </div>
  );
};

export default (SelectItem);
