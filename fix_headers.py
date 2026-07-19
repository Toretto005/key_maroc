import os
import re
import glob

files = [
    "src/app/dashboard/profile/page.tsx",
    "src/app/dashboard/page.tsx",
    "src/app/dashboard/orders/page.tsx",
    "src/app/dashboard/clients/page.tsx",
    "src/app/dashboard/calendar/page.tsx",
    "src/app/provider/services/page.tsx",
    "src/app/provider/edit/page.tsx",
    "src/app/client/settings/page.tsx"
]

for file in files:
    if not os.path.exists(file):
        print(f"Not found: {file}")
        continue
    
    with open(file, 'r') as f:
        content = f.read()
    
    # We want to replace the header to remove the second div (the one with NotificationBell)
    # The header starts with <header className="..."...
    # It contains a first <div> for the title
    # Then a second <div> for the icons
    # Then </header>
    
    # Regex to match the icons div and its contents up to </header>
    pattern = r'(<header[^>]*>[\s\S]*?</div>)\s*<div className="flex items-center gap-2 sm:gap-4 shrink-0">[\s\S]*?</div>\s*</header>'
    
    # Replace justify-between with nothing in the header tag
    def repl(m):
        header_start = m.group(1).replace(' justify-between', '')
        return header_start + '\n      </header>'
        
    new_content = re.sub(pattern, repl, content)
    
    with open(file, 'w') as f:
        f.write(new_content)
    
    if new_content != content:
        print(f"Fixed {file}")
    else:
        print(f"No changes for {file}")

