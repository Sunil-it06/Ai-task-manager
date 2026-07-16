"""
operations.py

Implements the supported task operations:
- uppercase
- lowercase
- reverse
- wordcount
"""


class UnsupportedOperationError(Exception):
    pass


def run_operation(operation_type: str, input_text: str) -> str:

    if operation_type == "uppercase":
        return input_text.upper()

    if operation_type == "lowercase":
        return input_text.lower()

    if operation_type == "reverse":
        return input_text[::-1]

    if operation_type == "wordcount":
        word_count = len(input_text.split())
        return str(word_count)

    raise UnsupportedOperationError(
        f"Unsupported operation type: {operation_type}"
    )
