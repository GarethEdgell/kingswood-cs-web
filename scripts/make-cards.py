"""
make-cards.py — printable login cards from the credentials/*.csv files.

Outputs one print-ready A4 PDF per class into credentials/cards/.
Cards are 2 columns x 5 rows (10 per page) with dashed cut lines.

Run:  python scripts/make-cards.py
"""
import csv, glob, os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.pdfgen import canvas

CRED_DIR = os.path.join(os.path.dirname(__file__), '..', 'credentials')
OUT_DIR = os.path.join(CRED_DIR, 'cards')
os.makedirs(OUT_DIR, exist_ok=True)
SITE = 'kingswoodcomputerscience.com'

CYAN = colors.HexColor('#0891b2')
PURPLE = colors.HexColor('#7c3aed')
DARK = colors.HexColor('#0f172a')
GREY = colors.HexColor('#64748b')
LIGHT = colors.HexColor('#f1f5f9')

PAGE_W, PAGE_H = A4
COLS, ROWS = 2, 5
MARGIN = 12 * mm
GUT = 6 * mm
CARD_W = (PAGE_W - 2 * MARGIN - (COLS - 1) * GUT) / COLS
CARD_H = (PAGE_H - 2 * MARGIN - (ROWS - 1) * GUT) / ROWS

def draw_card(c, x, y, cls, username, password):
    # dashed cut border
    c.setDash(2, 2)
    c.setStrokeColor(colors.HexColor('#cbd5e1'))
    c.setLineWidth(0.6)
    c.roundRect(x, y, CARD_W, CARD_H, 4, stroke=1, fill=0)
    c.setDash()

    pad = 6 * mm
    # header band
    c.setFillColor(CYAN)
    c.roundRect(x, y + CARD_H - 11 * mm, CARD_W, 11 * mm, 4, stroke=0, fill=1)
    c.setFillColor(colors.white)
    c.setFont('Helvetica-Bold', 12)
    c.drawString(x + pad, y + CARD_H - 7.6 * mm, 'Digital Futures')
    c.setFont('Helvetica-Bold', 11)
    c.drawRightString(x + CARD_W - pad, y + CARD_H - 7.6 * mm, f'Class {cls}')

    # site
    c.setFillColor(GREY)
    c.setFont('Helvetica', 8.5)
    c.drawString(x + pad, y + CARD_H - 16 * mm, f'Go to:  {SITE}/login')

    # username
    c.setFillColor(GREY)
    c.setFont('Helvetica', 8)
    c.drawString(x + pad, y + CARD_H - 24 * mm, 'USERNAME')
    c.setFillColor(DARK)
    c.setFont('Courier-Bold', 15)
    c.drawString(x + pad, y + CARD_H - 30 * mm, username)

    # password
    c.setFillColor(GREY)
    c.setFont('Helvetica', 8)
    c.drawString(x + pad, y + CARD_H - 37 * mm, 'PASSWORD')
    c.setFillColor(PURPLE)
    c.setFont('Courier-Bold', 15)
    c.drawString(x + pad, y + CARD_H - 43 * mm, password)

    # footer note
    c.setFillColor(GREY)
    c.setFont('Helvetica-Oblique', 7)
    c.drawString(x + pad, y + 3.5 * mm, 'Keep this card safe. Forgotten it? Ask your teacher.')

def build(rows, cls, out_path):
    c = canvas.Canvas(out_path, pagesize=A4)
    per_page = COLS * ROWS
    for idx, (username, password) in enumerate(rows):
        slot = idx % per_page
        if idx and slot == 0:
            c.showPage()
        col = slot % COLS
        row = slot // COLS
        x = MARGIN + col * (CARD_W + GUT)
        y = PAGE_H - MARGIN - (row + 1) * CARD_H - row * GUT
        draw_card(c, x, y, cls, username, password)
    c.save()

def main():
    made, skipped = [], []
    for path in sorted(glob.glob(os.path.join(CRED_DIR, '*.csv'))):
        fname = os.path.basename(path)
        if fname == 'teachers.csv':
            continue
        with open(path, encoding='utf-8') as f:
            reader = list(csv.DictReader(f))
        if not reader:
            continue
        cls = reader[0].get('class', '')
        rows = [(r['username'], r['password']) for r in reader]
        # detect placeholder passwords
        if all('existing' in p for _, p in rows):
            skipped.append((fname, cls))
            continue
        # keep only rows with a real password
        rows = [(u, p) for u, p in rows if 'existing' not in p]
        out = os.path.join(OUT_DIR, fname.replace('.csv', '-cards.pdf'))
        build(rows, cls, out)
        made.append((os.path.basename(out), len(rows)))

    print('CARDS CREATED in credentials/cards/:')
    for name, count in made:
        print(f'   {name}  ({count} cards)')
    if skipped:
        print('\nSKIPPED (passwords not recorded — CSV shows "(existing — unchanged)"):')
        for fname, cls in skipped:
            print(f'   {fname}  (class {cls})')

if __name__ == '__main__':
    main()
