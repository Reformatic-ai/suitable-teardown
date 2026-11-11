import sys, re, glob, os
d, n = sys.argv[1], int(sys.argv[2])
files = [f for f in glob.glob(os.path.join(d, '*.js'))]
for w in sys.argv[3:]:
    print('==', w)
    k = 0
    for f in sorted(files):
        t = open(f, encoding='utf-8', errors='replace').read()
        for m in re.finditer(w, t, re.I):
            print('  [%s]' % os.path.basename(f).split('.')[0], t[max(0, m.start()-n):m.end()+n].replace('\n', ' '))
            k += 1
            if k >= 4: break
        if k >= 4: break
