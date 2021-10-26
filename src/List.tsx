import * as React from 'react'
import { sortBy } from 'lodash'

import { ImCheckmark2 } from 'react-icons/im'

import { Stories, Story } from './App'

type ListProps = {
    list: Stories;
    onRemoveItem: (item: Story) => void;
}

const SORTS = {
    NONE: (list : Stories) => list,
    TITLE: (list: Stories) => sortBy(list, 'title'),
    AUTHOR: (list: Stories) => sortBy(list, 'author'),
    COMMENTS: (list: Stories) => sortBy(list, 'num_comments'),
    POINTS: (list: Stories) => sortBy(list, 'points')
}

const List = ({ list, onRemoveItem }: ListProps) => {

    type sorting = {
        sortKey: keyof typeof SORTS;
        isReverse: boolean;
    }

    const [sort, setSort] = React.useState<sorting>({
        sortKey: 'NONE', 
        isReverse: false,
    });

    const handleSort = (sortKey: keyof typeof SORTS) => {
        const isReverse = sort.sortKey === sortKey && !sort.isReverse;
        setSort({sortKey: sortKey, isReverse: isReverse});

        setSort({sortKey, isReverse});
    };

    const sortFunction = SORTS[sort.sortKey];
    const sortedList = sort.isReverse
        ? sortFunction(list).reverse()
        : sortFunction(list);

    return (
        <div>
            <div>
                <li style={{ display: 'flex'}}>
                    <span style={{ width: "40%" }}>
                        <button type="button" onClick={() => handleSort('TITLE')}>
                            Title 
                        </button>
                    </span>
                    <span style={{ width: "30%" }}>
                        <button type="button" onClick={() => handleSort('AUTHOR')}>
                            Author
                        </button>
                    </span>
                    <span style={{ width: "10%" }}>
                        <button type="button" onClick={() => handleSort('COMMENTS')}>
                            Comments
                        </button>
                    </span>
                    <span style={{ width: "10%" }}>
                        <button type="button" onClick={() => handleSort('POINTS')}>
                            Points
                        </button>
                    </span>
                    <span style={{ width: "10%" }}>Actions</span>
                </li>
            </div>

            {sortedList.map((item: Story) => (
                <Item
                    key={item.objectID}
                    item={item}
                    onRemoveItem={onRemoveItem}
                />
            ))}
        </div>
    );
};

type ItemProps = {
    item: Story;
    onRemoveItem: (item: Story) => void;
};

const Item = ({ item, onRemoveItem }: ItemProps) => (
    <li style={{ display: 'flex' }}>
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