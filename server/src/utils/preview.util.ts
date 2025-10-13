import axios, { AxiosError, AxiosResponse } from 'axios';
import qs from 'qs';

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
    const rootUrl = 'https://api.linkpreview.net';

    const res = await axios.post<IPreviewLink>(
      rootUrl,
      { q: originalLink },
      {
        headers: {
          'X-Linkpreview-Api-Key': process.env.LINK_PREVIEW_API,
        },
      }
    );

    return res.data;
  } catch (error) {
    // Fail silently
    return null;
  }
};

export default getPreview;
