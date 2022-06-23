import './App.css';
import { Box, Button, List, ListItem, ThemeIcon, Title } from '@mantine/core';
import { AddTodo } from './components/AddTodo';
import { Navigation } from './components/Navigation';
import { CheckCircleFillIcon } from '@primer/octicons-react';
import useSWR from 'swr';
import { useEffect, useState } from 'react';

export interface Todo {
  id: number;
  title: string;
  body: string;
  done: boolean;
}

export const ENDPOINT = 'http://localhost:4000';

const fetcher = async (url: string) => {
  try {
    const response = await fetch(`${ENDPOINT}/${url}`);
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

const App = () => {
  const [todosLength, setTodosLength] = useState(null);
  const { data, mutate } = useSWR<Todo[]>('api/todos', fetcher);

  const markTodoAsDone = async (id: number) => {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}/done`, {
      method: 'PATCH',
    }).then((response) => response.json());
    mutate(updated);
  };

  const removeTodo = async (id: number) => {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}`, {
      method: 'DELETE',
    }).then((response) => response.json());
    mutate(updated);
  };

  const getLengthOfTodos = () => {
    fetch(`${ENDPOINT}/api/todos/length`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((length) => setTodosLength(length));
  };

  useEffect(() => {
    getLengthOfTodos();
  }, [data]);

  return (
    <div className='App'>
      <Navigation />
      <Title order={5}>
        {!todosLength ? (
          <span>No todos, add your first!</span>
        ) : (
          <span>Total todos: {todosLength}</span>
        )}
      </Title>
      <AddTodo mutate={mutate} />
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
              <div
                key={todo.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  border: '1px solid #eee',
                  borderRadius: '10px',
                  padding: '10px',
                  margin: '10px',
                }}
              >
                <div>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => markTodoAsDone(todo.id)}
                  >
                    {todo.done ? (
                      <ThemeIcon color='teal' size={24} radius='xl'>
                        <CheckCircleFillIcon size={20} />
                      </ThemeIcon>
                    ) : (
                      <ThemeIcon color='gray' size={24} radius='xl'>
                        <CheckCircleFillIcon size={20} />
                      </ThemeIcon>
                    )}
                  </span>
                  <ListItem
                    style={{ listStyleType: 'none', textAlign: 'left' }}
                    key={`todo__${todo.id}`}
                  >
                    <h4
                      style={
                        todo.done ? { textDecoration: 'line-through' } : {}
                      }
                    >
                      {todo.title}
                    </h4>
                    <p
                      style={
                        todo.done ? { textDecoration: 'line-through' } : {}
                      }
                    >
                      {todo.body}
                    </p>
                  </ListItem>
                </div>
                <Button
                  size='xs'
                  onClick={() => removeTodo(todo.id)}
                  color={'red'}
                >
                  Remove
                </Button>
              </div>
            );
          })}
        </List>
      </Box>
    </div>
  );
};

export default App;
