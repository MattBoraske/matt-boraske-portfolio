/**
 * Research & Writing Agent
 *
 * This agent:
 * 1. Researches current topics in AI/ML/Cloud using web search
 * 2. Identifies the most interesting trends
 * 3. Writes expert-to-amateur articles (1200-1800 words)
 * 4. Saves drafts locally for manual publishing
 *
 * Note: Medium API deprecated as of Jan 2025. Articles saved to ./drafts/
 */

import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

const RESEARCH_TOPICS = [
    'data science',
    'system architecture',
    'cloud computing',
    'traditional AI',
    'generative AI',
    'AI agents',
    'machine learning',
    'MLOps'
];

/**
 * Execute a web search using DuckDuckGo's HTML API
 */
async function executeWebSearch(query) {
    console.log(`  🔎 Searching: "${query}"`);

    try {
        // Use DuckDuckGo HTML search
        const response = await axios.get('https://html.duckduckgo.com/html/', {
            params: {
                q: query
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        // Parse HTML to extract search results (basic parsing)
        const html = response.data;

        // Extract snippets from DuckDuckGo results
        // This is a simple regex-based extraction - in production you'd use a proper HTML parser
        const snippetMatches = [...html.matchAll(/class="result__snippet"[^>]*>(.*?)<\/a>/gs)];
        const titleMatches = [...html.matchAll(/class="result__a"[^>]*>(.*?)<\/a>/gs)];

        let results = [];
        for (let i = 0; i < Math.min(5, snippetMatches.length); i++) {
            const snippet = snippetMatches[i]?.[1]?.replace(/<[^>]*>/g, '').trim() || '';
            const title = titleMatches[i]?.[1]?.replace(/<[^>]*>/g, '').trim() || '';
            if (snippet && title) {
                results.push(`${title}: ${snippet}`);
            }
        }

        if (results.length === 0) {
            return `Search completed for "${query}" but no detailed results extracted. Query processed.`;
        }

        return `Search results for "${query}":\n${results.join('\n\n')}`;

    } catch (error) {
        console.error(`  ❌ Search failed: ${error.message}`);
        // Fallback to basic response if search fails
        return `Search attempted for "${query}". Topic area: ${query}. Consider recent developments in this space.`;
    }
}

/**
 * Step 1: Research current topics using web search
 */
async function researchCurrentTopics() {
    console.log('🔍 Researching current topics...\n');

    const initialPrompt = `You are a tech research assistant. Search the web to identify the most interesting and important recent developments (late 2025) in these areas:

${RESEARCH_TOPICS.map((topic, i) => `${i + 1}. ${topic}`).join('\n')}

For each area, search for:
- Breakthrough technologies or methods
- Major company announcements
- Significant research findings
- Emerging trends
- Practical applications gaining traction

After searching, return ONLY a valid JSON array (no additional text) of the top 5 most interesting topics:
[
    {
        "topic": "Brief topic title",
        "category": "data science|system architecture|cloud computing|traditional AI|generative AI|AI agents|machine learning|MLOps",
        "description": "2-3 sentence description of what's happening",
        "why_interesting": "Why this matters to practitioners"
    }
]`;

    const messages = [{
        role: 'user',
        content: initialPrompt
    }];

    const tools = [{
        name: 'web_search',
        description: 'Search the web for current information about technology trends and developments',
        input_schema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'The search query to execute'
                }
            },
            required: ['query']
        }
    }];

    let topics = [];
    const maxIterations = 10; // Prevent infinite loops
    let iteration = 0;

    while (iteration < maxIterations) {
        iteration++;

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-5-20250929',
            max_tokens: 4000,
            messages: messages,
            tools: tools
        });

        // Add assistant's response to conversation
        messages.push({
            role: 'assistant',
            content: response.content
        });

        // Check if Claude wants to use tools (collect ALL tool uses)
        const toolUses = response.content.filter(block => block.type === 'tool_use');

        if (toolUses.length > 0) {
            // Execute all web searches in parallel
            const searchPromises = toolUses.map(toolUse =>
                executeWebSearch(toolUse.input.query)
            );
            const searchResults = await Promise.all(searchPromises);

            // Send all results back to Claude
            const toolResults = toolUses.map((toolUse, index) => ({
                type: 'tool_result',
                tool_use_id: toolUse.id,
                content: searchResults[index]
            }));

            messages.push({
                role: 'user',
                content: toolResults
            });
        } else {
            // No more tool use - extract final response
            const textBlock = response.content.find(block => block.type === 'text');
            if (textBlock) {
                try {
                    const jsonMatch = textBlock.text.match(/\[[\s\S]*\]/);
                    if (jsonMatch) {
                        topics = JSON.parse(jsonMatch[0]);
                        console.log(`✅ Found ${topics.length} topics\n`);
                    }
                } catch (e) {
                    console.error('Failed to parse topics:', e);
                }
            }
            break;
        }
    }

    return topics;
}

/**
 * Step 2: Select best topic for article
 */
async function selectBestTopic(topics) {
    console.log('📊 Analyzing topics to select the best one...\n');

    const prompt = `You are an editor for a technical blog aimed at helping professionals learn about new technologies.

Here are potential article topics:
${JSON.stringify(topics, null, 2)}

Select the ONE topic that would make the best article for an audience of:
- Mid-level to senior engineers
- People who want to understand practical applications
- Readers who appreciate expert knowledge explained clearly

Consider:
- Timeliness and relevance
- Practical applicability
- Educational value
- Interest level

Return ONLY the index (0-${topics.length - 1}) of the best topic.`;

    const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 100,
        messages: [{
            role: 'user',
            content: prompt
        }]
    });

    const responseText = message.content[0].text.trim();
    const index = parseInt(responseText.match(/\d+/)?.[0] || '0');

    return topics[Math.min(index, topics.length - 1)];
}

/**
 * Step 3: Write the Medium article
 */
async function writeArticle(topic) {
    console.log(`✍️  Writing article about: ${topic.topic}\n`);

    const prompt = `You are a senior technical expert writing for Medium. Your audience is intermediate-level professionals who want to learn about cutting-edge technologies explained clearly.

Write a comprehensive, engaging article about:
**${topic.topic}**

Context: ${topic.description}
Why it matters: ${topic.why_interesting}

Article Requirements:
1. **Tone**: Expert explaining to motivated amateurs - friendly but authoritative
2. **Length**: 1200-1800 words
3. **Structure**:
   - Catchy, clear title
   - Hook that explains why readers should care
   - Background/context section
   - Deep dive into the technology/concept
   - Practical examples or use cases
   - Implications for the field
   - What to learn next / how to get started
   - Conclusion

4. **Style**:
   - Use analogies and real-world examples
   - Explain technical terms when first used
   - Include concrete examples
   - Break down complex concepts
   - Use subheadings for scanability
   - Add occasional personal insights or industry observations

5. **Format**: Markdown with proper headings (# ## ###)

Write the article now:`;

    const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 8000,
        messages: [{
            role: 'user',
            content: prompt
        }]
    });

    const article = message.content[0].text;

    // Extract title and content
    const titleMatch = article.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : topic.topic;

    return {
        title,
        content: article,
        tags: generateTags(topic.category, article)
    };
}

/**
 * Generate appropriate tags for the article
 */
function generateTags(category, content) {
    const tagMap = {
        'data science': ['data-science', 'analytics', 'machine-learning'],
        'system architecture': ['software-architecture', 'system-design', 'engineering'],
        'cloud computing': ['cloud-computing', 'devops', 'infrastructure'],
        'traditional AI': ['artificial-intelligence', 'machine-learning', 'ai'],
        'generative AI': ['generative-ai', 'llm', 'ai'],
        'AI agents': ['ai-agents', 'artificial-intelligence', 'automation']
    };

    const baseTags = tagMap[category.toLowerCase()] || ['technology', 'software-engineering'];

    // Add technology-specific tags based on content
    const additionalTags = [];
    if (content.includes('Python')) additionalTags.push('python');
    if (content.includes('AWS') || content.includes('Amazon')) additionalTags.push('aws');
    if (content.includes('Kubernetes')) additionalTags.push('kubernetes');
    if (content.includes('Docker')) additionalTags.push('docker');

    return [...baseTags, ...additionalTags].slice(0, 5);
}

/**
 * Step 4: Post to Medium
 */
async function postToMedium(article, isDraft = true) {
    console.log('📤 Publishing to Medium...\n');

    const token = process.env.MEDIUM_INTEGRATION_TOKEN;

    if (!token) {
        console.log('⚠️  No Medium token found. Article saved locally only.');
        return null;
    }

    try {
        // Get user ID
        const userResponse = await axios.get('https://api.medium.com/v1/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const userId = userResponse.data.data.id;

        // Create post
        const postResponse = await axios.post(
            `https://api.medium.com/v1/users/${userId}/posts`,
            {
                title: article.title,
                contentFormat: 'markdown',
                content: article.content,
                tags: article.tags,
                publishStatus: isDraft ? 'draft' : 'public',
                notifyFollowers: false
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Article published to Medium!');
        console.log(`   URL: ${postResponse.data.data.url}`);

        return postResponse.data.data;
    } catch (error) {
        console.error('❌ Failed to publish to Medium:', error.response?.data || error.message);
        return null;
    }
}

/**
 * Save article locally for review
 */
async function saveArticleLocally(article, topic) {
    const fs = await import('fs');
    const path = await import('path');

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${timestamp}-${article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    const filepath = path.join(process.cwd(), 'drafts', filename);

    // Create drafts directory if it doesn't exist
    if (!fs.existsSync(path.join(process.cwd(), 'drafts'))) {
        fs.mkdirSync(path.join(process.cwd(), 'drafts'));
    }

    const frontmatter = `---
title: ${article.title}
category: ${topic.category}
tags: ${article.tags.join(', ')}
date: ${new Date().toISOString()}
status: draft
---

`;

    fs.writeFileSync(filepath, frontmatter + article.content);
    console.log(`💾 Article saved to: ${filepath}\n`);
}

/**
 * Main function
 */
async function main() {
    console.log('🤖 Research & Writing Agent Starting...\n');
    console.log('=' .repeat(60));

    try {
        // Step 1: Research topics
        const topics = await researchCurrentTopics();
        console.log(`Found ${topics.length} interesting topics\n`);

        if (topics.length === 0) {
            console.log('No topics found. Exiting.');
            return;
        }

        // Step 2: Select best topic
        const selectedTopic = await selectBestTopic(topics);
        console.log(`Selected topic: ${selectedTopic.topic}\n`);

        // Step 3: Write article
        const article = await writeArticle(selectedTopic);
        console.log(`Article written: "${article.title}"\n`);
        console.log(`Word count: ~${article.content.split(/\s+/).length} words\n`);

        // Step 4: Save locally
        await saveArticleLocally(article, selectedTopic);

        console.log('=' .repeat(60));
        console.log('✅ Agent completed successfully!\n');
        console.log('📝 Next steps:');
        console.log('   1. Review the article in the drafts folder');
        console.log('   2. Make any edits you want');
        console.log('   3. Publish manually to Medium, Dev.to, or your platform of choice\n');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Run the agent
main();
