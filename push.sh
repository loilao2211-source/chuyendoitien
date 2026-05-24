#!/bin/bash
# Automatic git push script

echo "Pushing code to GitHub..."

# Get commit message from user or use default
if [ -z "$1" ]; then
    msg="Auto-commit: Updated code"
else
    msg="$@"
fi

# Stage all changes
git add .

# Commit with message
git commit -m "$msg"

# Push to current branch
git push

echo "Done! Code pushed to GitHub."
