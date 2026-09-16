with open('src/app/page.tsx', 'r') as f:
    lines = f.readlines()

# Remove ALL recently added code:
# 1. Dark mode state+effects (lines 398-425)
# 2. handleDownloadRekapSeluruhTerminal function (lines 1338-1430)  
# 3. Overview tab rekap card (lines 2499-2531)
# 4. Laporan tab rekap card (around line 2710+)
# 5. Dark mode toggle in settings (lines 3328-3362)

# First, let's just try removing dark mode toggle JSX and rekap cards
# and see what happens

# Remove the Rekap Seluruh Terminal card from Overview (lines 2499-2531)
# Find it
rekap_start = None
for i, line in enumerate(lines):
    if '{/* Rekap Seluruh Terminal */}' in line:
        rekap_start = i
        break

if rekap_start:
    # Find end of this Card (matching </Card>)
    card_count = 0
    rekap_end = None
    for i in range(rekap_start, len(lines)):
        if '<Card' in lines[i] and '/>' not in lines[i]:
            card_count += 1
        if '</Card>' in lines[i]:
            card_count -= 1
            if card_count == 0:
                rekap_end = i
                break
    print(f'Rekap card: lines {rekap_start+1}-{rekap_end+1}')
    # Also find next rekap card in Laporan tab

# Find the Laporan tab rekap card
rekap2_start = None
for i, line in enumerate(lines):
    if i > 2600 and '{/* Rekap Seluruh Terminal */}' in line:
        rekap2_start = i
        break

if rekap2_start:
    card_count = 0
    rekap2_end = None
    for i in range(rekap2_start, len(lines)):
        if '<Card' in lines[i] and '/>' not in lines[i]:
            card_count += 1
        if '</Card>' in lines[i]:
            card_count -= 1
            if card_count == 0:
                rekap2_end = i
                break
    print(f'Rekap card 2: lines {rekap2_start+1}-{rekap2_end+1}')

# Find dark mode toggle section
# Find 'Section 5: Tampilan'
dm_start = None
for i, line in enumerate(lines):
    if 'Section 5: Tampilan' in line:
        dm_start = i - 1  # include the <div> above
        break

if dm_start:
    # Find the end of this div (matching </div>)
    div_count = 0
    dm_end = None
    for i in range(dm_start, len(lines)):
        if '<div' in lines[i] and '/>' not in lines[i] and not lines[i].strip().startswith('</'):
            div_count += 1
        if '</div>' in lines[i]:
            div_count -= 1
            if div_count == 0:
                dm_end = i
                break
    print(f'Dark mode section: lines {dm_start+1}-{dm_end+1}')

# Now remove all sections (from bottom to top to preserve line numbers)
sections_to_remove = []
if rekap_start and rekap_end:
    sections_to_remove.append((rekap_start, rekap_end))
if rekap2_start and rekap2_end:
    sections_to_remove.append((rekap2_start, rekap2_end))
if dm_start and dm_end:
    sections_to_remove.append((dm_start, dm_end))

# Also remove dark mode state code (lines 398-425)
sections_to_remove.append((397, 424))  # 0-indexed

# Also remove the function (lines 1337-1429)
sections_to_remove.append((1337, 1429))

# Sort in reverse order
sections_to_remove.sort(reverse=True)

for start, end in sections_to_remove:
    print(f'Removing lines {start+1}-{end+1}')
    lines = lines[:start] + lines[end+1:]

with open('src/app/page.tsx', 'w') as f:
    f.writelines(lines)

print(f'\nNew file: {len(lines)} lines')
