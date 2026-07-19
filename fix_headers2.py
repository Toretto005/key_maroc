import re

files = [
    "src/app/provider/services/page.tsx",
    "src/app/client/settings/page.tsx"
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()
        
    # More flexible regex
    pattern = r'(<header[^>]*>[\s\S]*?</div>)\s*<div className="flex items-center gap-2 sm:gap-4 shrink-0">[\s\S]*?</div>\s*</header>'
    
    def repl(m):
        header_start = m.group(1).replace(' justify-between', '')
        return header_start + '\n      </header>'
        
    new_content = re.sub(pattern, repl, content)
    
    with open(file, 'w') as f:
        f.write(new_content)
    
    if new_content != content:
        print(f"Fixed {file}")
    else:
        print(f"Still no changes for {file}")
