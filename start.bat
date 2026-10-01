@echo off
title Generator Hasel - Flashcard Password Generator
echo Uruchamianie aplikacji Generator Hasel...
npm start
if %errorlevel% neq 0 (
    echo.
    echo Uruchamianie w domyslnej przegladarce...
    start index.html
)
