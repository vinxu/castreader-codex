import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {get} from 'node:http';
import {createLabServer} from './server.mjs';
test('local playback serves valid byte ranges for seek, rejects malformed ranges and unrelated requests',async t=>{
 const dir=await mkdtemp(join(tmpdir(),'castreader-range-'));
 const bytes=Buffer.from('0123456789');await writeFile(join(dir,'audio.wav'),bytes);
 const server=createLabServer(dir);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 t.after(async()=>{await new Promise(resolve=>server.close(resolve));await rm(dir,{recursive:true,force:true});});
 const url=`http://127.0.0.1:${server.address().port}`;
 for(const [range,expected,header] of [['bytes=2-5','2345','bytes 2-5/10'],['bytes=7-','789','bytes 7-9/10'],['bytes=-3','789','bytes 7-9/10']]){
  const r=await fetch(url+'/audio.wav',{headers:{Range:range}});
  assert.equal(r.status,206);assert.equal(r.headers.get('content-range'),header);assert.equal(await r.text(),expected);
 }
 const whole=await fetch(url+'/audio.wav');assert.equal(whole.status,200);assert.equal(await whole.text(),'0123456789');
 for(const range of ['bytes=10-','bytes=4-2','bytes=-0','bytes=1-2,5-6','invalid']){
  const r=await fetch(url+'/audio.wav',{headers:{Range:range}});assert.equal(r.status,416);assert.equal(r.headers.get('content-range'),'bytes */10');
 }
 const head=await fetch(url+'/audio.wav',{method:'HEAD'});assert.equal(head.headers.get('content-length'),'10');assert.equal(await head.text(),'');
 assert.equal((await fetch(url+'/receipt.json')).status,404);
 assert.equal((await fetch(url+'/audio.wav',{method:'POST'})).status,405);
 const untrusted=await new Promise((resolve,reject)=>get(url+'/audio.wav',{headers:{Host:'untrusted.example'}},r=>{r.resume();resolve(r.statusCode);}).on('error',reject));
 assert.equal(untrusted,403);
});
