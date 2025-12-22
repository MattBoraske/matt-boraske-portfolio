| Research | Github Repo | HuggingFace Repo | Paper URL  | Publication Date | Abstract |
|----------|-------------|------------|------------------|----------|
| Context is Key: Aligning Large Language Models with Human Moral Judgments through Retrieval-Augmented Generation | https://github.com/MattBoraske/AITA-RAG-Agent | https://huggingface.co/collections/MattBoraske/reddit-aita-finetuning-v2 | https://journals.flvc.org/FLAIRS/article/download/138947/144114 | May 2025 | In this paper, we investigate whether pre-trained large
language models (LLMs) can align with human moral
judgments on a dataset of approximately fifty thousand interpersonal conflicts from the AITA (Am I the
A******) subreddit, an online forum where users evaluate the morality of others. We introduce a retrievalaugmented generation (RAG) approach that uses pretrained LLMs as core components. After collecting conflict posts from AITA and embedding them in a vector database, the RAG agent retrieves the most relevant
posts for each new query. Then, these are used sequentially as context to gradually refine the LLM’s judgment, providing adaptability without having to undergo
costly fine-tuning. Using OpenAI’s GPT-4o, our agent
outperforms directly prompting the LLM while achieving 83% accuracy and a Matthews correlation coefficient of 0.469 while also reducing the rate of toxic responses from 22.53% to virtually zero. These findings
indicate that the integration of LLMs into RAG agents is
an effective method to improve their alignment with human moral judgments while mitigating toxic language.
The Efficacy of Finetuning Large Language Models for Interpersonal Conflict Resolution | https://github.com/MattBoraske/Reddit-AITA-Conflict-Resolution-LLM-FT-Efficacy | https://huggingface.co/collections/MattBoraske/reddit-aita-finetuning-v1 | https://digitalcommons.wcupa.edu/cgi/viewcontent.cgi?article=1461&context=all_theses | May 2024 | Since its introduction in 2017, the transformer architecture has revolutionized natural language
processing, leading to the development of large language models (LLMs). Encoder-decoder transformers excel at tasks requiring deep understanding, such as summarization and question-answering.
Decoder-only variants have been optimized for generating coherent, extended texts.
Despite their success in deterministic tasks like translation, LLMs have been less explored
in ambiguous tasks such as interpersonal conflict resolution. This study addresses this gap by
evaluating LLMs on four new datasets derived from the ”Am I the A**hole” (AITA) subreddit,
featuring discussions of interpersonal conflicts. These datasets challenge models with real-world
data including ambiguous judgments and toxic language.
This research utilizes Google’s Flan-T5 and Meta’s Llama-2-Chat to represent both architectures. Finetuned on the AITA datasets, these models were evaluated on their ability to classify
and justify conflicts and their tendency to generate toxic language. Findings suggest that the most
effective strategy involves finetuning an encoder-decoder LLM on a dataset cleaned of toxicity,
followed by iterative refinement using Reinforcement Learning with Human Feedback (RLHF) to
align with ethical standards.
To our knowledge, this is the first work examining the use of transformer-based LLMs for realworld interpersonal conflict resolution, offering insights for applications in social and therapeutic
contexts where sensitive advice is crucial. It also contributes to discussions on the ethical implications of deploying AI in sensitive areas, suggesting ways it can complement human judgment.
