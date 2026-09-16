with open('src/app/page.tsx.bak', 'rb') as f:
    data = f.read()

lines = data.split(b'\n')
print(f'Original lines: {len(lines)}')

# Remove lines 397-424 (0-indexed), which is original lines 398-425
new_lines = lines[:397] + lines[425:]
print(f'After removal: {len(new_lines)} lines')

new_data = b'\n'.join(new_lines)
with open('src/app/page.tsx', 'wb') as f:
    f.write(new_data)

print('File written')
