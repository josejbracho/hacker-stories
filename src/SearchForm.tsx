import * as React from 'react'

import { InputWithLabel } from './InputWithLabel';
import { BiSearchAlt } from 'react-icons/bi'

type SearchFormProps = {
    searchTerm: string;
    onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const SearchForm = ({
    searchTerm,
    onSearchInput,
    onSearchSubmit,
}: SearchFormProps) => (
    <form onSubmit={onSearchSubmit} className="search-form">
        <InputWithLabel
            id="search"
            value={searchTerm}
            isFocused
            onInputChange={onSearchInput}
        >
            <strong>Search:</strong>
        </InputWithLabel>

        <button
            aria-label='submit'
            type="submit"
            disabled={!searchTerm}
            className="button button_large"
        >
            <BiSearchAlt />
        </button>
    </form>
);

export { SearchForm };