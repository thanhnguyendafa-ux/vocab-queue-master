export function setupAnalyticsWebSocket(store) {
    if (typeof window === 'undefined')
        return;
    var protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    var socket = new WebSocket("".concat(protocol, "//").concat(window.location.host, "/api/analytics"));
    socket.onmessage = function (event) {
        var data = JSON.parse(event.data);
        if (data.type === 'SESSION_UPDATE') {
            store.setState({
                sessionHistory: data.sessions,
                items: data.items
            });
        }
    };
    return function () { return socket.close(); };
}
//# sourceMappingURL=websocket.js.map