with open('src/app/page.tsx', 'r') as f:
    lines = f.readlines()

# Replace line 3481-3483 with a simple div
lines[3480] = '                <div className="test">\n'
lines[3481] = ''
lines[3482] = ''

with open('src/app/page.tsx', 'w') as f:
    f.writelines(lines)
print('Modified')
