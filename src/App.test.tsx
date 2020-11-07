import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { createBrowserHistory } from 'history';
import { identity } from "lodash";

const history = createBrowserHistory();

test('renders learn react link', () => {
  const { getByText } = render(<App loadInitialData={ identity } history={history}/>);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
