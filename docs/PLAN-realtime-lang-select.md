# Realtime AI Generation Display & Language Selection

Yêu cầu bổ sung 2 tính năng cho ứng dụng BA Document Generator:
1. **Realtime streaming**: Hiển thị UI cho biết AI đang generate, trả kết quả realtime (gen đến đâu hiển thị đến đấy)
2. **Language selection**: Bổ sung option chọn ngôn ngữ khi tạo SRS từ BRD hoặc FRD từ SRS ở màn preview

---

## User Review Required

> [!IMPORTANT]
> **Streaming Approach**: Cần sử dụng Server-Sent Events (SSE) hoặc ReadableStream để stream kết quả từ AI. Điều này sẽ thay đổi cách API route hoạt động.

> [!WARNING]
> **Breaking Changes**: Transform API routes sẽ có thêm optional parameter `language`. Không ảnh hưởng backward compatibility.

---

## Proposed Changes

### Backend - AI Service Layer

#### [MODIFY] [gemini.ts](file:///c:/Users/kienlt/Desktop/AI/ba-doc-generator/lib/ai/gemini.ts)
- Thêm function `generateWithGeminiStream()` sử dụng `generateContentStream()` API
- Thêm function `transformWithGeminiStream()` cho streaming transform
- Thêm parameter `language` vào `TransformOptions` interface

#### [MODIFY] [ollama.ts](file:///c:/Users/kienlt/Desktop/AI/ba-doc-generator/lib/ai/ollama.ts)
- Thêm function `generateWithOllamaStream()` sử dụng streaming API
- Thêm function `transformWithOllamaStream()` cho streaming transform
- Thêm parameter `language` vào `TransformOptions` interface

#### [MODIFY] [ai-service.ts](file:///c:/Users/kienlt/Desktop/AI/ba-doc-generator/lib/ai/ai-service.ts)
- Thêm function `generateDocumentStream()` returns `AsyncGenerator`
- Thêm function `transformDocumentStream()` returns `AsyncGenerator`
- Update `TransformOptions` interface thêm optional `language` field

---

### Backend - Transform Prompts

#### [MODIFY] [brd-to-srs.ts](file:///c:/Users/kienlt/Desktop/AI/ba-doc-generator/lib/ai/prompts/brd-to-srs.ts)
- Update `buildTransformPrompt()` thêm parameter `language: 'en' | 'vi'`
- Thêm instruction để generate document bằng ngôn ngữ được chọn

#### [MODIFY] [srs-to-frd.ts](file:///c:/Users/kienlt/Desktop/AI/ba-doc-generator/lib/ai/prompts/srs-to-frd.ts)
- Update `buildTransformPrompt()` thêm parameter `language: 'en' | 'vi'`
- Thêm instruction để generate document bằng ngôn ngữ được chọn

---

### Backend - API Routes (Streaming)

#### [NEW] [stream/route.ts](file:///c:/Users/kienlt/Desktop/AI/ba-doc-generator/app/api/generate/stream/route.ts)
- Streaming endpoint cho BRD generation
- Sử dụng `TransformStream` + SSE format
- Return streaming response thay vì JSON

#### [NEW] [stream/route.ts](file:///c:/Users/kienlt/Desktop/AI/ba-doc-generator/app/api/transform/brd-to-srs/stream/route.ts)
- Streaming endpoint cho BRD → SRS transform
- Accept `language` parameter
- Save document sau khi stream complete

#### [NEW] [stream/route.ts](file:///c:/Users/kienlt/Desktop/AI/ba-doc-generator/app/api/transform/srs-to-frd/stream/route.ts)
- Streaming endpoint cho SRS → FRD transform
- Accept `language` parameter  
- Save document sau khi stream complete

---

### Backend - Transform Routes (Language Support)

#### [MODIFY] [brd-to-srs/route.ts](file:///c:/Users/kienlt/Desktop/AI/ba-doc-generator/app/api/transform/brd-to-srs/route.ts)
- Thêm optional `language` parameter từ request body
- Pass `language` vào `transformDocument()` call

#### [MODIFY] [srs-to-frd/route.ts](file:///c:/Users/kienlt/Desktop/AI/ba-doc-generator/app/api/transform/srs-to-frd/route.ts)
- Thêm optional `language` parameter từ request body
- Pass `language` vào `transformDocument()` call

---

### Frontend - Streaming UI Component

#### [NEW] [StreamingContent.tsx](file:///c:/Users/kienlt/Desktop/AI/ba-doc-generator/components/StreamingContent.tsx)
```tsx
// Component hiển thị:
// - Text loading indicator ("AI is thinking...") khi đang connect
// - Realtime markdown content được render dần dần
// - Error state handling
// NOTE: Không cần progress bar, chỉ hiện content streaming
```

---

### Frontend - Preview Page Updates

#### [MODIFY] [page.tsx](file:///c:/Users/kienlt/Desktop/AI/ba-doc-generator/app/preview/%5Bid%5D/page.tsx)
- Thêm state `selectedLanguage` với default là 'vi' (Vietnamese)
- Thêm Language Selector UI gần button "To SRS" / "To FRD"
- Update `handleTransform()` để gọi streaming endpoint
- Integrate `StreamingContent` component cho realtime display
- Thêm modal/overlay hiển thị streaming khi transform

---

## Verification Plan

### Manual Testing

**Test 1: Streaming Display**
1. Mở terminal, chạy `npm run dev` trong thư mục `ba-doc-generator`
2. Mở browser tại `http://localhost:3000`
3. Tạo một BRD mới
4. Verify:
   - Hiển thị text loading ban đầu
   - Nội dung xuất hiện dần dần
   - Không có progress bar

**Test 2: Default Language Behavior**
1. Mở trang preview document
2. Verify dropdown ngôn ngữ mặc định chọn "Vietnamese"
3. Click transform button
4. Verify document được generate bằng tiếng Việt

**Test 3: Language Selection**
1. Đổi sang "English"
2. Click transform button
3. Verify document được generate bằng tiếng Anh

---

## Implementation Notes

### Streaming Technical Details

```typescript
// SSE Response format
const encoder = new TextEncoder();
const stream = new ReadableStream({
  async start(controller) {
    for await (const chunk of aiStream) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
    }
    controller.close();
  }
});

return new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  }
});
```

### Frontend Stream Consumption

```typescript
const response = await fetch('/api/generate/stream', { method: 'POST', body });
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const text = decoder.decode(value);
  // Parse SSE and update state
  setContent(prev => prev + parsedChunk);
}
```
