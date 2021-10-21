import * as React from 'react'

import { ImCheckmark2 } from 'react-icons/im'

import { Stories, Story } from './App'

type ListProps = {
    list: Stories;
    onRemoveItem: (item: Story) => void;
}

const List = ({ list, onRemoveItem }: ListProps) => (
    <ul>
        {list.map((item) => (
            <Item
                key={item.objectID}
                item={item}
                onRemoveItem={onRemoveItem}
            />
        ))}
    </ul>
);

type ItemProps = {
    item: Story;
    onRemoveItem: (item: Story) => void;
};

const Item = ({ item, onRemoveItem }: ItemProps) => (
    <li className="item">
        <span style={{ width: "40%" }}>
            <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%' }}>{item.author}</span>
        <span style={{ width: '10%' }}>{item.num_comments}</span>
        <span style={{ width: '10%' }}>{item.points}</span>
        <span style={{ width: '10%' }}>
            <button
                type="button"
                onClick={() => onRemoveItem(item)}
                className="button button_small"
            >
                <ImCheckmark2 />
            </button>
        </span>
    </li>
);

export { List };