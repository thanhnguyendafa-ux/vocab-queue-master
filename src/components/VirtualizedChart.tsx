import React from 'react'
import { VariableSizeList as List } from 'react-window'

export function VirtualizedChart({ data, height }: {
  data: any[]
  height: number
}) {
  const itemSize = (index: number) => 
    data[index].isLarge ? 100 : 50

  const Row = ({ index, style }: { index: number, style: any }) => (
    <div style={style}>
      {/* Render chart item */}
    </div>
  )

  return (
    <List
      height={height}
      itemCount={data.length}
      itemSize={itemSize}
      width="100%"
    >
      {Row}
    </List>
  )
}
