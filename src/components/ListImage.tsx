import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './styles.css';

export const ListImage: React.FC = () => {
  const dataList = [
    { id: '1', label: 'List Item 1' },
    { id: '2', label: 'List Item 2' },
    { id: '3', label: 'List Item 3' },
    { id: '4', label: 'List Item 4' },
    { id: '5', label: 'List Item 5' },
    { id: '6', label: 'List Item 6' },
  ];
  const [dragDropList, setDragDropList] = useState(dataList);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const arr = [...dragDropList];
    let removedItem = arr.splice(result.source.index, 1)[0];
    arr.splice(result.destination.index, 0, removedItem);

    setDragDropList(arr);
  };

  return (
    <div className='container flex-wrap'>
      <div className='card'>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='drag-drop-list' direction='horizontal'>
            {(provided, snapshot) => (
              <div
                className='drag-drop-list-container'
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {dragDropList.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        className='item-card'
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <span className='material-symbols-outlined'>
                          drag_indicator
                        </span>
                        <p className='label'>{item.label}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};
