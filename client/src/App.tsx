import './App.css';
import { Box } from '@mantine/core';
import useSWR from 'swr';

export const ENDPOINT = 'http://localhost:4000';

const fetcher = (url: string) => {
  return fetch(`${ENDPOINT}/${url}`)
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

const App = () => {
  const { data, mutate } = useSWR('/api/todos', fetcher);

  return (
    <div className='App'>
      <Box>{JSON.stringify(data)}</Box>
    </div>
  );
};

export default App;
