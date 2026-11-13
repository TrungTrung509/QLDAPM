#!/bin/bash
has_model=0
for arg in "$@"; do
    if [[ "$arg" == --model* ]] || [[ "$arg" == "-m" ]]; then
        has_model=1
        break
    fi
done

if [ $has_model -eq 0 ]; then
    exec /usr/local/bin/agy-bin --model gemini-3.6-flash-low "$@"
else
    exec /usr/local/bin/agy-bin "$@"
fi

