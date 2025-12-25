# Research Publications

## Context is Key: Aligning Large Language Models with Human Moral Judgments through Retrieval-Augmented Generation
- **Venue:** FLAIRS (Florida Artificial Intelligence Research Society)
- **Year:** 2025
- **Summary:** This research investigates whether pre-trained large language models (LLMs) can align with human moral judgments on a dataset of approximately fifty thousand interpersonal conflicts from the AITA (Am I the A******) subreddit. We introduce a retrieval-augmented generation (RAG) approach that uses pre-trained LLMs as core components. Using OpenAI's GPT-4o, our agent outperforms directly prompting the LLM while achieving 83% accuracy and a Matthews correlation coefficient of 0.469 while also reducing the rate of toxic responses from 22.53% to virtually zero.
- **Authors:** Boraske, M.
- **Tags:** LLMs, RAG, NLP, Moral Judgments, Conflict Resolution
- **PDF:** https://journals.flvc.org/FLAIRS/article/download/138947/144114
- **GitHub:** https://github.com/MattBoraske/AITA-RAG-Agent
- **HuggingFace:** https://huggingface.co/collections/MattBoraske/reddit-aita-finetuning-v2

## The Efficacy of Finetuning Large Language Models for Interpersonal Conflict Resolution
- **Venue:** West Chester University of Pennsylvania - M.S. Thesis
- **Year:** 2024
- **Summary:** This study addresses the gap in evaluating LLMs on ambiguous tasks such as interpersonal conflict resolution. We evaluate LLMs on four new datasets derived from the "Am I the A**hole" (AITA) subreddit, featuring discussions of interpersonal conflicts. Using Google's Flan-T5 and Meta's Llama-2-Chat, these models were evaluated on their ability to classify and justify conflicts and their tendency to generate toxic language. Findings suggest that the most effective strategy involves finetuning an encoder-decoder LLM on a dataset cleaned of toxicity, followed by iterative refinement using RLHF to align with ethical standards.
- **Authors:** Boraske, M. (Advised by Dr. Richard Burns)
- **Tags:** LLMs, Fine-tuning, NLP, Conflict Resolution, RLHF
- **PDF:** https://digitalcommons.wcupa.edu/cgi/viewcontent.cgi?article=1461&context=all_theses
- **GitHub:** https://github.com/MattBoraske/Reddit-AITA-Conflict-Resolution-LLM-FT-Efficacy
- **HuggingFace:** https://huggingface.co/collections/MattBoraske/reddit-aita-finetuning-v1
- **ID:** thesis
