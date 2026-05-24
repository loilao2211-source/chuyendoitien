@echo off
REM Automatic git push script
echo Pushing code to GitHub...

REM Get commit message from user or use default
if "%1"=="" (
    set "msg=Auto-commit: Updated code"
) else (
    set "msg=%*"
)

REM Stage all changes
git add .

REM Commit with message
git commit -m "%msg%"

REM Push to current branch
git push

echo Done! Code pushed to GitHub.
pause
