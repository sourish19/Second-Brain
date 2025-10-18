import axios from 'axios';

interface IPreviewLink {
  title: string;
  description: string;
  image: string;
  url: string;
}

import ENV from '../config/env.config';

const getPreview = async (
  originalLink: string
): Promise<IPreviewLink | null> => {
  try {
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
    // console.log(res.data);
    return res.data;
  } catch (error) {
    // console.log(error);
    // Fail silently
    return null;
  }
};

export default getPreview;
