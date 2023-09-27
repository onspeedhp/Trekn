import React, { Component, RefObject } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
`;

// Define the prop types using TypeScript interfaces
interface AutoCompleteProps {
  map: any; // You can replace 'any' with the specific type if known
  mapApi: any; // You can replace 'any' with the specific type if known
  addplace: (place: any) => void; // You can replace 'any' with the specific type if known
}

class AutoComplete extends Component<AutoCompleteProps> {
  private searchInput: RefObject<HTMLInputElement> = React.createRef();
  private autoComplete: any; // You can replace 'any' with the specific type if known

  constructor(props: AutoCompleteProps) {
    super(props);
    this.clearSearchBox = this.clearSearchBox.bind(this);
  }

  componentDidMount() {
    const { map, mapApi } = this.props;
    const options = {
      // ... (same as before)
    };
    this.autoComplete = new mapApi.places.Autocomplete(
      this.searchInput.current!,
      options
    );
    this.autoComplete.addListener('place_changed', this.onPlaceChanged);
    this.autoComplete.bindTo('bounds', map);
  }

  componentWillUnmount() {
    const { mapApi } = this.props;
    mapApi.event.clearInstanceListeners(this.searchInput.current!);
  }

  onPlaceChanged = () => {
    const { map, addplace } = this.props;
    const place = this.autoComplete.getPlace();

    // ... (same as before)
  };

  clearSearchBox() {
    if (this.searchInput.current) {
      this.searchInput.current.value = '';
    }
  }

  render() {
    return (
      <Wrapper>
        <input
          ref={this.searchInput}
          type='text'
          onFocus={this.clearSearchBox}
          placeholder='Enter a location'
        />
      </Wrapper>
    );
  }
}

export default AutoComplete;
