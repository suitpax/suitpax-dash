#!/bin/bash

# Suitpax MCP Server Management Script

MCP_SERVER_PID_FILE="/tmp/suitpax-mcp-server.pid"
MCP_SERVER_LOG_FILE="/tmp/suitpax-mcp-server.log"

start_server() {
    echo "Starting Suitpax MCP Server..."
    
    if [ -f "$MCP_SERVER_PID_FILE" ]; then
        PID=$(cat "$MCP_SERVER_PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo "MCP Server is already running (PID: $PID)"
            return 0
        else
            echo "Removing stale PID file..."
            rm -f "$MCP_SERVER_PID_FILE"
        fi
    fi
    
    # Start the MCP server
    node dist/lib/mcp/mcp-server.js > "$MCP_SERVER_LOG_FILE" 2>&1 &
    SERVER_PID=$!
    
    echo $SERVER_PID > "$MCP_SERVER_PID_FILE"
    echo "MCP Server started with PID: $SERVER_PID"
    echo "Logs available at: $MCP_SERVER_LOG_FILE"
    
    # Wait a moment and check if server is still running
    sleep 2
    if ps -p $SERVER_PID > /dev/null 2>&1; then
        echo "✅ MCP Server is running successfully"
        return 0
    else
        echo "❌ MCP Server failed to start"
        cat "$MCP_SERVER_LOG_FILE"
        return 1
    fi
}

stop_server() {
    echo "Stopping Suitpax MCP Server..."
    
    if [ -f "$MCP_SERVER_PID_FILE" ]; then
        PID=$(cat "$MCP_SERVER_PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            kill $PID
            echo "MCP Server stopped (PID: $PID)"
            rm -f "$MCP_SERVER_PID_FILE"
        else
            echo "MCP Server was not running"
            rm -f "$MCP_SERVER_PID_FILE"
        fi
    else
        echo "No PID file found. MCP Server may not be running."
    fi
}

status_server() {
    if [ -f "$MCP_SERVER_PID_FILE" ]; then
        PID=$(cat "$MCP_SERVER_PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo "✅ MCP Server is running (PID: $PID)"
            echo "📊 Memory usage: $(ps -o rss= -p $PID | awk '{print $1/1024 " MB"}')"
            echo "⏱️  CPU time: $(ps -o time= -p $PID)"
            return 0
        else
            echo "❌ MCP Server is not running (stale PID file)"
            rm -f "$MCP_SERVER_PID_FILE"
            return 1
        fi
    else
        echo "❌ MCP Server is not running"
        return 1
    fi
}

restart_server() {
    echo "Restarting Suitpax MCP Server..."
    stop_server
    sleep 1
    start_server
}

logs_server() {
    if [ -f "$MCP_SERVER_LOG_FILE" ]; then
        echo "📋 MCP Server Logs:"
        echo "=================="
        tail -n 50 "$MCP_SERVER_LOG_FILE"
    else
        echo "No log file found at $MCP_SERVER_LOG_FILE"
    fi
}

case "$1" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    status)
        status_server
        ;;
    restart)
        restart_server
        ;;
    logs)
        logs_server
        ;;
    *)
        echo "Usage: $0 {start|stop|status|restart|logs}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the MCP server"
        echo "  stop    - Stop the MCP server"
        echo "  status  - Check MCP server status"
        echo "  restart - Restart the MCP server"
        echo "  logs    - Show recent MCP server logs"
        exit 1
        ;;
esac
