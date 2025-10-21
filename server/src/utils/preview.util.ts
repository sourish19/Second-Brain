import axios from 'axios';

import logger from '../config/logger.config';
import ENV from '../config/env.config';

interface IPreviewLink {
  title: string;
  description: string;
  image: string;
  url: string;
}

const getPreview = async (
  originalLink: string
): Promise<IPreviewLink | null> => {
  try {
    logger.debug({ originalLink }, 'Fetching link preview');
    const rootUrl = 'https://api.linkpreview.net';

    const res = await axios.post<IPreviewLink>(
      rootUrl,
      { q: originalLink },
      {
        headers: {
          'X-Linkpreview-Api-Key': ENV.LINK_PREVIEW_API,
        },
      }
    );

    logger.debug(
      { originalLink, title: res.data.title },
      'Link preview fetched successfully'
    );
    return res.data;
  } catch (error) {
    logger.warn({ originalLink, err: error }, 'Failed to fetch link preview');
    // Fail silently
    return null;
  }
};

export default getPreview;
