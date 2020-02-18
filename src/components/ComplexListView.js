'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';

import Data from '../Data';

export default class MeteorListView extends Component {
  static propTypes = {
    elements: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
    listViewRef: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  };
  constructor(props) {
    super(props);

    this.state = {
      items: []
    };
  }
  componentWillReceiveProps(props) {
    const { elements } = props;

    const elems = elements();
    this.setState({
      items: elems
    });
  }
  componentWillMount() {
    const { elements } = this.props;

    this.onChange = () => {
      const elems = elements();
      this.setState({
        items: elems
      });
    };

    this.onChange();
    Data.onChange(this.onChange);
  }
  componentWillUnmount() {
    Data.offChange(this.onChange);
  }
  render() {
    const { items } = this.state;
    const { listViewRef, ...props } = this.props;

    return <FlatList {...props} ref={listViewRef} data={items} keyExtractor={item => item._id} />;
  }
}
