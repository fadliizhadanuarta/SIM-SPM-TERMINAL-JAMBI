with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Replace the problematic className with simple string concatenation
old = "className={`w-full py-6 text-base font-semibold transition-all ${settingsSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}"
new = "className={'w-full py-6 text-base font-semibold transition-all ' + (settingsSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700')}"

if old in content:
    content = content.replace(old, new, 1)
    with open('src/app/page.tsx', 'w') as f:
        f.write(content)
    print('Fixed className')
else:
    print('Pattern not found')
