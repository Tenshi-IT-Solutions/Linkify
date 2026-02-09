# How to Use Directives

This directory contains Standard Operating Procedures (SOPs) called Directives.

## Creating a New Directive
1. Create a new markdown file in this directory (e.g. `scrape_website.md`).
2. Clearly define the **Goal** of the directive.
3. List strictly required **Inputs**.
4. Describe the **Process** logic (which tools to call, in what order).
5. Define the expected **Outputs**.

## Example Structure

```markdown
# [Directive Name]

## Goal
[One sentence description]

## Inputs
- [Input 1]
- [Input 2]

## Tools
- `execution/script_name.py`

## Process
1. Run `execution/script_name.py` with arguments...
2. Verify output in `.tmp/`...
3. If error, do X...

## Outputs
- [Output file path or result]
```

## Maintenance
- If a script fails or an API changes, update the Directive to reflect the new reality.
- Maintain version history if necessary (e.g. strictly via git).
