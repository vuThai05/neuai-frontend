export type SourceType = "internal" | "web"

export interface Source {
    type: SourceType
    title: string
    url: string | null
    snippet: string
    score: number
}

export type Route = "RAG_ONLY" | "RAG_PLUS_WEB"

export type ReasonCode =
    | "RAG_SUFFICIENT_HIGH_CONFIDENCE"
    | "RAG_INSUFFICIENT_LOW_TOP_SCORE"
    | "RAG_INSUFFICIENT_LOW_COVERAGE"
    | "QUERY_REQUIRES_FRESHNESS"
    | "BORDERLINE_ESCALATE_TO_WEB"
    | "BORDERLINE_KEEP_INTERNAL"

export interface Decision {
    route: Route
    reason_code: ReasonCode
    reason: string
    confidence: number
}

export interface ChatResponse {
    answer: string
    conversation_id: string
    decision: Decision
    sources: Source[]
}

export async function chat(
    question: string,
    conversationId?: string | null,
): Promise<ChatResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured. Please set it in your .env.local file.")
    }

    const body: Record<string, unknown> = { question }
    if (conversationId) {
        body.conversation_id = conversationId
    }

    const response = await fetch(`${baseUrl}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
    }

    return response.json()
}
