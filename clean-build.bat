@echo off
echo Cleaning Next.js build cache...
if exist .next (
    rmdir /s /q .next
    echo .next directory removed
) else (
    echo .next directory not found
)

echo.
echo Running fresh build...
npm run build
