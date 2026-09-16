with open('src/app/page.tsx.bak', 'rb') as f:
    data = f.read()

# Check for any bytes that look like '[' but aren't 0x5b
for i, b in enumerate(data):
    if b == 0x5b:  # regular [
        # Check surrounding context
        ctx = data[max(0,i-10):i+15]
        # If it looks like 'const [' followed by identifier
        if ctx.endswith(b'const '):
            print(f'Found [ at offset {i}, context: {repr(ctx)}')

# Also check for any 0x5b that's right before 'mounted'
idx = data.find(b'mounted')
while idx >= 0:
    if idx > 0:
        prev = data[idx-1]
        print(f'mounted at offset {idx}, prev byte: 0x{prev:02x} = {chr(prev) if 32 <= prev < 127 else "?"}')
    idx = data.find(b'mounted', idx + 1)
