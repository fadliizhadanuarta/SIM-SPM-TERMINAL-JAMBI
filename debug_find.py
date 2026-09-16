import re

with open('src/app/page.tsx.bak', 'r') as f:
    lines = f.readlines()

# Find all '{/* Rekap Seluruh Terminal */}' lines
for i, line in enumerate(lines):
    if 'Rekap Seluruh Terminal' in line and '<!--' in line:
        print(f'Line {i+1}: {line.strip()}')

# Find 'Section 5: Tampilan'
for i, line in enumerate(lines):
    if 'Section 5: Tampilan' in line:
        print(f'Line {i+1}: {line.strip()}')

# Find dark mode state
for i, line in enumerate(lines):
    if 'darkMode' in line and 'useState' in line:
        print(f'Line {i+1}: {line.strip()}')
    if 'toggleDarkMode' in line and 'useCallback' in line:
        print(f'Line {i+1}: {line.strip()}')
    if 'mounted' in line and 'useState' in line and 'setMounted' in line:
        print(f'Line {i+1}: {line.strip()}')
