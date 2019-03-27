workflow "Code quality" {
  on = "push"
  resolves = ["Run ESLint"]
}

action "Run ESLint" {
  uses = "stefanoeb/eslint-action@1.0.0"
}
