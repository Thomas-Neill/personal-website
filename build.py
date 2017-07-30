#!/usr/bin/python3
import os
import re
import json

class DictWrapper:
    def __init__(self,**kwargs):
        self.__dict__.update(kwargs)

def text(filename):
    result = ''
    with open(filename) as f:
        result = f.read()
    return result

def all_blog_files():
    return map(lambda x: x[:-5:],filter(lambda file:re.match(r'.+\.html',file),os.listdir('Blog')))

def generate_blog_index(info):
    template = text('blog_index.html')
    return template.format(posts=''.join(map(
        lambda info:"<li><a href={}>{}</a></li>".format(info.filename,info.name),info)))

def generate_blog_post(filename):
    with open('Blog/' + filename) as f:
        result = text('blog_post.html').format(f.read())
    return result

def load_info(filename):
    f = open('Blog/{}.json'.format(filename))
    loaded = DictWrapper(filename='{}.html'.format(filename),**json.load(f))
    f.close()
    return loaded
        
def save_into_static(text,filename):
    with open('Static Content/blog/' + filename,'w') as f:
        f.truncate()
        f.write(text)

all_files = []
for i in all_blog_files():
    info = load_info(i)
    save_into_static(generate_blog_post(info.filename),info.filename)
    all_files.append(info)
save_into_static(generate_blog_index(all_files),'index.html')
