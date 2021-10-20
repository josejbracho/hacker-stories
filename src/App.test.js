import * as React from 'react'
import axios from 'axios';

import {
  render,
  screen,
  fireEvent,
  act,
} from '@testing-library/react'

import App, {
  storiesReducer,
  Item,
  List,
  SearchForm,
  InputWithLabel,
} from './App';
import { createRenderer } from 'react-dom/test-utils';
import { isJSDocAugmentsTag } from 'typescript';
import { ImRtl } from 'react-icons/im';

const storyOne = {
  title: 'React',
  url: 'https://reactjs.org',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
};

jest.mock('axios');

const storyTwo = {
  title: 'Redux',
  url: 'https://redux.js.org',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1
};

const stories = [storyOne, storyTwo];

describe('storiesReducer', () => {
  test('removes a story from all stories', () => {
    const action = { type: 'REMOVE_STORY', payload: storyOne };
    const state = { data: stories, isLoading: false, isError: false }

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  test('fetch stories from API', () => {
    const action = { type: 'STORIES_FETCH_SUCCESS', payload: stories }
    const state = { data: stories, isLoading: false, isError: false }

    const newState = storiesReducer(state, action)

    const expectedState = {
      data: stories,
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  test('initiate stories fetch', () => {
    const action = { type: 'STORIES_FETCH_INIT' }
    const state = { isLoading: false, isError: false }

    const newState = storiesReducer(state, action)

    const expectedState = {
      isLoading: true,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  test('failed stories fetch', () => {
    const action = { type: 'STORIES_FETCH_FAILURE' }
    const state = { isLoading: false, isError: false }

    const newState = storiesReducer(state, action)

    const expectedState = {
      isLoading: false,
      isError: true,
    };

    expect(newState).toStrictEqual(expectedState);
  });
});

describe('Item', () => {
  test('renders all properties', () => {
    render(<Item item={storyOne} />)

    expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
    expect(screen.getByText('React')).toHaveAttribute(
      'href',
      'https://reactjs.org'
    );
  });

  test('renders a clickable dismiss button', () => {
    render(<Item item={storyOne} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('clicking the dismiss button calls the callback handler', () => {
    const handleRemoveItem = jest.fn();

    render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);

    fireEvent.click(screen.getByRole('button'));

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
  });
});

describe('SearchForm', () => {
  const searchFormProps = {
    searchTerm: 'React',
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
  };
  test('renders the input field with its value', () => {
    render(<SearchForm {...searchFormProps} />);
    expect(screen.getByDisplayValue('React')).toBeInTheDocument();
  });
  test('renders the correct label', () => {
    render(<SearchForm {...searchFormProps} />);
    expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
  });
  test('calls onSeachInput on input field change', () => {
    render(<SearchForm {...searchFormProps} />);
    fireEvent.change(screen.getByDisplayValue('React'), {
      target: { value: 'Redux' },
    });
    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
  });
  test('call onSearchSubmit on button submit click', () => {
    render(<SearchForm {...searchFormProps} />);
    fireEvent.submit(screen.getByRole('button'));
    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
  });

  test('renders snapshot', () => {
    const { container } = render(<SearchForm {...searchFormProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('List', () => {
  const listProps = {
    list: [storyOne],
  };
  test('renders stories on a list', () => {
    render(<List {...listProps} />);
    expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
    expect(screen.getByText('React')).toHaveAttribute(
      'href',
      'https://reactjs.org'
    );
  });
});

describe('App', () => {
  test('suceeds fetching data', async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    await act(() => promise);

    expect(screen.queryByText(/Loading/)).toBeNull();
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBe(3);
  });

  test('fails fetching data', async () => {
    const promise = Promise.reject();

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    try {
      await act(() => promise);
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(screen.queryByText(/Loading/)).toBeNull();
      // eslint-disable-next-line jest/no-conditional-expect
      expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
    }
  });

  test('removes a story', async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    await act(() => promise);

    fireEvent.click(screen.getAllByRole('button')[1]);

    expect(screen.getAllByRole('button').length).toBe(2);
    expect(screen.queryByText('Jordan Walke')).toBeNull();
  });

  test('searches for a specific story', async () => {
    const reactPromise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    const anotherStory = {
      title: 'JavaScript',
      url: 'https://en.wikipedia.org/wiki/JavaScript',
      author: 'Brendan Eich',
      num_comments: 15,
      points: 10,
      objectID: 3,
    };

    const javascriptPromise = Promise.resolve({
      data: {
        hits: [anotherStory],
      }
    });

    axios.get.mockImplementation((url) => {
      if (url.includes('React')) {
        return reactPromise;
      }
      if (url.includes('JavaScript')) {
        return javascriptPromise;
      }

      throw Error();
    });

    render(<App />);

    await act(() => reactPromise);

    expect(screen.queryByDisplayValue('React')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('JavaScript')).toBeNull();

    expect(screen.queryByText('Jordan Walke')).toBeInTheDocument();
    expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeInTheDocument();
    expect(screen.queryByText('Brendan Eich')).toBeNull();

    fireEvent.change(screen.queryByDisplayValue('React'), {
      target: {
        value: 'JavaScript',
      },
    });

    expect(screen.queryByDisplayValue('React')).toBeNull();
    expect(screen.queryByDisplayValue('JavaScript')).toBeInTheDocument();

    fireEvent.submit(screen.getByRole('button', { name: /submit/i}));

    await act(() => javascriptPromise);

    expect(screen.queryByText('Jordan Walke')).toBeNull();
    expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeNull();
    expect(screen.queryByText('Brendan Eich')).toBeInTheDocument();
  });
});