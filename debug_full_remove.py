with open('src/app/page.tsx.bak', 'rb') as f:
    data = f.read()

lines = data.split(b'\n')
print(f'Original lines: {len(lines)}')

# Remove in reverse order to preserve line numbers:
# 1. Dark mode toggle in settings: lines 3327-3361 (0-indexed 3326-3360)
# 2. handleDownloadRekapSeluruhTerminal function: lines 1337-1429 (0-indexed 1336-1428)
# 3. Dark mode state/effects: lines 398-425 (0-indexed 397-424)

removals = [
    (3326, 3361),  # dark mode toggle section (div containing the card)
    (1336, 1429),  # handleDownloadRekapSeluruhTerminal function
    (397, 425),    # dark mode state/effects
]

# Sort in reverse order
removals.sort(reverse=True)

for start, end in removals:
    print(f'Removing lines {start+1}-{end} ({end-start} lines)')
    lines = lines[:start] + lines[end:]

print(f'After removals: {len(lines)} lines')

new_data = b'\n'.join(lines)
with open('src/app/page.tsx', 'wb') as f:
    f.write(new_data)

print('File written')