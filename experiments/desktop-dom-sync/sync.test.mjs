import test from 'node:test';
import assert from 'node:assert/strict';
import {alignWords,wordAtTime} from './sync.mjs';
const words = [{word:'Hello',start_time:0.5,end_time:1},{word:'world',start_time:1.2,end_time:2}];
test('source offsets preserve emoji and punctuation in the actual text',()=>{
 const text='😀 Hello, world!';
 const mapped=alignWords(text,words);
 assert.deepEqual(mapped.map(w=>text.slice(w.start,w.end)),['Hello','world']);
});
test('full coverage and repeated words cannot silently skip text',()=>{
 assert.throws(()=>alignWords('Hello secret world',words));
 assert.throws(()=>alignWords('Hello world extra',words));
 const w=[{word:'go',start_time:0,end_time:1},{word:'go',start_time:1,end_time:2}];
 assert.deepEqual(alignWords('go, go',w).map(x=>x.start),[0,4]);
});
test('audio silence, boundaries, backward seek and end are deterministic',()=>{
 assert.deepEqual([0,0.5,0.999,1,1.2,1.9,2,0.6].map(t=>wordAtTime(words,t)),[-1,0,0,-1,1,1,-1,0]);
});
test('missing, overlapping, negative or fabricated invalid timing is rejected',()=>{
 for(const w of [[],[{word:'Hello',start_time:-1,end_time:1}],
 [{word:'Hello',start_time:0,end_time:1},{word:'world',start_time:.9,end_time:2}],
 [{word:'Hello',start_time:NaN,end_time:1}]])assert.throws(()=>alignWords('Hello world',w));
});
