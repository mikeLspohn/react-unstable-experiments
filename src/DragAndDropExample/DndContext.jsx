import React, { Component } from "react"
import { Draggable, Droppable, DragDropContext } from "react-beautiful-dnd"

const reorderRow = isDragging => ({
  color: "#89909c",
  padding: "20px",
  opacity: isDragging ? 0.3 : 1,
  borderBottom: "1px solid #dfe4ea",
  borderTop: 0,
  borderLeft: 0,
  cursor: "pointer"
})

const iconStyle = {
  paddingRight: "10px",
  color: "#15b4db"
}

// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }))

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "gray" : "black",

  // styles we need to apply on draggables
  ...reorderRow,
  ...draggableStyle
})

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "grey",
  padding: grid,
  width: 250
})

const reorderRowI = {
  paddingRight: "10px",
  color: "red"
}

export default class DndContext extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      items: getItems(10)
    }
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    )

    this.setState({
      items
    })
  }

  render() {
    return (
      <div
        style={{
          margin: "20px auto",
          width: "50%",
          padding: "20px",
          border: "1px solid #f3f3f3",
          borderRadius: "5px"
        }}
      >
        <div
          style={{ marginBottom: "20px", borderBottom: "1px solid #f3f3f3" }}
        >
          <h2>Reorder Modal</h2>
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(droppableProvided, droppableSnapshot) => (
              <div ref={droppableProvided.innerRef}>
                {this.state.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(draggableProvided, draggableSnapshot) => (
                      <div>
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          <div style={reorderRow(draggableSnapshot.isDragging)}>
                            {item.content}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    )
  }
}
