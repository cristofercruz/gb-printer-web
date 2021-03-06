import dayjs from 'dayjs';
import { FILTER_MONOCHROME, FILTER_NEW, FILTER_RGB, FILTER_UNTAGGED } from '../../consts/specialTags';
import { dateFormat } from '../../app/defaults';

const filter = (activeTags) => (image) => {
  if (activeTags.length) {

    if (activeTags.includes(FILTER_UNTAGGED) && image.tags.length === 0) {
      return true;
    }

    if (activeTags.includes(FILTER_NEW)) {
      const date = dayjs(image.created, dateFormat)
        .unix();
      const maxNew = dayjs()
        .subtract('1', 'day')
        .unix();

      if (date > maxNew) {
        return true;
      }
    }

    if (activeTags.includes(FILTER_RGB) && !!image.hashes) {
      return true;
    }

    if (activeTags.includes(FILTER_MONOCHROME) && !image.hashes) {
      return true;
    }

    if (image.tags.find((tag) => activeTags.includes(tag))) {
      return true;
    }

    return false;
  }

  return true;
};

export default filter;
