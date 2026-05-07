import subprocess, sys
subprocess.run([sys.executable, '-m', 'pip', 'install', 'pymupdf'], capture_output=True)

import fitz

doc = fitz.open(r'd:\HCMUT\HCMUT_HK252\DA\DADN\lý-thuyết-đồ-án (1).pdf')

with open(r'd:\HCMUT\HCMUT_HK252\DA\DADN\pdf_content.txt', 'w', encoding='utf-8') as f:
    for i, page in enumerate(doc):
        f.write(f"=== PAGE {i+1} ===\n")
        f.write(page.get_text())
        f.write("\n\n")

print(f"Total pages: {len(doc)}")
print("Written to pdf_content.txt")
