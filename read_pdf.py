import subprocess
import sys

# Install pymupdf if needed
subprocess.run([sys.executable, '-m', 'pip', 'install', 'pymupdf'], capture_output=True)

import fitz

doc = fitz.open(r'd:\HCMUT\HCMUT_HK252\DA\DADN\lý-thuyết-đồ-án (1).pdf')
for i, page in enumerate(doc):
    print(f"=== PAGE {i+1} ===")
    print(page.get_text())
    print()
