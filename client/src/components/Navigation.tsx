import { Text, Title, Header, Code } from '@mantine/core';

export const Navigation = () => {
  return (
    <>
      <br />
      <Header height={'100'}>
        <Title>Todo</Title>
        <Text>
          <Code color='red'>Go</Code>
          <Code color='teal'>React</Code>
          <Code color='blue'>SWR</Code>
          <Code color='yellow'>Mantine</Code>
        </Text>
        <img width={75} src='assets/header.png' alt='React & Go' />
      </Header>
      <br />
    </>
  );
};
