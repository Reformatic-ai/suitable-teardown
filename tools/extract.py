import sys, re, glob, os, json
d, out = sys.argv[1], sys.argv[2]
src = {os.path.basename(f).split('.')[0]: open(f, encoding='utf-8', errors='replace').read() for f in glob.glob(os.path.join(d, '*.js'))}
# 1. API client methods: key:"name",value:function(...){... this.fetcher("".concat(...)...,{method:"X"
api = []
consts = {c: dict(re.findall(r'[,\s(](\w{1,2})="(/v1/[^"]+)"', s)) for c, s in src.items()}
for chunk, t in src.items():
    for m in re.finditer(r'\{key:"(\w+)",value:function', t):
        body = t[m.end():m.end()+900]
        nxt = body.find('{key:"')
        if nxt > 0: body = body[:nxt]
        if 'fetcher(' not in body: continue
        f = body[body.find('fetcher('):]
        end = f.find(',{')
        call = f[:end if end > 0 else 300]
        first = re.match(r'fetcher\((\w+)(?:[,)]|$)', call)
        if first:  # URL built into a variable first: use that assignment
            asg = re.search(r'(?:var |,)%s=("".concat[^;]*?)(?=;|,\w+=|return)' % re.escape(first.group(1)), body)
            if asg: call = asg.group(1)
        parts = re.findall(r'"([^"]*)"|\.concat\(([\w.]+)', call)
        path = ''
        for lit, var in parts:
            if lit: path += lit
            elif var in consts.get(chunk, {}): path += consts[chunk][var]
            elif var: path += '{value}' if path.endswith('=') else '{id}'
        path = re.sub(r'^https://app\.suitable\.co', '', path)
        meth = re.search(r'method:"(\w+)"', body)
        verb = meth.group(1) if meth else 'GET'
        if re.search(r'method:\w\b', body) and '"PUT"' in body and '"DELETE"' in body: verb = 'PUT or DELETE'
        api.append((chunk, m.group(1), verb, path))
# 2. route names and titles: VAR="a.b" definitions, then (s,VAR,"Title") pairs
names, titles = {}, {}
for chunk, t in src.items():
    if chunk != 'login': continue
    for m in re.finditer(r'(?<![\w.])(\w{1,3})="((?:public\.)?(?:institution|organization|profile|user|admin|employer|school|course|public)[\w.]*)"', t):
        names[m.group(1)] = m.group(2)
    for m in re.finditer(r',(\w{1,3}),"([A-Z][^"]{1,60})"\)', t):
        titles.setdefault(m.group(1), m.group(2))
    plain = sorted(set(re.findall(r'"((?:institution|organization|public\.institution)\.[A-Za-z]+(?:\.[A-Za-z]+)*)"', t)))
with open(out + '/api-surface.tsv', 'w') as fh:
    for r in sorted(set(api), key=lambda r: r[3]): fh.write('\t'.join(r) + '\n')
with open(out + '/screens.tsv', 'w') as fh:
    seen = set()
    for v, n in names.items():
        fh.write('%s\t%s\n' % (n, titles.get(v, ''))); seen.add(n)
    for n in plain:
        if n not in seen: fh.write('%s\t\n' % n)
print(len(set(api)), 'api methods;', len(names), 'named routes;', len(plain), 'route strings')
