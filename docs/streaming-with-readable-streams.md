# 🌊 Streaming with Readable Streams

This guide shows you how to implement streaming data from backend to frontend using **Readable Streams**. **Avoid using WebSockets** unless absolutely necessary for bidirectional real-time communication.

## Why Readable Streams?

- **Simpler**: No need for WebSocket server setup
- **HTTP-based**: Works with standard HTTP/HTTPS
- **Better for one-way data flow**: Perfect for server-to-client streaming
- **Built-in backpressure**: Automatic flow control

## Backend Implementation (Hono.js)

### Example: Streaming JSON data

```typescript
// apps/api/src/index.ts
import { Hono } from 'hono';
import { stream } from 'hono/streaming';

const app = new Hono();

app.get('/stream/data', (c) => {
  return stream(c, async (stream) => {
    // Stream multiple JSON objects
    for (let i = 0; i < 10; i++) {
      const data = { id: i, message: `Item ${i}`, timestamp: Date.now() };
      await stream.writeln(JSON.stringify(data));
      await stream.sleep(1000); // Wait 1 second between items
    }
  });
});

// Example: Streaming large file or AI responses
app.get('/stream/ai-response', (c) => {
  return stream(c, async (stream) => {
    const chunks = [
      'Hello, ',
      'this is ',
      'a streaming ',
      'response ',
      'from the AI!'
    ];
    
    for (const chunk of chunks) {
      await stream.write(chunk);
      await stream.sleep(500);
    }
  });
});
```

## Frontend Implementation (React)

### Example: Consuming streamed data

```typescript
// apps/web/src/pages/StreamExample.tsx
import { useEffect, useState } from 'react';

export default function StreamExample() {
  const [items, setItems] = useState<Array<{ id: number; message: string }>>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const startStream = async () => {
    setIsStreaming(true);
    setItems([]);

    try {
      const response = await fetch('/api/stream/data');
      
      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            setItems(prev => [...prev, data]);
          } catch (e) {
            console.error('Failed to parse JSON:', e);
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div>
      <button onClick={startStream} disabled={isStreaming}>
        {isStreaming ? 'Streaming...' : 'Start Stream'}
      </button>
      
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.message}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Example: Streaming text (AI responses)

```typescript
// apps/web/src/pages/AIStreamExample.tsx
import { useState } from 'react';

export default function AIStreamExample() {
  const [text, setText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const startAIStream = async () => {
    setIsStreaming(true);
    setText('');

    try {
      const response = await fetch('/api/stream/ai-response');
      
      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        setText(prev => prev + chunk);
      }
    } catch (error) {
      console.error('Stream error:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div>
      <button onClick={startAIStream} disabled={isStreaming}>
        {isStreaming ? 'Streaming...' : 'Start AI Stream'}
      </button>
      
      <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
    </div>
  );
}
```

## Advanced: Using Server-Sent Events (SSE)

For automatic reconnection and a simpler API, consider using Server-Sent Events with the `EventSource` API:

### Backend (Hono.js)

```typescript
app.get('/sse/events', (c) => {
  return stream(c, async (stream) => {
    // Set SSE headers
    c.header('Content-Type', 'text/event-stream');
    c.header('Cache-Control', 'no-cache');
    c.header('Connection', 'keep-alive');

    for (let i = 0; i < 10; i++) {
      const data = { id: i, message: `Event ${i}` };
      await stream.writeln(`data: ${JSON.stringify(data)}\n\n`);
      await stream.sleep(1000);
    }
  });
});
```

### Frontend (React)

```typescript
import { useEffect, useState } from 'react';

export default function SSEExample() {
  const [events, setEvents] = useState<Array<{ id: number; message: string }>>([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/sse/events');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setEvents(prev => [...prev, data]);
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h2>Server-Sent Events</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.message}</li>
        ))}
      </ul>
    </div>
  );
}
```

> [!TIP]
> For Server-Sent Events (SSE) with automatic reconnection, the `EventSource` API is simpler than manual ReadableStream handling.

## Use Cases

### When to use Readable Streams:
- **AI/LLM responses**: Stream text as it's generated
- **Large file downloads**: Stream file chunks progressively
- **Real-time logs**: Stream server logs to the client
- **Progress updates**: Stream build/deployment progress
- **Data processing**: Stream results as they're computed

### When to use WebSockets instead:
- **Bidirectional communication**: Client and server both send messages
- **Real-time chat**: Multiple users sending messages
- **Collaborative editing**: Multiple users editing the same document
- **Gaming**: Low-latency, bidirectional game state updates

## Best Practices

1. **Handle errors gracefully**: Always wrap stream reading in try-catch
2. **Clean up resources**: Close readers when done or on unmount
3. **Show loading states**: Indicate when streaming is in progress
4. **Handle backpressure**: Let the browser manage flow control
5. **Use appropriate content types**: Set correct headers for your data format
6. **Test edge cases**: Test network failures, slow connections, and large payloads

## Additional Resources

- [Hono Streaming Helper](https://hono.dev/helpers/streaming)
- [MDN: Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
- [MDN: Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
