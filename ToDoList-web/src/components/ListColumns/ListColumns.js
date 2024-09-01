import React from 'react';
import { Draggable } from 'react-smooth-dnd';
import Column from 'components/ListColumns/Column/Column';

function ListColumns(props) {
    const { columns, onCardDrop, onupdateColumnAPIState } = props;
    return columns.map((column, index) => (
        <Draggable key={index}>
            <Column column={column} onCardDrop={onCardDrop} onupdateColumnAPIState={onupdateColumnAPIState} />
        </Draggable>
    ));
}

export default React.memo(ListColumns);
