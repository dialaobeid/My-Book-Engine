import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import Navbar from './components/Navbar';
import Auth from './utils/auth';

const httpLink = createHttpLink({
  uri: '/graphql',
  headers: {
    authorization: Auth.getToken() ? `Bearer ${Auth.getToken()}` : '',
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;