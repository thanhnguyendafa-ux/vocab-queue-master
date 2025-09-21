import React from 'react';
import { VariableSizeList as List } from 'react-window';
export function VirtualizedChart(_a) {
    var data = _a.data, height = _a.height;
    var itemSize = function (index) {
        return data[index].isLarge ? 100 : 50;
    };
    var Row = function (_a) {
        var index = _a.index, style = _a.style;
        return (<div style={style}>
      {/* Render chart item */}
    </div>);
    };
    return (<List height={height} itemCount={data.length} itemSize={itemSize} width="100%">
      {Row}
    </List>);
}
//# sourceMappingURL=VirtualizedChart.jsx.map