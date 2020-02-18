'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';

import Data from '../Data';

export default class MeteorListView extends Component {
  static propTypes = {
    collection: PropTypes.string.isRequired,
    selector: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    options: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    renderItem: PropTypes.func.isRequired,
    listViewRef: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  };
  static defaultProps = {
    selector: {},
  };
  constructor(props) {
    super(props);

    this.state = {
      items: []
    };
  }
  componentWillReceiveProps(props) {
    const { collection, selector, options } = props;

    this.update(Data.db[collection].find(selector, options));
  }
  componentWillMount() {
    const { collection, selector, options } = this.props;

    this.update = results => {
      this.setState({
        items: results
      });
    };

    if (!Data.db[collection]) {
      Data.db.addCollection(collection);
    }

    this.items = Data.db.observe(() => {
      return Data.db[collection].find(selector, options);
    });

    this.items.subscribe(this.update);
  }
  componentWillUnmount() {
    this.items.dispose();
  }
  render() {
    const { items } = this.state;
    const { listViewRef, ...props } = this.props;

    return <ListView {...props} ref={listViewRef} data={items} keyExtractor={item => item._id} />;
  }
}
