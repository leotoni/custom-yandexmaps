import React, { Fragment } from 'react';
import { Map, Placemark, YMaps } from 'react-yandex-maps';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import unicid from 'uniqid';

const styles = {
  root: {
    display: 'flex',
  },
  pacContainer: {
    margin: '0px 5px 0px 5px',
    backgroundColor: '#fff',
    maxWidth: '90%',
    width: 'auto',
    top: '185px',
    position: 'absolute',
    zIndex: '1000',
    borderRadius: '2px',
    borderTop: '1px solid #d9d9d9',
    fontFamily: 'Arial,sans-serif',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  },
  pacItem: {
    cursor: 'pointer',
    padding: '0 4px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    lineHeight: '30px',
    textAlign: 'left',
    borderTop: '1px solid #e6e6e6',
    fontSize: '11px',
    color: '#999',
  },
  pacItemQuery: {
    fontSize: '13px',
    paddingRight: '3px',
    color: '#000',
  },
  pacMatched: {
    fontWeight: '700',
  },
};

function init(func, func2) {
  if (typeof func === 'function') document.addEventListener('click', func, false);
  if (typeof func2 === 'function') document.addEventListener('keydown', func2, false);
}

const PacItem = (elem, handleSelect, active) => {
  const { name = '',
    description = '',
    CompanyMetaData = '' } = elem.properties;
  const { Categories = [] } = CompanyMetaData;
  const cat = (Categories.length > 0 && Categories.map(e => e.name).join(',')) || '';
  const style = (!active && styles.pacItem) || { backgroundColor: '#69afe5', ...styles.pacItem };
  return (
    <div
      key={unicid()}
      className="pac-item"
      style={style}
      onClick={() => {
        handleSelect(`${name}, ${cat}`);
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
  );
};

class YandexMaps extends React.Component {
  state = {
    text: '',
    elements: [],
    indexActive: -1,
    cord: '',
    isOpen: false,
  };

  componentDidMount() {
    init(() => this.setState({ isOpen: false }), this.handleKeyDown);
  }

  getData() {
    const url = `https://search-maps.yandex.ru/v1/?text=Тюмень,${this.state.text}&type=biz&lang=ru_RU&apikey=f7c98cb2-11c0-4f5b-bd27-a3cca8c31583`;
    axios.get(url)
      .then((resp) => {
        this.setState({ elements: resp.data.features, isOpen: true });
      });
  }

  handleKeyDown = (e) => {
    const UP = 38;
    const DOWN = 40;
    const ENTER = 13;
    const { indexActive, elements, isOpen } = this.state;
    if (!isOpen) return;
    if (e.keyCode === UP && indexActive >= 0) {
      this.setState({ indexActive: indexActive - 1 });
    }
    if (e.keyCode === DOWN && indexActive < 10) {
      this.setState({ indexActive: indexActive + 1 });
    }
    if (e.keyCode === ENTER) {
      const elem = elements && elements[indexActive];
      if (!elem) return;
      console.log('elem', elem);
      const { name = '', CompanyMetaData = '' } = elem.properties;
      const { Categories = [] } = CompanyMetaData;
      const cat = (Categories.length > 0 && Categories.map(c => c.name).join(',')) || '';
      this.setState({
        cord: elem.geometry.coordinates, text: `${name}, ${cat}`, indexActive: -1, isOpen: false,
      });
    }
  };

  handleSelect = (e) => {;
    this.setState({ text: e, indexActive: -1, isOpen: false });
  };

  render() {
    const { elements, indexActive, cord } = this.state;
    return (
      <Fragment>
        <div style={{ height: '15%' }}>
          <TextField
            style={{ width: '100%' }}
            id="outlined-name"
            label="Autocoplete"
            onChange={e => this.setState({ text: e.target.value }, this.getData())}
            margin="normal"
            value={this.state.text}
            variant="outlined"
          />
        </div>
        <div style={{ width: '100%', height: '85%' }}>
          <YMaps>
            <Map style={{ width: '100%', height: '100%' }} defaultState={{ center: [57.12, 65.52], zoom: 12 }}>
              <Placemark geometry={(cord && cord) || [57.12, 65.52]} />
            </Map>
          </YMaps>
        </div>
        {this.state.isOpen && elements.length > 0 && (
          <div style={styles.pacContainer}>
            {elements.map((e, i) => PacItem(e, this.handleSelect, i === indexActive))}
          </div>
        )}
      </Fragment>
    );
  }
}

export default (YandexMaps);
