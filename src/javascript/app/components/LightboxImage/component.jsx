import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import GameBoyImage from '../GameBoyImage';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import { load } from '../../../tools/storage';
import { dateFormat, dateFormatReadable } from '../../defaults';
import SVG from '../SVG';

class LightboxImage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tiles: null,
      loaded: false,
      hash: props.hash,
    };
  }

  static getDerivedStateFromProps(props, state) {
    // same image
    if (props.hash === state.hash) {
      return state;
    }

    // image changed or was unloaded
    return {
      tiles: null,
      loaded: false,
      hash: props.hash,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hash !== this.props.hash && this.props.hash) {

      if (this.props.hashes) {
        Promise.all([
          load(this.props.hashes.r),
          load(this.props.hashes.g),
          load(this.props.hashes.b),
          load(this.props.hashes.n),
        ])
          .then((tiles) => {
            this.setState({
              tiles: RGBNDecoder.rgbnTiles(tiles),
              loaded: true,
            });
          });
      } else {
        load(this.props.hash)
          .then((tiles) => {
            this.setState({
              tiles,
              loaded: true,
            });
          });
      }

    }
  }

  render() {
    return (this.state.loaded) ? (
      <div className="lightbox-image">
        <div className="lightbox-image__backdrop" />
        <div className="lightbox-image__box">
          <label className="lightbox-image__title">
            {this.props.title}
          </label>
          { this.props.isFullscreen ? null : (
            <button
              type="button"
              className="lightbox-image__button lightbox-image__button--fullscreen"
              onClick={this.props.fullscreen}
            >
              <SVG name="fullscreen" />
            </button>
          ) }
          <button
            type="button"
            className="lightbox-image__button lightbox-image__button--close"
            onClick={this.props.close}
          >
            <SVG name="close" />
          </button>
          <GameBoyImage
            tiles={this.state.tiles}
            palette={this.props.palette}
          />
          <div className="lightbox-image__navigation">
            <button
              type="button"
              className="lightbox-image__button lightbox-image__button--left"
              onClick={this.props.prev}
            >
              <SVG name="left" />
            </button>
            <button
              type="button"
              className="lightbox-image__button lightbox-image__button--right"
              onClick={this.props.next}
            >
              <SVG name="right" />
            </button>
          </div>
          <div className="lightbox-image__created">
            {dayjs(this.props.created, dateFormat).format(dateFormatReadable)}
          </div>
        </div>
      </div>
    ) : null;
  }
}

LightboxImage.propTypes = {
  created: PropTypes.string,
  hash: PropTypes.string,
  hashes: PropTypes.object,
  palette: PropTypes.object,
  title: PropTypes.string,
  close: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  fullscreen: PropTypes.func.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
};

LightboxImage.defaultProps = {
  created: null,
  hash: null,
  hashes: null,
  palette: null,
  title: null,
};

export default LightboxImage;