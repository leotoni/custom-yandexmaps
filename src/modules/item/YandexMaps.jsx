import React, { Fragment } from 'react';
import { Map, Placemark, YMaps } from 'react-yandex-maps';
import TextField from '@material-ui/core/TextField';
import unicid from 'uniqid';
import axios from 'axios';
import DetailedItem from './DetailedItem';
import SelectItem from './SelectItem';

const styles = {
  pacContainer: {
    margin: '0px 5px 0px 5px',
    maxWidth: '90%',
    width: 'auto',
    minWidth: '500px',
    top: '185px',
    position: 'absolute',
    zIndex: '1000',
    borderRadius: '2px',
    borderTop: '1px solid #d9d9d9',
    fontFamily: 'Arial,sans-serif',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  },
};


function init(func, func2) {
  if (typeof func === 'function') document.addEventListener('click', func, false);
  if (typeof func2 === 'function') document.addEventListener('keydown', func2, false);
}

class YandexMaps extends React.Component {
  state = {
    org: '',
    text: '',
    elements: [],
    indexActive: -1,
    isOpen: false,
  };

  componentDidMount() {
    init(() => this.setState({ isOpen: false }), this.handleKeyDown);
  }

  getData() {
    const url = `https://search-maps.yandex.ru/v1/?text=Тюмень,${this.state.text}&type=biz&lang=ru_RU&apikey=ba499814-4c73-461a-ab9c-2b528677ce39`;
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
      const { name = '', CompanyMetaData = '' } = elem.properties;
      const { Categories = [] } = CompanyMetaData;
      const cat = (Categories.length > 0 && Categories.map(c => c.name).join(',')) || '';
      this.setState({
        org: elem, text: `${name}, ${cat}`, indexActive: -1, isOpen: false,
      });
    }
  };

  handleSelect = (e, org) => {
    this.setState({
      org, text: e, indexActive: -1, isOpen: false,
    });
  };

  render() {
    const { elements, indexActive, org } = this.state;
    const lat = org && org.geometry.coordinates[1];
    const long = org && org.geometry.coordinates[0];
    const state = {
      center: (org && [lat, long]) || [57.12, 65.52],
      zoom: (org && 14) || 12,
    };
    return (
      <Fragment>
        <div style={{ height: '10%' }}>
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
            <Map
              style={{ width: '100%', height: '100%', zIndex: '11' }}
              state={state}
            >
              <Placemark
                geometry={(org && [lat, long]) || []}
              />
            </Map>
            {org && (<DetailedItem org={org} close={() => this.setState({ org: '' })} />)}
          </YMaps>
        </div>
        {this.state.isOpen && elements.length > 0 && (
          <div style={styles.pacContainer}>
            {elements.map((e, i) => (
              <SelectItem
                key={unicid()}
                elem={e}
                handleSelect={this.handleSelect}
                active={i === indexActive}
              />
            ))}
          </div>
        )}
      </Fragment>
    );
  }
}

export default (YandexMaps);
