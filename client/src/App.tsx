import './App.css';
import { Box, List, ThemeIcon } from '@mantine/core';
import { AddTodo } from './components/AddTodo';
import { CheckCircleFillIcon } from '@primer/octicons-react';
import useSWR from 'swr';

export interface Todo {
  id: number;
  title: string;
  body: string;
  done: boolean;
}

export const ENDPOINT = 'http://localhost:4000';

const fetcher = (url: string) => {
  return fetch(`${ENDPOINT}/${url}`)
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

const App = () => {
  const { data, mutate } = useSWR<Todo[]>('api/todos', fetcher);

  const markTodoAsDone = async (id: number) => {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}/done`, {
      method: 'PATCH',
    }).then((response) => response.json());
    mutate(updated);
  };

  return (
    <div className='App'>
      <Box
        sx={() => ({
          padding: '2rem',
          width: '100%',
          maxWidth: '40rem',
          margin: '0 auto',
        })}
      >
        <List spacing='xs' size='sm' mb={12} center>
          {data?.map((todo) => {
            return (
              <List.Item
                onClick={() => markTodoAsDone(todo.id)}
                key={`todo__${todo.id}`}
                icon={
                  todo.done ? (
                    <ThemeIcon color='teal' size={24} radius='xl'>
                      <CheckCircleFillIcon size={20} />
                    </ThemeIcon>
                  ) : (
                    <ThemeIcon color='gray' size={24} radius='xl'>
                      <CheckCircleFillIcon size={20} />
                    </ThemeIcon>
                  )
                }
              >
                {todo.title}
              </List.Item>
            );
          })}
        </List>
      </Box>

      <AddTodo mutate={mutate} />
    </div>
  );
};

export default App;
