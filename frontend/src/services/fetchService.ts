import { useQuery } from 'react-query';

const fetcher = async (url: any) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const useFetchData = (route: any, params: any = {}) => {
    const queryKey = [route, params];

    const fetchUrl = new URL(route, 'http://localhost:3001');
    Object.keys(params).forEach((key) => fetchUrl.searchParams.append(key, params[key]));
    return useQuery(queryKey, () => fetcher(fetchUrl.toString()));
};

export default useFetchData;