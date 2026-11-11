import sys, html, re
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(s): super().__init__(); s.out=[]; s.skip=0
    def handle_starttag(s,t,a):
        if t in('script','style','noscript','svg'): s.skip+=1
        if t in('p','div','li','h1','h2','h3','h4','br','tr','section'): s.out.append('\n')
        if t in('h1','h2','h3','h4'): s.out.append('## ')
    def handle_endtag(s,t):
        if t in('script','style','noscript','svg') and s.skip: s.skip-=1
    def handle_data(s,d):
        if not s.skip: s.out.append(d)
for f in sys.argv[1:]:
    p=P(); p.feed(open(f,encoding='utf-8',errors='replace').read())
    t=re.sub(r'[ \t\r\f\v]+',' ',''.join(p.out)); t=re.sub(r'\n\s*\n+','\n',t)
    open(f[:-5]+'.txt','w').write(t.strip()+'\n')
