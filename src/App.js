import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";

const App = () => {
  const [lists, setLists] = useState([
    {
      id: "list-1",
      title: "To Do",
      cards: [
        { id: "card-1", content: "Task 1" },
        { id: "card-2", content: "Task 2" },
      ],
    },
    {
      id: "list-2",
      title: "Doing",
      cards: [
        { id: "card-3", content: "Task 3" },
        { id: "card-4", content: "Task 4" },
      ],
    },
  ]);

  // Drag-and-Drop Handler
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    // Moving within the same list
    if (source.droppableId === destination.droppableId) {
      const listIndex = lists.findIndex((list) => list.id === source.droppableId);
      const updatedCards = Array.from(lists[listIndex].cards);
      const [movedCard] = updatedCards.splice(source.index, 1);
      updatedCards.splice(destination.index, 0, movedCard);

      const updatedLists = [...lists];
      updatedLists[listIndex].cards = updatedCards;
      setLists(updatedLists);
    } else {
      // Moving between lists
      const sourceListIndex = lists.findIndex((list) => list.id === source.droppableId);
      const destinationListIndex = lists.findIndex(
        (list) => list.id === destination.droppableId
      );

      const sourceCards = Array.from(lists[sourceListIndex].cards);
      const destinationCards = Array.from(lists[destinationListIndex].cards);

      const [movedCard] = sourceCards.splice(source.index, 1);
      destinationCards.splice(destination.index, 0, movedCard);

      const updatedLists = [...lists];
      updatedLists[sourceListIndex].cards = sourceCards;
      updatedLists[destinationListIndex].cards = destinationCards;
      setLists(updatedLists);
    }
  };

  // Add a new card to a list
  const addCard = (listId) => {
    const newCard = { id: `card-${Date.now()}`, content: "New Card" };
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        return { ...list, cards: [...list.cards, newCard] };
      }
      return list;
    });
    setLists(updatedLists);
  };

  // Add a new list
  const addList = () => {
    const newList = {
      id: `list-${Date.now()}`,
      title: "New List",
      cards: [],
    };
    setLists([...lists, newList]);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Trello-like Board</h1>
        <button className="add-list-btn" onClick={addList}>
          + Add another list
        </button>
      </header>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {lists.map((list) => (
            <Droppable droppableId={list.id} key={list.id}>
              {(provided) => (
                <div
                  className="list"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="list-header">
                    <h3>{list.title}</h3>
                  </div>
                  <div className="card-container">
                    {list.cards.map((card, index) => (
                      <Draggable
                        draggableId={card.id}
                        index={index}
                        key={card.id}
                      >
                        {(provided) => (
                          <div
                            className="card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {card.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                  <button
                    className="add-card-btn"
                    onClick={() => addCard(list.id)}
                  >
                    + Add a card
                  </button>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;
