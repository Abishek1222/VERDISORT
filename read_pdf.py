import sys
import PyPDF2

def read_pdf():
    try:
        reader = PyPDF2.PdfReader(r'c:\Users\LENOVO\OneDrive\Desktop\SMARTATHON 2.0 (FINALS)\VERDISORT\Docs\AI_based_AGS_PAPER FINAL IEEE FORMAT.pdf')
        text = ''
        for page in reader.pages:
            text += page.extract_text() + '\n'
        print(text[:15000])
    except Exception as e:
        print('ERROR:', e)

if __name__ == '__main__':
    read_pdf()
