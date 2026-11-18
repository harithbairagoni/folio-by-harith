"""Generate the single-column PDF and plain-text CV from the shared source data."""
import json
from pathlib import Path
from html import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'src/data/resume.json').read_text())
output = ROOT / 'public/resume'
output.mkdir(parents=True, exist_ok=True)
font_root = Path('/Users/harith/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/poppler/fonts')
pdfmetrics.registerFont(TTFont('ResumeArial', str(font_root/'Ubuntu-R.ttf')))
pdfmetrics.registerFont(TTFont('ResumeArialBold', str(font_root/'Ubuntu-B.ttf')))
pdfmetrics.registerFontFamily('ResumeArial', normal='ResumeArial', bold='ResumeArialBold')
body = ParagraphStyle('body', fontName='ResumeArial', fontSize=9.1, leading=12.4, alignment=TA_LEFT, textColor=colors.HexColor('#171717'), spaceAfter=3)
title = ParagraphStyle('name', parent=body, fontName='ResumeArialBold', fontSize=19, leading=23, spaceAfter=7)
contact = ParagraphStyle('contact', parent=body, fontSize=8.3, leading=11.3, spaceAfter=2)
heading = ParagraphStyle('section', parent=body, fontName='ResumeArialBold', fontSize=10.5, leading=14, spaceBefore=12, spaceAfter=6, keepWithNext=True)
entry_heading = ParagraphStyle('entry', parent=body, fontName='ResumeArialBold', fontSize=9.2, leading=12.4, spaceBefore=5, spaceAfter=1, keepWithNext=True)
meta = ParagraphStyle('meta', parent=body, fontSize=8.7, leading=11.7, spaceAfter=3, keepWithNext=True)
bullet = ParagraphStyle('bullet', parent=body, leftIndent=10, firstLineIndent=-8, spaceAfter=2)

def safe(value):
    return escape(value).replace('\u2013', '-').replace('\u2014', '-')

story = [Paragraph(safe(data['name']), title), Paragraph(safe(data['email']+' | '+data['phone']), contact), Paragraph(safe(data['linkedin']), contact), Spacer(1, 6)]
text = [data['name'], data['email']+' | '+data['phone'], data['linkedin'], '']
for section in data['sections']:
    story.append(Paragraph(safe(section['title'].upper()), heading))
    text.extend([section['title'].upper(), ''])
    if section.get('paragraph'):
        story.append(Paragraph(safe(section['paragraph']), body))
        text.extend([section['paragraph'], ''])
    for entry_index, entry in enumerate(section.get('entries', [])):
        start = [Paragraph(safe(entry['title']), entry_heading)]
        if entry_index == 0 and not section.get('paragraph'):
            start.insert(0, story.pop())
        text.append(entry['title'])
        details = ' | '.join(entry[key] for key in ('role', 'date', 'location') if entry.get(key))
        if details:
            start.append(Paragraph(safe(details), meta))
            text.append(details)
        if entry.get('description'):
            start.append(Paragraph(safe(entry['description']), body))
            text.append(entry['description'])
        if entry.get('bullets'):
            start.append(Paragraph('- '+safe(entry['bullets'][0]), bullet))
        story.append(KeepTogether(start))
        for line in entry.get('bullets', [])[1:]:
            story.append(Paragraph('- '+safe(line), bullet))
        text.extend('- '+line for line in entry.get('bullets', []))
        text.append('')
    for line in section.get('bullets', []):
        story.append(Paragraph('- '+safe(line), bullet))
        text.append('- '+line)
    text.append('')

pdf = output / 'harith-focos-ats.pdf'
SimpleDocTemplate(str(pdf), pagesize=A4, leftMargin=42, rightMargin=42, topMargin=37, bottomMargin=37, title='Bairagoni Harith - Founder\'s Office Resume', author='Bairagoni Harith', subject='Professional resume', pageCompression=1).build(story)
(output / 'harith-focos-ats.txt').write_text('\n'.join(text), encoding='utf-8')

reader = PdfReader(pdf)
extracted = '\n'.join(page.extract_text() for page in reader.pages)
normalize = lambda value: ''.join(value.split()).replace('\u2013', '-').replace('\u2014', '-')
expected = [data['name'], data['email'], data['phone'], data['linkedin']]
for section in data['sections']:
    expected.append(section['title'].upper())
    if section.get('paragraph'): expected.append(section['paragraph'])
    expected.extend(section.get('bullets', []))
    for entry in section.get('entries', []):
        expected.append(entry['title'])
        expected.extend(entry[key] for key in ('role', 'date', 'location', 'description') if entry.get(key))
        expected.extend(entry.get('bullets', []))
missing = [value for value in expected if normalize(value) not in normalize(extracted)]
if missing:
    raise RuntimeError('PDF extraction missing content: '+repr(missing))
position = -1
for section in data['sections']:
    next_position = extracted.find(section['title'].upper(), position+1)
    if next_position < position: raise RuntimeError('Incorrect section reading order')
    position = next_position
print(json.dumps({'pdf':str(pdf),'pages':len(reader.pages),'validatedFields':len(expected),'missingFields':missing,'sectionOrder':'matches source CV','text':str(output/'harith-focos-ats.txt')},indent=2))
